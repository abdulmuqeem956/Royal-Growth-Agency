/**
 * FRAMESTUDIO — App.jsx
 * React component · Uses Tailwind-compatible inline styles
 * Run with: npx create-react-app framestudio && replace src/App.js
 * Dependencies: react, react-dom (already in CRA)
 */

import { useState, useEffect, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────
const NAV_LINKS = ["Work", "About", "Services", "Process", "Contact"];

const PORTFOLIO = [
  {
    title: "Restaurant Reel",
    tag: "Food & Lifestyle",
    desc: "Food ni just show cheyyam... feeling create chestham.",
    color: "#A855F7",
    icon: "🍽️",
    frames: ["🔴", "🟠", "🟡"],
  },
  {
    title: "Creator Content",
    tag: "Personal Brand",
    desc: "Talking videos ni boring ga kakunda engaging ga chestham.",
    color: "#3B82F6",
    icon: "🎥",
    frames: ["🔵", "🟣", "⚫"],
  },
  {
    title: "Brand Promotion",
    tag: "Business & Brands",
    desc: "Mee product ni audience ki connect ayye way lo present chestham.",
    color: "#8B5CF6",
    icon: "✨",
    frames: ["🟣", "🔵", "🟤"],
  },
];

const SERVICES = [
  { icon: "✂️", title: "Reel Editing",    desc: "Instagram kosam fast, clean and premium edits.", glow: "#A855F7" },
  { icon: "💡", title: "Content Ideas",   desc: "Em content cheyyalo ideas and direction.",        glow: "#3B82F6" },
  { icon: "📅", title: "Monthly Content", desc: "Consistent ga quality content support.",          glow: "#8B5CF6" },
];

const WHY_US = [
  { icon: "⚡", title: "Modern Editing", desc: "Current trends ki match ayye style."         },
  { icon: "🎬", title: "Storytelling",   desc: "Every second ki oka purpose untundi."        },
  { icon: "📲", title: "Social First",   desc: "Instagram audience kosam create chestham."   },
];

const STATS = [
  { num: "100+", label: "Videos Created"    },
  { num: "10M+", label: "Frames Edited"     },
  { num: "∞",    label: "Creative Every Day" },
];

// ─── CUSTOM HOOKS ─────────────────────────────────────────────

/** Returns [ref, isVisible] — fires once when element enters viewport */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/** Animates a number from 0 to target when visible = true */
function useCountUp(target, visible, duration = 1800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!visible) return;

    const isNumeric = !isNaN(parseInt(target));
    if (!isNumeric) { setValue(target); return; }

    const end  = parseInt(target);
    const step = Math.ceil(end / (duration / 16));
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= end) {
        setValue(target);          // preserve suffix like "+" or "M+"
        clearInterval(timer);
      } else {
        setValue(current + (target.includes("+") ? "+" : ""));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [visible, target, duration]);

  return value;
}

// ─── STYLE HELPERS ────────────────────────────────────────────
const S = {
  gradientText: {
    background: "linear-gradient(135deg, #A855F7, #3B82F6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: "0.2em",
    color: "#A855F7",
    fontWeight: 700,
    fontFamily: "Inter, sans-serif",
    marginBottom: 16,
  },
  sectionTitle: (vis) => ({
    fontFamily: "Space Grotesk, sans-serif",
    fontWeight: 800,
    fontSize: "clamp(2rem, 4vw, 3rem)",
    letterSpacing: "-0.03em",
    color: "#fff",
    marginBottom: 48,
    opacity: vis ? 1 : 0,
    transform: vis ? "translateY(0)" : "translateY(24px)",
    transition: "all 0.8s cubic-bezier(0.23,1,0.32,1)",
  }),
};

// ─── SHARED COMPONENTS ────────────────────────────────────────

/** Radial gradient blob for background ambience */
function GlowOrb({ x, y, color = "#A855F7", size = 400, opacity = 0.18 }) {
  const hex = Math.round(opacity * 255).toString(16).padStart(2, "0");
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}${hex} 0%, transparent 70%)`,
        pointerEvents: "none",
        filter: "blur(40px)",
        zIndex: 0,
      }}
    />
  );
}

/** Glass morphism card with coloured hover glow */
function GlassCard({ children, style = {}, glow = "#A855F7" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${hovered ? glow + "60" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 20,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: hovered
          ? `0 0 40px ${glow}30, 0 20px 60px rgba(0,0,0,0.5)`
          : "0 4px 24px rgba(0,0,0,0.3)",
        transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Gradient pill button — variant: 'fill' | 'outline' */
function Btn({ children, href = "#", variant = "fill" }) {
  const [hov, setHov] = useState(false);
  const fill = variant === "fill";
  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-block",
        padding: "14px 32px",
        borderRadius: 100,
        fontFamily: "Space Grotesk, sans-serif",
        fontWeight: 700,
        fontSize: 15,
        textDecoration: "none",
        cursor: "pointer",
        letterSpacing: "0.01em",
        transition: "all 0.3s cubic-bezier(0.23,1,0.32,1)",
        ...(fill
          ? {
              background: hov
                ? "linear-gradient(135deg,#C084FC,#60A5FA)"
                : "linear-gradient(135deg,#A855F7,#3B82F6)",
              color: "#fff",
              boxShadow: hov ? "0 0 40px rgba(168,85,247,0.5)" : "0 0 20px rgba(168,85,247,0.25)",
              transform: hov ? "translateY(-2px) scale(1.03)" : "scale(1)",
            }
          : {
              background: "transparent",
              color: hov ? "#A855F7" : "rgba(255,255,255,0.7)",
              border: `1px solid ${hov ? "rgba(168,85,247,0.7)" : "rgba(255,255,255,0.2)"}`,
              transform: hov ? "translateY(-2px)" : "translateY(0)",
            }),
      }}
    >
      {children}
    </a>
  );
}

// ─── SECTIONS ─────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 5vw", height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(0,0,0,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(168,85,247,0.15)" : "none",
      transition: "all 0.4s",
    }}>
      {/* Logo */}
      <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 20, ...S.gradientText }}>
        FRAME<span style={{ WebkitTextFillColor: "rgba(255,255,255,0.45)", background: "none" }}>STUDIO</span>
      </span>

      {/* Desktop links */}
      <div style={{ display: "flex", gap: 36, alignItems: "center" }} className="desktop-nav">
        {NAV_LINKS.map(link => (
          <NavLink key={link} href={`#${link.toLowerCase()}`}>{link}</NavLink>
        ))}
        <Btn href="#contact" variant="fill">Let's Work</Btn>
      </div>

      {/* Hamburger (mobile) */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "none" }}
      >
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 22, height: 2, background: "#A855F7", margin: "5px 0",
            transition: "all 0.3s",
            transform: menuOpen
              ? i === 0 ? "rotate(45deg) translateY(7px)"
              : i === 2 ? "rotate(-45deg) translateY(-7px)"
              : "none"
              : "none",
            opacity: menuOpen && i === 1 ? 0 : 1,
          }} />
        ))}
      </button>

      {/* Mobile overlay */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.97)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 36, zIndex: 99,
        }}>
          {NAV_LINKS.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              style={{ color: "#fff", textDecoration: "none", fontSize: 28, fontWeight: 700, fontFamily: "Space Grotesk, sans-serif" }}
            >{link}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ color: hov ? "#A855F7" : "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: 13, fontWeight: 500, letterSpacing: "0.05em", transition: "color 0.2s" }}
    >{children}</a>
  );
}

function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  const ticker = ["REELS","SHORTS","BRANDS","CREATORS","CONTENT","VIDEOS","STORIES","EDITS"];

  return (
    <section id="work" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "120px 5vw 60px", textAlign: "center" }}>
      <GlowOrb x="-10%" y="10%"  color="#A855F7" size={600} opacity={0.20} />
      <GlowOrb x="60%"  y="30%"  color="#3B82F6" size={500} opacity={0.15} />
      <GlowOrb x="30%"  y="60%"  color="#8B5CF6" size={400} opacity={0.10} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 1s 0.1s cubic-bezier(0.23,1,0.32,1)" }}>
        {/* Eyebrow */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: 100, border: "1px solid rgba(168,85,247,0.35)", background: "rgba(168,85,247,0.08)", marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#A855F7", display: "inline-block", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 12, color: "#A855F7", fontWeight: 600, letterSpacing: "0.1em", fontFamily: "Inter, sans-serif" }}>DIGITAL CONTENT AGENCY · INDIA</span>
        </div>

       {/* H1 */}
        <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "clamp(2.4rem,7vw,5.5rem)", lineHeight: 1.08, letterSpacing: "-0.03em", maxWidth: 900, margin: "0 auto 20px", color: "#fff" }}>
          Your Business.{" "}
          <span style={S.gradientText}>Our Strategy.</span>
          {" "}More Revenue.
        </h1>

        {/* Subtext */}
        <p style={{ fontSize: "clamp(1rem,2.5vw,1.2rem)", color: "rgba(255,255,255,0.5)", maxWidth: 620, margin: "0 auto 44px", lineHeight: 1.7 }}>
          Meeru video pampandi... danini audience{" "}
          <em style={{ color: "rgba(168,85,247,0.85)" }}>stop chesi chuse</em>{" "}
          content ga marchestham.
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <Btn href="#portfolio" variant="outline">View Our Work</Btn>
          <Btn href="#contact"   variant="fill">Start Project →</Btn>
        </div>
      </div>

      {/* Ticker strip */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, borderTop: "1px solid rgba(168,85,247,0.12)", overflow: "hidden" }}>
        <div style={{ display: "flex", width: "max-content", animation: "ticker 20s linear infinite" }}>
          {[...ticker, ...ticker, ...ticker].map((word, i) => (
            <span key={i} style={{ display: "inline-block", padding: "10px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", color: i % 2 === 0 ? "#A855F7" : "rgba(255,255,255,0.3)", borderRight: "1px solid rgba(168,85,247,0.15)", whiteSpace: "nowrap", fontFamily: "Space Grotesk, sans-serif" }}>
              {word}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  const [ref, vis] = useInView();
  return (
    <section id="about" style={{ padding: "100px 5vw", position: "relative", overflow: "hidden" }}>
      <GlowOrb x="70%" y="20%" color="#3B82F6" size={500} opacity={0.12} />
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="about-grid">
        {/* Text */}
        <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateX(0)" : "translateX(-40px)", transition: "all 0.9s cubic-bezier(0.23,1,0.32,1)" }}>
          <div style={S.sectionLabel}>WHO WE ARE</div>
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1.1, letterSpacing: "-0.03em", color: "#fff", marginBottom: 24 }}>
            Just Editing Kaadu.{" "}<span style={S.gradientText}>We Create Impact.</span>
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: 20 }}>
            Normal videos ni engaging reels ga convert chestham. Better storytelling, clean editing and modern style tho mee brand ni highlight chestham.
          </p>
          <p style={{ fontSize: 15, color: "rgba(168,85,247,0.75)", fontStyle: "italic" }}>
            "మీ content ki inka ekkuva attention kavali — that's our job."
          </p>
        </div>

        {/* Video mockup */}
        <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateX(0)" : "translateX(40px)", transition: "all 0.9s 0.2s cubic-bezier(0.23,1,0.32,1)" }}>
          <GlassCard style={{ maxWidth: 280, margin: "0 auto", aspectRatio: "9/14", overflow: "hidden", position: "relative", padding: 0 }}>
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(160deg,#1a0533 0%,#0c1445 50%,#090016 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(168,85,247,0.25)", border: "2px solid rgba(168,85,247,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, paddingLeft: 4 }}>▶</div>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>PREVIEW REEL</span>
            </div>
            <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, height: 2, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
              <div style={{ height: "100%", width: "65%", background: "linear-gradient(90deg,#A855F7,#3B82F6)", borderRadius: 2 }} />
            </div>
            <div style={{ position: "absolute", top: 16, left: 16, padding: "4px 10px", borderRadius: 100, background: "rgba(168,85,247,0.9)", fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: "0.08em" }}>REEL</div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  const [ref, vis] = useInView();
  return (
    <section id="portfolio" style={{ padding: "100px 5vw", position: "relative" }}>
      <GlowOrb x="-5%" y="40%" color="#A855F7" size={500} opacity={0.13} />
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={S.sectionLabel}>PORTFOLIO</div>
        <h2 ref={ref} style={S.sectionTitle(vis)}>Our Recent Work</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }} className="portfolio-grid">
          {PORTFOLIO.map((p, i) => (
            <GlassCard key={p.title} glow={p.color} style={{ padding: 0, overflow: "hidden", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(40px)", transition: `all 0.8s ${0.1 * i}s cubic-bezier(0.23,1,0.32,1)` }}>
              <div style={{ width: "100%", aspectRatio: "16/9", background: `linear-gradient(135deg,${p.color}30 0%,#000 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, position: "relative" }}>
                {p.icon}
                <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 4 }}>{p.frames.map((f, fi) => <span key={fi} style={{ fontSize: 10 }}>{f}</span>)}</div>
                <div style={{ position: "absolute", bottom: 8, left: 8, padding: "2px 8px", borderRadius: 4, background: "rgba(0,0,0,0.6)", fontSize: 10, color: "rgba(255,255,255,0.6)" }}>0:30</div>
              </div>
              <div style={{ padding: "20px 20px 0" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: p.color, marginBottom: 8 }}>{p.tag}</div>
                <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 10 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, marginBottom: 20 }}>{p.desc}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { n: "01", title: "Understand", desc: "Mee brand, audience and goals ni first understand chestham." },
    { n: "02", title: "Create",     desc: "Best hooks, edits and visuals tho content build chestham."  },
    { n: "03", title: "Grow",       desc: "Social media lo better performance kosam optimize chestham." },
  ];
  const [ref, vis] = useInView();
  const gradients = [
    "linear-gradient(135deg,#A855F7,#3B82F6)",
    "linear-gradient(135deg,rgba(168,85,247,.73),rgba(59,130,246,.73))",
    "linear-gradient(135deg,rgba(168,85,247,.46),rgba(59,130,246,.46))",
  ];
  return (
    <section id="process" style={{ padding: "100px 5vw", position: "relative", overflow: "hidden" }}>
      <GlowOrb x="50%" y="30%" color="#3B82F6" size={600} opacity={0.10} />
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={S.sectionLabel}>HOW WE WORK</div>
        <h2 ref={ref} style={S.sectionTitle(vis)}>Mana Process</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", position: "relative" }} className="process-grid">
          <div style={{ position: "absolute", top: 26, left: "16.5%", right: "16.5%", height: 1, background: "linear-gradient(90deg,#A855F7,#3B82F6)", opacity: 0.3 }} className="connector-line" />
          {steps.map((s, i) => (
            <div key={s.n} style={{ padding: "40px 36px", position: "relative", zIndex: 1, opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(40px)", transition: `all 0.9s ${0.15 * i}s cubic-bezier(0.23,1,0.32,1)` }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: gradients[i], display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 15, color: "#fff", marginBottom: 24, boxShadow: "0 0 24px rgba(168,85,247,0.35)" }}>{s.n}</div>
              <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 22, color: "#fff", marginBottom: 12 }}>{s.title}</h3>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  const [ref, vis] = useInView();
  return (
    <section id="services" style={{ padding: "100px 5vw", position: "relative" }}>
      <GlowOrb x="80%" y="60%" color="#A855F7" size={400} opacity={0.15} />
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={S.sectionLabel}>WHAT WE DO</div>
        <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }} className="services-grid">
          {SERVICES.map((s, i) => (
            <GlassCard key={s.title} glow={s.glow} style={{ padding: "40px 32px", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(40px)", transition: `all 0.8s ${0.1 * i}s cubic-bezier(0.23,1,0.32,1)` }}>
              <div style={{ fontSize: 36, marginBottom: 20 }}>{s.icon}</div>
              <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 20, color: "#fff", marginBottom: 12 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{s.desc}</p>
              <div style={{ marginTop: 24, height: 2, background: `linear-gradient(90deg,${s.glow},transparent)`, borderRadius: 1, opacity: 0.5 }} />
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({ num, label, visible }) {
  const val = useCountUp(num, visible);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "clamp(2.5rem,5vw,4rem)", ...S.gradientText, letterSpacing: "-0.04em", lineHeight: 1 }}>{val}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 500, letterSpacing: "0.08em", marginTop: 8 }}>{label}</div>
    </div>
  );
}

function Results() {
  const [ref, vis] = useInView();
  return (
    <section style={{ padding: "100px 5vw", position: "relative" }}>
      <GlowOrb x="20%" y="30%" color="#8B5CF6" size={500} opacity={0.12} />
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <div style={S.sectionLabel}>RESULTS</div>
        <h2 ref={ref} style={S.sectionTitle(vis)}>Content That Gets Attention</h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.45)", maxWidth: 560, margin: "0 auto 64px", lineHeight: 1.75 }}>
          Viral guarantee ani cheppam. But audience attention ni capture cheyyadaniki{" "}
          <span style={{ color: "rgba(168,85,247,0.85)" }}>best content</span>{" "}
          create chestham.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 40 }} className="stats-grid">
          {STATS.map(s => <StatItem key={s.label} {...s} visible={vis} />)}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const [ref, vis] = useInView();
  return (
    <section id="why" style={{ padding: "100px 5vw", position: "relative" }}>
      <GlowOrb x="60%" y="10%" color="#A855F7" size={400} opacity={0.13} />
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={S.sectionLabel}>WHY US</div>
        <h2 ref={ref} style={S.sectionTitle(vis)}>Enduku Memu?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }} className="why-grid">
          {WHY_US.map((w, i) => (
            <GlassCard key={w.title} style={{ padding: "36px 28px", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(40px)", transition: `all 0.9s ${0.12 * i}s cubic-bezier(0.23,1,0.32,1)` }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{w.icon}</div>
              <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 19, color: "#fff", marginBottom: 10 }}>{w.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{w.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const [ref, vis] = useInView();
  return (
    <section id="contact" style={{ padding: "140px 5vw", position: "relative", overflow: "hidden" }}>
      <GlowOrb x="10%" y="20%" color="#A855F7" size={600} opacity={0.22} />
      <GlowOrb x="60%" y="50%" color="#3B82F6" size={500} opacity={0.18} />
      <div ref={ref} style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1, opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(40px)", transition: "all 1s cubic-bezier(0.23,1,0.32,1)" }}>
        <div style={{ position: "absolute", inset: -80, borderRadius: 40, border: "1px solid rgba(168,85,247,0.12)", pointerEvents: "none" }} />
        <div style={S.sectionLabel}>START TODAY</div>
        <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "clamp(2.2rem,5vw,4rem)", lineHeight: 1.1, letterSpacing: "-0.03em", color: "#fff", marginBottom: 20 }}>
          Ready Aa?{" "}<span style={S.gradientText}>Let's Create Something Big.</span>
        </h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.45)", marginBottom: 48, lineHeight: 1.7 }}>
          Mee next best video{" "}<em style={{ color: "rgba(168,85,247,0.8)" }}>ikkadi nundi</em>{" "}start avvachu.
        </p>
       <Btn href="mailto:royalgrowthagency04@gmail.com" variant="fill">Let's Work →</Btn>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "36px 5vw", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
      <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 18, ...S.gradientText }}>FRAMESTUDIO</span>
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>© 2025 FrameStudio. All rights reserved.</span>
      <div style={{ display: "flex", gap: 20 }}>
        {["Instagram", "YouTube", "WhatsApp"].map(s => (
          <span key={s} style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>{s}</span>
        ))}
      </div>
    </footer>
  );
}

// ─── ROOT COMPONENT ───────────────────────────────────────────
export default function App() {
  return (
    <>
      {/* Global styles injected via a <style> tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;800&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html  { scroll-behavior: smooth; }
        body  { background: #000; color: #fff; font-family: 'Inter', sans-serif; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar       { width: 4px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#A855F7, #3B82F6); border-radius: 4px; }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }
        @keyframes pulse  { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.8); } }
        @media (max-width: 768px) {
          .desktop-nav     { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .about-grid      { grid-template-columns: 1fr !important; gap: 40px !important; }
          .portfolio-grid  { grid-template-columns: 1fr !important; }
          .process-grid    { grid-template-columns: 1fr !important; }
          .services-grid   { grid-template-columns: 1fr !important; }
          .why-grid        { grid-template-columns: 1fr !important; }
          .stats-grid      { grid-template-columns: repeat(3,1fr) !important; gap: 20px !important; }
          .connector-line  { display: none !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ background: "#000", minHeight: "100vh" }}>
        <Navbar />
        <Hero />
        <About />
        <Portfolio />
        <Process />
        <Services />
        <Results />
        <WhyUs />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
}
