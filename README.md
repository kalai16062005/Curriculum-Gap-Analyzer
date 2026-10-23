# Curriculum Gap Analyzer

Curriculum Gap Analyzer is a browser-based tool for comparing a university syllabus PDF with a bundled list of industry skills. It extracts text from the uploaded PDF, checks for skill-name matches, and reports matched skills, missing skills, a readiness percentage, and a curriculum-gap percentage.

## Features

- Upload a syllabus PDF for analysis.
- Compare extracted PDF text with the skill names in `backend/data/industrySkills.json`.
- View matched and missing skills and a domain-gap chart.
- Generate a downloadable PDF audit report in the browser.
- Persist analysis documents in MongoDB and expose history and individual-report API routes.

The comparison uses text extraction and substring matching. It does not use an AI/ML model or an external AI API.

## Technology

- **Frontend:** HTML, CSS, and browser JavaScript; Chart.js and jsPDF are loaded from public CDNs.
- **Backend:** Node.js, Express, Multer, `pdf-parse`, and Mongoose.
- **Database:** MongoDB through Mongoose.
- **Data:** A bundled JSON skill catalog and CSV industry datasets.

## Project structure

```text
backend/
  config/db.js                 MongoDB connection
  data/
    industrySkills.json        Skill catalog used by syllabus analysis
    industry-datasets/         Bundled CSV source datasets
  models/                      Mongoose models
  routes/                      Syllabus upload and report-history APIs
  utils/                       Skill extraction helper
  server.js                    Express application entry point
  package.json                 Backend dependencies and scripts
frontend/
  index.html                   Main upload and analysis page
  script.js                    Upload flow, charts, skill tables, PDF export
  history.html, history.js     Analysis history page
  report.html, report.js       Individual report page
  style.css                    Main page styles
```

## Prerequisites

- Node.js **20.19.0 or later** and npm. The locked Mongoose version requires Node.js 20.19.0 or later.
- A MongoDB instance and a connection string.
- Python 3, or another static-file server, to serve the frontend locally.
- Internet access in the browser for the Chart.js and jsPDF CDN scripts.

## Setup

1. Install the backend dependencies:

   ```sh
   cd backend
   npm install
   ```

2. Configure the backend environment in `backend/.env`:

   ```dotenv
   MONGO_URI=<your MongoDB connection string>
   PORT=5000
   ```

   `MONGO_URI` is required for the database connection. `PORT` is optional and defaults to `5000`. Keep real credentials private.

## Run locally

Start the backend from the `backend` directory:

```sh
npm start
```

The API listens on `http://localhost:5000` by default. In a second terminal, serve the static frontend:

```sh
cd frontend
python -m http.server 8000
```

Open `http://localhost:8000` and upload a PDF. The frontend sends uploads to `http://127.0.0.1:5000/api/syllabus/upload`.

## API routes

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | Backend status message |
| `POST` | `/api/syllabus/upload` | Upload a PDF using the multipart field `syllabus` and analyze it |
| `GET` | `/api/history` | List saved reports |
| `GET` | `/api/history/:id` | Retrieve a saved report |

## Scripts and tests

Run these commands from `backend/`:

| Command | Description |
| --- | --- |
| `npm start` | Start the Express server with Node.js |
| `npm test` | Not implemented; the current script exits with an error indicating no tests are specified |

There is no frontend package manifest, build script, or automated test suite in the repository.

## Build and deployment

The frontend is static HTML, CSS, and JavaScript; no frontend build step is configured. The backend has no build script. For deployment, provide a Node.js runtime and reachable MongoDB instance, configure `MONGO_URI` and optionally `PORT`, and host the `frontend/` files with a static web server. The frontend currently uses hard-coded localhost API URLs, so it is configured for local development and will need those URLs changed for a non-local deployment. No deployment provider or automated deployment workflow is configured in the repository.

## Limitations and notes

- Matching is based on whether lowercased extracted PDF text contains each catalog skill name. It does not assess context, synonyms, or skill proficiency.
- The backend saves upload analysis using `summary`, `foundSkillsList`, and `missingSkillsList`, while the history and individual-report pages read a different set of analysis fields. As written, those pages may show empty or defaulted report details for newly uploaded analyses.
- The history API returns report identifiers as `id`, but the history page builds report links from `_id`; those links may not open the selected report.
- The catalog used during analysis is `backend/data/industrySkills.json`. The CSV files and `extractSkills.js`/`insertIndustrySkills.js` provide supporting data utilities, but are not invoked by the server's upload route.
- `pdf-lib` is declared as a backend dependency, but the current report export is implemented in the browser with jsPDF.
- MongoDB must be available when the backend starts; a connection failure terminates the server.
- `npm test` is a placeholder that intentionally exits unsuccessfully until tests are added.
