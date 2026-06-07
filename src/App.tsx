import { useEffect, useRef, useState, useCallback } from "react";
import {
  Send,
  ExternalLink,
  Mail,
  ChevronRight,
  ChevronLeft,
  Layers,
  GitBranch,
  Activity,
  RotateCcw,
  X,
  Rocket,
  Sparkles,
  Terminal,
  Menu,
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─── DATA ────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    title: "P2P Marketplace (Demo)",
    desc: "Повноцінна P2P-платформа для торгівлі між користувачами: оголошення, фільтри, чат, система рейтингів та безпечні угоди.",
    img: "./1/1.png",
    color: "from-violet-600/20 to-cyan-600/10",
    border: "border-violet-500/25",
    tag: "Marketplace",
    tagColor: "text-violet-300/70 bg-violet-500/10 border-violet-500/20",
    gallery: ["./1/1.png", "/1/2.png", "/1/3.jpg", "/1/4.png"],
    projectUrl: "https://zxckys.vercel.app/",
    details: {
      stack: ["React", "JavaScript / TypeScript", "Node.js", "Vercel (test)"],
      year: "2026",
      longDesc:
        "P2P Marketplace — це платформа для прямої торгівлі між користувачами. Реалізовано систему оголошень з фільтрацією, пошуком та категоріями. Вбудований чат для спілкування між покупцем і продавцем, система рейтингів та відгуків, безпечні угоди з підтвердженням. Адаптивний інтерфейс, оптимізований для мобільних пристроїв.",
    },
  },
  {
    title: "CoffeeOnly (Demo)",
    desc: "Сучасний інтернет-магазин спеціалізованої кави з каталогом, фільтрами, кошиком та прямими поставками від фермерів.",
    img: "./2/2.png",
    color: "from-green-600/20 to-emerald-600/10",
    border: "border-green-500/25",
    tag: "E-commerce",
    tagColor: "text-green-300/70 bg-green-500/10 border-green-500/20",
    gallery: ["./2/2.png"],
    projectUrl: null,
    details: {
      stack: ["React", "JavaScript / TypeScript", "Next.js", "Tailwind CSS"],
      year: "2026",
      longDesc:
        "CoffeeOnly — спеціалізований інтернет-магазин кави з акцентом на якість і прозорість. Реалізовано повноцінний каталог з фільтрацією за сортом, регіоном та обсмажкою, кошик із збереженням стану, систему відгуків клієнтів та сторінки товарів з детальним описом смакового профілю. Пряма співпраця з фермерами з Ефіопії, Колумбії та Бразилії. Адаптивний дизайн з акцентами на типографіку та зручну навігацію.",
    },
  },
  {
    title: "PixelProbe (Demo)",
    desc: "Інструмент для аналізу UI будь-якого сайту: витягує кольори, відступи, шрифти та паттерни компонентів у готові дизайн-токени.",
    img: "./3/3.png",
    color: "from-fuchsia-600/20 to-violet-600/10",
    border: "border-fuchsia-500/25",
    tag: "Dev Tool",
    tagColor: "text-fuchsia-300/70 bg-fuchsia-500/10 border-fuchsia-500/20",
    gallery: ["./3/3.png"],
    projectUrl: null,
    details: {
      stack: ["Next.js", "JavaScript / TypeScript", "Puppeteer", "CSS Parser"],
      year: "2026",
      longDesc:
        "PixelProbe — інструмент для глибокого аналізу інтерфейсів сайтів. Вставляєш посилання — отримуєш повну палітру кольорів, CSS-змінні, типографічну систему та патерни компонентів у форматі готових дизайн-токенів. Вбудований Visual Inspector дозволяє інспектувати елементи прямо в браузері, а CSS Exporter — миттєво експортувати стилі. Підтримка предперегляду: color palette, CSS variables, visual preview.",
    },
  },
];

// ─── AI STREAM WIDGET ─────────────────────────────────────────────────────────

const CONVERSATIONS = [
  {
    clientName: "Олексій",
    clientInitial: "О",
    clientColor: "from-orange-500 to-amber-600",
    prompt: "Привіт! Можеш зробити AI чат з стрімінгом?",
    reply:
      "Звісно. Підключаю Claude API, налаштовую Edge Runtime та WebSocket канал. Стрімінг токенів — готово, latency < 80ms.",
    tokens: 847,
    ms: 1240,
  },
  {
    clientName: "Марина",
    clientInitial: "М",
    clientColor: "from-pink-500 to-rose-600",
    prompt: "Потрібен Telegram бот з GPT-5, реально швидко?",
    reply:
      "Так. Grammyjs + GPT-5 SDK, webhook через Cloudflare Workers. Додаю контекст чату та rate limiting.",
    tokens: 612,
    ms: 980,
  },
  {
    clientName: "Дмитро",
    clientInitial: "Д",
    clientColor: "from-sky-500 to-blue-600",
    prompt: "Зроби landing під наш SaaS продукт, треба швидко.",
    reply:
      "Next.js 14 + Tailwind. Hero з particle-ефектом, секція pricing, анімований FAQ, CTA з градієнтом.",
    tokens: 734,
    ms: 1100,
  },
  {
    clientName: "Сергій",
    clientInitial: "С",
    clientColor: "from-emerald-500 to-teal-600",
    prompt: "Треба інтегрувати Stripe, наскільки складно?",
    reply:
      "Нічого складного. Checkout session, webhook для підтвердження, customer portal. TypeScript типи з stripe-js.",
    tokens: 519,
    ms: 870,
  },
  {
    clientName: "Аліна",
    clientInitial: "А",
    clientColor: "from-violet-500 to-purple-600",
    prompt: "Потрібне портфоліо з анімаціями та галереєю проєктів.",
    reply:
      "Зрозумів. Розкажи більше — який стиль, є референси? Під твій бренд зроблю архітектуру і стартуємо.",
    tokens: 681,
    ms: 1050,
  },
  {
    clientName: "Максим",
    clientInitial: "М",
    clientColor: "from-cyan-500 to-sky-600",
    prompt: "Можеш зробити сайт що виглядає як продукт з Силіконової долини?",
    reply:
      "Звісно. Скинь референси або опиши продукт — зрозумію напрямок і запропоную структуру під твою задачу.",
    tokens: 743,
    ms: 1180,
  },
];

function AIStreamWidget() {
  const [convIdx, setConvIdx] = useState(0);
  const [phase, setPhase] = useState<"typing-prompt" | "thinking" | "streaming" | "done">("typing-prompt");
  const [displayedPrompt, setDisplayedPrompt] = useState("");
  const [displayedReply, setDisplayedReply] = useState("");
  const [thinkDots, setThinkDots] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelRef = useRef(false);

  const conv = CONVERSATIONS[convIdx];

  const runConversation = useCallback((idx: number) => {
    cancelRef.current = false;
    const c = CONVERSATIONS[idx];
    setDisplayedPrompt("");
    setDisplayedReply("");
    setPhase("typing-prompt");

    let i = 0;
    const typePrompt = () => {
      if (cancelRef.current) return;
      if (i <= c.prompt.length) {
        setDisplayedPrompt(c.prompt.slice(0, i));
        i++;
        timerRef.current = setTimeout(typePrompt, 38);
      } else {
        setPhase("thinking");
        timerRef.current = setTimeout(() => {
          if (cancelRef.current) return;
          setPhase("streaming");
          let j = 0;
          const streamReply = () => {
            if (cancelRef.current) return;
            if (j <= c.reply.length) {
              setDisplayedReply(c.reply.slice(0, j));
              j++;
              timerRef.current = setTimeout(streamReply, 18);
            } else {
              setPhase("done");
              timerRef.current = setTimeout(() => {
                if (cancelRef.current) return;
                const next = (idx + 1) % CONVERSATIONS.length;
                setConvIdx(next);
                runConversation(next);
              }, 3000);
            }
          };
          streamReply();
        }, 900);
      }
    };
    typePrompt();
  }, []);

  useEffect(() => {
    runConversation(0);
    return () => {
      cancelRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [runConversation]);

  useEffect(() => {
    if (phase !== "thinking") return;
    const id = setInterval(() => setThinkDots((d) => (d + 1) % 4), 280);
    return () => clearInterval(id);
  }, [phase]);

  const handleNext = () => {
    cancelRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    setTimeout(() => {
      const next = (convIdx + 1) % CONVERSATIONS.length;
      setConvIdx(next);
      runConversation(next);
    }, 50);
  };

  return (
    <div className="relative w-full flex flex-col min-w-0" style={{ height: "100%" }}>
      {/* Header bar */}
      <div className="flex items-center justify-between mb-5 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex gap-1.5 flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
          </div>
          <span className="text-white/30 text-xs font-mono ml-1.5 truncate">client-chat</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-0.5">
            {CONVERSATIONS.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${i === convIdx ? "w-3 h-1.5 bg-violet-400" : "w-1.5 h-1.5 bg-white/15"}`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="w-6 h-6 rounded-md border border-white/8 bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center transition-colors flex-shrink-0"
          >
            <RotateCcw size={10} className="text-white/40" />
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-hidden">
        {/* Client message */}
        <div className="flex items-start gap-2.5 min-w-0">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${conv.clientColor} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg`}>
            <span className="text-white text-[11px] font-bold">{conv.clientInitial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white/35 text-[10px] font-medium">{conv.clientName}</span>
            </div>
            <div className="px-3 py-2.5 rounded-xl rounded-tl-sm bg-white/[0.06] border border-white/8 w-full">
              <p className="text-white/80 text-[13px] leading-relaxed break-words">
                {displayedPrompt}
                {phase === "typing-prompt" && (
                  <span className="inline-block w-0.5 h-3 bg-violet-400/70 ml-0.5 animate-pulse" />
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Igor's response */}
        {(phase === "thinking" || phase === "streaming" || phase === "done") && (
          <div className="flex items-start gap-2.5 flex-row-reverse min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-violet-500/20">
              <span className="text-white text-[11px] font-bold">І</span>
            </div>
            <div className="flex-1 min-w-0 flex flex-col items-end">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-violet-300/50 text-[10px] font-medium">Ігор</span>
              </div>
              {phase === "thinking" ? (
                <div className="px-3 py-2.5 rounded-xl rounded-tr-sm bg-violet-500/[0.08] border border-violet-500/15 inline-flex items-center gap-1.5">
                  <span className="text-white/35 text-xs font-mono">набираю</span>
                  <span className="text-violet-400/60 font-mono text-sm tracking-widest">
                    {"•".repeat(thinkDots + 1)}
                  </span>
                </div>
              ) : (
                <div className="px-3 py-2.5 rounded-xl rounded-tr-sm bg-violet-500/[0.10] border border-violet-500/20 w-full">
                  <p className="text-white/80 text-[13px] leading-relaxed break-words">
                    {displayedReply}
                    {phase === "streaming" && (
                      <span className="inline-block w-0.5 h-3 bg-violet-400 ml-0.5 animate-pulse" />
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stats bar */}
      {phase === "done" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-3 border-t border-white/6 flex items-center gap-3 flex-wrap"
        >
          <div className="flex items-center gap-1">
            <Activity size={10} className="text-green-400" />
            <span className="text-green-400/70 text-[10px] font-mono">{conv.ms}ms</span>
          </div>
          <div className="flex items-center gap-1">
            <Layers size={10} className="text-violet-400/60" />
            <span className="text-white/30 text-[10px] font-mono">{conv.tokens} tokens</span>
          </div>
          <div className="flex items-center gap-1">
            <GitBranch size={10} className="text-white/25" />
            <span className="text-white/30 text-[10px] font-mono">відповідь надіслана</span>
          </div>
        </motion.div>
      )}

      {/* Typing indicator */}
      {phase !== "done" && (
        <div className="mt-4 pt-3 border-t border-white/6 flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400/40 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400/40 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400/40 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-white/20 text-[10px] font-mono">
            {phase === "typing-prompt"
              ? `${conv.clientName} пише...`
              : phase === "thinking"
                ? "Ігор набирає відповідь..."
                : "відправляю..."}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── BACKGROUND & EFFECTS ─────────────────────────────────────────────────────

function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 10% 10%, rgba(132,56,255,0.28), transparent 55%),
            radial-gradient(ellipse 60% 40% at 85% 15%, rgba(58,191,255,0.18), transparent 50%),
            radial-gradient(ellipse 70% 50% at 50% 100%, rgba(88,80,255,0.20), transparent 55%),
            radial-gradient(ellipse 50% 40% at 90% 80%, rgba(23,170,255,0.14), transparent 45%),
            radial-gradient(ellipse 40% 40% at 20% 70%, rgba(120,74,255,0.16), transparent 50%),
            linear-gradient(135deg, #0d0717 0%, #090c18 40%, #08111a 100%)
          `,
        }}
      />
      <div className="absolute -top-32 left-[5%] h-96 w-96 rounded-full bg-violet-600/20 blur-[140px]" />
      <div className="absolute top-[15%] right-[8%] h-80 w-80 rounded-full bg-sky-500/15 blur-[120px]" />
      <div className="absolute top-[55%] left-[30%] h-96 w-96 rounded-full bg-indigo-500/12 blur-[160px]" />
      <div className="absolute bottom-[10%] right-[20%] h-80 w-80 rounded-full bg-cyan-400/10 blur-[130px]" />
      <div className="absolute bottom-0 left-[10%] h-72 w-72 rounded-full bg-violet-500/14 blur-[120px]" />
    </div>
  );
}

function CursorHalo() {
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let cx = tx, cy = ty;
    let frame = 0;
    const animate = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      if (haloRef.current) {
        haloRef.current.style.transform = `translate3d(${cx - 90}px,${cy - 90}px,0)`;
      }
      frame = requestAnimationFrame(animate);
    };
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (haloRef.current) haloRef.current.style.opacity = "0.18";
    };
    const onLeave = () => {
      if (haloRef.current) haloRef.current.style.opacity = "0";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    frame = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={haloRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 hidden md:block rounded-full opacity-0 blur-[80px] transition-opacity duration-700"
      style={{
        width: 180,
        height: 180,
        background:
          "radial-gradient(circle, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 35%, rgba(255,255,255,0.01) 60%, transparent 80%)",
      }}
    />
  );
}

// ─── ANIMATION HELPERS ────────────────────────────────────────────────────────

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

function Navbar({ hidden }: { hidden?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Про мене", href: "#about" },
    { label: "Роботи", href: "#work" },
    { label: "Навички", href: "#skills" },
    { label: "Контакти", href: "#contact" },
  ];

  const handleLink = () => setMobileOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-opacity duration-300 ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        style={{
          background: "rgba(9, 6, 20, 0.80)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 1px 40px rgba(0,0,0,0.4)",
        }}
      >
        <nav className="w-full px-5 sm:px-8 md:px-16 lg:px-24 h-14 sm:h-16 flex items-center justify-between md:justify-center">
        

          <ul className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-white/55 hover:text-white/90 transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Меню"
          >
            {mobileOpen ? <X size={16} className="text-white/70" /> : <Menu size={16} className="text-white/70" />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && !hidden && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed top-14 left-0 right-0 z-40 md:hidden"
            style={{
              background: "rgba(9, 6, 20, 0.95)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <ul className="flex flex-col px-5 py-3">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={handleLink}
                    className="block py-3 text-base text-white/70 hover:text-white/95 transition-colors border-b border-white/[0.05] last:border-0"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="hero" className="w-full px-5 sm:px-8 md:px-16 lg:px-24 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
      <div className="w-full max-w-[1600px] mx-auto">
        <div className="flex flex-col xl:flex-row gap-10 xl:gap-12 items-center xl:items-start">
          {/* Left — text */}
          <div className="flex-1 min-w-0 w-full">
            <FadeIn>
              <h1 className="text-[2.6rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white/90 tracking-tight mb-4 sm:mb-6 leading-[1.05]">
                <span className="text-white/90">Ігор</span>
                <br />
                <span className="text-violet-400">Паламарчук</span>
              </h1>
              <p className="text-white/50 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed max-w-lg">
                Збираю AI-логіку, інтерфейси та продакшн-рішення. Якщо є задача — розберусь і зроблю.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8 max-w-xs sm:max-w-sm">
                {[
                  { num: "3+", label: "Проєкти" },
                  { num: "1+", label: "Роки досвіду" },
                  { num: "AI", label: "Спеціалізація" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="px-2 sm:px-3 py-2.5 sm:py-3 rounded-xl border border-violet-500/20 bg-violet-500/5 backdrop-blur-sm"
                  >
                    <div className="text-lg sm:text-xl font-bold text-white/90 mb-0.5">{s.num}</div>
                    <div className="text-[10px] sm:text-[11px] text-violet-300/60 leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Feature list */}
              <div className="space-y-2.5 sm:space-y-3 mb-8 sm:mb-10">
                {[
                  { icon: <Rocket size={11} />, text: "Швидкий старт — перший результат за 24 години" },
                  { icon: <Sparkles size={11} />, text: "AI-інтеграції — GPT-5, Claude Code, Arena AI, кастомні моделі" },
                  { icon: <Terminal size={12} />, text: "Чистий код — React, JavaScript / TypeScript, сучасний стек" },
                ].map((f) => (
                  <div key={f.text} className="flex items-start sm:items-center gap-2.5 sm:gap-3 text-white/70">
                    <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                      <span className="text-violet-400">{f.icon}</span>
                    </div>
                    <span className="text-[13px] sm:text-sm leading-snug">{f.text}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <a
                  href="#work"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white/90 text-sm font-semibold transition-all duration-200 hover:shadow-xl hover:shadow-violet-500/25 inline-flex items-center gap-1.5"
                >
                  Дивитися роботи
                  <ChevronRight size={14} className="-mr-1" />
                </a>
                <a
                  href="#contact"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-white/10 text-white/80 hover:text-white/90 hover:border-white/20 text-sm font-semibold transition-all duration-200 hover:bg-white/5 inline-flex items-center gap-2"
                >
                  <Send size={14} />
                  Написати
                </a>
              </div>
            </FadeIn>

            {/* Mobile AI Widget */}
            <FadeIn delay={0.18} className="xl:hidden mt-8 sm:mt-10 w-full">
              <div
                className="relative rounded-2xl border border-violet-500/15 overflow-hidden shadow-2xl shadow-violet-900/15 p-5 sm:p-6 w-full"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(32px)",
                  WebkitBackdropFilter: "blur(32px)",
                  height: "380px",
                }}
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-500/[0.12] blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-cyan-500/[0.08] blur-3xl" />
                <AIStreamWidget />
              </div>
            </FadeIn>
          </div>

          {/* Right — Client Chat Widget (desktop only) */}
          <FadeIn delay={0.15} className="hidden xl:flex xl:flex-shrink-0">
            <div className="relative">
              <div
                className="relative rounded-2xl border border-violet-500/15 overflow-hidden shadow-2xl shadow-violet-900/15 p-8"
                style={{
                  width: "clamp(420px, 38vw, 660px)",
                  height: "clamp(400px, 45vw, 580px)",
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(32px)",
                  WebkitBackdropFilter: "blur(32px)",
                }}
              >
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/[0.12] blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-cyan-500/[0.08] blur-3xl" />
                <AIStreamWidget />
              </div>
              <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-violet-500/[0.07] blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-72 h-72 rounded-full bg-cyan-500/[0.05] blur-3xl pointer-events-none" />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

function About() {
  return (
    <section id="about" className="w-full py-12 sm:py-16 md:py-20 px-5 sm:px-8 md:px-16 lg:px-24">
      <div className="w-full max-w-[1600px] mx-auto">
        <FadeIn>
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <div className="w-px h-6 bg-violet-500" />
            <span className="text-violet-300 text-xs font-semibold uppercase tracking-[0.24em]">Про мене</span>
          </div>

          {/* Heading + body — full-width single column */}
          <h2 className="text-[1.9rem] sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white/90 tracking-tight mb-5 sm:mb-6 leading-[1.1]">
            Fullstack розробник · AI-Web розробник
          </h2>

          <div className="flex flex-col gap-3 mb-6 sm:mb-8">
            <p className="text-white/45 text-sm sm:text-base md:text-lg leading-relaxed">
              Я — розробник-універсал: пишу складні вебдодатки, системи автоматизації та telegram-ботів. Але головне
              — я працюю через промт-інженерію. Це моя суперсила: проектую промпти, автоматизую логіку, генерую код
              через AI і роблю це все дуже швидко.
            </p>
            <p className="text-white/45 text-sm sm:text-base md:text-lg leading-relaxed">
              Від ідеї до продакшену — і архітектура, і інтеграції, і деплой. Працюю з React, JavaScript / TypeScript, Node.js та
              будь-якими AI інструментами.
            </p>
          </div>

          {/* Info pills */}
          <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10">
            {[
              { label: "Вік", value: "19 років" },
              { label: "Напрямок", value: "AI Automation Developer" },
            ].map((item) => (
              <div key={item.label} className="px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur-sm flex items-center gap-3">
                <span className="text-[11px] sm:text-xs text-white/35 uppercase tracking-wider">{item.label}</span>
                <div className="w-px h-4 bg-white/10" />
                <span className="text-sm sm:text-base font-bold text-white/90">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
            {[
              { title: "Чіткий план", desc: "Перед стартом обговорюємо задачу, строки і очікування" },
              { title: "Консультація", desc: "Постійно в діалозі — розберу будь-яку задачу разом з тобою" },
              { title: "Відкритий", desc: "Беру будь-які проекти — від лендингу до AI-продукту" },
            ].map((item, idx) => (
              <FadeIn key={idx} delay={idx * 0.05}>
                <div className="px-4 sm:px-6 py-4 sm:py-5 rounded-xl border border-white/8 bg-white/[0.02] backdrop-blur-sm transition-all duration-300 h-full">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0" />
                    <h3 className="text-white/90 font-semibold text-sm sm:text-base">{item.title}</h3>
                  </div>
                  <p className="text-white/40 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {["React", "JavaScript / TypeScript", "Node.js", "Prompt Engineering", "Telegram Bots", "AI Tools"].map((t) => (
              <span
                key={t}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/8 bg-white/[0.02] text-white/70 text-xs sm:text-sm backdrop-blur-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── IMAGE LIGHTBOX ───────────────────────────────────────────────────────────

function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/92 backdrop-blur-md" />
        <motion.div
          key="lightbox-img"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative z-10 max-w-[95vw] max-h-[90vh]"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <img src={src} alt={alt} className="max-w-full max-h-[88vh] object-contain rounded-xl shadow-2xl" />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/80 border border-white/15 flex items-center justify-center transition-colors"
          >
            <X size={14} className="text-white/80" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── PROJECT MODAL ────────────────────────────────────────────────────────────

type Project = (typeof PROJECTS)[number];

function ProjectModal({
  project,
  onClose,
  onLightboxChange,
}: {
  project: Project;
  onClose: () => void;
  onLightboxChange: (open: boolean) => void;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const gallery = project.gallery ?? [];

  const openLightbox = (src: string) => { setLightboxSrc(src); onLightboxChange(true); };
  const closeLightbox = () => { setLightboxSrc(null); onLightboxChange(false); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !lightboxSrc) onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, lightboxSrc]);

  const prev = () => setImgIdx((i) => (i - 1 + gallery.length) % gallery.length);
  const next = () => setImgIdx((i) => (i + 1) % gallery.length);

  return (
    <>
      <AnimatePresence>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 md:p-8"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.97, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 30 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="relative z-10 w-full sm:max-w-2xl md:max-w-3xl rounded-t-2xl sm:rounded-2xl border border-violet-500/20 bg-[#0f0f16] shadow-2xl shadow-violet-900/30 overflow-hidden max-h-[92vh] overflow-y-auto"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center transition-colors"
            >
              <X size={14} className="text-white/70" />
            </button>

            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {gallery.length > 0 && (
              <div className="relative w-full h-40 sm:h-52 md:h-64 bg-black/40 overflow-hidden group/gallery">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={imgIdx}
                    src={gallery[imgIdx]}
                    alt={`${project.title} — фото ${imgIdx + 1}`}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={() => openLightbox(gallery[imgIdx])}
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f16]/60 via-transparent to-transparent pointer-events-none" />

                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prev(); }}
                      className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/65 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all"
                    >
                      <ChevronLeft size={16} className="text-white/80" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); next(); }}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/65 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all"
                    >
                      <ChevronRight size={16} className="text-white/80" />
                    </button>
                  </>
                )}

                {gallery.length > 1 && (
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                    {gallery.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                        className={`rounded-full transition-all duration-200 ${i === imgIdx ? "w-5 h-1.5 bg-violet-400" : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50"}`}
                      />
                    ))}
                  </div>
                )}

                {gallery.length > 1 && (
                  <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm border border-white/10">
                    <span className="text-white/60 text-[10px] font-mono">{imgIdx + 1} / {gallery.length}</span>
                  </div>
                )}
              </div>
            )}

            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded-md border text-[10px] font-semibold mb-1.5 ${project.tagColor}`}>
                    {project.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white/90">{project.title}</h3>
                </div>
                {project.details && (
                  <div className="text-right flex-shrink-0">
                    <div className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Рік</div>
                    <div className="text-white/70 font-semibold text-sm sm:text-base">{project.details.year}</div>
                  </div>
                )}
              </div>

              <p className="text-white/50 text-[13px] sm:text-sm leading-relaxed mb-4 sm:mb-5">
                {project.details?.longDesc ?? project.desc}
              </p>

              {project.details?.stack && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
                  {project.details.stack.map((t) => (
                    <span key={t} className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg border border-white/8 bg-white/[0.03] text-white/60 text-[11px] sm:text-xs font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {project.projectUrl && (
                <div className="pt-3 sm:pt-4 border-t border-white/6">
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/35 border border-violet-500/30 hover:border-violet-500/50 text-violet-300 hover:text-violet-200 text-xs font-semibold transition-all duration-200"
                  >
                    <ExternalLink size={13} />
                    Переглянути демо проєкт
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {lightboxSrc && (
        <ImageLightbox src={lightboxSrc} alt={project.title} onClose={closeLightbox} />
      )}
    </>
  );
}

// ─── WORK ─────────────────────────────────────────────────────────────────────

function Work({
  onModalChange,
  onLightboxChange,
}: {
  onModalChange: (open: boolean) => void;
  onLightboxChange: (open: boolean) => void;
}) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const openProject = (project: Project) => { setActiveProject(project); onModalChange(true); };
  const closeProject = () => { setActiveProject(null); onModalChange(false); };

  return (
    <section id="work" className="w-full py-12 sm:py-16 md:py-20 px-5 sm:px-8 md:px-16 lg:px-24">
      <div className="w-full max-w-[1600px] mx-auto">
        <FadeIn>
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <div className="w-px h-6 bg-violet-500" />
            <span className="text-violet-300 text-xs font-semibold uppercase tracking-[0.24em]">Вибрані роботи</span>
          </div>
          <h2 className="text-[1.9rem] sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white/90 tracking-tight mb-8 sm:mb-12 leading-[1.02] max-w-3xl">
            Мої роботи
          </h2>
        </FadeIn>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {PROJECTS.map((project, index) => (
            <FadeIn key={project.title} delay={index * 0.08}>
              <div
                className={`group relative rounded-2xl border ${project.border} bg-white/[0.035] hover:bg-white/[0.05] transition-all duration-300 overflow-hidden cursor-pointer backdrop-blur-sm active:scale-[0.98]`}
                onClick={() => openProject(project)}
              >
                <div className="relative h-44 sm:h-52 md:h-56 overflow-hidden">
                  <img src={`${import.meta.env.BASE_URL}${project.img}`} alt={project.title} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${project.color} via-transparent to-transparent`} />
                  <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3">
                    <span className={`px-2 py-0.5 sm:py-1 rounded-md border text-[10px] font-semibold ${project.tagColor}`}>
                      {project.tag}
                    </span>
                  </div>
                  <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center border border-white/15">
                      <ExternalLink size={12} className="text-white/90" />
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-white/90 font-semibold text-base sm:text-lg mb-1.5 sm:mb-2">{project.title}</h3>
                  <p className="text-white/42 text-xs sm:text-sm leading-relaxed line-clamp-3">{project.desc}</p>
                  <div className="mt-2.5 sm:mt-3 flex items-center gap-1 text-violet-400/60 group-hover:text-violet-400 transition-colors text-xs font-medium">
                    <span>Детальніше</span>
                    <ChevronRight size={12} />
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {activeProject && (
        <ProjectModal project={activeProject} onClose={closeProject} onLightboxChange={onLightboxChange} />
      )}
    </section>
  );
}

// ─── SKILLS ───────────────────────────────────────────────────────────────────

const SKILL_CATEGORIES = [
  {
    index: "01",
    title: "Frontend",
    accent: "violet",
    desc: "Сучасні інтерфейси з фокусом на UX та продуктивність",
    items: [
      { name: "React", note: "Hooks, Context, оптимізація" },
      { name: "Next.js", note: "App Router, SSR, SSG" },
      { name: "JavaScript / TypeScript", note: "Скрипти та строга типізація" },
      { name: "Tailwind CSS", note: "Utility-first стилі" },
      { name: "Vite", note: "Швидкий білд-тул" },
      { name: "Framer Motion", note: "Анімації та переходи" },
    ],
  },
  {
    index: "02",
    title: "Backend & DB",
    accent: "sky",
    desc: "Серверна логіка, бази даних та API інтеграції",
    items: [
      { name: "Node.js", note: "Runtime та сервери" },
      { name: "PostgreSQL", note: "Реляційна БД" },
      { name: "Prisma ORM", note: "Схема та міграції" },
      { name: "REST API", note: "Проектування ендпоінтів" },
      { name: "Webhooks", note: "Подієво-орієнтована логіка" },
      { name: "Edge Runtime", note: "Мінімальна затримка" },
    ],
  },
  {
    index: "03",
    title: "AI & Automation",
    accent: "fuchsia",
    desc: "Інтеграції з мовними моделями та автоматизація процесів",
    items: [
      { name: "GPT-5 / Claude Code", note: "Провідні LLM" },
      { name: "Arena AI", note: "Мультимодельна платформа" },
      { name: "LangChain", note: "Ланцюги та агенти" },
      { name: "Prompt Eng.", note: "Проектування промптів" },
      { name: "Replicate API", note: "Генерація зображень" },
      { name: "OpenAI SDK", note: "Повна інтеграція" },
    ],
  },
  {
    index: "04",
    title: "Tools & Deploy",
    accent: "cyan",
    desc: "Інструменти розробки та хмарний деплой",
    items: [
      { name: "Cursor IDE", note: "AI-асистований редактор" },
      { name: "Railway", note: "Деплой та хостинг" },
      { name: "Git / GitHub", note: "Контроль версій" },
      { name: "Cloudflare", note: "Workers та захист" },
      { name: "Figma", note: "UI/UX дизайн" },
      { name: "Docker", note: "Контейнеризація" },
    ],
  },
];

const accentMap: Record<string, {
  dot: string; label: string; border: string; glow: string;
  itemDot: string; note: string; indexColor: string; headerLine: string;
}> = {
  violet: {
    dot: "bg-violet-400", label: "text-violet-400/70", border: "border-violet-500/20",
    glow: "bg-violet-500/10", itemDot: "bg-violet-400/50", note: "text-violet-300/40",
    indexColor: "text-violet-400/50", headerLine: "bg-violet-500/40",
  },
  sky: {
    dot: "bg-sky-400", label: "text-sky-400/70", border: "border-sky-500/20",
    glow: "bg-sky-500/10", itemDot: "bg-sky-400/50", note: "text-sky-300/40",
    indexColor: "text-sky-400/50", headerLine: "bg-sky-500/40",
  },
  fuchsia: {
    dot: "bg-fuchsia-400", label: "text-fuchsia-400/70", border: "border-fuchsia-500/20",
    glow: "bg-fuchsia-500/10", itemDot: "bg-fuchsia-400/50", note: "text-fuchsia-300/40",
    indexColor: "text-fuchsia-400/50", headerLine: "bg-fuchsia-500/40",
  },
  cyan: {
    dot: "bg-cyan-400", label: "text-cyan-400/70", border: "border-cyan-500/20",
    glow: "bg-cyan-500/10", itemDot: "bg-cyan-400/50", note: "text-cyan-300/40",
    indexColor: "text-cyan-400/50", headerLine: "bg-cyan-500/40",
  },
};

const MARQUEE_ITEMS = [
  "React", "JavaScript / TypeScript", "Next.js", "Node.js", "PostgreSQL",
  "GPT-5", "Claude Code", "Arena AI", "LangChain", "Tailwind CSS", "Vite",
  "Railway", "Prompt Engineering", "Edge Runtime", "Framer Motion", "Docker",
];

function SkillsMarquee() {
  const track = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative overflow-hidden py-4 sm:py-5 border-y border-white/[0.06] mt-8 sm:mt-10">
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 z-10"
        style={{ background: "linear-gradient(to right, #0d0717, transparent)" }}
      />
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 z-10"
        style={{ background: "linear-gradient(to left, #0d0717, transparent)" }}
      />
      <div
        className="flex gap-6 sm:gap-10 w-max"
        style={{ animation: "marquee 28s linear infinite" }}
      >
        {track.map((item, i) => (
          <div key={i} className="flex items-center gap-6 sm:gap-10 flex-shrink-0">
            <span className="text-white/22 text-xs sm:text-sm font-medium tracking-widest uppercase whitespace-nowrap">
              {item}
            </span>
            <span className="w-1 h-1 rounded-full bg-violet-500/40 flex-shrink-0" />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function Skills() {
  return (
    <section id="skills" className="w-full pt-12 sm:pt-16 pb-6 sm:pb-8 px-5 sm:px-8 md:px-16 lg:px-24 relative">
      <div className="w-full max-w-[1600px] mx-auto relative">

        <FadeIn>
          <div className="flex items-end justify-between mb-8 sm:mb-10 gap-4 sm:gap-8 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-px h-6 bg-violet-500" />
                <span className="text-violet-300 text-xs font-semibold uppercase tracking-[0.24em]">Стек</span>
              </div>
              <h2 className="text-[1.9rem] sm:text-[2.4rem] md:text-[3.5rem] lg:text-[4.5rem] font-bold text-white/90 tracking-[-0.03em] leading-[0.95]">
                Мій стек
              </h2>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {SKILL_CATEGORIES.map((cat, ci) => {
            const ac = accentMap[cat.accent];
            return (
              <FadeIn key={cat.title} delay={ci * 0.06}>
                <div
                  className={`relative rounded-2xl border ${ac.border} overflow-hidden h-full`}
                  style={{
                    background: "rgba(255,255,255,0.045)",
                    backdropFilter: "blur(28px)",
                    WebkitBackdropFilter: "blur(28px)",
                  }}
                >
                  <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full ${ac.glow} blur-3xl pointer-events-none`} />
                  <div className={`absolute -bottom-10 -left-10 w-36 h-36 rounded-full ${ac.glow} blur-3xl pointer-events-none opacity-60`} />

                  <div className="relative p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-4 sm:mb-5">
                      <div className="flex-1">
                        <span className={`text-[10px] font-mono ${ac.indexColor} tracking-[0.2em] uppercase mb-1 sm:mb-1.5 block`}>
                          {cat.index}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white/90 tracking-tight mb-1 sm:mb-1.5">{cat.title}</h3>
                        <p className={`text-[10px] sm:text-[11px] ${ac.label} leading-snug max-w-[180px]`}>{cat.desc}</p>
                      </div>
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border ${ac.border} flex items-center justify-center flex-shrink-0 mt-0.5`}
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      >
                        <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${ac.dot} opacity-80`} />
                      </div>
                    </div>

                    <div className="w-full h-px mb-4 sm:mb-5" style={{ background: "rgba(255,255,255,0.07)" }} />

                    <div className="space-y-2.5 sm:space-y-3">
                      {cat.items.map((item) => (
                        <div key={item.name} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`w-1.5 h-1.5 rounded-full ${ac.itemDot} flex-shrink-0`} />
                            <span className="text-white/80 text-xs sm:text-sm font-medium truncate">{item.name}</span>
                          </div>
                          <span className={`text-[10px] sm:text-[11px] ${ac.note} whitespace-nowrap flex-shrink-0 hidden sm:block`}>
                            {item.note}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <SkillsMarquee />
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────

function Contact() {
  const contactMethods = [
    { icon: <Send size={15} />, label: "Telegram", username: "@bloodandquill", href: "https://t.me/bloodandquill" },
    { icon: <Mail size={15} />, label: "Email", username: "igorp5463@gmail.com", href: "mailto:igorp5463@gmail.com" },
  ];

  return (
    <section id="contact" className="w-full py-12 sm:py-16 md:py-20 px-5 sm:px-8 md:px-16 lg:px-24">
      <div className="w-full max-w-[1600px] mx-auto">
        <FadeIn>
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <div className="w-px h-6 bg-violet-500" />
            <span className="text-violet-300 text-xs font-semibold uppercase tracking-[0.24em]">Контакти</span>
          </div>
          <h2 className="text-[1.9rem] sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white/90 tracking-tight mb-3 sm:mb-5">
            Є проєкт?
          </h2>
          <p className="text-white/40 text-sm sm:text-base md:text-lg max-w-lg mb-4 leading-relaxed">
            Маєш ідею чи задачу? Пиши — обговоримо деталі та зроблю. Беру фріланс-проєкти, складні штуки та все, що
            пов'язано з кодом.
            <br />
            Відповідаю за 1–3 год · Open for freelance
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 sm:mb-12 max-w-lg">
          {contactMethods.map((method, index) => (
            <FadeIn key={method.label} delay={index * 0.04}>
              <a
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3.5 sm:py-4 rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-violet-500/30 active:scale-[0.98] transition-all duration-200 group backdrop-blur-sm"
              >
                <span className="text-violet-400 group-hover:text-violet-300 transition-colors flex-shrink-0">
                  {method.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-white/62 group-hover:text-white/90 text-sm transition-colors font-medium block">
                    {method.label}
                  </span>
                  <span className="text-white/35 text-xs truncate block">{method.username}</span>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const headerHidden = modalOpen || lightboxOpen;

  return (
    <div className="relative isolate text-white/90 font-sans antialiased w-full min-h-screen overflow-x-hidden">
      <SiteBackground />
      <CursorHalo />
      <Navbar hidden={headerHidden} />
      <main className="relative z-10 w-full">
        <Hero />
        <About />
        <Work onModalChange={setModalOpen} onLightboxChange={setLightboxOpen} />
        <Skills />
        <Contact />
      </main>
    </div>
  );
}
