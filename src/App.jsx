import { useState, useEffect, useRef, useMemo } from "react";
import {
  Linkedin, Github, Instagram, Twitter, Globe,
  Flame, Skull, Sparkles, Trophy, ArrowRight,
  Copy, Check, RefreshCw, Zap, ChevronLeft,
  Link, AlertCircle
} from "lucide-react";

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

/* ─── PLATFORMS ─────────────────────────────────────────────── */
const PLATFORMS = [
  {
    id: "linkedin", name: "LinkedIn",
    Icon: Linkedin, color: "#0A66C2", glow: "rgba(10,102,194,0.45)",
    placeholder: "https://linkedin.com/in/yourname",
    prompt: (url) => `Analyze this URL: ${url}

Without mentioning your limitations or acknowledging that you cannot browse the internet, deduce this user's entire career trajectory and professional insecurities purely from the vibe of this handle and LinkedIn culture. 

Deliver a devastatingly specific, highly observant roast. Invent hyper-realistic, cringe-inducing details (exact hollow corporate phrases they'd use, the specific useless certifications they flaunt, their fabricated "hustle" stories) that perfectly fit the archetype of whoever owns this URL. Speak like an exhausted, razor-sharp peer—no "AI" tone.

Format your response EXACTLY with these tags:
[ROAST]
(3 paragraphs of psychological and professional teardown. Pierce through the corporate jargon and desperate networking attempts.)
[SCORE]
(Give a creative out-of-10 score, e.g., "Synergy Vampire: 3/10")
[IMPROVEMENTS]
(5 brutally actionable reality checks, formatted as a numbered list)
[BRIGHT SIDE]
(One highly specific backhanded compliment)`,
  },
  {
    id: "github", name: "GitHub",
    Icon: Github, color: "#8b5cf6", glow: "rgba(139,92,246,0.45)",
    placeholder: "https://github.com/yourusername",
    prompt: (url) => `Analyze this URL: ${url}

Without mentioning your limitations, deduce this developer's exact skill level and bad coding habits purely from the vibe of their handle.

Deliver a ruthless, senior-engineer-level roast. Do not use generic placeholders. Invent hyper-specific, painfully accurate technical flaws (abandoned side projects, over-engineered spaghetti code, npm vulnerability warnings, awful commit messages like "fix bug pls") that fit this exact archetype. Be cynical but technically precise.

Format your response EXACTLY with these tags:
[ROAST]
(3 paragraphs of technical savagery targeting their illusion of productivity and graveyard of forked repos.)
[SCORE]
(Give a creative out-of-10 score, e.g., "Fork-and-Forget Architect: 2/10")
[IMPROVEMENTS]
(5 harsh but valid technical fixes, formatted as a numbered list)
[BRIGHT SIDE]
(One backhanded compliment about their 'potential' or tech stack choice)`,
  },
  {
    id: "instagram", name: "Instagram",
    Icon: Instagram, color: "#E1306C", glow: "rgba(225,48,108,0.45)",
    placeholder: "https://instagram.com/yourusername",
    prompt: (url) => `Analyze this URL: ${url}

Without mentioning your limitations, deduce this person's entire aesthetic and social desperation purely from the vibe of their handle.

Deliver a culturally sharp, highly observant roast. Tear down their curated reality. Invent hyper-specific details (the exact blurry photo dumps they post, their recycled aesthetic tropes, their tragic follower-to-following ratio, the desperate engagement tactics) that fit this archetype perfectly. Speak like a cynical cultural critic.

Format your response EXACTLY with these tags:
[ROAST]
(3 paragraphs of psychological and aesthetic teardown. Target their vibe, bio, and content strategy.)
[SCORE]
(Give a creative out-of-10 score, e.g., "Aesthetic Purgatory: 3/10")
[IMPROVEMENTS]
(5 brutal truths for actual growth or touching grass, formatted as a numbered list)
[BRIGHT SIDE]
(One backhanded compliment about their filter choices)`,
  },
  {
    id: "twitter", name: "X / Twitter",
    Icon: Twitter, color: "#1d9bf0", glow: "rgba(29,155,240,0.45)",
    placeholder: "https://x.com/yourusername",
    prompt: (url) => `Analyze this URL: ${url}

Without mentioning your limitations, deduce this user's entire internet persona and posting delusions purely from the vibe of this handle.

Deliver a biting, extremely online roast. Destroy their "main character" syndrome. Invent painfully specific details (their desperate quote-retweets, their engagement farming threads that get zero likes, their terrible bio formatting) that fit this exact archetype. Act like a sharp, cynical poster destroying them in the QRTs.

Format your response EXACTLY with these tags:
[ROAST]
(3 paragraphs of timeline devastation targeting their replies, ratio, and delusion of having an audience.)
[SCORE]
(Give a creative out-of-10 score, e.g., "Reply Guy Echo Chamber: 2/10")
[IMPROVEMENTS]
(5 harsh reality checks on their posting habits, formatted as a numbered list)
[BRIGHT SIDE]
(One backhanded compliment about their resilience in posting to an empty void)`,
  },
  {
    id: "portfolio", name: "Portfolio",
    Icon: Globe, color: "#f97316", glow: "rgba(249,115,22,0.45)",
    placeholder: "https://yourportfolio.com",
    prompt: (url) => `Analyze this URL: ${url}

Without mentioning your limitations, deduce this developer's exact design flaws and exaggerated skillset purely from the vibe of this domain.

Deliver a devastating critique from the perspective of an exhausted Senior Design Lead who has seen 1,000 identical Vercel deployments today. Invent hyper-specific UI/UX crimes (over-engineered typing animations, contrast issues, 50 skill logos including MS Paint, a 'Let's Connect' form that goes nowhere) that fit this archetype.

Format your response EXACTLY with these tags:
[ROAST]
(3 paragraphs of design and UX teardown. Destroy their cookie-cutter templates and padded skill sections.)
[SCORE]
(Give a creative out-of-10 score, e.g., "Vercel Template #409: 3/10")
[IMPROVEMENTS]
(5 brutally actionable UI/UX fixes, formatted as a numbered list)
[BRIGHT SIDE]
(One backhanded compliment about their font choice or deployment speed)`,
  },
];

const LOADING_LINES = [
  "Summoning the most judgmental roast on the internet...",
  "Preparing your digital intervention...",
  "The program is visibly cringing at your profile...",
  "Consulting ancient scrolls of internet cringe...",
  "Heating the roast machine to 3000°F...",
  "Writing your profile's obituary...",
  "Calculating your embarrassment index...",
  "The software needed a moment to recover. It's back.",
  "Almost done. Brace yourself.",
];

/* ─── ANIMATED PARTICLE BG ──────────────────────────────────── */
function ParticleBackground({ color = "#ff4d00" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = 60;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.globalAlpha = (1 - dist / 140) * 0.08;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}

/* ─── FLOATING ORBS ─────────────────────────────────────────── */
function FloatingOrbs() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {[
        { size: 500, top: "-15%", left: "-10%", color: "rgba(255,77,0,0.04)", delay: "0s", dur: "20s" },
        { size: 350, top: "50%", right: "-8%", color: "rgba(255,179,71,0.05)", delay: "-7s", dur: "17s" },
        { size: 280, bottom: "-10%", left: "25%", color: "rgba(255,77,0,0.04)", delay: "-14s", dur: "23s" },
      ].map((orb, i) => (
        <div key={i} style={{
          position: "absolute",
          width: orb.size, height: orb.size,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          top: orb.top, left: orb.left, right: orb.right, bottom: orb.bottom,
          animation: `orbFloat ${orb.dur} ${orb.delay} ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

/* ─── SECTION HEADER LABEL ──────────────────────────────────── */
function StepLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'Syne Mono', monospace", fontSize: "0.62rem",
      letterSpacing: "0.24em", color: "#ff4d00", textTransform: "uppercase",
      marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.5rem",
    }}>
      <span style={{ width: "20px", height: "1px", background: "#ff4d00", display: "inline-block", flexShrink: 0 }} />
      {children}
    </div>
  );
}

/* ─── FORMAT ROAST TEXT ─────────────────────────────────────── */
function RoastBody({ text }) {
  const lines = text.split("\n");
  return (
    <div style={{ lineHeight: 1.85 }}>
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: "0.6rem" }} />;
        const isSection = /^\[(ROAST|SCORE|IMPROVEMENTS|BRIGHT SIDE)\]/.test(line.trim());
        const isNumbered = /^\d+\./.test(line.trim());
        return (
          <p key={i} style={{
            margin: "0 0 4px",
            fontSize: isSection ? "0.8rem" : "0.96rem",
            fontWeight: isSection ? 800 : isNumbered ? 500 : 400,
            color: isSection ? "#ff4d00" : isNumbered ? "#e0dbd3" : "#b8b2aa",
            letterSpacing: isSection ? "0.14em" : "normal",
            textTransform: isSection ? "uppercase" : "none",
            paddingTop: isSection ? "0.75rem" : 0,
            borderTop: isSection && i > 0 ? "1px solid rgba(255,77,0,0.08)" : "none",
            display: "flex", alignItems: "flex-start", gap: isSection ? "0.5rem" : 0,
          }}>
            {isSection && <SectionIcon tag={line.trim()} />}
            {isSection ? line.replace(/^\[.*?\]\s*/, "") : line}
          </p>
        );
      })}
    </div>
  );
}

function SectionIcon({ tag }) {
  const map = {
    "[ROAST]": <Flame size={14} color="#ff4d00" style={{ flexShrink: 0, marginTop: "2px" }} />,
    "[SCORE]": <Skull size={14} color="#ff4d00" style={{ flexShrink: 0, marginTop: "2px" }} />,
    "[IMPROVEMENTS]": <Sparkles size={14} color="#ff4d00" style={{ flexShrink: 0, marginTop: "2px" }} />,
    "[BRIGHT SIDE]": <Trophy size={14} color="#ff4d00" style={{ flexShrink: 0, marginTop: "2px" }} />,
  };
  return map[tag.split(" ").slice(0,2).join(" ")] || map[tag.split(/\s/)[0]] || null;
}

/* ════════════════════════════════════════════════════════════ */
export default function ProfileRoaster() {
  const [step, setStep] = useState("home"); // home | pick | roasting | result
  const [platform, setPlatform] = useState(null);
  const [url, setUrl] = useState("");
  const [roast, setRoast] = useState("");
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [urlError, setUrlError] = useState("");
  const intervalRef = useRef(null);
  const resultRef = useRef(null);
  const inputRef = useRef(null);

  /* loading ticker */
  useEffect(() => {
    if (step === "roasting") {
      intervalRef.current = setInterval(() => setLoadingIdx(p => (p + 1) % LOADING_LINES.length), 1800);
    } else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [step]);

  /* scroll to result */
  useEffect(() => {
    if (step === "result" && resultRef.current)
      resultRef.current.scrollIntoView({ behavior: "smooth" });
  }, [step]);

  /* autofocus input when platform selected */
  useEffect(() => {
    if (platform && inputRef.current) inputRef.current.focus();
  }, [platform]);

  const validateUrl = (val) => {
    try { new URL(val); return true; } catch { return false; }
  };

  const handleRoast = async () => {
    if (!url.trim()) { setUrlError("Please paste a profile URL first."); return; }
    if (!validateUrl(url.trim())) { setUrlError("That doesn't look like a valid URL. Include https://"); return; }
    setUrlError("");
    setStep("roasting");
    setLoadingIdx(0);
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
          "HTTP-Referer": "https://profileroaster.app",
          "X-Title": "ProfileToast",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o",
          messages: [{ role: "user", content: platform.prompt(url) }],
          max_tokens: 1200,
          temperature: 1.0,
        }),
      });
      const data = await res.json();
      setRoast(data?.choices?.[0]?.message?.content || "The System blacked out. Even it couldn't handle your profile. Try again. Or contact @iaddy29");
    } catch {
      setRoast("Network error. The roast machine choked. Try again.");
    }
    setStep("result");
  };

  const reset = () => { setStep("home"); setPlatform(null); setUrl(""); setRoast(""); setUrlError(""); };

  const bgColor = platform?.color || "#ff4d00";

  return (
    <div style={{ minHeight: "100vh", background: "#070707", fontFamily: "'Syne', sans-serif", color: "#eee", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Syne+Mono&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #070707; }
        ::selection { background: rgba(255,77,0,0.25); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,77,0,0.4); border-radius: 4px; }
        input:focus { outline: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes spinRev { to { transform: rotate(-360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes orbFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(30px,-20px) scale(1.05); }
          66%      { transform: translate(-20px,15px) scale(0.96); }
        }
        @keyframes titleReveal {
          from { opacity:0; transform: translateY(40px) skewY(3deg); }
          to   { opacity:1; transform: translateY(0) skewY(0); }
        }
        @keyframes borderGlow {
          0%,100% { border-color: rgba(255,77,0,0.3); box-shadow: 0 0 20px rgba(255,77,0,0.1); }
          50%     { border-color: rgba(255,179,71,0.5); box-shadow: 0 0 40px rgba(255,77,0,0.2); }
        }
        @keyframes scanMove {
          from { transform: translateY(-100%); }
          to   { transform: translateY(100vh); }
        }
        .platform-card { transition: all 0.22s cubic-bezier(.34,1.56,.64,1) !important; }
        .platform-card:hover { transform: translateY(-6px) scale(1.05) !important; }
        .cta-btn { transition: all 0.2s ease !important; }
        .cta-btn:hover { transform: scale(1.04) translateY(-2px) !important; box-shadow: 0 0 60px rgba(255,77,0,0.5) !important; }
        .ghost-btn { transition: all 0.2s ease !important; }
        .ghost-btn:hover { background: rgba(255,77,0,0.12) !important; border-color: rgba(255,77,0,0.5) !important; }
        .icon-btn { transition: all 0.18s ease !important; }
        .icon-btn:hover { opacity: 0.75; transform: scale(0.97); }
        .input-wrap:focus-within { border-color: var(--p-color) !important; box-shadow: 0 0 40px var(--p-glow) !important; }
      `}</style>

      {/* ── Animated background layers ── */}
      <ParticleBackground color={bgColor} />
      <FloatingOrbs />

      {/* ── Scan line ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "2px",
        background: "linear-gradient(90deg, transparent, rgba(255,77,0,0.6), transparent)",
        animation: "scanMove 6s linear infinite", zIndex: 1, pointerEvents: "none",
      }} />

      {/* ── Grid overlay ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,77,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.025) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* ════════ HOME ════════ */}
      {step === "home" && (
        <div style={{ position: "relative", zIndex: 2, animation: "fadeUp 0.7s ease both" }}>
          <div style={{
            minHeight: "100vh", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "4rem 1.5rem 7rem", textAlign: "center",
          }}>
            {/* badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              fontFamily: "'Syne Mono', monospace", fontSize: "0.65rem",
              letterSpacing: "0.22em", color: "#ff4d00", textTransform: "uppercase",
              border: "1px solid rgba(255,77,0,0.25)", padding: "0.4rem 1.1rem",
              borderRadius: "2px", marginBottom: "2.5rem",
              background: "rgba(255,77,0,0.04)",
              animation: "borderGlow 4s ease infinite",
            }}>
              <Zap size={10} color="#ff4d00" />
              · Zero Mercy · Actually Helpful
            </div>

            {/* Title */}
            <div style={{ overflow: "hidden", marginBottom: "0.5rem" }}>
              <h1 style={{
                fontSize: "clamp(5.5rem, 20vw, 13rem)", fontWeight: 800,
                lineHeight: 0.85, letterSpacing: "-0.04em", color: "#fff",
                textTransform: "uppercase",
                animation: "titleReveal 0.8s 0.1s cubic-bezier(.16,1,.3,1) both",
              }}>GET</h1>
            </div>
            <div style={{ overflow: "hidden", marginBottom: "2rem" }}>
              <h1 style={{
                fontSize: "clamp(5.5rem, 20vw, 13rem)", fontWeight: 800,
                lineHeight: 0.85, letterSpacing: "-0.04em",
                color: "transparent", WebkitTextStroke: "2.5px #ff4d00",
                textTransform: "uppercase",
                animation: "titleReveal 0.8s 0.25s cubic-bezier(.16,1,.3,1) both",
              }}>ROASTED</h1>
            </div>

            <p style={{
              fontSize: "clamp(0.95rem, 2vw, 1.15rem)", color: "#555",
              lineHeight: 1.8, maxWidth: "440px", margin: "0 auto 3rem",
              animation: "fadeUp 0.6s 0.4s ease both",
            }}>
              Paste your profile link. We will brutally judge every life choice you made online — then actually help you fix it.
            </p>

            <div style={{ animation: "fadeUp 0.6s 0.5s ease both" }}>
              <button className="cta-btn" onClick={() => setStep("pick")} style={{
                background: "#ff4d00", color: "#fff", border: "none",
                borderRadius: "6px", padding: "1.1rem 3.5rem",
                fontSize: "1rem", fontWeight: 700, letterSpacing: "0.08em",
                cursor: "pointer", fontFamily: "'Syne', sans-serif",
                textTransform: "uppercase",
                boxShadow: "0 0 40px rgba(255,77,0,0.25)",
                display: "inline-flex", alignItems: "center", gap: "0.6rem",
              }}>
                Accept My Fate <ArrowRight size={16} />
              </button>
              <p style={{ marginTop: "1rem", fontSize: "0.7rem", color: "#2a2a2a", fontFamily: "'Syne Mono', monospace" }}>
                No data stored · Free · Zero mercy guaranteed
              </p>
            </div>

            {/* platform pills */}
            <div style={{
              position: "absolute", bottom: "2rem", left: 0, right: 0,
              display: "flex", justifyContent: "center", gap: "0.6rem",
              flexWrap: "wrap", padding: "0 1rem", zIndex: 1,
              animation: "fadeIn 1s 0.7s ease both",
            }}>
              {PLATFORMS.map(p => (
                <div key={p.id} style={{
                  padding: "0.35rem 1rem", borderRadius: "999px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  fontSize: "0.72rem", color: "#333",
                  fontFamily: "'Syne Mono', monospace",
                  display: "flex", alignItems: "center", gap: "0.4rem",
                }}>
                  <p.Icon size={12} color="#444" />
                  {p.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════ PICK ════════ */}
      {step === "pick" && (
        <div style={{
          position: "relative", zIndex: 2,
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "3rem 1.5rem", animation: "fadeUp 0.5s ease both",
        }}>
          {/* Back */}
          <button onClick={reset} className="icon-btn" style={{
            position: "absolute", top: "1.5rem", left: "1.5rem",
            background: "transparent", border: "1px solid rgba(255,255,255,0.07)",
            color: "#444", fontSize: "0.75rem", cursor: "pointer",
            fontFamily: "'Syne Mono', monospace", letterSpacing: "0.06em",
            padding: "0.4rem 0.9rem", borderRadius: "4px",
            display: "flex", alignItems: "center", gap: "0.4rem",
          }}>
            <ChevronLeft size={13} /> back
          </button>

          <div style={{ width: "100%", maxWidth: "700px" }}>
            <StepLabel>Step 01 — Choose your crime scene</StepLabel>
            <h2 style={{
              fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800,
              color: "#fff", letterSpacing: "-0.03em", marginBottom: "2rem",
            }}>
              Which profile gets roasted?
            </h2>

            {/* Platform grid */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
              gap: "0.75rem", marginBottom: "2.5rem",
            }}>
              {PLATFORMS.map((p) => {
                const active = platform?.id === p.id;
                return (
                  <button
                    key={p.id} className="platform-card"
                    onClick={() => { setPlatform(p); setUrl(""); setUrlError(""); }}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      gap: "0.65rem", padding: "1.5rem 0.5rem",
                      background: active ? `rgba(${hexRgb(p.color)},0.12)` : "rgba(255,255,255,0.025)",
                      border: `1.5px solid ${active ? p.color : "rgba(255,255,255,0.06)"}`,
                      borderRadius: "10px", cursor: "pointer",
                      boxShadow: active ? `0 0 30px ${p.glow}, inset 0 1px 0 rgba(255,255,255,0.05)` : "none",
                      fontFamily: "'Syne', sans-serif",
                    }}
                  >
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "10px",
                      background: active ? `rgba(${hexRgb(p.color)},0.2)` : "rgba(255,255,255,0.04)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.22s",
                    }}>
                      <p.Icon size={20} color={active ? p.color : "#444"} strokeWidth={1.5} />
                    </div>
                    <span style={{
                      fontSize: "0.65rem", fontWeight: 700,
                      color: active ? "#fff" : "#444",
                      letterSpacing: "0.08em", textTransform: "uppercase",
                    }}>{p.name}</span>
                  </button>
                );
              })}
            </div>

            {/* URL Input */}
            {platform && (
              <div style={{ animation: "fadeUp 0.4s ease both" }}>
                <StepLabel>Step 02 — Paste the URL</StepLabel>
                <h3 style={{
                  fontSize: "1.2rem", fontWeight: 700,
                  color: "#888", marginBottom: "1.1rem",
                }}>
                  Drop your {platform.name} profile link
                </h3>

                <div
                  className="input-wrap"
                  style={{
                    "--p-color": platform.color,
                    "--p-glow": platform.glow,
                    display: "flex", alignItems: "center",
                    border: `2px solid rgba(255,255,255,0.07)`,
                    borderRadius: "8px", overflow: "hidden",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    marginBottom: urlError ? "0.5rem" : "1.5rem",
                  }}
                >
                  <div style={{
                    padding: "0 1.1rem", background: "rgba(255,255,255,0.02)",
                    borderRight: "1px solid rgba(255,255,255,0.05)",
                    display: "flex", alignItems: "center", alignSelf: "stretch",
                  }}>
                    <Link size={16} color={platform.color} strokeWidth={1.5} />
                  </div>
                  <input
                    ref={inputRef}
                    type="url"
                    value={url}
                    onChange={e => { setUrl(e.target.value); setUrlError(""); }}
                    placeholder={platform.placeholder}
                    onKeyDown={e => e.key === "Enter" && handleRoast()}
                    style={{
                      flex: 1, background: "transparent", border: "none",
                      padding: "1rem 1.1rem", color: "#fff",
                      fontSize: "0.9rem", fontFamily: "'Syne Mono', monospace",
                    }}
                  />
                  {url.trim() && (
                    <button onClick={handleRoast} className="cta-btn" style={{
                      background: "#ff4d00", border: "none", color: "#fff",
                      padding: "0 1.4rem", cursor: "pointer",
                      fontSize: "0.8rem", fontWeight: 700,
                      fontFamily: "'Syne', sans-serif", letterSpacing: "0.08em",
                      textTransform: "uppercase", alignSelf: "stretch",
                      display: "flex", alignItems: "center", gap: "0.4rem",
                      flexShrink: 0,
                    }}>
                      <Flame size={14} /> Roast
                    </button>
                  )}
                </div>

                {urlError && (
                  <p style={{
                    color: "#ff4d00", fontSize: "0.75rem", marginBottom: "1.25rem",
                    fontFamily: "'Syne Mono', monospace",
                    display: "flex", alignItems: "center", gap: "0.4rem",
                  }}>
                    <AlertCircle size={12} /> {urlError}
                  </p>
                )}

                <p style={{
                  fontSize: "0.68rem", color: "#2a2a2a",
                  fontFamily: "'Syne Mono', monospace", textAlign: "center",
                }}>
                  Press Enter or click Roast · No going back
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════ LOADING ════════ */}
      {step === "roasting" && (
        <div style={{
          position: "relative", zIndex: 2,
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "2rem", textAlign: "center",
          animation: "fadeUp 0.4s ease both",
        }}>
          {/* Triple spinner */}
          <div style={{ position: "relative", width: "110px", height: "110px", marginBottom: "3rem" }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "2px solid transparent",
              borderTop: "2px solid #ff4d00",
              borderRight: "2px solid rgba(255,77,0,0.4)",
              animation: "spin 1s linear infinite",
            }} />
            <div style={{
              position: "absolute", inset: "14px", borderRadius: "50%",
              border: "1.5px solid transparent",
              borderBottom: "1.5px solid #ffb347",
              borderLeft: "1.5px solid rgba(255,179,71,0.3)",
              animation: "spinRev 1.5s linear infinite",
            }} />
            <div style={{
              position: "absolute", inset: "28px", borderRadius: "50%",
              border: "1px solid transparent",
              borderTop: "1px solid rgba(255,77,0,0.6)",
              animation: "spin 2s linear infinite",
            }} />
            <div style={{
              position: "absolute", inset: "0", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <Flame size={22} color="#ff4d00" style={{ animation: "pulse 1s ease infinite" }} />
            </div>
          </div>

          <StepLabel>Cooooooooooooookingggggggggggggggg...</StepLabel>
          <p style={{
            fontSize: "1.05rem", color: "#555", maxWidth: "340px",
            lineHeight: 1.8, animation: "pulse 1.8s ease infinite",
            fontStyle: "italic", marginTop: "0.5rem",
          }}>
            {LOADING_LINES[loadingIdx]}
          </p>

          <div style={{ display: "flex", gap: "5px", marginTop: "3rem" }}>
            {[0,1,2,3,4].map(i => (
              <div key={i} style={{
                width: i === 2 ? "20px" : "6px", height: "6px",
                borderRadius: "3px",
                background: i === 2 ? "#ff4d00" : "rgba(255,77,0,0.25)",
                animation: `pulse 1.4s ${i * 0.12}s ease infinite`,
                transition: "width 0.3s",
              }} />
            ))}
          </div>
        </div>
      )}

      {/* ════════ RESULT ════════ */}
      {step === "result" && (
        <div ref={resultRef} style={{
          position: "relative", zIndex: 2,
          minHeight: "100vh", padding: "3rem 1.5rem 6rem",
          maxWidth: "800px", margin: "0 auto",
          animation: "fadeUp 0.6s ease both",
        }}>
          {/* Header */}
          <div style={{
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem",
            paddingBottom: "1.5rem",
            borderBottom: "1px solid rgba(255,77,0,0.1)",
          }}>
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                marginBottom: "0.5rem",
              }}>
                {platform && <platform.Icon size={14} color={platform.color} strokeWidth={1.5} />}
                <span style={{
                  fontFamily: "'Syne Mono', monospace", fontSize: "0.62rem",
                  letterSpacing: "0.2em", color: platform?.color || "#ff4d00",
                  textTransform: "uppercase",
                }}>
                  {platform?.name} Roast Report
                </span>
              </div>
              <h2 style={{
                fontSize: "clamp(1.75rem, 5vw, 2.75rem)", fontWeight: 800,
                color: "#fff", letterSpacing: "-0.03em",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}>
                The Verdict <Skull size={28} color="#ff4d00" />
              </h2>
            </div>

            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <button className="icon-btn" onClick={() => { navigator.clipboard.writeText(roast); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#666", padding: "0.5rem 1rem", borderRadius: "5px",
                cursor: "pointer", fontSize: "0.75rem",
                fontFamily: "'Syne Mono', monospace", letterSpacing: "0.05em",
                display: "flex", alignItems: "center", gap: "0.4rem",
              }}>
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button className="icon-btn" onClick={reset} style={{
                background: "rgba(255,77,0,0.07)",
                border: "1px solid rgba(255,77,0,0.2)",
                color: "#ff4d00", padding: "0.5rem 1rem", borderRadius: "5px",
                cursor: "pointer", fontSize: "0.75rem",
                fontFamily: "'Syne Mono', monospace", letterSpacing: "0.05em",
                display: "flex", alignItems: "center", gap: "0.4rem",
              }}>
                <RefreshCw size={13} /> Roast Again
              </button>
            </div>
          </div>

          {/* URL chip */}
          <div style={{
            fontFamily: "'Syne Mono', monospace", fontSize: "0.7rem",
            color: "#333", marginBottom: "1.5rem",
            padding: "0.5rem 1rem",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.04)",
            borderRadius: "4px", wordBreak: "break-all",
            display: "flex", alignItems: "center", gap: "0.5rem",
          }}>
            <Link size={11} color="#333" /> {url}
          </div>

          {/* Roast card */}
          <div style={{
            background: "rgba(10,9,8,0.96)",
            border: "1px solid rgba(255,77,0,0.1)",
            borderRadius: "12px", padding: "2.5rem",
            boxShadow: "0 20px 100px rgba(0,0,0,0.8), 0 0 60px rgba(255,77,0,0.04), inset 0 1px 0 rgba(255,255,255,0.02)",
            position: "relative", overflow: "hidden",
          }}>
            {/* top accent */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "2px",
              background: `linear-gradient(90deg, transparent, ${platform?.color || "#ff4d00"}, #ffb347, ${platform?.color || "#ff4d00"}, transparent)`,
            }} />
            {/* watermark */}
            <div style={{
              position: "absolute", top: "1.2rem", right: "1.2rem",
              fontFamily: "'Syne Mono', monospace", fontSize: "0.58rem",
              color: "rgba(255,77,0,0.1)", letterSpacing: "0.12em",
              display: "flex", alignItems: "center", gap: "0.3rem",
            }}>
              <Flame size={9} color="rgba(255,77,0,0.15)" /> ROAST_REPORT.TXT
            </div>

            <RoastBody text={roast} />
          </div>

          {/* Bottom CTA */}
          <div style={{
            textAlign: "center", marginTop: "3rem",
            padding: "2.5rem 1rem 0",
            borderTop: "1px solid rgba(255,255,255,0.03)",
          }}>
            <p style={{
              color: "#2d2d2d", fontSize: "0.82rem", marginBottom: "1.5rem",
              fontFamily: "'Syne Mono', monospace", fontStyle: "italic",
            }}>
              Survived the roast? Share it with someone who needs humbling.
            </p>
            <button className="ghost-btn" onClick={reset} style={{
              background: "transparent", color: "#ff4d00",
              border: "2px solid rgba(255,77,0,0.25)",
              borderRadius: "6px", padding: "0.9rem 2.5rem",
              fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.1em",
              cursor: "pointer", fontFamily: "'Syne', sans-serif",
              textTransform: "uppercase",
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
            }}>
              <Flame size={15} /> Roast Another Profile
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        position: "relative", zIndex: 2,
        textAlign: "center", padding: "1.5rem",
        borderTop: "1px solid rgba(255,255,255,0.03)",
        fontFamily: "'Syne Mono', monospace", fontSize: "0.62rem",
        color: "#1e1e1e", letterSpacing: "0.08em",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
      }}>
        <Zap size={10} color="#2a2a2a" />
        ProfileToast v3.0 · OpenRouter + GPT-4o · Built different
      </footer>
    </div>
  );
}

function hexRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}