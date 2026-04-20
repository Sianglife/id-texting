# ID Texting

ID Texting is a Nuxt-based image text editor for adding text on photos, cards, and ID-style layouts. 
It is designed for quick text placement, drag-and-resize editing, and export-friendly composition on top of uploaded images.

<img width="600" alt="snapshot" src="https://github.com/user-attachments/assets/b7ba5bcb-7788-4433-b0cf-f84e78aa349c" />

## Intro

The app focuses on two common use cases:

- adding text on top of an image, such as a poster, screenshot, or photo
- placing ID-style labels and date marks on document-like layouts

The editor runs fully in the browser. Images are processed locally, so nothing needs to be uploaded to a server.

## Online Use

You can use the app immediately here:

[sianglife.github.io/id-texting/](https://sianglife.github.io/id-texting/)

## Get Started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open the app at `http://localhost:3000`.

Build for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

## Project Structure

- [app/app.vue](app/app.vue) sets up the global app shell and styling entry point.
- [app/pages/index.vue](app/pages/index.vue) contains the main editor UI, image upload flow, text overlay controls, and export actions.
- [app/utils/canvasComposer.ts](app/utils/canvasComposer.ts) handles canvas sizing, rendering, drag hit testing, and PNG export.
- [app/data/textTemplates.json](app/data/textTemplates.json) stores the preset text templates, including ID-style and date-related entries.
- [app/assets/css/main.css](app/assets/css/main.css) contains the global visual styling.
- [public/](public/) stores static assets served directly by Nuxt.

## Notes

- The editor supports both manual text entry and preset text templates.
- Text can be repositioned directly on the canvas and resized with the drag handle.
- The current implementation keeps the workflow simple: upload an image, add text, adjust placement, and export the result.

## Scripts

```bash
pnpm dev
pnpm build
pnpm preview
pnpm generate
```
