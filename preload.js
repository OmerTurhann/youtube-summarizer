const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    // Video işlemleri (transkript ve özet)
    processVideo: (videoUrl, targetLanguage) =>
        ipcRenderer.invoke("process-video", videoUrl, targetLanguage),

    // Transkript özetleme işlevi
    summarizeTranscript: (transcript) =>
        ipcRenderer.invoke("summarize-transcript", transcript),

    // Metin çevirme (DeepL API ile)
    translateText: (text, targetLanguage, sourceLanguage = null) =>
        ipcRenderer.invoke("translate-text", text, targetLanguage, sourceLanguage),
});
