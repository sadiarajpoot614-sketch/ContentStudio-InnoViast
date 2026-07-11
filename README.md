# Content Studio — AI Content Generation Studio

InnoViast Internship • Track 03 (AI Solutions Engineering) • Week 2, Assignment 2

A content writing assistant that turns a short brief into a structured, editable, ready-to-publish draft — across six real content formats, with tone, length, audience, and output-format controls.

---

## 1. Problem Statement

Marketers, founders, and social teams spend a disproportionate amount of time on the *first draft* of routine content — a caption, a product blurb, a follow-up email — rather than on judgment calls like strategy and voice. Generic "write me something about X" prompts to a chatbot produce inconsistent structure and require a lot of back-and-forth to get usable output.

**Content Studio** solves this by pairing each content type with a purpose-built prompt template (not one generic prompt for everything), so the structure of a blog post, an ad, and a LinkedIn post are each correct for that format on the first try — and the result lands in an editable draft the user can immediately refine and export.

## 2. Features

- **6 content templates**: Blog Post, Social Caption, Ad Copy, Email, Product Description, LinkedIn Post — each with its own structural instructions (see [`src/templates.js`](./src/templates.js)).
- **Controls**: Tone (8 presets), Length (short/medium/long, each mapped to a word-count target), Audience (free text), Output format (plain paragraphs / Markdown / bullet-first).
- **Transparent prompting**: a "View prompt sent to the model" panel shows exactly what was sent — useful for learning prompt engineering, not just using the tool.
- **Editable output**: the generated draft renders in an editable "proof sheet" — click in and revise directly, with a live word count.
- **Export**: copy to clipboard, or download the draft as a `.md` file.
- **Bring-your-own-key**: the app calls the OpenAI API directly from the browser using a key you paste in at runtime. Nothing is stored server-side, and the key never touches disk or git (see the Security Note below).

## 3. Tech Stack

| Layer | Choice |
|---|---|
| UI | React 18 + Vite |
| Styling | Plain CSS (custom design system, no framework) |
| AI API | OpenAI Chat Completions (`gpt-4o-mini`) — swappable for any Chat-Completions-compatible endpoint |
| Deployment | Vercel / Netlify (static SPA, no backend required) |

## 4. Project Structure

```
ContentStudio-InnoViast/
├── src/
│   ├── App.jsx           # Main UI + generation logic
│   ├── App.css            # Design system (editorial "press desk" theme)
│   ├── templates.js       # Template library + prompt builder (core logic)
│   └── main.jsx           # React entry point
├── docs/
│   ├── PROMPT_STRATEGY.md # Prompt design approach + iteration history
│   └── OUTPUT_EXAMPLES.md # Sample generations per template
├── screenshots/            # Progress + final screenshots
├── AI_USAGE.md             # AI tools/prompts used while building this project
├── index.html
├── package.json
└── vite.config.js
```

## 5. Setup

```bash
git clone <your-repo-url>
cd ContentStudio-InnoViast
npm install
npm run dev
```

Open the local URL Vite prints (typically `http://localhost:5173`). Paste an OpenAI API key into the field at the top of the control panel — get one at https://platform.openai.com/api-keys. The key lives only in that browser tab's memory for the session.

### Build for production

```bash
npm run build
npm run preview   # sanity-check the production build locally
```

## 6. Deployment

Deploy the static build to Vercel (or Netlify):

```bash
npm run build
# then drag /dist into Netlify, or:
npx vercel --prod
```

**Live deployment link:** _add your deployed URL here after deploying_

## 7. Security Note

This project intentionally has no backend, so the OpenAI key is entered by the user at runtime and used directly from the browser. That is fine for a personal/demo tool but **is not how you'd ship this to real end users** — for production, a key should live server-side (a small serverless function) so it's never exposed to the client. This trade-off is documented here on purpose, as part of understanding the design, not as an oversight.

No API keys, `.env` files, or credentials are committed to this repository (see `.gitignore`).

## 8. Screenshots

See `/screenshots` for: initial wireframe/design pass, mid-build state, a caught-and-fixed bug, and the final polished UI. _(Insert images here once captured — e.g. `![Control panel](./screenshots/01-control-panel.png)`)_

## 9. Learning Outcomes

- Designing **template-specific prompts** rather than one generic prompt, and why that materially changes output quality and structure.
- Separating **prompt construction** (`templates.js`, a pure/testable function) from **UI state** (`App.jsx`) so the prompt logic can be reasoned about and iterated on independently.
- Exposing the constructed prompt back to the user as a transparency/debugging feature, which also documents prompt-engineering decisions in the product itself.
- Practical trade-offs of client-only AI apps (no backend) vs. the security cost of exposing an API key to the browser.
- Iterating on a prompt through multiple versions based on observed output quality — documented in [`docs/PROMPT_STRATEGY.md`](./docs/PROMPT_STRATEGY.md).

---

Built as part of the InnoViast Internship, Track 03 — AI Solutions Engineering.
