# Project Setup Guide

## Overview

This guide walks you through the setup process for the 'analyticalite' project, which includes both backend and frontend components.

## Prerequisites

Before you start, ensure you have Python and Node.js installed on your system. 

- **Python**: Download it based on your operating system from [Python Downloads](https://www.python.org/downloads/).
- **Node.js**: Download and install Node.js from [Node.js Downloads](https://nodejs.org/en/download). For macOS users, you can also install it using Homebrew:
```
brew install node
```

## Backend Setup
Navigate to the `analyticalite/backend` directory:
1. **Create a Python Virtual Environment**:
```
python -m venv ./venv
```
or 
```
python3 -m venv ./venv
```

2. **Activate the Virtual Environment**:
```
. venv/bin/activate
```

3. **Install Dependencies**:
```
pip install -r requirements.txt
```

4. **Install Llama-CPP-Python**:

For a default CPU-only build:
```
pip install llama-cpp-python
```
For a mixed CPU+GPU build on Macs with GPUs:
```
CMAKE_ARGS=”-DLLAMA_METAL=on” pip install llama-cpp-python
```
Note: Windows users might need additional installation steps.

5. **Download Llama Model**:
```
huggingface-cli download TheBloke/Llama-2-7b-Chat-GGUF llama-2-7b-chat.Q8_0.gguf --local-dir ./models --local-dir-use-symlinks False
```

6. **Start the Backend Server**:
```
uvicorn main:app
```
Note: If this doesn’t start open up a new terminal and run this command again in the same directory with the activated venv.

## Frontend Setup

Navigate to the `analyticalite/frontend` directory and run:

1. **Install Node Modules**
```
npm install
```
2. **Start the Frontend Server**:
```
npm run dev
```
