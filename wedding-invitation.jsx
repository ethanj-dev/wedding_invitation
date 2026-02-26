import { useState, useEffect } from "react";

// ── Design tokens ──
const C = {
  brown: "#4A2C2A",
  brownLight: "#6D4C41",
  pink: "#FB6BB7",
  pinkSoft: "#FFD1D1",
  pinkPale: "#FFF5F5",
  pinkMuted: "#F8E4E4",
  bg: "#FAF7F2",
  bgOuter: "#EBE5E1",
  white: "#FDFBF7",
};

const shadow = (px = 4) => `${px}px ${px}px 0px 0px ${C.brown}`;
const shadowPink = (px = 4) => `${px}px ${px}px 0px 0px ${C.pinkSoft}`;

// ── Breakpoint hook ──
function useBreakpoint() {
  const [bp, setBp] = useState("mobile");
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      if (w >= 1024) setBp("desktop");
      else if (w >= 768) setBp("tablet");
      else setBp("mobile");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return bp;
}

const isMobile = (bp) => bp === "mobile";
const isDesktop = (bp) => bp === "desktop";

// ── Shared Components ──
function SectionTag({ children, rotate = 0 }) {
  return (
    <span
      className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase select-none"
      style={{
        background: C.brown,
        color: C.pinkPale,
        border: `2px solid ${C.brown}`,
        boxShadow: shadow(2),
        transform: `rotate(${rotate}deg)`,
        fontFamily: "'Space Mono', monospace",
      }}
    >
      {children}
    </span>
  );
}

function SectionTitle({ children, large = false }) {
  return (
    <h2
      className={`font-bold tracking-tight mt-3 ${large ? "text-3xl" : "text-2xl"}`}
      style={{ color: C.brown, fontFamily: "'Noto Serif KR', serif" }}
    >
      {children}
    </h2>
  );
}

function DashedDivider() {
  return (
    <div className="w-full px-6" style={{ background: C.bg }}>
      <div
        className="w-full my-8 md:my-12"
        style={{
          height: "2px",
          backgroundImage: `linear-gradient(to right, ${C.brown} 50%, transparent 50%)`,
          backgroundSize: "16px 2px",
          backgroundRepeat: "repeat-x",
        }}
      />
    </div>
  );
}

function RetroButton({ children, bg, color, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${className}`}
      style={{
        background: bg || C.pinkSoft,
        color: color || C.brown,
        border: `3px solid ${C.brown}`,
        boxShadow: shadow(4),
        padding: "10px 20px",
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "translate(2px,2px)";
        e.currentTarget.style.boxShadow = shadow(2);
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = shadow(4);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = shadow(4);
      }}
    >
      {children}
    </button>
  );
}

function Accordion({ icon, title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        background: "white",
        border: `3px solid ${C.brown}`,
        boxShadow: shadow(5),
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 cursor-pointer font-bold select-none"
        style={{ color: C.brown }}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <span className="material-symbols-outlined" style={{ color: C.brown }}>
              {icon}
            </span>
          )}
          {title}
        </div>
        <span
          className="material-symbols-outlined transition-transform"
          style={{
            color: C.brown,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          expand_more
        </span>
      </button>
      {open && (
        <div
          className="px-4 pb-4 text-sm leading-relaxed"
          style={{
            borderTop: `3px solid ${C.brown}`,
            background: C.bg,
            color: C.brownLight,
          }}
        >
          <div className="pt-3">{children}</div>
        </div>
      )}
    </div>
  );
}

function Icon({ name, size = 20, style = {} }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{ fontSize: size, color: C.brown, ...style }}
    >
      {name}
    </span>
  );
}

// ── Data ──
const galleryImages = [
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQjs3-T5K6c685nEKW1KW9ibbYzSU9y6h5Pd0Ubr2SciUTdT254fcoRuo7xZlabvFSdeA4I6vxg1JYoqNNUf4M3vUHM9c0NvHGfrQLutOudCDxGBkUrw5zFqFJBOj4csijBEhyfqiWQRjHfLnOXMwBEvi_jGKt3YGUhWQWaAWFonAGdUC-ARO3g22qYkF06ha9GfZr4hy-Cwvq2pkIUYlvaVaw4wSyotsNRDCZzLlb0fJeer_5j_KhJ1eE67s5qS29vnmvxk_LPX92", alt: "Couple holding hands", aspect: "3/4" },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_Pdx8DMJZBh-s5sbakpkBjZ5Iupb2n6P9FJBjsZvz-hVWDJ4JQoSj1iviFMmUHFnhk3m7hH0ePjmU1J7g4nnSmtT0ibj588xwRczZvTxLI6zXLpNgoFIlwzRNftR3xYCFM6Sp6gEQG2cUN6U6_q0mMLv-YGosZxJ2UGQxBpllSQkf442z-75zZm7PjUvCzgIVF8jcnrFnHr3vYkxHQX9ZDxSLcdgbw3Bm0s7d1nr2diWgO_By_r5QNkdjZ1WHViAHHcALY03KSciP", alt: "Wedding rings", aspect: "4/5" },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD69JxbGcPOOfA7yrC4amheVCngeJOip8OBS5heMm1pqoGDBMbwmO64aU29c7Wwsv_AgCPG3cUtfm9BBscKWL6_f4vRDkdgINqB4Z-RCk4pIIFYMbk7AJBJe_50KRNNmW9dgXH-0bMa1qCqRQgRBkAnqT-Os-6xlnNp8p2DVBYkPC65Y8VY2nrx2ADvFNf1r2ZU4qr484Q4XxVW6Fi46zzLzwJ8NCb4dOEzhYPU9nzp9Nlig20wuSaqvVc166VbbFGEr7LZrPZaPZC1", alt: "Bride with bouquet", aspect: "1/1" },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlgH-P9pnevLrfvh6WCpQvsJmsgtXr8jCgM3aZ61sWZWFw1fLXhcDRKJD00mdbU_cAGqid0v-jtoDRxVwxDUflE9H9BdYZCE09Fn05UqkqyLcBN3W2bLvuv9EGMvBHr39G1_QBAvQQCoM9XxZv8oOA3LvT7jg-xZEADHm2LKdLVshpJF-rk0pPE5U9vI0go0azL1vcLWjmFwoCFlb5k3RXk-1BSO2yMaV-TJaQ0kQkG2ItkFCjYjwm5_6na7YpXZku_mkZcDKrBI1n", alt: "Groom adjusting tie", aspect: "3/4" },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKrRBvENI3u6R4zGUgfbSYBguqnnTCcmwT21S7OcNzO6QG7cNbYHuUudaUgc8Ss-TE0TH0et2YhB53wv3IBiPZu0bSbk14Oc39C7Jf4BmUXhxUmUGZp3JiaiRhpaAswHY89A1woSfLZL8XccrG9e6c85uuMXzwdRo9Xei8AkYIRhK6-WXemX6kuuxbunBCxvaVQA2D6Z6sJS5wTTSPbZDypRyDPz6yaslwhzm0Cl0p46k7lFNX5Xr41RST6R1Uv-DqxS4gj8UFTrRI", alt: "Wedding cake", aspect: "4/3" },
];

const mainPhoto = "https://lh3.googleusercontent.com/aida-public/AB6AXuBT6kM85PWXNTVGSOniwyJ3EmoyoEunMqhgcAT-Vli78XSD0B65F5tYOXZktanrSv6Mb_pAIIiChaoPb2kNf7b_-dJ4b3oz5y6ZR2Ul_5a3xBSkT4dGZETLG_b8BUCpQkFYsQTf2VhhrflZCEJLjaskqAWcKtos32XwFIaqfjMQkexAYD93ymS_D6nVxIrXfhgAqn78SgJtUniqrvwZOV6wpAx0BZYA5xRFwQMJI8rnCNoMAlq4IsuD671mA_67goh7YdMPDQGY-v2f";

const mapImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuD4do90S2iEd0RroFbkM-95FBw9bQJkdv3ZsfdTyrJg7kq8XmunCqwD17d_A-dv2UIXV2pqXj9RP87InBqDieZihKX_tuSaIKtlZIxPEiAKrABqXgSqQb6esf-dvmbdkJn5kZoeNylmxQ07KN1z9zz_p2rUdjFqqrh3xTn8mfhjS2030Pjbz0bfEeONko4XgFkxN1k-0UNBEK5zO3W1EHr6E-JLPEnPekqyGgzln6YuD9KxBYRyGjvPcZqCX9G5yAl5-yvmtVwLrXYh";

// ── D-Day Counter ──
function useDday() {
  const target = new Date("2024-10-26T12:00:00");
  const [days, setDays] = useState(0);
  useEffect(() => {
    const calc = () => {
      const diff = target - new Date();
      setDays(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
    };
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, []);
  return days;
}

// ══════════════════════════════════════
//  SECTIONS
// ══════════════════════════════════════

function HeroSection({ bp }) {
  const dday = useDday();
  const [hovered, setHovered] = useState(false);
  const mobile = isMobile(bp);

  // ── Desktop/Tablet: side-by-side ──
  if (!mobile) {
    return (
      <section className="px-8 lg:px-16 pt-10 pb-14">
        <div
          className="mb-10 w-full flex justify-between items-center pb-3"
          style={{ borderBottom: `2px solid ${C.brown}` }}
        >
          <span
            className="text-xs font-bold px-2 py-1 uppercase"
            style={{ background: C.brown, color: "white", fontFamily: "'Space Mono', monospace" }}
          >
            Wedding Inv.
          </span>
          <span
            className="text-xs font-bold"
            style={{ color: C.brown, fontFamily: "'Space Mono', monospace" }}
          >
            Vol.1
          </span>
        </div>

        <div className="flex gap-10 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1
              className="text-5xl lg:text-6xl font-black tracking-tight leading-tight"
              style={{ color: C.brown, fontFamily: "'Noto Serif KR', serif" }}
            >
              홍길동<br />
              <span style={{ color: C.pink }}>&</span> 김영희
            </h1>
            <div className="w-16 h-1 my-5 rounded-full" style={{ background: `${C.brown}20` }} />
            <p
              className="text-lg font-bold tracking-wide"
              style={{ color: `${C.brown}B3`, fontFamily: "'Noto Sans KR', sans-serif" }}
            >
              2024. 10. 26. SAT 12:00
            </p>
          </div>

          {/* Right: Photo */}
          <div
            className="flex-1 max-w-[380px]"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div
              className="relative w-full"
              style={{
                aspectRatio: "3/4",
                background: "white",
                border: `3px solid ${C.brown}`,
                padding: "8px",
                boxShadow: "6px 6px 0px 0px " + C.brown,
                transform: "rotate(2deg)",
              }}
            >
              <div className="w-full h-full overflow-hidden relative" style={{ border: `1px solid ${C.brown}` }}>
                <img
                  src={mainPhoto}
                  alt="Wedding couple"
                  className="w-full h-full object-cover transition-all duration-500"
                  style={{ filter: hovered ? "grayscale(0)" : "grayscale(1)" }}
                />
                <div
                  className="absolute top-4 right-4 px-3 py-1"
                  style={{ background: C.pink, border: `2px solid ${C.brown}`, boxShadow: shadow(2), transform: "rotate(12deg)" }}
                >
                  <span className="font-black text-lg" style={{ color: C.brown, fontFamily: "'Space Mono', monospace" }}>
                    D-{dday}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Mobile: stacked ──
  return (
    <section className="flex flex-col items-center pt-8 pb-10 px-5">
      <div className="mb-6 w-full flex justify-between items-center pb-2" style={{ borderBottom: `2px solid ${C.brown}` }}>
        <span className="text-xs font-bold px-2 py-1 uppercase" style={{ background: C.brown, color: "white", fontFamily: "'Space Mono', monospace" }}>
          Wedding Inv.
        </span>
        <span className="text-xs font-bold" style={{ color: C.brown, fontFamily: "'Space Mono', monospace" }}>Vol.1</span>
      </div>
      <div className="text-center mb-8 w-full">
        <h1 className="text-4xl font-black tracking-tight leading-tight" style={{ color: C.brown, fontFamily: "'Noto Serif KR', serif" }}>
          홍길동 <span style={{ color: C.pink }}>&</span> 김영희
        </h1>
        <div className="w-12 h-1 mx-auto my-3 rounded-full" style={{ background: `${C.brown}20` }} />
        <p className="text-base font-bold tracking-wide" style={{ color: `${C.brown}B3`, fontFamily: "'Noto Sans KR', sans-serif" }}>
          2024. 10. 26. SAT 12:00
        </p>
      </div>
      <div
        className="relative w-full mb-4"
        style={{ aspectRatio: "3/4", background: "white", border: `3px solid ${C.brown}`, padding: "8px", boxShadow: "6px 6px 0px 0px " + C.brown, transform: "rotate(1deg)" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="w-full h-full overflow-hidden relative" style={{ border: `1px solid ${C.brown}` }}>
          <img src={mainPhoto} alt="Wedding couple" className="w-full h-full object-cover transition-all duration-500" style={{ filter: hovered ? "grayscale(0)" : "grayscale(1)" }} />
          <div className="absolute top-3 right-3 px-3 py-1" style={{ background: C.pink, border: `2px solid ${C.brown}`, boxShadow: shadow(2), transform: "rotate(12deg)" }}>
            <span className="font-black text-lg" style={{ color: C.brown, fontFamily: "'Space Mono', monospace" }}>D-{dday}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function InvitationSection({ bp }) {
  const mobile = isMobile(bp);

  return (
    <section className={`${mobile ? "px-5 py-12" : "px-8 lg:px-16 py-16"} flex flex-col items-center`} style={{ background: C.bg }}>
      <div className="text-center mb-8">
        <SectionTag>Invitation</SectionTag>
        <SectionTitle large={!mobile}>초대합니다</SectionTitle>
      </div>

      <div
        className={`w-full flex flex-col ${mobile ? "" : "max-w-[560px]"}`}
        style={{ border: `4px solid ${C.brown}`, background: "white", borderRadius: "2px" }}
      >
        {/* Title bar */}
        <div className="h-9 flex items-center justify-between px-2 select-none" style={{ background: "#F8CACA", borderBottom: `3px solid ${C.brown}` }}>
          <div className="flex items-center gap-2 pl-1">
            <Icon name="folder_open" size={18} />
            <span className="font-bold text-sm tracking-wide" style={{ color: C.brown }}>Invitation</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 flex items-center justify-center" style={{ background: "white", border: `2px solid ${C.brown}` }}>
              <div className="w-2.5" style={{ height: "2px", background: C.brown, transform: "translateY(3px)" }} />
            </div>
            <div className="w-5 h-5 flex items-center justify-center" style={{ background: "white", border: `2px solid ${C.brown}` }}>
              <div className="w-2.5 h-2.5" style={{ border: `1px solid ${C.brown}`, borderTopWidth: "2px" }} />
            </div>
            <div className="w-5 h-5 flex items-center justify-center cursor-pointer" style={{ background: "#E85D5D", border: `2px solid ${C.brown}` }}>
              <span className="material-symbols-outlined text-white" style={{ fontSize: 14, fontWeight: "bold" }}>close</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`${mobile ? "p-8 pb-12" : "p-12 pb-16"} text-center relative flex flex-col items-center justify-center`} style={{ background: C.white, minHeight: mobile ? 380 : 440 }}>
          <span className="material-symbols-outlined mb-8" style={{ fontSize: mobile ? 48 : 56, color: C.brown }}>favorite</span>
          <h3 className={`font-bold ${mobile ? "text-2xl" : "text-3xl"} mb-4 leading-tight tracking-tight`} style={{ color: C.brown, fontFamily: "'Noto Serif KR', serif" }}>
            소중한 분들을<br />초대합니다
          </h3>
          <div className="w-12 mx-auto mt-4 mb-8" style={{ height: 3, background: C.brown }} />
          <p className={`${mobile ? "text-sm" : "text-base"} mb-12 font-medium`} style={{ color: C.brownLight, lineHeight: 2.2, fontFamily: "'Noto Sans KR', sans-serif", wordBreak: "keep-all" }}>
            2025년에 시작되는 따뜻한 이야기<br />
            서로의 따뜻한 사랑으로<br />
            하나가 되는 자리에 모십니다.<br />
            귀한 걸음 하시어 축복해 주시면<br />
            더없는 기쁨이 되겠습니다.
          </p>
          <div className="relative inline-block">
            <div className="absolute inset-0 z-0" style={{ background: C.pinkSoft, border: `2px solid ${C.brown}`, transform: "translate(4px, 4px)" }} />
            <div className="relative z-10 px-8 py-3 w-64" style={{ background: "white", border: `2px solid ${C.brown}` }}>
              <span className="font-bold text-sm tracking-wide" style={{ color: C.brown }}>홍길동 · 김영희 의 아들·딸</span>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="h-8 flex text-xs font-bold items-center" style={{ background: "#F4E1DE", borderTop: `3px solid ${C.brown}`, color: C.brown, fontFamily: "'Space Mono', monospace", fontSize: 11 }}>
          <div className="flex-1 h-full flex items-center px-3" style={{ borderRight: `2px solid ${C.brown}` }}>1 Object(s) selected</div>
          <div className="flex-1 h-full flex items-center px-3">My Computer</div>
        </div>
      </div>
    </section>
  );
}

function GallerySection({ bp }) {
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const mobile = isMobile(bp);
  const cols = isDesktop(bp) ? 3 : 2;

  return (
    <section className={`${mobile ? "px-4 py-12" : "px-8 lg:px-16 py-16"}`} style={{ background: C.bg }}>
      <div className="text-center mb-10">
        <SectionTag rotate={-2}>Gallery</SectionTag>
        <SectionTitle large={!mobile}>우리의 순간들</SectionTitle>
      </div>

      <div className="px-2" style={{ columnCount: cols, columnGap: mobile ? "0.75rem" : "1.25rem" }}>
        {galleryImages.map((img, i) => (
          <div
            key={i}
            className={mobile ? "mb-3" : "mb-5"}
            style={{ breakInside: "avoid" }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(-1)}
          >
            <div
              className="w-full p-2 cursor-pointer transition-all"
              style={{ background: "white", border: `2px solid ${C.brown}`, boxShadow: hoveredIdx === i ? shadow(6) : shadow(4) }}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: img.aspect, border: `1px solid ${C.brown}`, background: C.pinkMuted }}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-all duration-500"
                  style={{ filter: hoveredIdx === i ? "grayscale(0) sepia(0)" : "grayscale(1) sepia(0.3)" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <RetroButton>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>photo_library</span>
          더 많은 사진 보기
        </RetroButton>
      </div>
    </section>
  );
}

function LocationSection({ bp }) {
  const mobile = isMobile(bp);

  const mapBlock = (
    <div
      className="w-full relative overflow-hidden group cursor-pointer"
      style={{ aspectRatio: "4/3", border: `3px solid ${C.brown}`, boxShadow: shadow(5) }}
    >
      <img src={mapImage} alt="Map" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: C.pinkSoft, border: `3px solid ${C.brown}`, boxShadow: shadow(4) }}>
          <Icon name="location_on" />
          <span className="font-bold" style={{ color: C.brown }}>더 채플 앳 논현</span>
        </div>
      </div>
    </div>
  );

  const mapButtons = (
    <div className="grid grid-cols-3 gap-3">
      {[
        { icon: "map", label: "네이버지도" },
        { icon: "chat_bubble", label: "카카오맵" },
        { icon: "navigation", label: "티맵" },
      ].map((btn) => (
        <button
          key={btn.label}
          className="flex flex-col items-center justify-center gap-2 p-3 transition-all"
          style={{ background: C.pinkSoft, border: `3px solid ${C.brown}`, boxShadow: shadow(4) }}
          onMouseDown={(e) => { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = shadow(2); }}
          onMouseUp={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = shadow(4); }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = shadow(4); }}
        >
          <span className="material-symbols-outlined text-2xl font-bold" style={{ color: C.brown }}>{btn.icon}</span>
          <span className="text-xs font-bold" style={{ color: C.brown }}>{btn.label}</span>
        </button>
      ))}
    </div>
  );

  const addressBlock = (
    <div className="flex flex-col items-center gap-3 p-6" style={{ border: `3px solid ${C.brown}`, background: "white", boxShadow: shadow(5) }}>
      <p className="text-center font-bold" style={{ color: C.brown }}>
        서울 강남구 논현로 549
        <span className="text-sm font-medium mt-1 block" style={{ color: C.brownLight }}>더 채플 앳 논현 6층 라포레홀</span>
      </p>
      <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold mt-2 transition-colors" style={{ border: `2px solid ${C.brown}`, color: C.brown, background: C.pinkPale, boxShadow: shadow(2) }}>
        <Icon name="content_copy" size={14} />
        주소 복사
      </button>
    </div>
  );

  const transportBlock = (
    <div className="space-y-4">
      <Accordion icon="directions_subway" title="지하철 이용시">
        <div className="flex items-center gap-2 mb-3 mt-1 flex-wrap">
          <div className="w-4 h-4 rounded-full shrink-0" style={{ background: "#3CB44A", border: `2px solid ${C.brown}` }} />
          <p className="font-bold">2호선 역삼역</p>
          <span className="text-xs px-1.5 py-0.5 font-bold" style={{ border: `2px solid ${C.brown}`, background: "white", color: C.brown, boxShadow: "1px 1px 0 0 " + C.brown }}>6번 출구</span>
          <span className="text-xs font-medium" style={{ color: "#999" }}>도보 5분</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-4 h-4 rounded-full shrink-0" style={{ background: "#D5A54E", border: `2px solid ${C.brown}` }} />
          <p className="font-bold">9호선 언주역</p>
          <span className="text-xs px-1.5 py-0.5 font-bold" style={{ border: `2px solid ${C.brown}`, background: "white", color: C.brown, boxShadow: "1px 1px 0 0 " + C.brown }}>7번 출구</span>
          <span className="text-xs font-medium" style={{ color: "#999" }}>도보 3분</span>
        </div>
      </Accordion>
      <Accordion icon="directions_bus" title="버스 이용시">
        <div className="flex gap-2 mb-2 items-start mt-1">
          <span className="text-xs font-bold px-1.5 py-0.5 text-white" style={{ border: `2px solid ${C.brown}`, background: "#4298B5", boxShadow: "1px 1px 0 0 " + C.brown }}>Blue</span>
          <p className="font-bold">147, 463, 241</p>
        </div>
        <div className="flex gap-2 items-start">
          <span className="text-xs font-bold px-1.5 py-0.5 text-white" style={{ border: `2px solid ${C.brown}`, background: "#5BB04F", boxShadow: "1px 1px 0 0 " + C.brown }}>Green</span>
          <p className="font-bold">4211, 3412</p>
        </div>
        <p className="mt-3 text-xs text-center font-medium pt-2" style={{ borderTop: "2px dashed #ccc", color: "#999" }}>
          '차병원' 정류장 하차 후 도보 2분
        </p>
      </Accordion>
      <Accordion icon="local_parking" title="자가용 및 주차안내">
        <p className="font-bold mt-1 mb-3">🚗 본 건물 지하주차장 이용 (B2 ~ B6)</p>
        <div className="p-2 text-center mb-2" style={{ background: C.pinkSoft, border: `2px solid ${C.brown}`, boxShadow: shadow(2) }}>
          <p className="text-xs font-bold" style={{ color: C.brown }}>하객 2시간 무료 주차</p>
        </div>
        <p className="text-xs text-center font-medium" style={{ color: "#999" }}>안내데스크에서 주차 등록을 꼭 해주세요.</p>
      </Accordion>
    </div>
  );

  // ── Desktop/Tablet: two-column ──
  if (!mobile) {
    return (
      <section className="px-8 lg:px-16 py-16" style={{ background: C.bg }}>
        <div className="text-center mb-12">
          <SectionTag rotate={2}>Location</SectionTag>
          <SectionTitle large>오시는 길</SectionTitle>
        </div>
        <div className="flex gap-8 lg:gap-12">
          <div className="flex-1 flex flex-col gap-6">
            {mapBlock}
            {mapButtons}
          </div>
          <div className="flex-1 flex flex-col gap-6">
            {addressBlock}
            {transportBlock}
          </div>
        </div>
      </section>
    );
  }

  // ── Mobile: stacked ──
  return (
    <section className="px-6 py-12" style={{ background: C.bg }}>
      <div className="text-center mb-10">
        <SectionTag rotate={2}>Location</SectionTag>
        <SectionTitle>오시는 길</SectionTitle>
      </div>
      <div className="mb-8">{mapBlock}</div>
      <div className="mb-8">{mapButtons}</div>
      <div className="mb-10">{addressBlock}</div>
      {transportBlock}
    </section>
  );
}

function PhotoEventSection({ bp }) {
  const mobile = isMobile(bp);

  return (
    <section className={`${mobile ? "px-6 py-12" : "px-8 lg:px-16 py-16"}`} style={{ background: C.bg }}>
      <div className="text-center mb-6">
        <SectionTag rotate={-1}>Photo Event</SectionTag>
        <SectionTitle large={!mobile}>하객 사진 이벤트</SectionTitle>
      </div>
      <div
        className={`p-6 flex flex-col items-center text-center gap-4 ${mobile ? "" : "max-w-[560px] mx-auto"}`}
        style={{ border: `3px dashed ${C.brown}`, background: "rgba(255,255,255,0.5)" }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: C.pinkSoft, border: `2px solid ${C.brown}`, boxShadow: shadow(3) }}
        >
          <Icon name="add_a_photo" size={24} />
        </div>
        <p
          className={`${mobile ? "text-sm" : "text-base"} font-medium leading-relaxed`}
          style={{ color: C.brown, wordBreak: "keep-all", fontFamily: "'Noto Sans KR', sans-serif" }}
        >
          신랑 신부가 마음에 드는 사진을 선정하여<br />
          소정의 선물을 드립니다!<br />
          여러분의 시선으로 담은 저희의 순간을<br />
          공유해 주세요.
        </p>
        <RetroButton bg={C.brown} color={C.pinkPale}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>upload_file</span>
          사진 업로드하기
        </RetroButton>
      </div>
    </section>
  );
}

function AccountCard({ accounts }) {
  return (
    <div className="space-y-3 text-left">
      {accounts.map((acc) => (
        <div
          key={acc.bank}
          className="flex justify-between items-center p-3"
          style={{ background: "white", border: `2px solid ${C.brown}`, boxShadow: shadow(2) }}
        >
          <div>
            <p className="text-xs mb-1" style={{ color: "#999" }}>{acc.rel}</p>
            <p className="text-sm font-bold" style={{ color: C.brown }}>{acc.bank}</p>
            <p className="text-xs mt-0.5" style={{ color: C.brown }}>{acc.name}</p>
          </div>
          <button className="p-1.5 transition-colors" style={{ background: C.pinkSoft, border: `2px solid ${C.brown}` }}>
            <Icon name="content_copy" size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

function GiftSection({ bp }) {
  const mobile = isMobile(bp);
  const groomAccounts = [
    { rel: "신랑 아버지", bank: "국민 123-456-7890", name: "홍아빠" },
    { rel: "신랑", bank: "신한 110-123-456789", name: "홍길동" },
  ];
  const brideAccounts = [
    { rel: "신부 아버지", bank: "농협 352-1234-5678-90", name: "김아빠" },
    { rel: "신부", bank: "카카오 3333-01-2345678", name: "김영희" },
  ];

  const groomAccordion = (
    <Accordion
      title={
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: C.brown }} />
          신랑측 계좌번호
        </span>
      }
      defaultOpen={!mobile}
    >
      <AccountCard accounts={groomAccounts} />
    </Accordion>
  );

  const brideAccordion = (
    <Accordion
      title={
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: C.pinkSoft, border: `1px solid ${C.brown}` }} />
          신부측 계좌번호
        </span>
      }
      defaultOpen={!mobile}
    >
      <AccountCard accounts={brideAccounts} />
    </Accordion>
  );

  return (
    <section className={`${mobile ? "px-6 py-12" : "px-8 lg:px-16 py-16"} text-center`} style={{ background: C.bg }}>
      <div className="text-center mb-10">
        <SectionTag rotate={-1}>For Gift</SectionTag>
        <SectionTitle large={!mobile}>마음 전하실 곳</SectionTitle>
        <p className="text-sm mt-3 leading-relaxed" style={{ color: C.brownLight, fontFamily: "'Noto Sans KR', sans-serif" }}>
          참석이 어려우신 분들을 위해<br />계좌번호를 안내해 드립니다.
        </p>
      </div>

      {!mobile ? (
        <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto items-start">
          {groomAccordion}
          {brideAccordion}
        </div>
      ) : (
        <div className="space-y-4 max-w-sm mx-auto">
          {groomAccordion}
          {brideAccordion}
        </div>
      )}
    </section>
  );
}

function FooterSection({ bp }) {
  const mobile = isMobile(bp);

  return (
    <section className={`pt-0 ${mobile ? "pb-12 px-6" : "pb-16 px-8 lg:px-16"} text-center`} style={{ background: C.bg }}>
      <DashedDivider />
      <div
        className={`mx-auto p-3 mb-6 ${mobile ? "max-w-[200px]" : "max-w-[240px]"}`}
        style={{ aspectRatio: "1/1", background: "white", border: `3px solid ${C.brown}`, boxShadow: shadow(5), transform: "rotate(2deg)" }}
      >
        <img src={galleryImages[0].src} alt="Happy couple" className="w-full h-full object-cover" style={{ filter: "grayscale(1) sepia(0.3)" }} />
      </div>
      <h3 className={`${mobile ? "text-xl" : "text-2xl"} font-bold mb-2`} style={{ color: C.brown, fontFamily: "'Noto Serif KR', serif" }}>
        Thank You
      </h3>
      <p className={`${mobile ? "text-sm" : "text-base"} font-medium leading-relaxed mb-8`} style={{ color: C.brown }}>
        저희 두 사람의 새로운 출발을<br />축복해 주셔서 진심으로 감사드립니다.
      </p>
      <div className="flex justify-center gap-4 mb-8">
        <button className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-black/5" style={{ border: `1px solid ${C.brown}30` }}>
          <Icon name="share" size={18} style={{ color: C.brownLight }} />
        </button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-black/5" style={{ border: `1px solid ${C.brown}30` }}>
          <Icon name="link" size={18} style={{ color: C.brownLight }} />
        </button>
      </div>
      <p className="uppercase tracking-widest" style={{ color: "#999", fontSize: 10, fontFamily: "'Space Mono', monospace" }}>
        © 2024 Wedding Invitation
      </p>
    </section>
  );
}

// ══════════════════════════════════════
//  MAIN APP
// ══════════════════════════════════════
export default function WeddingInvitation() {
  const bp = useBreakpoint();
  const mobile = isMobile(bp);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;600;700;900&family=Noto+Sans+KR:wght@300;400;500;700;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen flex justify-center"
        style={{ background: C.bgOuter, fontFamily: "'Noto Sans KR', sans-serif" }}
      >
        <main
          className={`w-full min-h-screen overflow-x-hidden flex flex-col ${mobile ? "max-w-[480px]" : "max-w-[960px]"}`}
          style={{
            background: C.bg,
            borderLeft: `2px solid ${C.brown}`,
            borderRight: `2px solid ${C.brown}`,
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
            backgroundImage: `linear-gradient(to right, rgba(251,107,183,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(251,107,183,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        >
          <div
            className={`${mobile ? "h-16" : "h-20"} w-full`}
            style={{ background: `linear-gradient(to bottom, ${C.pinkSoft}33, transparent)` }}
          />

          <HeroSection bp={bp} />
          <DashedDivider />
          <InvitationSection bp={bp} />
          <DashedDivider />
          <GallerySection bp={bp} />
          <DashedDivider />
          <LocationSection bp={bp} />
          <DashedDivider />
          <PhotoEventSection bp={bp} />
          <DashedDivider />
          <GiftSection bp={bp} />
          <FooterSection bp={bp} />
        </main>
      </div>
    </>
  );
}
