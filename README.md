# Desktop OS Portfolio

A macOS-inspired personal portfolio website built with Next.js (App Router), Tailwind CSS, and Framer Motion. Designed to replicate a beautiful desktop environment with draggable windows and a reactive dock.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000)

## Editing Content
All textual content and data is driven by a single source of truth:
- Edit `/src/data/content.ts` to change your name, bio, experience, projects, skills, and links.

## Placeholders Needed
Please replace or provide the following to complete the site:
1. **Portrait**: Add your B&W grainy square portrait photo at `public/portrait.jpg`.
2. **Resume PDF**: Add your actual PDF resume at `public/resume.pdf` so the Resume window can display and download it.
3. **Writing Posts**: Add real blog post links to `content.ts` under `widgets.writing`.
4. **Quote**: Add your favorite quote in `content.ts`.
5. **Gallery images**: Replace the placeholder `<div>` elements in the Gallery window inside `src/app/page.tsx` with actual `<Image>` tags.
