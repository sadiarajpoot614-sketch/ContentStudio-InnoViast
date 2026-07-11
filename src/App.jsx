import { useState, useRef } from "react";
import {
  TEMPLATES,
  TONE_OPTIONS,
  LENGTH_OPTIONS,
  FORMAT_OPTIONS,
  buildPrompt,
} from "./templates";

// The app calls OpenAI's Chat Completions API directly from the browser.
// This is intentional for a small student project with no backend, but it
// means the API key lives in the browser tab's memory for the session only.
// It is NEVER written to localStorage, a file, or committed anywhere --
// see docs/AI_USAGE.md and the README security note.
async function callOpenAI(apiKey, system, user) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Request failed (${response.status}): ${detail.slice(0, 160)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

function wordCount(str) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export default function App() {
  const [templateKey, setTemplateKey] = useState("blog");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState(TONE_OPTIONS[0]);
  const [length, setLength] = useState("medium");
  const [format, setFormat] = useState("plain");
  const [audience, setAudience] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [output, setOutput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");

  const sheetRef = useRef(null);
  const template = TEMPLATES[templateKey];

  async function handleGenerate() {
    if (generating) return;
    if (!apiKey.trim()) {
setError("Add your Groq API key above first (it stays in this browser tab only).");
      return;
    }
    setError("");
    setGenerating(true);

    const { system, user } = buildPrompt({ templateKey, topic, tone, length, audience, format });
    setLastPrompt(`SYSTEM:\n${system}\n\nUSER:\n${user}`);

    try {
      const text = await callOpenAI(apiKey.trim(), system, user);
      setOutput(text);
    } catch (err) {
      setError(`Couldn't generate right now: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  }

  function handleCopy() {
    const text = sheetRef.current?.innerText || "";
    navigator.clipboard.writeText(text).catch(() => {});
  }

  function handleDownload() {
    const text = sheetRef.current?.innerText || "";
    const blob = new Blob([`# ${template.label}\n\n${text}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.label.toLowerCase().replace(/\s+/g, "-")}-draft.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const stampState = generating ? "working" : output ? "ready" : "";
  const stampText = generating ? "Generating…" : output ? "Ready" : "Draft";

  return (
    <div className="cs-root">
      <div className="cs-header">
        <div>
          <h1 className="cs-title">
            Content <span>Studio</span>
          </h1>
          <div className="cs-subtitle">AI Content Generation Studio</div>
        </div>
        <div className="cs-issue">
          TEMPLATE: {template.label.toUpperCase()}
          <br />
          FORMAT: {format.toUpperCase()}
        </div>
      </div>

      <div className="cs-grid">
        <div className="cs-panel">
        <span className="cs-label">API key (Groq)</span>
          <input
            className="cs-input"
            type="password"
        placeholder="gsk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <div className="cs-hint">
            Stored in memory for this tab only. Never saved or sent anywhere except OpenAI.
          </div>

          <span className="cs-label">Template</span>
          <div className="cs-tabs">
            {Object.entries(TEMPLATES).map(([key, t]) => (
              <button
                key={key}
                className={`cs-tab ${key === templateKey ? "active" : ""}`}
                onClick={() => {
                  setTemplateKey(key);
                  setTopic("");
                }}
              >
                {t.label} <span className="cs-tag">{t.tag}</span>
              </button>
            ))}
          </div>

          <span className="cs-label">{template.brief}</span>
          <textarea
            className="cs-input"
            placeholder={template.placeholder}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <span className="cs-label">Tone</span>
          <select className="cs-input" value={tone} onChange={(e) => setTone(e.target.value)}>
            {TONE_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>

          <div className="cs-row2">
            <div>
              <span className="cs-label">Length</span>
              <select className="cs-input" value={length} onChange={(e) => setLength(e.target.value)}>
                {LENGTH_OPTIONS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="cs-label">Format</span>
              <select className="cs-input" value={format} onChange={(e) => setFormat(e.target.value)}>
                {FORMAT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <span className="cs-label">Audience (optional)</span>
          <input
            className="cs-input"
            placeholder="e.g. busy new parents"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          />

          <button className="cs-generate" onClick={handleGenerate} disabled={generating}>
            {generating ? "Generating…" : "Generate draft"}
          </button>

          {error && <div className="cs-error">{error}</div>}

          <button className="cs-prompt-toggle" onClick={() => setShowPrompt((v) => !v)}>
            {showPrompt ? "Hide" : "View"} prompt sent to the model
          </button>
          {showPrompt && (
            <div className="cs-prompt-view">
              {lastPrompt || "Generate a draft first to see the constructed prompt."}
            </div>
          )}

          <div className="cs-hint">Output is editable — click into the sheet and revise directly.</div>
        </div>

        <div className="cs-perf" />

        <div className="cs-output-wrap">
          <div className={`cs-stamp ${stampState}`}>{stampText}</div>
          <div className="cs-sheet">
            <div className="cs-sheet-tear" />
            <div className="cs-sheet-body">
              <div className="cs-sheet-meta">
                <span>{template.label}</span>
                <span>Tone: {tone}</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div
                className="cs-sheet-content"
                contentEditable
                suppressContentEditableWarning
                ref={sheetRef}
                data-placeholder="Your generated draft will appear here. Fill in the brief and hit Generate."
              >
                {output}
              </div>
            </div>
            <div className="cs-sheet-footer">
              <span className="cs-wordcount">{output ? `${wordCount(output)} words` : "0 words"}</span>
              <div className="cs-actions">
                <button className="cs-action-btn" onClick={handleCopy}>
                  Copy
                </button>
                <button className="cs-action-btn" onClick={handleDownload}>
                  Download .md
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
