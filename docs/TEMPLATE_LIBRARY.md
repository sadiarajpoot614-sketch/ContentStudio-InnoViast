# Template Library

Implemented in `src/templates.js`. Each template below shows its brief field, and the structural instruction it adds on top of the shared tone/audience/length/format controls.

| Template | Tag | Brief field | Structural focus |
|---|---|---|---|
| Blog Post | long-form | Topic | Headline, hook, 3-4 distinct subheadings, closing takeaway |
| Social Caption | social | Post idea | Scroll-stopping opener, tight body, CTA + 3-5 hashtags |
| Ad Copy | conversion | Product / offer | Headline (<8 words), one benefit-led body line, one CTA line |
| Email | lifecycle | Purpose | Subject, preview text, greeting, short body, one CTA label |
| Product Description | ecommerce | Product | Lead benefit, sensory/use-case paragraph, 3-5 spec bullets, objection-handling closer |
| LinkedIn Post | professional | Idea / update | Hook line, short white-spaced paragraphs, grounded specific detail, genuine closing question |

## Shared Controls (apply to every template)

| Control | Options |
|---|---|
| Tone | Professional, Casual & friendly, Enthusiastic, Witty, Formal, Persuasive, Empathetic, Bold & direct |
| Length | Short (60-120 words), Medium (150-300 words), Long (350-600 words) |
| Audience | Free text, defaults to "a general but engaged audience" |
| Output format | Plain paragraphs, Markdown, Bullet-first |

## Adding a New Template

Add an entry to the `TEMPLATES` object in `src/templates.js` with a `label`, `tag`, `brief`, `placeholder`, and an `instructions(topic)` function. No other file needs to change — the UI in `App.jsx` renders the template list directly from this object.
