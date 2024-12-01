const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const axios = require("axios");
const deepl = require("deepl-node");

let mainWindow;

// API Keys
const GROQ_API_KEY = "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"; // Groq API
const DEEPL_API_KEY = "95b8bad8-ea73-4142-9e6e-1ca99f56955e:fx"; // DeepL API

const translator = new deepl.Translator(DEEPL_API_KEY); // DeepL Translator instance

// Extract video ID from YouTube URL
function extractVideoId(url) {
    const pattern = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(pattern);
    return match ? match[1] : null;
}

// Function to call Python script for fetching transcript
function fetchTranscriptUsingPython(videoId) {
    console.log(`[INFO] Fetching transcript for video ID: ${videoId}`);
    return new Promise((resolve, reject) => {
        exec(`python fetch_transcript.py ${videoId}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`[ERROR] Python script error: ${stderr || error.message}`);
                reject(`Error: ${stderr || error.message}`);
                return;
            }
            console.log(`[INFO] Transcript fetched successfully.`);
            resolve(stdout.trim());
        });
    });
}

// Function to summarize transcript using Groq API
async function summarizeTranscript(transcript) {
    console.log(`[INFO] Summarizing transcript.`);
    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                messages: [
                    {
                        role: "user",
                        content: `Please summarize the following transcript in detail: ${transcript}`
                    }
                ],
                model: "llama3-8b-8192"
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );
        console.log(`[INFO] Summary generated successfully.`);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error(`[ERROR] Groq API request failed: ${error.message}`);
        throw new Error("Error with Groq API request: " + error.message);
    }
}

// Function to translate text using DeepL API
async function translateTextWithDeepL(text, targetLanguage, sourceLanguage = null) {
    console.log(`[INFO] Translating text to ${targetLanguage} using DeepL.`);
    try {
        // DeepL'de `en` yerine `en-GB` veya `en-US` kullanılması gerekiyor
        if (targetLanguage === "en") {
            targetLanguage = "en-US"; // Varsayılan olarak Amerikan İngilizcesi
        }

        const result = await translator.translateText(text, sourceLanguage, targetLanguage);
        console.log(`[INFO] Translation completed successfully.`);
        return result.text;
    } catch (error) {
        console.error(`[ERROR] DeepL translation failed: ${error.message}`);
        throw new Error("Error with DeepL translation: " + error.message);
    }
}


// Create the main application window
const createWindow = () => {
    console.log(`[INFO] Creating main application window.`);
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });
    mainWindow.loadFile("index.html");
    console.log(`[INFO] Main application window created.`);
};

// Event Listeners for Electron
app.on("ready", createWindow);
app.on("window-all-closed", () => {
    console.log(`[INFO] Application window closed.`);
    if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
    console.log(`[INFO] Application activated.`);
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// IPC Event to handle video processing (transcript + summary + translation)
ipcMain.handle("process-video", async (event, videoUrl, targetLanguage) => {
    console.log(`[INFO] Processing video URL: ${videoUrl}`);
    try {
        const videoId = extractVideoId(videoUrl);
        if (!videoId) throw new Error("Invalid YouTube URL");
        console.log(`[INFO] Extracted Video ID: ${videoId}`);

        const transcript = await fetchTranscriptUsingPython(videoId);
        console.log(`[INFO] Transcript length: ${transcript.length} characters`);

        let summary = await summarizeTranscript(transcript);
        console.log(`[INFO] Summary length: ${summary.length} characters`);

        let translatedTranscript = null;
        let translatedSummary = null;

        if (targetLanguage) {
            console.log(`[INFO] Translating transcript and summary to ${targetLanguage}.`);
            translatedTranscript = await translateTextWithDeepL(transcript, targetLanguage);
            translatedSummary = await translateTextWithDeepL(summary, targetLanguage);
        }

        return { transcript, summary, translatedTranscript, translatedSummary };
    } catch (error) {
        console.error(`[ERROR] process-video failed: ${error.message}`);
        return { error: error.message };
    }
});

// IPC Event to handle text translation
// Transkript özetleme için IPC handler'ı

ipcMain.handle("summarize-transcript", async (event, transcript) => {
    console.log(`[INFO] Summarizing provided transcript.`);
    try {
        // Groq API'yi kullanarak transkripti özetle
        const summary = await summarizeTranscript(transcript);
        console.log(`[INFO] Summary generated successfully.`);
        return summary;
    } catch (error) {
        console.error(`[ERROR] summarize-transcript failed: ${error.message}`);
        return { error: error.message };
    }
});

ipcMain.handle("translate-text", async (event, text, targetLanguage, sourceLanguage = null) => {
    console.log(`[INFO] Translating text to ${targetLanguage} using DeepL.`);
    try {
        const translatedText = await translateTextWithDeepL(text, targetLanguage, sourceLanguage);
        console.log(`[INFO] Text translated successfully.`);
        return translatedText;
    } catch (error) {
        console.error(`[ERROR] translate-text failed: ${error.message}`);
        return { error: error.message };
    }
});

