# Prompt Strategy Notes

This document explains how prompts are constructed in Content Studio, and walks through the iteration history for a few templates so the improvement process is visible (not just the final result).

## 1. Overall Architecture

Every generation sends **one system prompt** (shared, sets the model's role and output hygiene rules) plus **one user prompt** assembled from four pieces:

```
[Template instructions]   <- structure specific to the content type
[Tone line]                <- "Tone: {tone}."
[Audience line]             <- "Write for this specific audience: {audience}." or a sensible default
[Length line]                <- mapped to an explicit word-count range, not a vague "short/long"
[Format line]                 <- plain / markdown / bullet-first, as an explicit instruction
```

See `buildPrompt()` in `src/templates.js` for the exact implementation. Keeping this as one pure function (rather than string-building inline in the UI) made it possible to iterate on wording without touching any UI code, and to show the constructed prompt back to the user for transparency.

### Shared system prompt

```
You are a senior copywriter and content strategist producing ready-to-publish
drafts. Follow the brief exactly. Never include meta-commentary, explanations,
or notes about what you did -- output only the finished content piece itself.
Do not use generic filler phrases like "in today's fast-paced world."
```

This single line — banning meta-commentary and naming a specific cliché to avoid — removed the two most common failure modes seen in early testing: the model prefacing output with "Sure, here's a blog post about..." and reaching for stock filler phrases as an opening line.

### Why explicit word-count ranges instead of "short / medium / long"

Early versions of the length control just said `Length: short.` in the prompt. In practice this was inconsistently interpreted — sometimes 40 words, sometimes 150. Replacing it with an explicit range (`60-120 words`) made output length far more consistent across templates and across regenerations.

## 2. Per-Template Iteration History

### Blog Post

- **v1 (naive):** `Write a blog post about {topic}.`
  - *Problem:* produced a single unbroken wall of text with no headline or subheadings — technically "a blog post" but not structured for scanning.
- **v2:** `Write a blog post about {topic}. Include a headline and some subheadings.`
  - *Problem:* better, but subheadings were often vague restatements of the same point rather than distinct angles, and the ending just trailed off.
- **v3 (current):** explicitly asks for a headline, a short hook opening, **3-4 subheadings covering distinct angles**, and a closing takeaway, plus a standing instruction to prefer concrete examples over abstractions.
  - *Result:* consistently produces a piece with real structure and non-redundant sections.

### Ad Copy

- **v1 (naive):** `Write ad copy for {topic}.`
  - *Problem:* output was a full paragraph — closer to a product description than something that could sit in a small ad unit.
- **v2 (current):** explicitly asks for a headline **under 8 words**, one line of benefit-led body copy, and a single CTA line, with the framing instruction "make every word earn its place."
  - *Result:* output is short enough to actually use as ad copy, and consistently leads with benefit rather than feature (e.g. "Sleep 20 minutes faster tonight" rather than "Our mattress uses memory foam").

### LinkedIn Post

- **v1 (naive):** `Write a LinkedIn post about {topic}.`
  - *Problem:* read like generic listicle advice ("Here are 5 tips for..."), not a first-person post grounded in a real moment — low credibility, high "AI-generated" smell.
- **v2 (current):** asks for a one-line hook designed to earn the "see more" click, short paragraphs with white space (matching how LinkedIn posts are actually formatted), and explicitly instructs the model to ground the post in **"a specific, credible detail rather than generic advice,"** ending in a genuine question rather than a sales pitch.
  - *Result:* noticeably more specific, first-person-sounding drafts; see `docs/OUTPUT_EXAMPLES.md` for a before/after sample.

## 3. Tone, Audience, and Format Controls

- **Tone** is passed as a single direct instruction (`Tone: Witty.`) rather than trying to encode tone into every template's instructions — this keeps the template library reusable across all 8 tone presets without combinatorial prompt-writing.
- **Audience** defaults to "a general but engaged audience" rather than being left blank, since an empty instruction slot sometimes caused the model to address no one in particular.
- **Format** is the one control that changes *output syntax*, so it's phrased as a hard instruction ("Use plain, well-spaced paragraphs -- no markdown symbols.") rather than a preference, since preference-phrased formatting instructions were inconsistently followed in testing.

## 4. What Didn't Work

- Asking for tone and structure in the same sentence (e.g. "Write a witty, well-structured blog post...") diluted both — splitting them into separate, clearly labeled lines in the final prompt produced more reliable adherence to each individually.
- Giving a numeric word count as a hard target (e.g. "exactly 200 words") was ignored more often than a range was — ranges are honored much more consistently than exact counts.
