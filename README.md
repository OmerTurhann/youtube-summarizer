YouTube Transcript Summarizer

A powerful open-source desktop application that allows users to fetch, summarize, and translate YouTube video transcripts. Built with Electron, Python, and DeepL API for high-quality text processing.

---

Prerequisites

Before running the application, ensure you have the following installed on your system:

- [Node.js (v18.x or higher)](https://nodejs.org)
- [Python (v3.x)](https://www.python.org)
- pip (Python Package Installer)

---

Installation Guide

Step 1: Clone the Repository
First, clone this repository from GitHub:

git clone git@github.com:OmerTurhann/youtube-summarizer.git
cd OmerTurhann/youtube-summarizer.git


Step 2: Install Node.js Dependencies
Run the following commands to install the necessary Node.js modules:

1. Add the Node.js package source and install:
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   

2. Install the required Node.js packages:
   npm install
   npm install electron --save-dev
   npm install -g electron
   npm install bootstrap
   npm install axios
   npm install deepl-node


   

Step 3: Set Up Python Environment
The application uses Python for fetching YouTube transcripts. Set up a virtual Python environment and install the required dependencies:

1. Create and activate the virtual environment:
   python3 -m venv myenv
   source myenv/bin/activate

   Gitbash:
   python -m venv env
   source env/Scripts/activate

 

3. Install Python dependencies from `requirements.txt`:
   sudo apt update
   sudo apt install python3-pip
   pip install -r requirements.txt


Step 4: Run the Application
Once all dependencies are installed, start the application by running:

npm start


---

Features

- Fetch YouTube video transcripts (supports English and Turkish).
- Summarize transcripts using Groq API.
- Translate transcripts and summaries using DeepL API.
- User-friendly interface built with Bootstrap and Electron.

---

Dependencies

Node.js Packages
The following Node.js dependencies are used in the application:
- [Electron](https://www.electronjs.org/) - Desktop application framework.
- [Bootstrap](https://getbootstrap.com/) - CSS framework for UI components.
- [axios](https://github.com/axios/axios) - HTTP client for API requests.
- [deepl-node](https://www.deepl.com/) - DeepL API for text translations.

Python Libraries
The following Python libraries are required:
- `youtube-transcript-api` - To fetch video transcripts from YouTube.
- `requests` - To make HTTP requests for Groq and DeepL APIs.

Ensure all these dependencies are installed via the steps outlined above.

---

Folder Structure
```
/project-folder
│
├── index.html           # Main application interface
├── main.js              # Electron main process
├── preload.js           # Preload script for communication between renderer and main
├── renderer.js          # Handles frontend functionality
├── fetch_transcript.py  # Python script for fetching YouTube transcripts
├── package.json         # Node.js project configuration
├── requirements.txt     # Python dependencies
└── README.md            # Documentation
```

---

Contributing
We welcome contributions to this project! Feel free to open issues or submit pull requests to improve functionality or fix bugs.

---

License
This project is licensed under the MIT License.

---

Having Trouble?
If you encounter issues, make sure:
1. Node.js and Python are installed correctly.
2. Dependencies are installed without errors.
3. API keys for Groq and DeepL are correctly configured in the source files.

For further assistance, feel free to open an issue on the GitHub repository.


