// Template library for the AI Content Generation Studio.
// Each template defines: a label, a short tag, the brief field label/placeholder,
// and an `instructions` function that turns the user's brief into a
// template-specific instruction block for the model.
//
// This is the single source of truth for "what makes a blog post prompt
// different from an ad copy prompt" -- see docs/PROMPT_STRATEGY.md for the
// reasoning and iteration history behind these instructions.

export const TEMPLATES = {
  blog: {
    label: "Blog Post",
    tag: "long-form",
    brief: "Topic",
    placeholder: "e.g. Why remote teams struggle with async communication",
    instructions: (topic) => `Write a blog post about: ${topic}.
Structure it with a compelling headline, a short hook opening, 3-4 clearly
labeled subheadings covering distinct angles, and a closing takeaway.
Use concrete examples over abstractions.`,
  },
  caption: {
    label: "Social Caption",
    tag: "social",
    brief: "Post idea",
    placeholder: "e.g. Behind-the-scenes photo of our team packing orders",
    instructions: (topic) => `Write a social media caption for: ${topic}.
Open with a scroll-stopping first line. Keep it tight. Include a natural
call-to-action and 3-5 relevant hashtags at the end, on their own line.`,
  },
  ad: {
    label: "Ad Copy",
    tag: "conversion",
    brief: "Product / offer",
    placeholder: "e.g. 20% off first order of our organic dog food",
    instructions: (topic) => `Write ad copy for: ${topic}.
Provide a headline (under 8 words), one primary line of body copy that
leads with the benefit not the feature, and a single clear call-to-action
line. Make every word earn its place.`,
  },
  email: {
    label: "Email",
    tag: "lifecycle",
    brief: "Purpose",
    placeholder: "e.g. Re-engagement email for users inactive for 30 days",
    instructions: (topic) => `Write a marketing/lifecycle email for: ${topic}.
Include a subject line, a short preview text line, a greeting, 2-3 short
body paragraphs (or a scannable list if that fits better), and a single
clear call-to-action button label. Label each part clearly.`,
  },
  product: {
    label: "Product Description",
    tag: "ecommerce",
    brief: "Product",
    placeholder: "e.g. Hand-thrown ceramic mug, holds 12oz, dishwasher safe",
    instructions: (topic) => `Write an ecommerce product description for: ${topic}.
Lead with the single most persuasive benefit, follow with a short sensory
or use-case paragraph, then a bullet list of 3-5 concrete specs/features.
End with one line addressing a likely hesitation.`,
  },
  linkedin: {
    label: "LinkedIn Post",
    tag: "professional",
    brief: "Idea / update",
    placeholder: "e.g. Lesson learned from missing a product launch deadline",
    instructions: (topic) => `Write a LinkedIn post about: ${topic}.
Open with a one-line hook that earns the click to 'see more'. Use short
paragraphs (1-2 sentences each) with white space between them. Ground it
in a specific, credible detail rather than generic advice. End with a
genuine question or takeaway, not a hard sales pitch.`,
  },
};

export const TONE_OPTIONS = [
  "Professional",
  "Casual & friendly",
  "Enthusiastic",
  "Witty",
  "Formal",
  "Persuasive",
  "Empathetic",
  "Bold & direct",
];

export const LENGTH_OPTIONS = [
  { value: "short", label: "Short", words: "60-120 words" },
  { value: "medium", label: "Medium", words: "150-300 words" },
  { value: "long", label: "Long", words: "350-600 words" },
];

export const FORMAT_OPTIONS = [
  { value: "plain", label: "Plain paragraphs" },
  { value: "markdown", label: "Markdown (headings/bold)" },
  { value: "bullets", label: "Bullet-first" },
];

const SYSTEM_PROMPT = `You are a senior copywriter and content strategist producing ready-to-publish drafts. Follow the brief exactly. Never include meta-commentary, explanations, or notes about what you did -- output only the finished content piece itself. Do not use generic filler phrases like "in today's fast-paced world."`;

/**
 * Builds the final system + user prompt sent to the model from the
 * current form state. Kept as a pure function so it can be unit tested
 * and so the "view prompt" panel in the UI can show exactly what will
 * be sent before the request goes out.
 */
export function buildPrompt({ templateKey, topic, tone, length, audience, format }) {
  const template = TEMPLATES[templateKey];
  const lengthObj = LENGTH_OPTIONS.find((l) => l.value === length) || LENGTH_OPTIONS[1];
  const effectiveTopic = topic && topic.trim() ? topic.trim() : template.placeholder;

  const audienceLine = audience && audience.trim()
    ? `Write for this specific audience: ${audience.trim()}.`
    : `Write for a general but engaged audience.`;

  const formatLine =
    format === "markdown"
      ? "Format the output using Markdown (## for headings, ** for bold emphasis where useful)."
      : format === "bullets"
      ? "Prefer scannable bullet points over dense paragraphs wherever the content allows it."
      : "Use plain, well-spaced paragraphs -- no markdown symbols.";

  const user = `${template.instructions(effectiveTopic)}

Tone: ${tone}.
${audienceLine}
Target length: ${lengthObj.words}.
${formatLine}`;

  return { system: SYSTEM_PROMPT, user };
}
