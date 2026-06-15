import { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiCpu,
  FiBarChart2,
  FiFileText,
  FiCheck,
  FiPackage,
  FiList,
  FiShield,
} from "react-icons/fi";

const STEPS = [
  { id: "extract",   label: "Extraction",      sub: "Unpacking APK & parsing manifest",       icon: FiPackage,      agent: false },
  { id: "heuristic", label: "Apk Engine", sub: "Scoring 15+ dangerous permissions",      icon: FiList,         agent: false },
  { id: "triage",    label: "Triage",           sub: "Threat classification & initial scoring", icon: FiAlertTriangle, agent: true,  num: 1 },
  { id: "code",      label: "Code analysis",    sub: "Behavioral mapping & IOC extraction",     icon: FiCpu,          agent: true,  num: 2 },
  { id: "risk",      label: "Risk synthesis",   sub: "Consolidating evidence & final score",    icon: FiBarChart2,    agent: true,  num: 3 },
  { id: "report",    label: "Report writer",    sub: "Generating bank-grade PDF report",        icon: FiFileText,     agent: true,  num: 4 },
];

function SpinnerRing({ size = 20, color = "#fff", thickness = 2 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      border: `${thickness}px solid ${color}22`,
      borderTopColor: color,
      animation: "tl-spin 0.8s linear infinite", flexShrink: 0,
    }} />
  );
}

export default function LoadingPage({ filename, currentStep = 0 }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const pct = Math.min(97, Math.round((currentStep / (STEPS.length - 1)) * 97));

  const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div style={{
      background: "#000", minHeight: "100vh", color: "#fff",
      fontFamily: "system-ui, sans-serif", padding: "60px 40px 80px",
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <style>{`
        @keyframes tl-spin { to { transform: rotate(360deg); } }
        @keyframes tl-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes tl-fadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes tl-progress { from{width:0%} to{width:var(--pct)} }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ textAlign: "center", marginBottom: 56, animation: "tl-fadein 0.4s ease" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "#0d0d0d", border: "0.5px solid #2a2a2a",
          borderRadius: 20, padding: "5px 16px", marginBottom: 24,
          fontSize: 12, color: "#555",
        }}>
          <FiShield size={12} color="#444" />
          ThreatLens — APK analysis in progress
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
          <SpinnerRing size={18} color="#888" thickness={2} />
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "#fff", margin: 0 }}>
            Analyzing APK
          </h1>
        </div>

        <div style={{
          fontFamily: "monospace", fontSize: 12, color: "#444",
          marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <FiPackage size={11} color="#333" />
          {filename}
        </div>

        <div style={{ fontSize: 13, color: "#555" }}>
          {STEPS[currentStep]?.sub ?? STEPS[STEPS.length - 1].sub}
        </div>
      </div>

      {/* ── PIPELINE FLOW ── */}
      <div style={{ width: "100%", maxWidth: 860, position: "relative" }}>

        {/* Flow connector line (behind cards) */}
        <div style={{
          position: "absolute", top: 36, left: "calc(8.33% + 20px)",
          right: "calc(8.33% + 20px)", height: "0.5px", background: "#1a1a1a", zIndex: 0,
        }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, position: "relative", zIndex: 1 }}>
          {STEPS.map((step, i) => {
            const done   = i < currentStep;
            const active = i === currentStep;
            // const pending= i > currentStep;

            const borderColor = done ? "#22c55e" : active ? "#fff" : "#1e1e1e";
            const bgColor     = done ? "rgba(34,197,94,0.06)" : active ? "#0d0d0d" : "#080808";
            const iconColor   = done ? "#22c55e" : active ? "#fff" : "#333";
            const labelColor  = done ? "#22c55e" : active ? "#fff" : "#333";

            const Icon = step.icon;

            return (
              <div key={step.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>

                {/* Icon circle */}
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: bgColor, border: `1px solid ${borderColor}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", flexShrink: 0,
                  boxShadow: active ? "0 0 16px rgba(255,255,255,0.06)" : "none",
                  transition: "all 0.3s ease",
                }}>
                  {done
                    ? <FiCheck size={16} color="#22c55e" />
                    : active
                      ? <SpinnerRing size={20} color="#fff" thickness={1.5} />
                      : <Icon size={15} color={iconColor} />
                  }

                  {/* Agent badge */}
                  {step.agent && (
                    <div style={{
                      position: "absolute", top: -6, right: -6,
                      background: done ? "#22c55e" : active ? "#fff" : "#1a1a1a",
                      color: done || active ? "#000" : "#333",
                      fontSize: 9, fontWeight: 600, borderRadius: "50%",
                      width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center",
                      border: `1px solid ${done ? "#22c55e" : active ? "#fff" : "#2a2a2a"}`,
                    }}>
                      {step.num}
                    </div>
                  )}
                </div>

                {/* Label */}
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    fontSize: 11, fontWeight: 500, color: labelColor,
                    marginBottom: 2, whiteSpace: "nowrap",
                    transition: "color 0.3s ease",
                  }}>{step.label}</div>
                  {step.agent && (
                    <div style={{
                      fontSize: 9, color: done ? "#22c55e" : active ? "#555" : "#2a2a2a",
                      letterSpacing: "0.06em", textTransform: "uppercase",
                    }}>
                      {done ? "Complete" : active ? "Running" : `Agent ${step.num}`}
                    </div>
                  )}
                </div>

                {/* Arrow connector (not on last) */}
                {i < STEPS.length - 1 && (
                  <div style={{
                    position: "absolute",
                    top: 36 - 4,
                    left: `calc(${(i + 1) * (100 / 6)}% - 4px)`,
                    // inline arrow drawn via the grid gap — handled by line above
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ACTIVE STEP DETAIL CARD ── */}
      <div style={{ width: "100%", maxWidth: 860, marginTop: 36 }}>
        {(() => {
          const step = STEPS[currentStep];
          if (!step) return null;
          const Icon = step.icon;
          return (
            <div key={currentStep} style={{
              background: "#080808", border: "0.5px solid #1e1e1e",
              borderRadius: 12, padding: "20px 24px",
              display: "flex", alignItems: "center", gap: 16,
              animation: "tl-fadein 0.35s ease",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "#0d0d0d", border: "0.5px solid #2a2a2a",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Icon size={17} color="#aaa" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#ddd" }}>{step.label}</span>
                  {step.agent && (
                    <span style={{
                      fontSize: 10, color: "#555", background: "#111",
                      border: "0.5px solid #2a2a2a", borderRadius: 4, padding: "1px 7px",
                      letterSpacing: "0.06em", textTransform: "uppercase",
                    }}>Agent {step.num}</span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: "#555" }}>{step.sub}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <SpinnerRing size={14} color="#666" thickness={1.5} />
                <span style={{ fontSize: 12, color: "#444" }}>Processing…</span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ── PROGRESS BAR ── */}
      <div style={{ width: "100%", maxWidth: 860, marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: "#444" }}>{pct}% complete</span>
          <span style={{ fontSize: 11, color: "#333", fontFamily: "monospace" }}>{fmt(elapsed)}</span>
        </div>
        <div style={{ height: 3, background: "#111", borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: "linear-gradient(90deg, #333, #fff)",
            borderRadius: 4, transition: "width 0.6s ease",
          }} />
        </div>
      </div>

      {/* ── COMPLETED STEPS LOG ── */}
      {currentStep > 0 && (
        <div style={{ width: "100%", maxWidth: 860, marginTop: 28 }}>
          <div style={{
            background: "#060606", border: "0.5px solid #141414",
            borderRadius: 10, overflow: "hidden",
          }}>
            <div style={{
              padding: "10px 16px", borderBottom: "0.5px solid #141414",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "tl-pulse 1.5s ease-in-out infinite" }} />
              <span style={{ fontSize: 11, color: "#444", letterSpacing: "0.06em", textTransform: "uppercase" }}>Live log</span>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {STEPS.slice(0, currentStep).map((s, i) => (
                <div key={s.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  fontSize: 12, color: "#444",
                }}>
                  <FiCheck size={12} color="#22c55e" style={{ flexShrink: 0 }} />
                  <span style={{ color: "#333", fontFamily: "monospace", fontSize: 11 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ color: "#555" }}>{s.label}</span>
                  <span style={{ color: "#2a2a2a", flex: 1 }}>— {s.sub}</span>
                  <span style={{ color: "#22c55e22", fontSize: 10 }}>✓ done</span>
                </div>
              ))}
              {/* Current step blinking */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10, fontSize: 12,
                animation: "tl-fadein 0.3s ease",
              }}>
                <div style={{ width: 12, height: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <SpinnerRing size={12} color="#fff" thickness={1.5} />
                </div>
                <span style={{ color: "#555", fontFamily: "monospace", fontSize: 11 }}>
                  {String(currentStep + 1).padStart(2, "0")}
                </span>
                <span style={{ color: "#aaa" }}>{STEPS[currentStep]?.label}</span>
                <span style={{ color: "#444", flex: 1 }}>— {STEPS[currentStep]?.sub}</span>
                <span style={{ color: "#555", fontSize: 10, animation: "tl-pulse 1.5s ease-in-out infinite" }}>running</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM NOTE ── */}
      <div style={{ marginTop: 36, fontSize: 12, color: "#2a2a2a", textAlign: "center" }}>
        Files are encrypted in transit and deleted immediately after analysis
      </div>
    </div>
  );
}