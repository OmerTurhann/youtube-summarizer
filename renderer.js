document.addEventListener("DOMContentLoaded", () => {
    const welcomePage = document.getElementById("welcome-page");
    const linkPage = document.getElementById("link-page");
    const transcriptPage = document.getElementById("transcript-page");
    const summaryPage = document.getElementById("summary-page");

    const startButton = document.getElementById("start-button");
    const fetchButton = document.getElementById("fetch-button");
    const showSummaryButton = document.getElementById("show-summary-button");
    const restartButton = document.getElementById("restart-button");

    const videoUrlInput = document.getElementById("video-url");
    const transcriptArea = document.getElementById("transcript");
    const summaryArea = document.getElementById("summary");
    const translatedTranscriptArea = document.getElementById("translated-transcript");
    const translatedSummaryArea = document.getElementById("translated-summary");
    const targetLanguageSelect = document.getElementById("target-language");

    // 1. Hoşgeldiniz Sayfasından Link Sayfasına Geçiş
    startButton.addEventListener("click", () => {
        welcomePage.classList.add("hidden");
        linkPage.classList.remove("hidden");
    });

    // 2. Link Sayfasından Transkript Sayfasına Geçiş
    fetchButton.addEventListener("click", async () => {
        const videoUrl = videoUrlInput.value.trim();
        const targetLanguage = targetLanguageSelect.value; // Kullanıcının seçtiği hedef dil

        if (!videoUrl) {
            alert("Please enter a valid YouTube URL!");
            return;
        }

        transcriptArea.value = "Fetching transcript...";
        translatedTranscriptArea.value = "";

        try {
            const result = await window.electronAPI.processVideo(videoUrl, targetLanguage);
            if (result.error) throw new Error(result.error);

            transcriptArea.value = result.transcript;

            // Eğer hedef dil seçildiyse çeviri sonuçlarını göster
            if (result.translatedTranscript) {
                translatedTranscriptArea.value = result.translatedTranscript;
            } else {
                translatedTranscriptArea.value = "No translation requested.";
            }

            linkPage.classList.add("hidden");
            transcriptPage.classList.remove("hidden");
        } catch (error) {
            alert("Error: " + error.message);
            transcriptArea.value = "";
            translatedTranscriptArea.value = "";
        }
    });

    // 3. Transkript Sayfasından Özet Sayfasına Geçiş
    showSummaryButton.addEventListener("click", async () => {
        summaryArea.value = "Generating summary...";
        translatedSummaryArea.value = "";

        try {
            const transcript = transcriptArea.value;
            const targetLanguage = targetLanguageSelect.value; // Kullanıcının seçtiği hedef dil

            const summary = await window.electronAPI.summarizeTranscript(transcript);
            if (!summary) throw new Error("Failed to generate summary.");

            summaryArea.value = summary;

            // Eğer hedef dil seçildiyse özet için çeviri yap
            if (targetLanguage) {
                translatedSummaryArea.value = "Translating summary...";
                const translatedSummary = await window.electronAPI.translateText(summary, targetLanguage);
                translatedSummaryArea.value = translatedSummary || "Translation failed.";
            } else {
                translatedSummaryArea.value = "No translation requested.";
            }

            transcriptPage.classList.add("hidden");
            summaryPage.classList.remove("hidden");
        } catch (error) {
            alert("Error: " + error.message);
            summaryArea.value = "";
            translatedSummaryArea.value = "";
        }
    });

    // 4. Uygulamayı Yeniden Başlat
    restartButton.addEventListener("click", () => {
        summaryPage.classList.add("hidden");
        welcomePage.classList.remove("hidden");

        videoUrlInput.value = "";
        transcriptArea.value = "";
        summaryArea.value = "";
        translatedTranscriptArea.value = "";
        translatedSummaryArea.value = "";
    });
});
