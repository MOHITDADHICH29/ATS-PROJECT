# Impact ATS Dashboard

A Next.js App Router prototype for explainable resume screening across an LCA Consultant role and a UI/UX Design Internship.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Run `npm run typecheck`, `npm run lint`, and `npm run build` to validate the app.

## Resume upload

The upload endpoint accepts PDF and DOCX files up to 10 MB, validates the file type, sends PDFs and extracted DOCX text to Google Gemini, and validates the structured response with Zod before returning it. Uploads are processed in memory and are not saved. Configure `GEMINI_API_KEY` in a server-only `.env.local` file (never expose it as a `NEXT_PUBLIC_` variable), then restart the Next.js server. The upload box checks `/api/config-status` to show the server-side configuration state without exposing the key. If the key is missing, the upload API returns a descriptive JSON error with HTTP 503; upload timeouts and failures are shown in the UI. Optional model override: `GEMINI_MODEL`.

```dotenv
GEMINI_API_KEY=your-rotated-server-side-key
GEMINI_MODEL=gemini-3.5-flash
```

The uploaded resume is not retained, so its original file is not available in the candidate drawer after analysis. Deploy this endpoint behind your application's authentication and rate limits, and confirm applicant consent and data-processing requirements before sending resume content to an AI provider.

The supplied source folder contains DOCX files; this prototype does not ingest those files. Dashboard candidates and source-PDF preview routes are synthetic demo data. The matching scores are deterministic heuristics intended for human review, not automated hiring decisions.

## Batch-process PDF resumes

The optional Python processor reads PDFs from `./resumes/`, copies each exact
filename into `./public/resumes/`, and writes validated records to
`./src/data/resumes_data.json` so the dashboard can import the generated data.
Place the PDF files in `./resumes/` before running it; scanned/image-only PDFs
are flagged because OCR is not included.

```powershell
python -m pip install -r requirements.txt
$env:GEMINI_API_KEY = "your-google-genai-api-key"
python process_resumes.py
```

The processor sends extracted resume text to the Google GenAI API. Confirm
appropriate consent, privacy, and data-processing approval before using it with
real applicant information. See [process_resumes.py](./process_resumes.py) for
options such as alternate input/output directories and disabling the PDF copy.
