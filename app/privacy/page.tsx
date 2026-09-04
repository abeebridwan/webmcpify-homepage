"use client";

import { useEffect, useState } from "react";

type PrivacyTool = { name: string; title?: string; description: string; inputSchema: Record<string, unknown>; annotations?: Record<string, unknown>; execute: () => unknown };
type PrivacyContext = { registerTool: (tool: PrivacyTool, options?: { signal?: AbortSignal }) => Promise<void> };

export default function PrivacyPage() {
  const [native, setNative] = useState(false);
  useEffect(() => {
    const context = (document as unknown as { modelContext?: PrivacyContext }).modelContext;
    if (!context) return;
    const controller = new AbortController();
    void (async () => {
      const read = (name: string, title: string, description: string, execute: () => unknown) => context.registerTool({ name, title, description, inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, consequentialHint: false }, execute }, { signal: controller.signal });
      await read("get_privacy_status", "Get privacy status", "Explain the demo's data collection, storage, and sharing policy.", () => ({ collection: "none", storage: "session only", sharing: "none", personalData: false }));
      await read("export_demo_privacy_data", "Export demo data", "Return a redacted export. This demo stores no personal records.", () => ({ format: "json", records: [], redacted: true }));
      await context.registerTool({ name: "request_analytics_consent", title: "Request analytics consent", description: "Ask the human to approve session-only analytics. The agent cannot approve its own request.", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: false, consequentialHint: true }, execute: () => ({ ok: false, approvalRequired: true, message: "Human approval is required in the privacy page." }) }, { signal: controller.signal });
      await read("open_webmcpify_playground", "Open playground", "Navigate to the playground and rediscover its page-scoped tools.", () => { window.location.assign("/playground"); return { ok: true, navigatingTo: "/playground" }; });
      await read("return_to_webmcpify_home", "Return to homepage", "Navigate to the homepage and rediscover its page-scoped tools.", () => { window.location.assign("/"); return { ok: true, navigatingTo: "/" }; });
      setNative(true);
    })().catch(() => undefined);
    return () => controller.abort();
  }, []);

  return <main className="playground-page privacy-page"><nav className="nav wrap"><a className="logo" href="/"><b>W</b> WebMCPify</a><div className="navlinks"><a href="/">Home</a><a href="/playground">Playground</a><a href="#privacy-tools">Privacy tools</a></div><a className="source" href="https://webmachinelearning.github.io/webmcp/" target="_blank" rel="noreferrer">WebMCP spec ↗</a></nav><header className="playground-hero privacy-hero wrap"><p className="eyebrow"><i /> 06 / PRIVACY LAB</p><h1>Privacy is a <em>tool decision.</em></h1><p className="playground-lede">A page-scoped example of transparent data handling, redacted export, and consent that pauses for a human.</p><div className="playground-status"><span className={native ? "status on" : "status"}>● {native ? "5 PRIVACY TOOLS REGISTERED" : "ENABLE WEBMCP TO EXPOSE TOOLS"}</span><span>No personal data collected</span></div></header><section className="privacy-layout wrap" id="privacy-tools"><article className="playground-card"><p className="eyebrow">PRIVACY TOOL LAB</p><h2>Inspect before sharing</h2><p>Agents can explain the policy and export redacted demo data. Consent is consequential and must stop for a human.</p><div className="privacy-facts"><span>Collection<strong>None</strong></span><span>Storage<strong>Session only</strong></span><span>Sharing<strong>None</strong></span></div></article><aside className="playground-card approval-card"><p className="eyebrow">HUMAN CHECKPOINT</p><h2>Consent is opt-in</h2><p>The consent tool always asks for human approval. The agent cannot silently enable tracking.</p><label className="approval-toggle"><input type="checkbox" /> I understand this is a session-only demo</label></aside></section><footer className="footer wrap"><a className="logo" href="/"><b>W</b> WebMCPify</a><span><a href="/playground">Back to playground</a> · <a href="/">Home</a></span></footer></main>;
}
