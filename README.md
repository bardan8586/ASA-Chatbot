# ASA-Bot (ASAHE) — Quick Start

This repo contains a minimal ASAHE-branded page with the Chatbase widget embedded to preview ASA‑Bot behaviour.

## Preview locally

Open `index.html` directly in your browser (double‑click the file) or serve with any static server.

## Configure Chatbase

1. Log in to Chatbase and open the bot with id `bVrB07H2M1k0K0bN59FGy`.
2. Paste the ASA‑Bot System Prompt (below) into your bot instructions / system message.
3. Set temperature to 0.15–0.30, max tokens ≈ 300 per reply.
4. Enable analytics as needed.

## Canonical ASAHE links

- Home: https://asahe.edu.au/
- Courses: https://asahe.edu.au/courses/
- International: https://asahe.edu.au/international-students/
- Student Support: https://asahe.edu.au/student-support/
- About: https://asahe.edu.au/about-us/
- Contact: https://asahe.edu.au/contact-us/
- Fees & Refunds: https://asahe.edu.au/fees-and-refunds/
- Admissions: https://asahe.edu.au/admissions/
- Student Portal: https://asahe.edu.au/student-portal/

## System Prompt (paste into Chatbase)

See `SYSTEM_PROMPT.md` for the full text. Keep replies concise (1–3 short sentences), link‑first answers with exactly one canonical ASAHE link, offer a natural next step, and follow escalation/fallback rules.

## Dev notes

- The embed script in `index.html` is the exact snippet you provided.
- Colours follow ASA Sydney look: Navy `#002E5D`, Gold `#D4AF37`, Teal `#007B7F`.
- For file handling, set up your ingestion pipeline (OCR → text → chunk → embeddings → vector DB) in your backend, then connect Chatbase via retrieval or custom API as needed.


