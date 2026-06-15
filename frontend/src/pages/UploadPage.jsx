import { useState, useRef } from "react";
import {
  FiShieldOff,
  FiUploadCloud,
  FiFileText,
  FiSearch,
  FiActivity,
  FiCpu,
  FiAward,
  FiWifi,
  FiKey,
  FiUser,
  FiBriefcase,
  FiShield,
  FiLock,
  FiTrash2,
  FiServer,
  FiCheckCircle,
  FiPlus,
  FiX,
  FiAlertTriangle,
  FiCheck,
  FiBarChart2,
  FiBox,
  FiTag,
  FiSmartphone,
  FiCode,
  FiMessageSquare,
} from "react-icons/fi";

// ─── NAV ────────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 40px", borderBottom: "0.5px solid #222",
      background: "#000", position: "sticky", top: 0, zIndex: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 500, fontSize: 15 }}>
        <FiShieldOff size={20} color="#fff" />
        ThreatLens
      </div>
      <div style={{ display: "flex", gap: 28 }}>
        {["Features", "Workflow", "Services", "Pricing"].map(l => (
          <a key={l} href="#" style={{ fontSize: 13, color: "#888", textDecoration: "none" }}>{l}</a>
        ))}
      </div>
      <button style={{
        background: "#fff", color: "#000", border: "none",
        padding: "8px 18px", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer",
      }}>Get started</button>
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
const STATS = [
  { num: "15+", label: "Dangerous permissions checked" },
  { num: "4",   label: "AI agents in pipeline" },
  { num: "<90s",label: "Full report turnaround" },
  { num: "99.2%",label: "Detection accuracy" },
];

function Hero({ onUploadClick }) {
  return (
    <div style={{ padding: "80px 40px 60px", maxWidth: 960, margin: "0 auto" }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "#111", border: "0.5px solid #333", borderRadius: 20,
        padding: "5px 14px", fontSize: 12, color: "#aaa", marginBottom: 28,
      }}>
        <FiActivity size={13} color="#666" />
        AI-powered malware detection for Android
      </div>
      <h1 style={{ fontSize: 44, fontWeight: 500, lineHeight: 1.2, color: "#fff", maxWidth: 640 }}>
        Detect fraudulent APKs{" "}
        <span style={{ color: "#555" }}>before they reach your customers</span>
      </h1>
      <p style={{ fontSize: 15, color: "#666", marginTop: 18, maxWidth: 520, lineHeight: 1.7 }}>
        ThreatLens uses a 4-agent AI pipeline to analyze permissions, network behavior,
        and malware signatures — generating bank-grade investigation reports instantly.
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 36 }}>
        <button onClick={onUploadClick} style={{
          background: "#fff", color: "#000", border: "none",
          padding: "12px 24px", borderRadius: 7, fontSize: 14, fontWeight: 500,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
        }}>
          <FiUploadCloud size={16} /> Upload an APK
        </button>
        <button style={{
          background: "transparent", color: "#888", border: "0.5px solid #333",
          padding: "12px 24px", borderRadius: 7, fontSize: 14,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
        }}>
          <FiFileText size={16} /> View sample report
        </button>
      </div>
      <div style={{
        display: "flex", gap: 40, marginTop: 52,
        paddingTop: 36, borderTop: "0.5px solid #1a1a1a",
      }}>
        {STATS.map(s => (
          <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 500, color: "#fff" }}>{s.num}</span>
            <span style={{ fontSize: 12, color: "#555" }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── UPLOAD ZONE ─────────────────────────────────────────────────────────────
function UploadZone({ onFileSelect, error: externalError }) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const displayError = error || externalError;

  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".apk")) {
      setError("Invalid file type. Please upload a .apk file.");
      return;
    }
    setError("");
    onFileSelect(file);
  };

  return (
    <div style={{ padding: "0 40px 60px", maxWidth: 960, margin: "0 auto" }}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
        style={{
          border: `1px dashed ${dragOver ? "#888" : "#333"}`,
          borderRadius: 12, padding: "52px 40px", textAlign: "center",
          background: "#080808", cursor: "pointer", transition: "border-color 0.15s",
        }}
      >
        <div style={{
          width: 52, height: 52, background: "#111", border: "0.5px solid #2a2a2a",
          borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 18px",
        }}>
          <FiUploadCloud size={24} color="#aaa" />
        </div>
        <div style={{ fontSize: 16, fontWeight: 500, color: "#fff", marginBottom: 6 }}>
          Drop your APK file here
        </div>
        <div style={{ fontSize: 13, color: "#555", marginBottom: 24 }}>
          .apk files only · max 100 MB · analysis starts immediately
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          style={{
            background: "#fff", color: "#000", border: "none",
            padding: "10px 22px", borderRadius: 7, fontSize: 13, fontWeight: 500,
            cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
          }}
        >
          <FiUploadCloud size={15} /> Choose APK file
        </button>
        <input
          ref={inputRef} type="file" accept=".apk"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 20 }}>
          {[
            { icon: <FiLock size={13} />, text: "End-to-end encrypted" },
            { icon: <FiTrash2 size={13} />, text: "Files deleted after analysis" },
            { icon: <FiActivity size={13} />, text: "Results in under 90 seconds" },
          ].map(m => (
            <span key={m.text} style={{ fontSize: 12, color: "#444", display: "flex", alignItems: "center", gap: 5 }}>
              {m.icon} {m.text}
            </span>
          ))}
        </div>
      </div>
      {displayError && (
        <div style={{ color: "#ff4444", marginTop: 12, fontSize: 13 }}>{displayError}</div>
      )}
    </div>
  );
}

// ─── FEATURES ────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: <FiSearch size={18} />, title: "Static analysis", desc: "Extracts permissions, manifest data, certificates, and embedded URLs using Androguard — no device or emulator needed." },
  { icon: <FiActivity size={18} />, title: "Heuristic scoring", desc: "Rules engine scores 15+ dangerous permissions and detects known attack combos like OTP-stealers and overlay hijacks." },
  { icon: <FiCpu size={18} />, title: "4-agent AI pipeline", desc: "Triage → Code Analysis → Risk Synthesis → Report Writing, each powered by Llama 3.1 70B for deep contextual reasoning." },
  { icon: <FiAward size={18} />, title: "PDF investigation report", desc: "Bank-grade formal report with IOCs, recommended remediation actions, and a plain-language customer advisory." },
  { icon: <FiWifi size={18} />, title: "Network behaviour profiling", desc: "Identifies suspicious C2 endpoints, hardcoded IPs, and rogue domains baked into the APK's compiled resources." },
  { icon: <FiKey size={18} />, title: "Certificate & signing analysis", desc: "Validates app signing chain, detects self-signed certificates, and flags certificate mismatch with known publishers." },
];

function SectionLabel({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
      <div style={{ width: 20, height: 0.5, background: "#333" }} />
      {text}
    </div>
  );
}

function Features() {
  return (
    <div style={{ padding: "70px 40px", maxWidth: 960, margin: "0 auto" }}>
      <SectionLabel text="Features" />
      <h2 style={{ fontSize: 28, fontWeight: 500, color: "#fff", maxWidth: 480, lineHeight: 1.3 }}>
        Everything you need to detect Android threats
      </h2>
      <p style={{ fontSize: 14, color: "#555", marginTop: 12, maxWidth: 440, lineHeight: 1.7 }}>
        From static extraction to AI synthesis, ThreatLens covers the full detection surface.
      </p>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
        gap: "1px", background: "#1a1a1a",
        border: "0.5px solid #1a1a1a", borderRadius: 12, overflow: "hidden", marginTop: 40,
      }}>
        {FEATURES.map(f => (
          <div key={f.title} style={{ background: "#000", padding: 28, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{
              width: 38, height: 38, background: "#111", border: "0.5px solid #2a2a2a",
              borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa",
            }}>
              {f.icon}
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>{f.title}</div>
            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── WORKFLOW ────────────────────────────────────────────────────────────────
const STEPS = [
  { num: "1", title: "Upload & extraction", desc: "Your APK is unpacked with Androguard. Permissions, manifest entries, DEX classes, embedded strings, and signing certificates are extracted into a structured evidence bundle.", tag: "Androguard · APKTool", icon: <FiCode size={12} /> },
  { num: "2", title: "Triage agent", desc: "The first AI agent scores the evidence bundle against 15+ heuristic rules, detects known attack combos, and assigns an initial risk tier (Low / Medium / High / Critical).", tag: "Llama 3.1 70B · Rules engine", icon: <FiCpu size={12} /> },
  { num: "3", title: "Deep code analysis agent", desc: "Focuses on suspicious class trees, decompiled method logic, obfuscation patterns, and runtime reflection calls. Cross-references IOCs against threat intelligence feeds.", tag: "Llama 3.1 70B · IOC feeds", icon: <FiCpu size={12} /> },
  { num: "4", title: "Risk synthesis & report", desc: "Two final agents consolidate findings into a structured JSON evidence object and render a bank-grade PDF with executive summary, technical IOCs, and customer advisory.", tag: "PDF · JSON export", icon: <FiFileText size={12} /> },
];

function Workflow() {
  return (
    <div style={{ padding: "70px 40px", maxWidth: 960, margin: "0 auto" }}>
      <SectionLabel text="Workflow" />
      <h2 style={{ fontSize: 28, fontWeight: 500, color: "#fff", lineHeight: 1.3 }}>
        From upload to report in four steps
      </h2>
      <p style={{ fontSize: 14, color: "#555", marginTop: 12, maxWidth: 440, lineHeight: 1.7 }}>
        Each stage hands enriched context to the next agent — nothing is lost in translation.
      </p>
      <div style={{ marginTop: 44, display: "flex", flexDirection: "column" }}>
        {STEPS.map((s, i) => (
          <div key={s.num} style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 20, position: "relative", paddingBottom: i < STEPS.length - 1 ? 36 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: 36, height: 36, border: "0.5px solid #333", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 500, color: "#888", background: "#000", flexShrink: 0, zIndex: 1,
              }}>{s.num}</div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, width: 0.5, background: "#222", marginTop: 8 }} />
              )}
            </div>
            <div style={{ paddingTop: 6 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{s.desc}</div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                background: "#111", border: "0.5px solid #2a2a2a", borderRadius: 4,
                padding: "3px 10px", fontSize: 11, color: "#666", marginTop: 10,
              }}>
                {s.icon} {s.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SERVICES ────────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: <FiUser size={17} />, badge: "Free", title: "Individual analyst", desc: "Upload up to 10 APKs per month. Full heuristic scoring, AI triage, and downloadable PDF report included." },
  { icon: <FiBriefcase size={17} />, badge: "Pro", title: "Bank & fintech", desc: "Unlimited uploads, priority queue, API access, bulk batch scanning, and compliance-ready report templates for RBI / DPDP." },
  { icon: <FiShield size={17} />, badge: "Enterprise", title: "SOC / CERT teams", desc: "On-premise deployment option, SIEM integrations, dedicated threat intelligence feed, and SLA-backed response times." },
];

function Services() {
  return (
    <div style={{ background: "#060606", borderTop: "0.5px solid #1a1a1a", borderBottom: "0.5px solid #1a1a1a" }}>
      <div style={{ padding: "70px 40px", maxWidth: 960, margin: "0 auto" }}>
        <SectionLabel text="Services" />
        <h2 style={{ fontSize: 28, fontWeight: 500, color: "#fff", lineHeight: 1.3 }}>
          Built for security teams at every scale
        </h2>
        <p style={{ fontSize: 14, color: "#555", marginTop: 12, maxWidth: 440, lineHeight: 1.7 }}>
          Whether you're a solo analyst or a CISO running a SOC, ThreatLens fits your workflow.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 40 }}>
          {SERVICES.map(s => (
            <div key={s.title} style={{
              background: "#0a0a0a", border: "0.5px solid #1e1e1e",
              borderRadius: 10, padding: 24,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{
                  width: 36, height: 36, background: "#111", border: "0.5px solid #2a2a2a",
                  borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa",
                }}>{s.icon}</div>
                <span style={{ fontSize: 10, color: "#555", background: "#111", border: "0.5px solid #222", borderRadius: 4, padding: "2px 8px" }}>{s.badge}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#fff", marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── REPORT PREVIEW ──────────────────────────────────────────────────────────
const PERMS = [
  { label: "READ_SMS (OTP intercept)", level: "danger" },
  { label: "RECEIVE_SMS", level: "danger" },
  { label: "SYSTEM_ALERT_WINDOW (overlay)", level: "danger" },
  { label: "BIND_ACCESSIBILITY_SERVICE", level: "danger" },
  { label: "READ_CONTACTS", level: "warn" },
  { label: "ACCESS_FINE_LOCATION", level: "warn" },
  { label: "CAMERA", level: "warn" },
  { label: "INTERNET", level: "ok" },
  { label: "VIBRATE", level: "ok" },
];

const permColor = { danger: "#ff4444", warn: "#ff9933", ok: "#44aa66" };
const PermIcon = ({ level }) => {
  if (level === "ok") return <FiCheck size={13} color={permColor.ok} />;
  if (level === "warn") return <FiAlertTriangle size={13} color={permColor.warn} />;
  return <FiX size={13} color={permColor.danger} />;
};

function ReportPreview() {
  return (
    <div style={{ padding: "70px 40px", maxWidth: 960, margin: "0 auto" }}>
      <SectionLabel text="Sample output" />
      <h2 style={{ fontSize: 28, fontWeight: 500, color: "#fff", lineHeight: 1.3 }}>
        What a ThreatLens report looks like
      </h2>
      <p style={{ fontSize: 14, color: "#555", marginTop: 12, maxWidth: 480, lineHeight: 1.7 }}>
        A real analysis output from a known banking trojan sample — redacted for illustration.
      </p>
      <div style={{ background: "#080808", border: "0.5px solid #1e1e1e", borderRadius: 12, overflow: "hidden", marginTop: 40 }}>
        <div style={{
          background: "#0d0d0d", borderBottom: "0.5px solid #1e1e1e",
          padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FiFileText size={16} color="#666" />
            <span style={{ fontSize: 13, color: "#888" }}>ThreatLens Investigation Report — com.secure.banking.apk</span>
          </div>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 11, color: "#ff4444", border: "0.5px solid #2a2a2a", borderRadius: 4, padding: "3px 10px",
          }}>
            <FiAlertTriangle size={12} /> Risk: Critical
          </span>
        </div>
        <div style={{ padding: "28px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
          <div>
            <div style={{ fontSize: 11, color: "#444", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>APK metadata</div>
            {[
              { icon: <FiBox size={13} />, label: "Package", val: "com.secure.banking" },
              { icon: <FiTag size={13} />, label: "Version", val: "2.4.1 (build 83)" },
              { icon: <FiAward size={13} />, label: "Certificate", val: "Self-signed ⚠", danger: true },
              { icon: <FiFileText size={13} />, label: "File size", val: "4.2 MB" },
              { icon: <FiSmartphone size={13} />, label: "Min SDK", val: "API 21 (Android 5)" },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid #141414" }}>
                <span style={{ fontSize: 12, color: "#555", display: "flex", alignItems: "center", gap: 7 }}>{r.icon} {r.label}</span>
                <span style={{ fontSize: 12, color: r.danger ? "#ff4444" : "#aaa" }}>{r.val}</span>
              </div>
            ))}
            <div style={{ fontSize: 11, color: "#444", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 18, marginBottom: 14 }}>Risk scores</div>
            {[
              { icon: <FiBarChart2 size={13} />, label: "Heuristic", val: "92 / 100", color: "#ff4444" },
              { icon: <FiCpu size={13} />, label: "AI triage", val: "Critical", color: "#ff4444" },
              { icon: <FiAlertTriangle size={13} />, label: "IOCs found", val: "14", color: "#ff4444" },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid #141414" }}>
                <span style={{ fontSize: 12, color: "#555", display: "flex", alignItems: "center", gap: 7 }}>{r.icon} {r.label}</span>
                <span style={{ fontSize: 12, color: r.color }}>{r.val}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#444", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Dangerous permissions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PERMS.map(p => (
                <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: permColor[p.level] }}>
                  <PermIcon level={p.level} /> {p.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TRUST ───────────────────────────────────────────────────────────────────
const TRUST = [
  { icon: <FiLock size={17} />, title: "End-to-end encrypted", desc: "APKs are encrypted in transit and at rest using AES-256." },
  { icon: <FiTrash2 size={17} />, title: "Zero retention", desc: "Files and extracted data are permanently deleted after report generation." },
  { icon: <FiServer size={17} />, title: "On-premise option", desc: "Enterprise customers can run the full pipeline on their own infrastructure." },
  { icon: <FiCheckCircle size={17} />, title: "Compliance-ready", desc: "Reports are formatted for RBI cybersecurity guidelines and DPDP Act compliance." },
];

function Trust() {
  return (
    <div style={{ background: "#060606", borderTop: "0.5px solid #1a1a1a", borderBottom: "0.5px solid #1a1a1a" }}>
      <div style={{ padding: "56px 40px", maxWidth: 960, margin: "0 auto" }}>
        <SectionLabel text="Trust & privacy" />
        <h2 style={{ fontSize: 28, fontWeight: 500, color: "#fff", lineHeight: 1.3 }}>Your files stay private</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 40 }}>
          {TRUST.map(t => (
            <div key={t.title} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{
                width: 36, height: 36, background: "#111", border: "0.5px solid #2a2a2a",
                borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#777",
              }}>{t.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#ddd" }}>{t.title}</div>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "What types of malware can ThreatLens detect?", a: "ThreatLens detects OTP-stealers, banking trojans, overlay malware, accessibility abuse, SMS interceptors, spyware, and C2-connected RATs. The heuristic engine is updated regularly with new attack signatures." },
  { q: "Do you store the APKs I upload?", a: "No. APKs and all extracted data are permanently deleted immediately after the investigation report is generated. We never retain your files." },
  { q: "How accurate is the AI detection?", a: "In internal benchmarks against a curated dataset of 2,400 malicious and benign APKs, ThreatLens achieved 99.2% detection accuracy with a false-positive rate under 0.8%." },
  { q: "Can I use ThreatLens via API?", a: "Yes. Pro and Enterprise plans include full REST API access with JSON report output, webhook notifications on completion, and batch submission endpoints for CI/CD pipeline integration." },
  { q: "What is the maximum APK size?", a: "The upload limit is 100 MB for standard accounts. Enterprise customers can request higher limits for analyzing large app bundles or AAB files." },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ padding: "70px 40px", maxWidth: 960, margin: "0 auto" }}>
      <SectionLabel text="FAQ" />
      <h2 style={{ fontSize: 28, fontWeight: 500, color: "#fff", lineHeight: 1.3 }}>Common questions</h2>
      <div style={{ marginTop: 40, border: "0.5px solid #1a1a1a", borderRadius: 10, overflow: "hidden" }}>
        {FAQS.map((f, i) => (
          <div key={f.q} style={{ borderBottom: i < FAQS.length - 1 ? "0.5px solid #1a1a1a" : "none", background: "#000" }}>
            <div
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                padding: "18px 22px", fontSize: 13, color: "#bbb",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              {f.q}
              <span style={{ transform: open === i ? "rotate(45deg)" : "none", transition: "transform 0.2s", color: "#444" }}>
                <FiPlus size={15} />
              </span>
            </div>
            {open === i && (
              <div style={{ padding: "0 22px 16px", fontSize: 13, color: "#555", lineHeight: 1.7 }}>{f.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────
function CTA({ onUploadClick }) {
  return (
    <div style={{ padding: "80px 40px", maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
      <div style={{ background: "#090909", border: "0.5px solid #222", borderRadius: 16, padding: "60px 40px" }}>
        <h2 style={{ fontSize: 30, fontWeight: 500, color: "#fff", marginBottom: 14, lineHeight: 1.3 }}>
          Ready to protect your customers from fraudulent apps?
        </h2>
        <p style={{ fontSize: 14, color: "#555", marginBottom: 32, maxWidth: 380, margin: "0 auto 32px", lineHeight: 1.7 }}>
          Upload your first APK free. No signup required. Results in under 90 seconds.
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <button onClick={onUploadClick} style={{
            background: "#fff", color: "#000", border: "none",
            padding: "12px 24px", borderRadius: 7, fontSize: 14, fontWeight: 500,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
          }}>
            <FiUploadCloud size={16} /> Upload APK now
          </button>
          <button style={{
            background: "transparent", color: "#888", border: "0.5px solid #333",
            padding: "12px 24px", borderRadius: 7, fontSize: 14,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
          }}>
            <FiMessageSquare size={16} /> Talk to sales
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { title: "Product", links: ["Features", "Workflow", "Sample report", "API docs"] },
    { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
    { title: "Legal", links: ["Privacy policy", "Terms of service", "Security", "Compliance"] },
  ];
  return (
    <footer style={{ borderTop: "0.5px solid #1a1a1a", padding: 40 }}>
      <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 500, fontSize: 15, color: "#fff" }}>
            <FiShieldOff size={20} /> ThreatLens
          </div>
          <p style={{ fontSize: 12, color: "#444", marginTop: 10, maxWidth: 200, lineHeight: 1.6 }}>
            AI-powered Android APK threat intelligence for security teams and financial institutions.
          </p>
        </div>
        {cols.map(c => (
          <div key={c.title}>
            <div style={{ fontSize: 11, color: "#444", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>{c.title}</div>
            {c.links.map(l => (
              <a key={l} href="#" style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 9, textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{
        maxWidth: 960, margin: "24px auto 0", paddingTop: 20, borderTop: "0.5px solid #111",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <p style={{ fontSize: 12, color: "#333" }}>© 2025 ThreatLens. All rights reserved.</p>
        <div style={{ display: "flex", gap: 20 }}>
          {["Status", "Changelog", "Twitter"].map(l => (
            <a key={l} href="#" style={{ fontSize: 12, color: "#333", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function UploadPage({ onFileSelect, error }) {
  const uploadRef = useRef(null);
  const scrollToUpload = () => uploadRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      <Navbar />
      <Hero onUploadClick={scrollToUpload} />
      <div ref={uploadRef}>
        <UploadZone onFileSelect={onFileSelect} error={error} />
      </div>
      <Features />
      <Workflow />
      <Services />
      <ReportPreview />
      <Trust />
      <FAQ />
      <CTA onUploadClick={scrollToUpload} />
      <Footer />
    </div>
  );
}