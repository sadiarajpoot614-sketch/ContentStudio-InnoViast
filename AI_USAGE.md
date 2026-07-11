# AI Usage Log

This document records where and how AI tools were used while building Content Studio, per the assignment's working rules ("You may use AI tools for ideation, debugging, UI suggestions, and documentation, but you must understand and explain your own work").

## Tool Used

- **ChatGPT (OpenAI)** — used for project planning, debugging, code improvements, UI suggestions, and documentation.
- **Groq API (Llama 3.3 70B Versatile)** — used as the AI model for generating content inside the application.
- 
## What AI Was Used For

1. **Scaffolding the project structure** — initial Vite + React file layout (`App.jsx`, `templates.js`, `App.css`), so time could go into the prompt design and UI polish rather than boilerplate.
2. **Prompt template design** — drafting the first version of each template's instruction string, which I then reviewed and tightened per template (see `docs/PROMPT_STRATEGY.md` for the before/after reasoning per template).
3. **UI/visual direction** — the "editorial press desk" concept (perforated divider, proof-sheet output card, rubber-stamp status badge) was an AI-assisted design pass, deliberately steered away from generic "AI app" defaults (plain card grids, generic blue buttons).
4. **Debugging** — help tracing a state-update bug where switching templates didn't reset the output/word-count display.
5. **Documentation drafting** — first drafts of this file, the README, and the prompt-strategy notes, which were then edited to match what was actually built.

## What Was Not Delegated

- The actual choice of which six templates to support and which controls to expose (tone/length/audience/format) came from the assignment brief and my own read of common content-writing needs.
- Final wording of every prompt template was reviewed line-by-line against real sample generations, not accepted as first drafts (see iteration history in `docs/PROMPT_STRATEGY.md`).
- Testing the deployed app end-to-end (entering a real API key, generating drafts across all six templates, checking export/copy behavior) was done manually.

## Representative Prompts Used During Development

- "Help me design a prompt template for six content types (blog post, social caption, ad copy, email, product description, LinkedIn post) that each produce a correctly-structured draft, not just generic text."
- "Review this prompt for a LinkedIn post template — the output reads like generic advice, not a specific post. How do I fix that?"
- "Suggest a visual design direction for a content-generation tool that avoids the typical AI-app look (cream background + terracotta accent, or dark mode with one neon accent)."
- "Why does my word count not update when I edit the output text directly in the contentEditable div?"

## Human Review Statement

I reviewed and understand every part of this codebase, including the prompt-construction logic in `templates.js`, the generation flow in `App.jsx`, and the reasoning behind each template's instructions. I can explain and modify any part of it.
