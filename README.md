# Die_Botschaft_Transcript_AI_APIs

An integrated set of modular FastAPI-based APIs for text correction, PDF/image processing, and smart fuzzy-matching search using Supabase. Built for robust document automation, intelligent data handling, and seamless deployment to the cloud.

---

## 🧠 Overview

This project brings together multiple microservices into a single unified FastAPI app:

| Module            | Description |
|-------------------|-------------|
| 📝 `spellcheck`   | Smart fuzzy matching for towns, cities, and last names using Supabase as a database backend. |
| 📄 `pdf-to-image` | Converts PDF files into PNG or JPEG images. Supports single and multi-page PDFs. |
| ✂️ `separator`    | Splits uploaded PDFs into parts every 2 pages. Returns a downloadable ZIP archive. |
| 🖼️ `crop`         | Crops an uploaded image into a header and a body section and returns both in a ZIP file. |
| ❤️ `health`       | Simple endpoint to verify the health of the service (for deployment checks). |

---

## 📁 Project Structure

Die_Botschaft_Transcript_AI_APIs/ │ ├── app/ │ ├── spellcheck.py # Supabase fuzzy search module │ ├── pdf_to_image.py # PDF to image converter │ ├── separator.py # PDF splitter │ ├── crop_image.py # Image cropping tool │ ├── main.py # Entry point – loads and includes all routers ├── requirements.txt # Python dependencies ├── .env # Supabase API keys └── README.md # This file


---

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/Die_Botschaft_Transcript_AI_APIs.git
cd Die_Botschaft_Transcript_AI_APIs
2. Create a virtual environment
bash

python -m venv venv
3. Activate the virtual environment
Windows:

bash

venv\Scripts\activate
macOS/Linux:

bash

source venv/bin/activate
4. Install dependencies
bash

pip install -r requirements.txt
5. Create .env file
In the project root, add your Supabase credentials to a .env file:

env

SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_KEY=your-secret-supabase-key
🧪 Run the App Locally
bash

uvicorn main:app --reload
Visit the interactive documentation:

bash

http://localhost:8000/docs
🔍 API Endpoints
Health Check
http
GET /health
Returns:

json
{ "status": "ok" }
Spellcheck (Fuzzy Matching)
/spellcheck/towns?town=Input

/spellcheck/cities?city=Input

/spellcheck/lastnames?lastname=Input

Returns top 5 matches based on fuzzy string comparison.

PDF to Image
http

POST /pdf-to-image/convert-pdf/
Body: PDF file (file), optional format parameter (png, jpeg)

Returns:

A single image or ZIP of all pages as images.

PDF Separator
http

POST /separator/dividir
Body: PDF file (file)

Returns:

ZIP with PDFs split every 2 pages.

Image Cropper
http

POST /crop/crop-image/
Body: Image file (file)

Returns:

ZIP file with cropped header and body sections of the image.

🌐 Deployment (Render.com)
This app is fully compatible with Render.com.

Health Check on Render
After deployment, you can visit:

arduino

https://your-app-name.onrender.com/health
It should return:

json

{ "status": "ok" }
Example render.yaml (optional)
yaml

services:
  - type: web
    name: transcript-ai-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port 10000
    envVars:
      - key: SUPABASE_URL
        value: https://your-supabase-url.supabase.co
      - key: SUPABASE_KEY
        value: your-secret-supabase-key
📦 Requirements
Main dependencies:

FastAPI

Uvicorn

Supabase-py

fuzzywuzzy

pdf2image

Pillow

PyPDF2

python-dotenv

Install them with:

bash

pip install -r requirements.txt
