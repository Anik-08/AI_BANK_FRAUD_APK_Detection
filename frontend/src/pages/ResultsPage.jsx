import { useState } from "react";
import axios from "axios";
import {
  FiDownload,
  FiRefreshCw,
  FiShield,
  FiAlertTriangle,
  FiAlertCircle,
  FiCheckCircle,
  FiLock,
  FiGlobe,
  FiEye,
  FiCpu,
  FiBarChart2,
  FiFileText,
  FiChevronRight,
  FiX,
  FiCheck,
  FiInfo,
} from "react-icons/fi";

// ─── RISK PALETTE ────────────────────────────────────────────────────────────
const RISK = {
  CRITICAL: { color: "#ff3b3b", bg: "rgba(255,59,59,0.08)", border: "rgba(255,59,59,0.25)", label: "Critical" },
  HIGH:     { color: "#ff8c00", bg: "rgba(255,140,0,0.08)",  border: "rgba(255,140,0,0.25)",  label: "High" },
  MEDIUM:   { color: "#f5c518", bg: "rgba(245,197,24,0.08)", border: "rgba(245,197,24,0.25)", label: "Medium" },
  LOW:      { color: "#22c55e", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.25)",  label: "Low" },
};

function getRisk(level) {
  return RISK[level?.toUpperCase()] || RISK.MEDIUM;
}

function scoreToLevel(score) {
  if (score > 60) return "CRITICAL";
  if (score >= 40) return "HIGH";
  if (score >= 20) return "MEDIUM";
  return "LOW";
}

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────
function RiskBadge({ level, small }) {
  const r = getRisk(level);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: r.bg, border: `0.5px solid ${r.border}`,
      color: r.color, borderRadius: 4,
      padding: small ? "2px 8px" : "4px 12px",
      fontSize: small ? 11 : 12, fontWeight: 500, letterSpacing: "0.03em",
    }}>
      {r.label}
    </span>
  );
}

// function ScoreRing({ score, size = 80 }) {
//   const level = scoreToLevel(score);
//   const r = getRisk(level);
//   const radius = (size / 2) - 6;
//   const circ = 2 * Math.PI * radius;
//   const offset = circ * (1 - Math.min(100, Math.max(0, score)) / 100);
//   return (
//     <svg width={size} height={size}>
//       <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#1a1a1a" strokeWidth={5} />
//       <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={r.color} strokeWidth={5}
//         strokeDasharray={circ} strokeDashoffset={offset}
//         strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
//       <text x={size/2} y={size/2 + 5} textAnchor="middle" fontSize={size * 0.22} fill={r.color} fontWeight="500">
//         {score}
//       </text>
//     </svg>
//   );
// }

function ProgressBar({ score }) {
  const level = scoreToLevel(score);
  const r = getRisk(level);
  return (
    <div style={{ height: 4, background: "#1a1a1a", borderRadius: 4, overflow: "hidden", marginTop: 8 }}>
      <div style={{
        height: "100%", width: `${Math.min(100, Math.max(0, score))}%`,
        background: r.color, borderRadius: 4, transition: "width 0.6s ease",
      }} />
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#080808", border: "0.5px solid #1e1e1e",
      borderRadius: 10, padding: 20, ...style,
    }}>
      {children}
    </div>
  );
}

function CardTitle({ children }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 500, color: "#ddd", marginBottom: 14, display: "flex", alignItems: "center", gap: 7 }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: "0.5px", background: "#1a1a1a", margin: "10px 0" }} />;
}

// function MetaRow({ label, value, mono, color }) {
//   return (
//     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "0.5px solid #111" }}>
//       <span style={{ fontSize: 12, color: "#555" }}>{label}</span>
//       <span style={{ fontSize: 12, color: color || "#aaa", fontFamily: mono ? "monospace" : undefined, maxWidth: "60%", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value || "—"}</span>
//     </div>
//   );
// }

function PermIcon({ level }) {
  if (level === "CRITICAL" || level === "HIGH")
    return <FiX size={13} color={getRisk(level).color} />;
  if (level === "MEDIUM")
    return <FiAlertTriangle size={13} color={getRisk(level).color} />;
  return <FiCheck size={13} color={getRisk("LOW").color} />;
}

function Tab({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 14px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer",
      border: active ? "0.5px solid #444" : "0.5px solid transparent",
      background: active ? "#111" : "transparent",
      color: active ? "#fff" : "#555", transition: "all 0.15s",
    }}>{children}</button>
  );
}

// ─── PIPELINE STRIP ──────────────────────────────────────────────────────────
function PipelineStrip({ triage, analysis, riskAssessment, report }) {
  const steps = [
    { num: "01", label: "Triage", value: triage?.threat_category || "—", icon: <FiAlertTriangle size={13} /> },
    { num: "02", label: "Code analysis", value: (analysis?.technical_indicators || [])[0] || "—", icon: <FiCpu size={13} /> },
    { num: "03", label: "Risk synthesis", value: `Score: ${riskAssessment?.final_risk_score ?? "—"}`, icon: <FiBarChart2 size={13} /> },
    { num: "04", label: "Report writer", value: (report?.report_title || "—").slice(0, 36), icon: <FiFileText size={13} /> },
  ];
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
      background: "#060606", border: "0.5px solid #1e1e1e", borderRadius: 10, overflow: "hidden",
    }}>
      {steps.map((s, i) => (
        <div key={s.num} style={{
          padding: "16px 18px",
          borderLeft: i === 0 ? "none" : "0.5px solid #1a1a1a",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              background: "#22c55e18", border: "0.5px solid #22c55e44",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#22c55e",
            }}>{s.icon}</div>
            <span style={{ fontSize: 10, color: "#555", letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.num} {s.label}</span>
          </div>
          <div style={{ fontSize: 12, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.value}</div>
        </div>
      ))}
    </div>
  );
}

// ─── SCORE CARDS ─────────────────────────────────────────────────────────────
function ScoreCard({ icon, title, score }) {
  const level = scoreToLevel(score);
  const r = getRisk(level);
  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 32, height: 32, background: "#111", border: "0.5px solid #2a2a2a",
            borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa",
          }}>{icon}</div>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#ccc" }}>{title}</span>
        </div>
        <RiskBadge level={level} small />
      </div>
      <div style={{ fontSize: 28, fontWeight: 500, color: r.color }}>
        {score}<span style={{ fontSize: 13, color: "#444" }}>/100</span>
      </div>
      <ProgressBar score={score} />
    </Card>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function ResultsPage({ data, filename, onReset }) {
  const [tab, setTab] = useState("threat");
  const [downloading, setDownloading] = useState(false);

  if (!data) return (
    <div style={{ color: "#fff", padding: 40, textAlign: "center", background: "#000", minHeight: "100vh" }}>
      No analysis data available.
    </div>
  );

  const risk            = data?.risk || {};
  const impersonation   = data?.impersonation || {};
  const networkRisk     = data?.network_risk || {};
  const analysis        = data?.analysis || {};
  const report          = data?.report || {};
  const triage          = data?.triage || {};
  const riskAssessment  = data?.risk_assessment || {};
  const fingerprintMatch= data?.fingerprint_match || {};

  const riskLevel           = data?.risk_level || riskAssessment?.risk_level || "MEDIUM";
  const riskStyle           = getRisk(riskLevel);
  const finalScore          = data?.final_risk_score ?? riskAssessment?.final_risk_score ?? 0;
  const flaggedPermissions  = risk?.flagged_permissions || [];
  const triggeredCombos     = risk?.triggered_combos || [];
  const flaggedUrls         = networkRisk?.flagged_urls || [];
  const reasons             = impersonation?.reasons || [];
  const matchedPermissions  = fingerprintMatch?.matched_permission_overlap || [];
  const recommendedActions  = riskAssessment?.recommended_actions || [];
  const confidence          = fingerprintMatch?.confidence ?? 0;
  const circumference       = 2 * Math.PI * 40;
  const dashOffset          = circumference * (1 - confidence / 100);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/report/${encodeURIComponent(filename)}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${filename}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error("Failed to download report", e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff", fontFamily: "system-ui, sans-serif", padding: "0 40px 80px" }}>

      {/* ── TOP BAR ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0 24px", borderBottom: "0.5px solid #111" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FiFileText size={14} color="#555" />
          <span style={{ fontSize: 13, color: "#555", fontFamily: "monospace" }}>{filename}</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onReset} style={{
            padding: "9px 18px", borderRadius: 7, border: "0.5px solid #2a2a2a",
            background: "transparent", color: "#888", fontSize: 13, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 7,
          }}>
            <FiRefreshCw size={13} /> Analyze another APK
          </button>
          <button onClick={handleDownloadPdf} disabled={downloading} style={{
            padding: "9px 18px", borderRadius: 7, border: "none",
            background: downloading ? "#1a1a1a" : "#fff", color: "#000",
            fontSize: 13, fontWeight: 500, cursor: downloading ? "default" : "pointer",
            display: "flex", alignItems: "center", gap: 7, opacity: downloading ? 0.7 : 1,
          }}>
            <FiDownload size={13} /> {downloading ? "Generating…" : "Download PDF"}
          </button>
        </div>
      </div>

      {/* ── HERO RISK ROW ── */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20, marginTop: 24 }}>

        {/* Risk score card */}
        <div style={{
          background: riskStyle.bg, border: `1px solid ${riskStyle.border}`,
          borderRadius: 12, padding: 24, textAlign: "center",
          boxShadow: riskLevel === "CRITICAL" ? `0 0 24px ${riskStyle.color}22` : "none",
        }}>
          <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Risk score</div>
          <div style={{ fontSize: 60, fontWeight: 500, lineHeight: 1, color: riskStyle.color }}>{finalScore}</div>
          <div style={{ fontSize: 12, color: "#444", marginTop: 4 }}>out of 100</div>
          <div style={{ marginTop: 16 }}>
            <RiskBadge level={riskLevel} />
          </div>
          <div style={{ marginTop: 14, height: 4, background: "#1a1a1a", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${finalScore}%`, background: riskStyle.color, borderRadius: 4 }} />
          </div>
        </div>

        {/* APK info */}
        <Card style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
            <div>
              <div style={{ fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Package name</div>
              <div style={{ fontSize: 13, color: "#ccc", fontFamily: "monospace", marginBottom: 16 }}>{data?.package_name || "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>App name</div>
              <div style={{ fontSize: 13, color: "#ccc", marginBottom: 16 }}>{data?.app_name || "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Threat category</div>
              <div style={{ marginBottom: 4 }}>
                <RiskBadge level="HIGH" />
                <span style={{ fontSize: 12, color: "#888", marginLeft: 8 }}>{triage?.threat_category || "Unknown"}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Malware family</div>
              <div style={{ fontSize: 13, color: "#ccc" }}>{fingerprintMatch?.matched_family || "None detected"}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, paddingTop: 14, borderTop: "0.5px solid #111", marginTop: 8 }}>
            {[
              { label: `${flaggedPermissions.length} flagged perms`, color: "#ff3b3b" },
              { label: `${flaggedUrls.length} suspicious URLs`, color: "#ff8c00" },
              { label: `${(analysis?.technical_indicators || []).length} IOCs`, color: "#f5c518" },
            ].map(p => (
              <span key={p.label} style={{
                fontSize: 11, padding: "3px 10px", borderRadius: 4,
                background: `${p.color}14`, border: `0.5px solid ${p.color}33`, color: p.color,
              }}>{p.label}</span>
            ))}
          </div>
        </Card>
      </div>

      {/* ── PIPELINE ── */}
      <div style={{ marginTop: 20 }}>
        <PipelineStrip triage={triage} analysis={analysis} riskAssessment={riskAssessment} report={report} />
      </div>

      {/* ── THREE SCORE CARDS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 20 }}>
        <ScoreCard icon={<FiLock size={15} />}    title="Permission risk"    score={risk?.permission_risk_score || 0} />
        <ScoreCard icon={<FiEye size={15} />}      title="Impersonation risk" score={impersonation?.impersonation_risk_score || 0} />
        <ScoreCard icon={<FiGlobe size={15} />}    title="Network risk"       score={networkRisk?.network_risk_score || 0} />
      </div>

      {/* ── TWO COL — PERMS + ANALYSIS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>

        {/* Flagged Permissions */}
        <Card>
          <CardTitle><FiShield size={14} color="#aaa" /> Flagged permissions</CardTitle>
          {flaggedPermissions.length === 0 ? (
            <div style={{ fontSize: 13, color: "#444", display: "flex", alignItems: "center", gap: 6 }}>
              <FiCheckCircle size={14} color="#22c55e" /> No dangerous permissions detected
            </div>
          ) : (
            flaggedPermissions.map((p, i) => {
              const pts = p?.points || 0;
              const pLevel = pts > 20 ? "CRITICAL" : pts > 10 ? "HIGH" : "MEDIUM";
              return (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  padding: "10px 0", borderBottom: i < flaggedPermissions.length - 1 ? "0.5px solid #111" : "none",
                }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <div style={{ marginTop: 1 }}><PermIcon level={pLevel} /></div>
                    <div>
                      <div style={{ fontSize: 12, fontFamily: "monospace", color: getRisk(pLevel).color }}>{p?.permission || "Unknown"}</div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{p?.reason || ""}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11, padding: "2px 8px", borderRadius: 4, flexShrink: 0, marginLeft: 8,
                    background: getRisk(pLevel).bg, border: `0.5px solid ${getRisk(pLevel).border}`,
                    color: getRisk(pLevel).color,
                  }}>+{pts}</span>
                </div>
              );
            })
          )}

          {triggeredCombos.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Attack combos detected</div>
              {triggeredCombos.map((combo, i) => (
                <div key={i} style={{
                  background: "rgba(255,140,0,0.07)", border: "0.5px solid rgba(255,140,0,0.25)",
                  borderRadius: 6, padding: "9px 12px", fontSize: 12, color: "#ff8c00", marginBottom: 6,
                  display: "flex", alignItems: "flex-start", gap: 8,
                }}>
                  <FiAlertTriangle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                  {typeof combo === "string" ? combo : `${combo.name}${combo.reason ? ` — ${combo.reason}` : ""}${combo.bonus ? ` (+${combo.bonus})` : ""}`}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* AI Analysis Tabs */}
        <Card>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            <Tab active={tab === "threat"}        onClick={() => setTab("threat")}>Threat analysis</Tab>
            <Tab active={tab === "network"}       onClick={() => setTab("network")}>Network</Tab>
            <Tab active={tab === "impersonation"} onClick={() => setTab("impersonation")}>Impersonation</Tab>
          </div>

          {tab === "threat" && (
            <div style={{ fontSize: 13, color: "#777", lineHeight: 1.7 }}>
              <div style={{ fontWeight: 500, color: "#ccc", marginBottom: 6, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>Behavioral pattern</div>
              <div style={{ marginBottom: 16 }}>{analysis?.behavioral_pattern || "—"}</div>
              <Divider />
              <div style={{ fontWeight: 500, color: "#ccc", margin: "12px 0 6px", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>Banking impact</div>
              <div>{analysis?.banking_impact || "—"}</div>
            </div>
          )}

          {tab === "network" && (
            <div style={{ fontSize: 13, color: "#777", lineHeight: 1.7 }}>
              <div style={{ fontWeight: 500, color: "#ccc", marginBottom: 8, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>Flagged URLs</div>
              {flaggedUrls.length === 0
                ? <div style={{ color: "#444", display: "flex", gap: 6, alignItems: "center" }}><FiCheckCircle size={13} color="#22c55e" /> None detected</div>
                : flaggedUrls.map((u, i) => (
                  <div key={i} style={{ marginBottom: 10, padding: "8px 10px", background: "rgba(255,59,59,0.05)", border: "0.5px solid rgba(255,59,59,0.15)", borderRadius: 6 }}>
                    <div style={{ fontFamily: "monospace", fontSize: 12, color: "#ff3b3b" }}>{u?.url}</div>
                    {(u?.reasons || []).map((r, j) => (
                      <div key={j} style={{ fontSize: 11, color: "#555", marginTop: 3 }}>· {r}</div>
                    ))}
                  </div>
                ))}
              <Divider />
              <div style={{ fontWeight: 500, color: "#ccc", margin: "12px 0 6px", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>Network analysis</div>
              <div>{analysis?.network_analysis || "—"}</div>
            </div>
          )}

          {tab === "impersonation" && (
            <div style={{ fontSize: 13, color: "#777", lineHeight: 1.7 }}>
              <div style={{ fontWeight: 500, color: "#ccc", marginBottom: 8, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>Detected signals</div>
              {reasons.length === 0
                ? <div style={{ color: "#444", display: "flex", gap: 6, alignItems: "center" }}><FiCheckCircle size={13} color="#22c55e" /> None detected</div>
                : reasons.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                    <FiAlertCircle size={13} color="#f5c518" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span>{r}</span>
                  </div>
                ))}
              <Divider />
              <div style={{ fontWeight: 500, color: "#ccc", margin: "12px 0 6px", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>Analysis</div>
              <div>{analysis?.impersonation_analysis || "—"}</div>
            </div>
          )}
        </Card>
      </div>

      {/* ── FINGERPRINT MATCH ── */}
      <Card style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr auto", gap: 28, alignItems: "center" }}>
        <div>
          <CardTitle><FiCpu size={14} color="#aaa" /> Malware fingerprint match</CardTitle>
          <div style={{ fontSize: 18, fontWeight: 500, color: "#fff", marginBottom: 6 }}>
            {fingerprintMatch?.matched_family || "No fingerprint match"}
          </div>
          <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: 14 }}>
            {fingerprintMatch?.description || "No known malware family signature matched this APK."}
          </div>
          {matchedPermissions.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {matchedPermissions.map((p, i) => (
                <span key={i} style={{
                  fontSize: 11, fontFamily: "monospace", padding: "2px 9px", borderRadius: 4,
                  background: "rgba(245,197,24,0.07)", border: "0.5px solid rgba(245,197,24,0.25)", color: "#f5c518",
                }}>{p}</span>
              ))}
            </div>
          )}
        </div>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#1a1a1a" strokeWidth="8" />
            <circle cx="50" cy="50" r="40" fill="none"
              stroke={confidence > 60 ? "#ff3b3b" : confidence > 30 ? "#ff8c00" : "#22c55e"}
              strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={dashOffset}
              strokeLinecap="round" transform="rotate(-90 50 50)" />
            <text x="50" y="55" textAnchor="middle" fontSize="20"
              fill={confidence > 60 ? "#ff3b3b" : confidence > 30 ? "#ff8c00" : "#22c55e"}
              fontWeight="500">46%</text>
          </svg>
          <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>Family similarity</div>
        </div>
      </Card>

      {/* ── EXECUTIVE SUMMARY + ACTIONS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
        <Card>
          <CardTitle><FiFileText size={14} color="#aaa" /> Executive summary</CardTitle>
          <div style={{ fontSize: 13, color: "#666", lineHeight: 1.7, marginBottom: 16 }}>
            {report?.executive_summary || "—"}
          </div>
          <Divider />
          <div style={{ fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: "0.07em", margin: "12px 0 6px" }}>Verdict</div>
          <div style={{
            fontSize: 13, color: riskStyle.color, lineHeight: 1.6,
            padding: "10px 12px", borderRadius: 6,
            background: riskStyle.bg, border: `0.5px solid ${riskStyle.border}`,
          }}>
            {riskAssessment?.verdict || "—"}
          </div>
        </Card>

        <Card>
          <CardTitle><FiChevronRight size={14} color="#aaa" /> Recommended actions</CardTitle>
          {recommendedActions.length === 0
            ? <div style={{ fontSize: 13, color: "#444" }}>No actions specified.</div>
            : recommendedActions.map((a, i) => (
              <div key={i} style={{
                display: "flex", gap: 10, alignItems: "flex-start",
                padding: "8px 0", borderBottom: i < recommendedActions.length - 1 ? "0.5px solid #111" : "none",
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                  background: "#111", border: "0.5px solid #2a2a2a",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, color: "#555", marginTop: 1,
                }}>{i + 1}</div>
                <div style={{ fontSize: 13, color: "#777", lineHeight: 1.6 }}>{a}</div>
              </div>
            ))
          }

          {riskAssessment?.customer_advisory && (
            <div style={{
              marginTop: 16, padding: "12px 14px", borderRadius: 6,
              background: "rgba(34,197,94,0.06)", border: "0.5px solid rgba(34,197,94,0.2)",
              fontSize: 13, color: "#22c55e", lineHeight: 1.6,
              display: "flex", gap: 8, alignItems: "flex-start",
            }}>
              <FiInfo size={14} style={{ flexShrink: 0, marginTop: 2 }} />
              {riskAssessment.customer_advisory}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}