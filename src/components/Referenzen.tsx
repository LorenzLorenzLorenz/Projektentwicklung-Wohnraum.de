import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  Layers, 
  Home as HomeIcon, 
  KeyRound, 
  ArrowRight, 
  Check, 
  Send, 
  Map as MapIcon, 
  PhoneCall, 
  MailOpen, 
  Calendar,
  MapPin,
  Sparkles,
  Zap,
  Sun,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Droplets,
  Car,
  Wifi,
  Award,
  TrendingUp,
  Building2,
  Sliders,
  CheckSquare,
  Lock,
  ChevronRight,
  Info
} from "lucide-react";
import ProjekteChronik from "./ProjekteChronik";

interface ReferenzenProps {
  onOpenDatenschutz?: () => void;
  onOpenImpressum?: () => void;
  onOpenUeberUns?: () => void;
}

export default function Referenzen({ onOpenDatenschutz, onOpenImpressum, onOpenUeberUns }: ReferenzenProps) {
  // Highlights active category tab state
  const [activeHighlightCategory, setActiveHighlightCategory] = useState<string>("lage");
  // Proposal 2 Bento Card quickview state
  const [expandedBentoCard, setExpandedBentoCard] = useState<string | null>(null);

  const highlightCategories = [
    { id: "lage", label: "Lage & Barrierefreiheit", icon: MapPin },
    { id: "design", label: "Design & Edle Materialien", icon: Sparkles },
    { id: "fenster", label: "Fenster & Lichtkomfort", icon: Sun },
    { id: "energie", label: "Energie & Haustechnik", icon: Zap },
    { id: "mobilitaet", label: "Mobilität & E-Autos", icon: Car },
    { id: "digital", label: "Digitales & Nebenräume", icon: Wifi },
  ];

  // Loader States
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);
  const [loaderOpacity, setLoaderOpacity] = useState(1);
  const [loaderProgress, setLoaderProgress] = useState(0);

  // GSAP readiness polling state
  const [isGsapReady, setIsGsapReady] = useState(() => {
    return typeof window !== "undefined" && !!(window as any).gsap && !!(window as any).ScrollTrigger;
  });

  // Form States
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("ankauf");
  const [message, setMessage] = useState("");

  // Refs for GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);
  const scrollDotRef = useRef<HTMLDivElement>(null);
  const philosophieHeadingRef = useRef<HTMLDivElement>(null);
  const philosophieTextRef = useRef<HTMLDivElement>(null);

  // Poll for GSAP availability if not ready on mount
  useEffect(() => {
    if (isGsapReady) return;

    const checkInterval = setInterval(() => {
      if (typeof window !== "undefined" && !!(window as any).gsap && !!(window as any).ScrollTrigger) {
        setIsGsapReady(true);
        clearInterval(checkInterval);
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, [isGsapReady]);

  // Loader sequence
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let fadeTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;
    let safetyTimeout: NodeJS.Timeout;
    let hasCompleted = false;

    // Simulate high-end progressive loader
    progressInterval = setInterval(() => {
      setLoaderProgress((prev) => {
        if (prev < 95) {
          const increment = Math.random() * 15;
          return Math.min(prev + increment, 95);
        }
        return prev;
      });
    }, 70);

    const completeLoader = () => {
      if (hasCompleted) return;
      hasCompleted = true;

      clearInterval(progressInterval);
      setLoaderProgress(100);
      
      fadeTimeout = setTimeout(() => {
        setLoaderOpacity(0);
        hideTimeout = setTimeout(() => {
          setIsLoaderVisible(false);
        }, 1000);
      }, 400);
    };

    // Attempt video load hook
    const video = videoRef.current;
    let handleCanPlay: (() => void) | undefined;

    if (video) {
      try {
        const playPromise = video.play();
        if (playPromise !== undefined && typeof playPromise.then === "function") {
          playPromise.then(() => {
            video.pause();
          }).catch((e) => {
            console.warn("Video decoder warmup auto-play prevented:", e);
          });
        } else {
          video.pause();
        }
      } catch (e) {
        console.warn("Video decoder warmup auto-play threw synchronous error:", e);
      }

      if (video.readyState >= 2) {
        completeLoader();
      } else {
        handleCanPlay = () => completeLoader();
        video.addEventListener("loadedmetadata", handleCanPlay);
        video.addEventListener("canplay", handleCanPlay);
      }
    } else {
      // Safety timeout for load if video element is not ready
      safetyTimeout = setTimeout(completeLoader, 1500);
    }

    return () => {
      clearInterval(progressInterval);
      clearTimeout(fadeTimeout);
      clearTimeout(hideTimeout);
      clearTimeout(safetyTimeout);
      if (video && handleCanPlay) {
        video.removeEventListener("loadedmetadata", handleCanPlay);
        video.removeEventListener("canplay", handleCanPlay);
      }
    };
  }, []);

  // GSAP animation binding
  useLayoutEffect(() => {
    if (!isGsapReady) return;

    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;

    if (!gsap || !ScrollTrigger) {
      console.warn("GSAP or ScrollTrigger not found globally.");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    let animationFrameId: number;

    const ctx = gsap.context(() => {
      // 1. Pulsing dot animation for the scroll down indicator
      gsap.to(scrollDotRef.current, {
        y: 35,
        opacity: 0,
        repeat: -1,
        duration: 1.6,
        ease: "power1.inOut"
      });

      // 2. Hero video scrub & overlays scroll trigger timeline
      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3600", // Distance to scroll
          pin: true,
          scrub: 1.2,    // High-end smooth scrub response
          invalidateOnRefresh: true,
          onUpdate: (self: any) => {
            if (self.progress > 0.9) {
              document.body.classList.add("bg-transition-active");
            } else {
              document.body.classList.remove("bg-transition-active");
            }
          }
        }
      });

      // Video scrubbing controller
      const video = videoRef.current;
      let videoController = { currentTime: 0 };
      let targetTime = 0;
      let currentTime = 0;

      scrollTimeline.to(videoController, {
        currentTime: 1,
        ease: "none",
        duration: 10
      }, 0);

      const smoothVideoScrub = () => {
        if (video && video.duration && !isNaN(video.duration)) {
          targetTime = videoController.currentTime * video.duration;
          
          if (targetTime < 0) targetTime = 0;
          if (targetTime > video.duration) targetTime = video.duration;

          const diff = targetTime - currentTime;
          
          if (Math.abs(diff) < 0.002) {
            currentTime = targetTime;
          } else {
            currentTime += diff * 0.15; // smooth interpolation step
          }
          
          if (!video.seeking) {
            const currentDiff = Math.abs(video.currentTime - currentTime);
            if (currentDiff > 0.01) {
              video.currentTime = currentTime;
            }
          }
        }
        animationFrameId = requestAnimationFrame(smoothVideoScrub);
      };

      animationFrameId = requestAnimationFrame(smoothVideoScrub);

      // Staged text overlays linked to physical travel
      // Stage 1: "Architektur erleben."
      scrollTimeline.fromTo(text1Ref.current, 
        { opacity: 0, y: 35 }, 
        { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }, 
        0.8
      );
      scrollTimeline.to(text1Ref.current, 
        { opacity: 0, y: -35, duration: 1.5, ease: "power2.in" }, 
        2.8
      );

      // Stage 2: "Räume neu denken."
      scrollTimeline.fromTo(text2Ref.current, 
        { opacity: 0, y: 35 }, 
        { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }, 
        4.2
      );
      scrollTimeline.to(text2Ref.current, 
        { opacity: 0, y: -35, duration: 1.5, ease: "power2.in" }, 
        6.2
      );

      // Stage 3: "Exklusive Lebensräume."
      scrollTimeline.fromTo(text3Ref.current, 
        { opacity: 0, y: 35 }, 
        { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }, 
        7.6
      );
      scrollTimeline.to(text3Ref.current, 
        { opacity: 0, y: -35, duration: 1.5, ease: "power2.in" }, 
        9.6
      );

      // Cinematic zoom into framed video
      scrollTimeline.fromTo(video, 
        { scale: 1 }, 
        { scale: 1.08, duration: 10, ease: "none" }, 
        0
      );

      // Hide scroll down indicator smoothly on initial descent
      gsap.to("#scroll-indicator-wrapper", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=250",
          scrub: true
        },
        opacity: 0,
        pointerEvents: "none"
      });
    }, containerRef); // scoped to containerRef

    // Clean up all timers, loops and scrolltriggers on unmount
    return () => {
      ctx.revert(); // Reverts all GSAP & ScrollTrigger side-effects cleanly
      
      // Force kill all remaining ScrollTrigger instances to avoid orphaned pin-spacers
      const ScrollTrigger = (window as any).ScrollTrigger;
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger: any) => {
          trigger.kill(true); // Reverts and destroys the scrolltrigger
        });
      }

      // Remove any residual inline style properties on global elements
      document.documentElement.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("height");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("height");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("top");

      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove("bg-transition-active");
    };
  }, [isGsapReady]);

  // Form Submit Handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <>
      {/* LUXURY LOADER */}
      {isLoaderVisible && (
        <div 
          id="loader" 
          className="fixed inset-0 bg-[#121212] z-50 flex flex-col items-center justify-center transition-opacity duration-1000"
          style={{ opacity: loaderOpacity }}
        >
          <div className="text-center space-y-6 px-6">
            <h1 className="font-serif text-3xl md:text-5xl tracking-[0.25em] text-[#fcfbfa] uppercase font-light leading-tight">
              Projektentwicklung<br />
              <span className="text-luxury-gold italic tracking-widest font-normal lowercase">Wohnraum</span>
            </h1>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-stone-400 loader-pulse">
              Fehlner &amp; Götz &bull; Ästhetik &bull; Substanz
            </p>
            
            {/* Elegant loader progress */}
            <div className="w-48 h-[1px] bg-stone-800 mx-auto relative overflow-hidden mt-8">
              <div 
                id="loader-progress" 
                className="absolute top-0 left-0 h-full bg-luxury-gold transition-all duration-300"
                style={{ width: `${loaderProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* HERO & SCROLL-VIDEO SECTION (CINEMATIC CAGE) */}
      <section 
        id="hero" 
        ref={containerRef}
        className="relative w-full h-[100vh] h-[100svh] overflow-hidden flex flex-col items-center justify-center bg-[#faf9f8]" 
      >
        {/* Cinematic framed video container */}
        <div className="relative z-10 w-[85vw] md:w-[70vw] max-w-5xl aspect-video rounded-md overflow-hidden cinematic-glow bg-transparent">
          <video
            id="scroll-video"
            ref={videoRef}
            src="/api/video"
            className="w-full h-full object-cover opacity-100 scale-100 transform origin-center"
            muted
            playsInline
            preload="auto"
          ></video>
        </div>

        {/* Synchronized Text Overlays */}
        <div id="text-overlays" className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          {/* Overlay 1: "Projektentwicklung Wohnraum" -> "Architektur erleben." */}
          <div id="text-1" ref={text1Ref} className="absolute text-center opacity-0 px-6 max-w-4xl transform translate-y-12">
            <p className="font-sans text-[0.65rem] sm:text-xs text-[#e07200] tracking-[0.3em] uppercase mb-4 font-semibold">Projektentwicklung Wohnraum</p>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-stone-900 font-light tracking-wide leading-tight">
              Architektur erleben.
            </h2>
          </div>

          {/* Overlay 2: "Perspektivenwechsel" -> "Räume neu denken." */}
          <div id="text-2" ref={text2Ref} className="absolute text-center opacity-0 px-6 max-w-4xl transform translate-y-12">
            <p className="font-sans text-[0.65rem] sm:text-xs text-[#e07200] tracking-[0.3em] uppercase mb-4 font-semibold">Perspektivenwechsel</p>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-stone-900 font-light tracking-wide leading-tight">
              Räume neu denken.
            </h2>
          </div>

          {/* Overlay 3: "Fehlner & Götz" -> "Exklusive Lebensräume." */}
          <div id="text-3" ref={text3Ref} className="absolute text-center opacity-0 px-6 max-w-4xl transform translate-y-12">
            <p className="font-sans text-[0.65rem] sm:text-xs text-[#e07200] tracking-[0.3em] uppercase mb-4 font-semibold">Fehlner &amp; Götz</p>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-stone-900 font-light tracking-wide leading-tight">
              Exklusive Lebensräume.
            </h2>
          </div>
        </div>

        {/* Animated Scroll-Down Indicator */}
        <div id="scroll-indicator-wrapper" className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center space-y-2 opacity-80">
          <span className="font-sans text-[0.6rem] tracking-[0.3em] uppercase text-stone-500">Scrollen</span>
          <div className="w-[1px] h-12 bg-stone-300 relative overflow-hidden">
            <div id="scroll-dot" ref={scrollDotRef} className="absolute top-0 left-0 w-full h-3 bg-[#ff8200]"></div>
          </div>
        </div>
      </section>

      {/* SECTION "PHILOSOPHIE" */}
      <motion.section 
        id="philosophie" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative py-28 md:py-40 px-6 md:px-12 bg-transparent text-luxury-charcoal border-b border-stone-200/40"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start relative z-10">
          {/* Left: Asymmetric Heading */}
          <motion.div 
            id="philosophie-heading" 
            ref={philosophieHeadingRef} 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100/90 border border-stone-200/70 text-[10px] md:text-[11px] font-mono uppercase tracking-widest text-[#ff8200] font-semibold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff8200] animate-pulse"></span>
              <span>Über Uns &amp; Vision</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-luxury-charcoal leading-tight font-light"
            >
              Das feine Gespür für <span className="italic font-normal text-luxury-gold-dark">zeitlosen Luxus</span> &amp; bleibende Substanz.
            </motion.h2>
          </motion.div>

          {/* Right: Detail copy */}
          <div 
            id="philosophie-text" 
            ref={philosophieTextRef} 
            className="lg:col-span-6 space-y-8 lg:mt-12 text-stone-600 font-sans text-base md:text-lg leading-relaxed font-light"
          >
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              Bei <strong>Projektentwicklung Wohnraum GmbH (Fehlner &amp; Götz)</strong> steht die perfekte Synthese aus visionärer, anspruchsvoller Architektur und langfristig wertstabiler Substanz im Fokus. Wir betrachten Grundstücke und Altbestände nicht als bloße Flächen, sondern als leere Leinwände für exklusive, charakterstarke Lebensräume.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 35, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="rounded-2xl bg-white/80 backdrop-blur-md p-6 sm:p-8 border-l-2 border-[#ff8200] border-y border-r border-stone-200/70 shadow-2xs italic font-serif text-stone-800 leading-relaxed text-base sm:text-lg"
            >
              "Wir realisieren nicht einfach nur Immobilien. Wir entwickeln außergewöhnliche Lebenswelten mit unverwechselbarer Identität, handwerklicher Präzision und kompromisslosem Qualitätsanspruch."
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              Jedes unserer Projekte zeichnet sich durch zeitlose Eleganz, modernste technische Standards und eine feinfühlige Einbettung in das jeweilige Stadtbild aus. Von der ersten Machbarkeitsanalyse über die Schaffung von Baurecht bis hin zur schlüsselfertigen Übergabe begleiten wir alle Meilensteine mit größter Professionalität und Diskretion.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* SECTION "LEISTUNGEN" */}
      <motion.section 
        id="leistungen" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative py-28 md:py-40 px-6 md:px-12 bg-transparent text-luxury-charcoal"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20 space-y-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100/90 border border-stone-200/70 text-[10px] md:text-[11px] font-mono uppercase tracking-widest text-[#ff8200] font-semibold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff8200] animate-pulse"></span>
              <span>Ganzheitlicher Prozess</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              className="font-serif text-3xl md:text-4xl lg:text-5xl text-luxury-charcoal font-light"
            >
              Unsere Kernkompetenzen
            </motion.h2>
          </motion.div>

          {/* 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            
            {/* Card 1: Grundstücksankauf */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0 }}
              className="leistung-card group relative rounded-[28px] bg-white/85 backdrop-blur-xl border border-stone-200/80 p-8 md:p-10 flex flex-col justify-between min-h-[400px] shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_50px_-10px_rgba(255,130,0,0.12)] hover:border-[#ff8200]/50 hover:-translate-y-1.5 transition-all duration-500"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="p-3.5 bg-stone-100/80 border border-stone-200/60 rounded-2xl group-hover:bg-[#ff8200]/10 group-hover:border-[#ff8200]/30 transition-all duration-500">
                    <Compass className="w-6 h-6 text-stone-700 group-hover:text-[#ff8200] transition-colors duration-500" />
                  </div>
                  <span className="font-serif text-5xl md:text-6xl text-stone-200/70 group-hover:text-[#ff8200]/30 transition-colors duration-500 font-light select-none">
                    01
                  </span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl text-luxury-charcoal mt-8 mb-4 font-normal">
                  Grundstücksankauf
                </h3>
                <p className="font-sans text-stone-500 text-sm leading-relaxed font-light">
                  Diskrete und zügige Prüfung Ihrer Liegenschaft. Wir kaufen unerschlossene Grundstücke, Bestandsimmobilien sowie Konversionsflächen in exzellenten innerstädtischen und naturnahen Lagen.
                </p>
              </div>
              <a href="#kontakt" className="flex items-center text-[0.7rem] tracking-[0.2em] uppercase font-sans text-stone-600 group-hover:text-[#ff8200] transition-colors duration-300 mt-8 font-medium">
                Angebot senden <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
              </a>
            </motion.div>

            {/* Card 2: Projektentwicklung */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
              className="leistung-card group relative rounded-[28px] bg-white/85 backdrop-blur-xl border border-stone-200/80 p-8 md:p-10 flex flex-col justify-between min-h-[400px] shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_50px_-10px_rgba(255,130,0,0.12)] hover:border-[#ff8200]/50 hover:-translate-y-1.5 transition-all duration-500"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="p-3.5 bg-stone-100/80 border border-stone-200/60 rounded-2xl group-hover:bg-[#ff8200]/10 group-hover:border-[#ff8200]/30 transition-all duration-500">
                    <Layers className="w-6 h-6 text-stone-700 group-hover:text-[#ff8200] transition-colors duration-500" />
                  </div>
                  <span className="font-serif text-5xl md:text-6xl text-stone-200/70 group-hover:text-[#ff8200]/30 transition-colors duration-500 font-light select-none">
                    02
                  </span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl text-luxury-charcoal mt-8 mb-4 font-normal">
                  Projektentwicklung
                </h3>
                <p className="font-sans text-stone-500 text-sm leading-relaxed font-light">
                  Von der Baurechtschaffung bis zum ausgereiften Architekturkonzept. Wir entwickeln architektonisch anspruchsvolle Wohnbauprojekte, die sich organisch und stilsicher in das Umfeld einfügen.
                </p>
              </div>
              <a href="#kontakt" className="flex items-center text-[0.7rem] tracking-[0.2em] uppercase font-sans text-stone-600 group-hover:text-[#ff8200] transition-colors duration-300 mt-8 font-medium">
                Details ansehen <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
              </a>
            </motion.div>

            {/* Card 3: Schlüsselfertiger Bau */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
              className="leistung-card group relative rounded-[28px] bg-white/85 backdrop-blur-xl border border-stone-200/80 p-8 md:p-10 flex flex-col justify-between min-h-[400px] shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_50px_-10px_rgba(255,130,0,0.12)] hover:border-[#ff8200]/50 hover:-translate-y-1.5 transition-all duration-500"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="p-3.5 bg-stone-100/80 border border-stone-200/60 rounded-2xl group-hover:bg-[#ff8200]/10 group-hover:border-[#ff8200]/30 transition-all duration-500">
                    <HomeIcon className="w-6 h-6 text-stone-700 group-hover:text-[#ff8200] transition-colors duration-500" />
                  </div>
                  <span className="font-serif text-5xl md:text-6xl text-stone-200/70 group-hover:text-[#ff8200]/30 transition-colors duration-500 font-light select-none">
                    03
                  </span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl text-luxury-charcoal mt-8 mb-4 font-normal">
                  Schlüsselfertiger Bau
                </h3>
                <p className="font-sans text-stone-500 text-sm leading-relaxed font-light">
                  Höchste handwerkliche Qualität und Bauleitung aus einer Hand. Mit vertrauensvollen Premium-Partnern koordinieren wir den Rohbau und den exklusiven Innenausbau verlässlich bis zum Einzug.
                </p>
              </div>
              <a href="#kontakt" className="flex items-center text-[0.7rem] tracking-[0.2em] uppercase font-sans text-stone-600 group-hover:text-[#ff8200] transition-colors duration-300 mt-8 font-medium">
                Bauqualität erleben <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
              </a>
            </motion.div>

            {/* Card 4: Vertrieb */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
              className="leistung-card group relative rounded-[28px] bg-white/85 backdrop-blur-xl border border-stone-200/80 p-8 md:p-10 flex flex-col justify-between min-h-[400px] shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_50px_-10px_rgba(255,130,0,0.12)] hover:border-[#ff8200]/50 hover:-translate-y-1.5 transition-all duration-500"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="p-3.5 bg-stone-100/80 border border-stone-200/60 rounded-2xl group-hover:bg-[#ff8200]/10 group-hover:border-[#ff8200]/30 transition-all duration-500">
                    <KeyRound className="w-6 h-6 text-stone-700 group-hover:text-[#ff8200] transition-colors duration-500" />
                  </div>
                  <span className="font-serif text-5xl md:text-6xl text-stone-200/70 group-hover:text-[#ff8200]/30 transition-colors duration-500 font-light select-none">
                    04
                  </span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl text-luxury-charcoal mt-8 mb-4 font-normal">
                  Premium Vertrieb
                </h3>
                <p className="font-sans text-stone-500 text-sm leading-relaxed font-light">
                  Diskrete, zielgerichtete Platzierung am Markt. Wir erstellen erstklassige Exposés, führen Einzelbesichtigungen durch und begleiten anspruchsvolle Käufer sowie Eigentümer bis zur Schlüsselübergabe.
                </p>
              </div>
              <a href="#kontakt" className="flex items-center text-[0.7rem] tracking-[0.2em] uppercase font-sans text-stone-600 group-hover:text-[#ff8200] transition-colors duration-300 mt-8 font-medium">
                Beratung anfordern <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
              </a>
            </motion.div>

          </div>
        </div>
      </motion.section>

      {/* SECTION "HIGHLIGHTS" */}
      <motion.section 
        id="highlights" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.08 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative py-28 md:py-36 px-6 md:px-12 bg-transparent text-luxury-charcoal border-t border-stone-200/50"
      >
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100/90 border border-stone-200/70 text-[10px] md:text-[11px] font-mono uppercase tracking-widest text-[#ff8200] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff8200] animate-pulse"></span>
              <span>Exklusive Ausstattungsmerkmale</span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl text-luxury-charcoal font-light leading-tight">
              Highlights &amp; Bauqualität <br />
              <span className="italic font-normal text-luxury-gold-dark">im Raum Ingolstadt</span>
            </h2>
            <p className="font-sans text-stone-600 text-sm md:text-base font-light leading-relaxed">
              Jedes Detail unserer Bauprojekte vereint höchste Ästhetik, zukunftssichere Effizienz und schwellenlosen Komfort.
            </p>
          </motion.div>

          {/* PROPOSAL 5: VISUAL FACT SHEET / KEY STATS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0 }}
              className="bg-white/85 backdrop-blur-xl border border-stone-200/80 p-6 rounded-[24px] space-y-2 shadow-2xs hover:border-[#ff8200]/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between text-stone-400">
                <MapPin className="w-5 h-5 text-[#ff8200]" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-stone-400">Komfort</span>
              </div>
              <div className="font-serif text-3xl md:text-4xl font-light text-stone-900">100%</div>
              <div className="font-sans text-xs text-stone-600 font-medium">Barrierefrei &amp; Schwellenlos</div>
              <p className="font-sans text-[11px] text-stone-400 font-light leading-tight pt-1">Balkone, EG-Terrassen, Haustür &amp; Aufzug bis DG</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
              className="bg-white/85 backdrop-blur-xl border border-stone-200/80 p-6 rounded-[24px] space-y-2 shadow-2xs hover:border-[#ff8200]/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between text-stone-400">
                <Sparkles className="w-5 h-5 text-[#ff8200]" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-stone-400">Raumgefühl</span>
              </div>
              <div className="font-serif text-3xl md:text-4xl font-light text-stone-900">210 cm</div>
              <div className="font-sans text-xs text-stone-600 font-medium">Lichte Türdurchgangshöhe</div>
              <p className="font-sans text-[11px] text-stone-400 font-light leading-tight pt-1">Erhabenes Wohngefühl in allen Wohnräumen</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
              className="bg-white/85 backdrop-blur-xl border border-stone-200/80 p-6 rounded-[24px] space-y-2 shadow-2xs hover:border-[#ff8200]/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between text-stone-400">
                <Wifi className="w-5 h-5 text-[#ff8200]" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-stone-400">Internet</span>
              </div>
              <div className="font-serif text-3xl md:text-4xl font-light text-stone-900">1.000</div>
              <div className="font-sans text-xs text-stone-600 font-medium">MBit/s Highspeed Glasfaser</div>
              <p className="font-sans text-[11px] text-stone-400 font-light leading-tight pt-1">Dualer Ausbau mit COMIN &amp; TELEKOM</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
              className="bg-white/85 backdrop-blur-xl border border-stone-200/80 p-6 rounded-[24px] space-y-2 shadow-2xs hover:border-[#ff8200]/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between text-stone-400">
                <Zap className="w-5 h-5 text-[#ff8200]" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-stone-400">Energie</span>
              </div>
              <div className="font-serif text-3xl md:text-4xl font-light text-stone-900">100%</div>
              <div className="font-sans text-xs text-stone-600 font-medium">Regenerative Energie</div>
              <p className="font-sans text-[11px] text-stone-400 font-light leading-tight pt-1">Luft-Wärmepumpe &amp; PV-Anlage + Stromspeicher</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
              className="col-span-2 md:col-span-1 bg-white/85 backdrop-blur-xl border border-stone-200/80 p-6 rounded-[24px] space-y-2 shadow-2xs hover:border-[#ff8200]/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between text-stone-400">
                <ShieldCheck className="w-5 h-5 text-[#ff8200]" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-stone-400">Standard</span>
              </div>
              <div className="font-serif text-3xl md:text-4xl font-light text-stone-900">0</div>
              <div className="font-sans text-xs text-stone-600 font-medium">Kompromisse</div>
              <p className="font-sans text-[11px] text-stone-400 font-light leading-tight pt-1">Keine Pellets, keine Duplex-Parker, kein WDVS</p>
            </motion.div>

          </div>

          {/* PROPOSAL 1: INTERACTIVE CATEGORY TABS & SPOTLIGHT DISPLAY */}
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.12 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 bg-white/85 backdrop-blur-xl border border-stone-200/80 p-6 md:p-10 rounded-[32px] shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)]"
          >
            
            {/* Category Selector Tabs with Smooth Sliding Indicator */}
            <div className="relative flex items-center gap-2 overflow-x-auto pb-4 border-b border-stone-200/60 scrollbar-none">
              {highlightCategories.map((cat) => {
                const isActive = activeHighlightCategory === cat.id;
                const IconComp = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveHighlightCategory(cat.id)}
                    className={`relative px-5 py-2.5 text-xs md:text-sm font-sans tracking-wide transition-colors whitespace-nowrap rounded-full flex items-center space-x-2 z-10 cursor-pointer ${
                      isActive
                        ? "text-white font-medium"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/70"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeHighlightTabIndicator"
                        className="absolute inset-0 bg-luxury-charcoal rounded-full shadow-sm -z-10"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    )}
                    <IconComp className={`w-4 h-4 transition-colors ${isActive ? "text-[#ff8200]" : "text-stone-400"}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Spotlight & Details Panel with Smooth Fade */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHighlightCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {activeHighlightCategory === "lage" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-5 bg-stone-50 border border-stone-200/80 p-8 rounded-sm space-y-6">
                      <div className="p-3 bg-[#ff8200]/10 w-fit rounded-sm text-[#ff8200]">
                        <MapPin className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <span className="font-mono text-xs uppercase tracking-widest text-[#ff8200] font-bold">Kategorie 01</span>
                        <h3 className="font-serif text-2xl md:text-3xl font-light text-stone-900">Begehrte Top-Lage &amp; Barrierefreiheit</h3>
                      </div>
                      <p className="font-sans text-sm text-stone-600 font-light leading-relaxed">
                        Der Raum Ingolstadt besticht durch herausragende Ruhe, beste Infrastruktur und direkte Anbindung an Arbeitgeber, Natur &amp; Innenstadt.
                      </p>
                      <div className="p-4 bg-white border border-stone-200/70 rounded-sm font-mono text-xs text-stone-700 flex items-center justify-between">
                        <span>Erreichte Zugänglichkeit:</span>
                        <span className="font-bold text-[#ff8200]">100% Schwellenlos</span>
                      </div>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Traumhafte Wohnlage</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Sehr ruhige Lage mit minimalem Durchgangsverkehr im Raum Ingolstadt.
                        </p>
                      </div>

                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Sämtliche Wege kurz</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Schnelle Erreichbarkeit aller großen Arbeitgeber, Einkaufsgelegenheiten &amp; Altstadt.
                        </p>
                      </div>

                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">100% Barrierefrei</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Komplett schwellenloser Zugang zu Balkonen, EG-Terrassen, WCs &amp; Haupteingang.
                        </p>
                      </div>

                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Aufzug von TG bis DG</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Komfortabler Personenaufzug verbindet die Tiefgarage direkt mit allen Wohnebenen (Penthouse mit Direktzugang).
                        </p>
                      </div>

                      <div className="md:col-span-2 p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Großzügige 210 cm Raumtüren</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Spürbar erhabenes Raumgefühl durch erhöhte Türdurchgangsmaße in allen Wohnungsräumen.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeHighlightCategory === "design" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-5 bg-stone-50 border border-stone-200/80 p-8 rounded-sm space-y-6">
                      <div className="p-3 bg-[#ff8200]/10 w-fit rounded-sm text-[#ff8200]">
                        <Sparkles className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <span className="font-mono text-xs uppercase tracking-widest text-[#ff8200] font-bold">Kategorie 02</span>
                        <h3 className="font-serif text-2xl md:text-3xl font-light text-stone-900">Edle Materialien &amp; Italienisches Design</h3>
                      </div>
                      <p className="font-sans text-sm text-stone-600 font-light leading-relaxed">
                        Zeitlose Eleganz durch echte Natursteine, Manufaktur-Armaturen und behagliches Echtholz.
                      </p>
                      <div className="p-4 bg-white border border-stone-200/70 rounded-sm font-mono text-xs text-stone-700 flex items-center justify-between">
                        <span>Design-Partner:</span>
                        <span className="font-bold text-[#ff8200]">GESSI &bull; GIRA &bull; Q-railing</span>
                      </div>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">JURA Marmor &amp; Echtholz</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Langlebiger Natursteinboden im Treppenhaus &amp; edles Echtholz-Parkett in allen Wohnräumen.
                        </p>
                      </div>

                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Italienische GESSI Armaturen</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Bäder mit befliester Walk-In-Regendusche und Unterputz-Armaturen der Design-Manufaktur GESSI.
                        </p>
                      </div>

                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Blickdichtes Glasgeländer</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Ganzglasgeländer von Q-railing in blickdichtem Parsolgrau für maximale Privatsphäre.
                        </p>
                      </div>

                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">GIRA E2 Schalter &amp; LED</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Exklusives GIRA E2 Schalterprogramm sowie integrierte Deckenstrahler in allen Räumen.
                        </p>
                      </div>

                      <div className="md:col-span-2 p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Mineralische Silikat-Innenfarbe</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Wohngesunde mineralische Wandfarbe für natürliches Raumklima (Keine synthetische Dispersionsfarbe).
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeHighlightCategory === "fenster" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-5 bg-stone-50 border border-stone-200/80 p-8 rounded-sm space-y-6">
                      <div className="p-3 bg-[#ff8200]/10 w-fit rounded-sm text-[#ff8200]">
                        <Sun className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <span className="font-mono text-xs uppercase tracking-widest text-[#ff8200] font-bold">Kategorie 03</span>
                        <h3 className="font-serif text-2xl md:text-3xl font-light text-stone-900">Lichtdurchflutet &amp; Sichtgeschützt</h3>
                      </div>
                      <p className="font-sans text-sm text-stone-600 font-light leading-relaxed">
                        Maximale Sonneneinstrahlung bei optimaler Beschattungssteuerung und langlebigen Acryl-Oberflächen.
                      </p>
                      <div className="p-4 bg-white border border-stone-200/70 rounded-sm font-mono text-xs text-stone-700 flex items-center justify-between">
                        <span>Fenstersystem:</span>
                        <span className="font-bold text-[#ff8200]">Elektr. Raffstores &bull; Hebe-Schiebetür</span>
                      </div>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Elektrische Raffstores</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Alle Fenster mit programmierbaren elektrischen Raffstores für flexible Lichtlenkung &amp; Sonnenschutz.
                        </p>
                      </div>

                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Hebe-Schiebetür im Wohnbereich</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Leichtgängige Hebe-Schiebetüren in allen Wohnungen für nahtlosen Übergang zu Terrasse/Balkon.
                        </p>
                      </div>

                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Kratzfeste Acryl-Oberfläche</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Fensterrahmen mit robuster Acryl-Beschichtung für dauerhaft neuwertige Optik und Witterungsschutz.
                        </p>
                      </div>

                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Unsichtbare Lüftungshauben</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Lüftungsauslässe dezent im Raffstorekasten verborgen – keine störenden Abdeckhauben an der Fassade.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeHighlightCategory === "energie" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-5 bg-stone-50 border border-stone-200/80 p-8 rounded-sm space-y-6">
                      <div className="p-3 bg-[#ff8200]/10 w-fit rounded-sm text-[#ff8200]">
                        <Zap className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <span className="font-mono text-xs uppercase tracking-widest text-[#ff8200] font-bold">Kategorie 04</span>
                        <h3 className="font-serif text-2xl md:text-3xl font-light text-stone-900">Nachhaltig &amp; Unabhängig</h3>
                      </div>
                      <p className="font-sans text-sm text-stone-600 font-light leading-relaxed">
                        Geringste Nebenkosten durch die perfekte Kombination aus Wärmepumpe, eigener Photovoltaik &amp; Akkuspeicher.
                      </p>
                      <div className="p-4 bg-white border border-stone-200/70 rounded-sm font-mono text-xs text-stone-700 flex items-center justify-between">
                        <span>Energieklasse:</span>
                        <span className="font-bold text-[#ff8200]">Effizienzhaus EH40 QNG+</span>
                      </div>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Luft-Wärmepumpe &amp; PV</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Moderne Wärmepumpentechnik kombiniert mit hauseigener Photovoltaik und Akkuspeicher.
                        </p>
                      </div>

                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Fußbodenheizung &amp; Lüftung</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Gleichmäßige Wärme in allen Räumen sowie dezentrale Wohnraumlüftung mit Wärmerückgewinnung.
                        </p>
                      </div>

                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Wasserenthärtungsanlage</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Zentrale Entkalkungsanlage im Untergeschoss schont Armaturen, Geräte und Haut.
                        </p>
                      </div>

                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Minimale Betriebskosten</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Dauerhaft niedrige Nebenkosten sichern den Werterhalt für Eigennutzer &amp; Kapitalanleger.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeHighlightCategory === "mobilitaet" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-5 bg-stone-50 border border-stone-200/80 p-8 rounded-sm space-y-6">
                      <div className="p-3 bg-[#ff8200]/10 w-fit rounded-sm text-[#ff8200]">
                        <Car className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <span className="font-mono text-xs uppercase tracking-widest text-[#ff8200] font-bold">Kategorie 05</span>
                        <h3 className="font-serif text-2xl md:text-3xl font-light text-stone-900">Zukunftssichere E-Mobilität</h3>
                      </div>
                      <p className="font-sans text-sm text-stone-600 font-light leading-relaxed">
                        Jeder Tiefgaragen-Stellplatz ist bereits für die Installation von E-Wallboxen vorbereitet und abgesichert.
                      </p>
                      <div className="p-4 bg-white border border-stone-200/70 rounded-sm font-mono text-xs text-stone-700 flex items-center justify-between">
                        <span>Ladeinfrastruktur:</span>
                        <span className="font-bold text-[#ff8200]">Dynamisches Lastmanagement</span>
                      </div>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Wallbox Starkstrom-Vorbereitung</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Starkstromkabel bereits bis zu jedem einzelnen Tiefgaragenstellplatz verlegt.
                        </p>
                      </div>

                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Dynamisches Lastmanagement</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Intelligente Ladestromverteilung verhindert Überlastungen und optimiert Eigenstromnutzung.
                        </p>
                      </div>

                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Bequeme Einzelstellplätze</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Komfortable ebenerdige Tiefgaragenplätze ohne enge oder störanfällige Duplex-Mechanismen.
                        </p>
                      </div>

                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Fahrrad &amp; Müll-Einhausung</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Überdachte Fahrradstellplätze sowie gepflegte Einhausungen für Briefkästen &amp; Abfall.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeHighlightCategory === "digital" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-5 bg-stone-50 border border-stone-200/80 p-8 rounded-sm space-y-6">
                      <div className="p-3 bg-[#ff8200]/10 w-fit rounded-sm text-[#ff8200]">
                        <Wifi className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <span className="font-mono text-xs uppercase tracking-widest text-[#ff8200] font-bold">Kategorie 06</span>
                        <h3 className="font-serif text-2xl md:text-3xl font-light text-stone-900">Connectivity &amp; Gemauerte Keller</h3>
                      </div>
                      <p className="font-sans text-sm text-stone-600 font-light leading-relaxed">
                        Highspeed-Internet für Home-Office und massiv gemauerte Keller für maximale Lagersicherheit.
                      </p>
                      <div className="p-4 bg-white border border-stone-200/70 rounded-sm font-mono text-xs text-stone-700 flex items-center justify-between">
                        <span>Internetspeed:</span>
                        <span className="font-bold text-[#ff8200]">Bis zu 1.000 MBit/s</span>
                      </div>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Highspeed COMIN [1.000 MBit/s]</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Regionaler Glasfaseranschluss COMIN mit extrem schnellen 1.000 MBit/s Datenraten.
                        </p>
                      </div>

                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">TELEKOM [250 MBit/s]</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Zusätzlicher Telekom Anschluss als Ausfallsicherheit und freie Anbieterwahl.
                        </p>
                      </div>

                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Echte gemauerte Keller</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Eigene feste Kellerabteile mit Massivwänden statt billiger Holz- oder Lattenroste.
                        </p>
                      </div>

                      <div className="p-5 bg-stone-50/60 border border-stone-200/60 rounded-sm space-y-2">
                        <div className="flex items-center space-x-2 text-[#ff8200]">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-serif text-lg text-stone-900 font-medium">Separater Waschraum</h4>
                        </div>
                        <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
                          Großzügiger Gemeinschaftswaschraum mit Nebeneinander-Aufstellung von Geräten.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

          </motion.div>

          {/* PROPOSAL 2: BENTO GRID & MARKEN-SHOWCASE (VISUELLE HIGHLIGHT-KARTEN) */}
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/85 backdrop-blur-xl border border-stone-200/80 rounded-[32px] p-8 md:p-12 space-y-8 shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)]"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/60 pb-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200/70 text-[10px] md:text-[11px] font-mono uppercase tracking-widest text-[#ff8200] font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff8200]" />
                  <span>Exklusive Ausstattungs-Details</span>
                </div>
                <h3 className="font-serif text-2xl md:text-4xl font-light text-stone-900">
                  Markenqualität &amp; Architektur
                </h3>
                <p className="font-sans text-stone-600 text-sm font-light leading-relaxed">
                  Ausgewählte Markenpartner und erstklassige Materialien garantieren Wertbeständigkeit für Generationen.
                </p>
              </div>
              <div className="font-mono text-xs text-stone-600 flex items-center space-x-2 bg-stone-50 border border-stone-200/80 px-4 py-2 rounded-full shrink-0">
                <span>Interaktiver Detail-Quickview</span>
                <Sliders className="w-3.5 h-3.5 text-[#ff8200]" />
              </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1: JURA Marmor & Parkett */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0 }}
                className="bg-stone-50/70 hover:bg-white border border-stone-200/80 rounded-[24px] p-6 space-y-4 hover:border-[#ff8200]/50 hover:shadow-lg transition-all duration-400 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#ff8200] bg-[#ff8200]/10 px-3 py-1 rounded-full font-semibold">
                      JURA MARMOR &bull; MARKEN-STANDARD
                    </span>
                    <Sparkles className="w-4 h-4 text-stone-400" />
                  </div>
                  <h4 className="font-serif text-xl text-stone-900 font-normal">Naturstein &amp; Echtholz-Parkett</h4>
                  <p className="font-sans text-xs text-stone-600 font-light leading-relaxed">
                    Echter Jura-Marmor im Treppenhaus und edles Landhausdielen-Parkett in allen Wohnräumen für zeitlose Eleganz.
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-200/60">
                  <button
                    onClick={() => setExpandedBentoCard(expandedBentoCard === "marmor" ? null : "marmor")}
                    className="w-full text-left font-sans text-xs text-stone-700 hover:text-[#ff8200] flex items-center justify-between font-medium transition-colors cursor-pointer"
                  >
                    <span>{expandedBentoCard === "marmor" ? "Spezifikationen verbergen" : "Spezifikationen anzeigen"}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${expandedBentoCard === "marmor" ? "rotate-90 text-[#ff8200]" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expandedBentoCard === "marmor" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 text-[11px] font-sans text-stone-500 space-y-1.5 border-t border-stone-200/40 mt-2">
                          <p>&bull; Trittschalldämmung unter Parkett</p>
                          <p>&bull; Pflegeleichte Versiegelung</p>
                          <p>&bull; Optimal für Fußbodenheizung geeignet</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Card 2: GESSI Armaturen */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                className="bg-stone-50/70 hover:bg-white border border-stone-200/80 rounded-[24px] p-6 space-y-4 hover:border-[#ff8200]/50 hover:shadow-lg transition-all duration-400 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#ff8200] bg-[#ff8200]/10 px-3 py-1 rounded-full font-semibold">
                      GESSI MANUFAKTUR &bull; ITALIEN
                    </span>
                    <Droplets className="w-4 h-4 text-stone-400" />
                  </div>
                  <h4 className="font-serif text-xl text-stone-900 font-normal">GESSI Design-Armaturen</h4>
                  <p className="font-sans text-xs text-stone-600 font-light leading-relaxed">
                    Italienische Manufaktur-Unterputzarmaturen und befliesbare Walk-In Regenduschen für Spa-Atmosphäre.
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-200/60">
                  <button
                    onClick={() => setExpandedBentoCard(expandedBentoCard === "gessi" ? null : "gessi")}
                    className="w-full text-left font-sans text-xs text-stone-700 hover:text-[#ff8200] flex items-center justify-between font-medium transition-colors cursor-pointer"
                  >
                    <span>{expandedBentoCard === "gessi" ? "Spezifikationen verbergen" : "Spezifikationen anzeigen"}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${expandedBentoCard === "gessi" ? "rotate-90 text-[#ff8200]" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expandedBentoCard === "gessi" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 text-[11px] font-sans text-stone-500 space-y-1.5 border-t border-stone-200/40 mt-2">
                          <p>&bull; Unterputz-Mischsysteme</p>
                          <p>&bull; Bodengleiche Duschzonen</p>
                          <p>&bull; Hochwertige Chrom- &amp; Matt-Veredelungen</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Card 3: Q-railing Glasgeländer */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
                className="bg-stone-50/70 hover:bg-white border border-stone-200/80 rounded-[24px] p-6 space-y-4 hover:border-[#ff8200]/50 hover:shadow-lg transition-all duration-400 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#ff8200] bg-[#ff8200]/10 px-3 py-1 rounded-full font-semibold">
                      Q-RAILING &bull; PARSOLGRAU
                    </span>
                    <ShieldCheck className="w-4 h-4 text-stone-400" />
                  </div>
                  <h4 className="font-serif text-xl text-stone-900 font-normal">Blickdichtes Glasgeländer</h4>
                  <p className="font-sans text-xs text-stone-600 font-light leading-relaxed">
                    Ganzglasgeländer von Q-railing in elegant getöntem Parsolgrau – uneingeschränkter Schutz vor fremden Blicken.
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-200/60">
                  <button
                    onClick={() => setExpandedBentoCard(expandedBentoCard === "qrailing" ? null : "qrailing")}
                    className="w-full text-left font-sans text-xs text-stone-700 hover:text-[#ff8200] flex items-center justify-between font-medium transition-colors cursor-pointer"
                  >
                    <span>{expandedBentoCard === "qrailing" ? "Spezifikationen verbergen" : "Spezifikationen anzeigen"}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${expandedBentoCard === "qrailing" ? "rotate-90 text-[#ff8200]" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expandedBentoCard === "qrailing" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 text-[11px] font-sans text-stone-500 space-y-1.5 border-t border-stone-200/40 mt-2">
                          <p>&bull; Parsolgraues VSG-Sicherheitsglas</p>
                          <p>&bull; Zertifizierte Wind- &amp; Anprallsicherheit</p>
                          <p>&bull; Integrierte Tropfkanten-Entwässerung</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Card 4: GIRA E2 Schalter */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
                className="bg-stone-50/70 hover:bg-white border border-stone-200/80 rounded-[24px] p-6 space-y-4 hover:border-[#ff8200]/50 hover:shadow-lg transition-all duration-400 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#ff8200] bg-[#ff8200]/10 px-3 py-1 rounded-full font-semibold">
                      GIRA E2 &bull; ELEKTRO-STANDARD
                    </span>
                    <Zap className="w-4 h-4 text-stone-400" />
                  </div>
                  <h4 className="font-serif text-xl text-stone-900 font-normal">GIRA E2 Schalter &amp; Spotlights</h4>
                  <p className="font-sans text-xs text-stone-600 font-light leading-relaxed">
                    Premierte GIRA E2 Schalterserie gepaart mit warmen LED-Einbaustrahlern in Fluren und Badezimmern.
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-200/60">
                  <button
                    onClick={() => setExpandedBentoCard(expandedBentoCard === "gira" ? null : "gira")}
                    className="w-full text-left font-sans text-xs text-stone-700 hover:text-[#ff8200] flex items-center justify-between font-medium transition-colors cursor-pointer"
                  >
                    <span>{expandedBentoCard === "gira" ? "Spezifikationen verbergen" : "Spezifikationen anzeigen"}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${expandedBentoCard === "gira" ? "rotate-90 text-[#ff8200]" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expandedBentoCard === "gira" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 text-[11px] font-sans text-stone-500 space-y-1.5 border-t border-stone-200/40 mt-2">
                          <p>&bull; Bruchfestes, UV-beständiges Thermoplast</p>
                          <p>&bull; Integrierte Deckenstrahler inklusive</p>
                          <p>&bull; Vorbereitet für Smart-Home Erweiterung</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Card 5: Luft-Wärmepumpe & PV */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
                className="bg-stone-50/70 hover:bg-white border border-stone-200/80 rounded-[24px] p-6 space-y-4 hover:border-[#ff8200]/50 hover:shadow-lg transition-all duration-400 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#ff8200] bg-[#ff8200]/10 px-3 py-1 rounded-full font-semibold">
                      EFFIZIENZHAUS 40 &bull; AUTARK
                    </span>
                    <Sun className="w-4 h-4 text-stone-400" />
                  </div>
                  <h4 className="font-serif text-xl text-stone-900 font-normal">Wärmepumpe, PV &amp; Speicher</h4>
                  <p className="font-sans text-xs text-stone-600 font-light leading-relaxed">
                    Maximale Unabhängigkeit von fossilen Brennstoffen dank hauseigener Photovoltaikanlage und Akkuspeicher.
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-200/60">
                  <button
                    onClick={() => setExpandedBentoCard(expandedBentoCard === "energie" ? null : "energie")}
                    className="w-full text-left font-sans text-xs text-stone-700 hover:text-[#ff8200] flex items-center justify-between font-medium transition-colors cursor-pointer"
                  >
                    <span>{expandedBentoCard === "energie" ? "Spezifikationen verbergen" : "Spezifikationen anzeigen"}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${expandedBentoCard === "energie" ? "rotate-90 text-[#ff8200]" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expandedBentoCard === "energie" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 text-[11px] font-sans text-stone-500 space-y-1.5 border-t border-stone-200/40 mt-2">
                          <p>&bull; EH40 QNG+ KfW-förderfähig</p>
                          <p>&bull; Stromspeicher zur Eigenverbrauchsoptimierung</p>
                          <p>&bull; Sanfte Fußbodenheizung in allen Räumen</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Card 6: Starkstrom E-Mobilität */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                className="bg-stone-50/70 hover:bg-white border border-stone-200/80 rounded-[24px] p-6 space-y-4 hover:border-[#ff8200]/50 hover:shadow-lg transition-all duration-400 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#ff8200] bg-[#ff8200]/10 px-3 py-1 rounded-full font-semibold">
                      STARKSTROM &bull; LASTMANAGEMENT
                    </span>
                    <Car className="w-4 h-4 text-stone-400" />
                  </div>
                  <h4 className="font-serif text-xl text-stone-900 font-normal">Wallbox-Infrastruktur</h4>
                  <p className="font-sans text-xs text-stone-600 font-light leading-relaxed">
                    Starkstromkabel an jedem Einzelstellplatz verlegt + dynamisches Lastmanagement für sicheres E-Laden.
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-200/60">
                  <button
                    onClick={() => setExpandedBentoCard(expandedBentoCard === "emobility" ? null : "emobility")}
                    className="w-full text-left font-sans text-xs text-stone-700 hover:text-[#ff8200] flex items-center justify-between font-medium transition-colors cursor-pointer"
                  >
                    <span>{expandedBentoCard === "emobility" ? "Spezifikationen verbergen" : "Spezifikationen anzeigen"}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${expandedBentoCard === "emobility" ? "rotate-90 text-[#ff8200]" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expandedBentoCard === "emobility" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 text-[11px] font-sans text-stone-500 space-y-1.5 border-t border-stone-200/40 mt-2">
                          <p>&bull; 100% Vorbereitung an jedem Stellplatz</p>
                          <p>&bull; Keine störungsanfälligen Duplex-Wippen</p>
                          <p>&bull; Schutz vor Netzüberlastungen</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </motion.section>

      {/* SECTION "PROJEKTE-CHRONIK & GEBAUTE REALITÄT" */}
      <ProjekteChronik />

      {/* SECTION "FÖRDERUNG" */}
      <motion.section 
        id="foerderung" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative py-28 md:py-36 px-6 md:px-12 bg-transparent text-luxury-charcoal border-t border-stone-200/50"
      >
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200/60 pb-8"
          >
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100/90 border border-stone-200/70 text-[10px] md:text-[11px] font-mono uppercase tracking-widest text-[#ff8200] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff8200] animate-pulse"></span>
                <span>Staatliche Vorteile &bull; KfW &amp; AfA</span>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl font-light text-stone-900 leading-tight">
                Förderung &amp; AfA-Steuervorteile
              </h2>
              <p className="font-sans text-stone-600 text-sm md:text-base font-light leading-relaxed">
                Profitieren Sie von historischen Abschreibungssätzen und staatlichen Zinsverbilligungen für nachhaltigen Neubau im Effizienzhaus 40 QNG+ Standard.
              </p>
            </div>
            <div className="font-mono text-xs text-stone-500 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-stone-200/80 self-start md:self-auto shadow-2xs">
              Rechtsstand: 25. August 2024
            </div>
          </motion.div>

          {/* Grid of funding rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Rule 1: Degressive AfA */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0 }}
              className="p-6 md:p-8 bg-white/85 backdrop-blur-xl border border-stone-200/80 rounded-[28px] space-y-3 relative overflow-hidden shadow-2xs hover:shadow-lg hover:border-[#ff8200]/50 hover:-translate-y-1 transition-all duration-400"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="font-mono text-xs uppercase tracking-widest text-emerald-700 font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Capital Asset &bull; Mietwohnung
              </div>
              <h3 className="font-serif text-xl font-normal text-stone-900">Degressive AfA 5%</h3>
              <p className="font-sans text-stone-600 text-sm font-light leading-relaxed">
                Jährlich <strong className="text-emerald-700 font-medium">5% degressive Absetzung für Abnutzung</strong> OHNE Begrenzung bis zu 100% Abschreibung!
              </p>
            </motion.div>

            {/* Rule 2: Sonder-AfA QNG+ */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
              className="p-6 md:p-8 bg-white/85 backdrop-blur-xl border border-stone-200/80 rounded-[28px] space-y-3 relative overflow-hidden shadow-2xs hover:shadow-lg hover:border-[#ff8200]/50 hover:-translate-y-1 transition-all duration-400"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff8200]/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#ff8200] font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> § 7b EStG &bull; QNG+
              </div>
              <h3 className="font-serif text-xl font-normal text-stone-900">Sonder-AfA QNG+ 5%</h3>
              <p className="font-sans text-stone-600 text-sm font-light leading-relaxed">
                Zusätzlich jährlich <strong className="text-[#ff8200] font-medium">5% Sonder-AfA für 4 Jahre</strong> voll ansetzbar für Mietwohnungen.
              </p>
            </motion.div>

            {/* Rule 3: KfW 298 EH40 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
              className="p-6 md:p-8 bg-white/85 backdrop-blur-xl border border-stone-200/80 rounded-[28px] space-y-3 shadow-2xs hover:shadow-lg hover:border-[#ff8200]/50 hover:-translate-y-1 transition-all duration-400"
            >
              <div className="font-mono text-xs uppercase tracking-widest text-stone-500 font-bold flex items-center gap-2">
                <Award className="w-4 h-4 text-luxury-gold-dark" /> KfW 298 &bull; Klimafreundlich
              </div>
              <h3 className="font-serif text-xl font-normal text-stone-900">Mietwohnung EH40 QNG+</h3>
              <p className="font-sans text-stone-600 text-sm font-light leading-relaxed">
                Förderkredit ab <strong className="font-medium text-stone-900">2,30% Effektivzins</strong> bis zu max. <strong className="font-medium text-stone-900">150.000 €</strong> pro Wohneinheit.
              </p>
            </motion.div>

            {/* Rule 4: KfW 297 Wohneigentum */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
              className="p-6 md:p-8 bg-white/85 backdrop-blur-xl border border-stone-200/80 rounded-[28px] space-y-3 shadow-2xs hover:shadow-lg hover:border-[#ff8200]/50 hover:-translate-y-1 transition-all duration-400"
            >
              <div className="font-mono text-xs uppercase tracking-widest text-stone-500 font-bold flex items-center gap-2">
                <HomeIcon className="w-4 h-4 text-luxury-gold-dark" /> KfW 297 &bull; Eigennutzung
              </div>
              <h3 className="font-serif text-xl font-normal text-stone-900">Wohneigentum EH40 QNG+</h3>
              <p className="font-sans text-stone-600 text-sm font-light leading-relaxed">
                Staatlicher Zinsvorteil: Förderkredit ab <strong className="font-medium text-stone-900">2,30%</strong> bis max. <strong className="font-medium text-stone-900">150.000 €</strong> Kreditsumme.
              </p>
            </motion.div>

            {/* Rule 5: KfW 300 Familien */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
              className="p-6 md:p-8 bg-white/85 backdrop-blur-xl border border-stone-200/80 rounded-[28px] space-y-3 relative overflow-hidden shadow-2xs hover:shadow-lg hover:border-[#ff8200]/50 hover:-translate-y-1 transition-all duration-400"
            >
              <div className="font-mono text-xs uppercase tracking-widest text-emerald-700 font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> KfW 300 &bull; Familienförderung
              </div>
              <h3 className="font-serif text-xl font-normal text-stone-900">Zins ab 0,34%</h3>
              <p className="font-sans text-stone-600 text-sm font-light leading-relaxed">
                Für Familien mit Kindern: Unschlagbarer Förderkredit ab <strong className="text-emerald-700 font-medium">0,34% Sollzins</strong> bis max. <strong className="font-medium text-stone-900">270.000 €</strong>.
              </p>
            </motion.div>

            {/* Rule 6: BayernLabo */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="p-6 md:p-8 bg-white/85 backdrop-blur-xl border border-stone-200/80 rounded-[28px] space-y-3 shadow-2xs hover:shadow-lg hover:border-[#ff8200]/50 hover:-translate-y-1 transition-all duration-400"
            >
              <div className="font-mono text-xs uppercase tracking-widest text-stone-500 font-bold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-luxury-gold-dark" /> BayernLabo &bull; Freistaat Bayern
              </div>
              <h3 className="font-serif text-xl font-normal text-stone-900">Bayern-Darlehen</h3>
              <p className="font-sans text-stone-600 text-sm font-light leading-relaxed">
                Zusätzliche bayerische Zinsverbilligung um bis zu <strong className="font-medium text-stone-900">3% Zinsnachlass</strong> möglich.
              </p>
            </motion.div>

          </div>

        </div>
      </motion.section>

      {/* SECTION "KONTAKT & FOOTER" */}
      <motion.section 
        id="kontakt" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.08 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-luxury-dark text-white pt-28 pb-12 px-6 md:px-12 overflow-hidden border-t border-stone-900"
      >
        {/* Ambient subtle gold light flare */}
        <div className="absolute right-0 bottom-0 w-[40vw] h-[40vw] rounded-full bg-luxury-gold/5 blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            
            {/* Column 1: Elegant Contact Form */}
            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-10"
            >
              <div className="space-y-4">
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-luxury-gold">Gemeinsame Visionen</span>
                <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide leading-tight">
                  Lassen Sie uns Ihr Vorhaben besprechen.
                </h2>
                <p className="font-sans text-stone-400 text-sm md:text-base font-light leading-relaxed">
                  Haben Sie ein passendes Grundstück zum Verkauf oder interessieren Sie sich für den Erwerb einer exklusiven Neubauwohnung? Treten Sie diskret mit unseren Experten in Kontakt.
                </p>
              </div>

              {/* Minimalist Form */}
              {!formSubmitted ? (
                <form id="contact-form" onSubmit={handleFormSubmit} className="space-y-8 mt-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Name */}
                    <div className="relative flex flex-col space-y-1">
                      <label htmlFor="name" className="font-sans text-[0.65rem] tracking-widest uppercase text-stone-400">Ihr Name *</label>
                      <input 
                        type="text" 
                        id="name" 
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Vorname Nachname"
                        className="bg-transparent border-b border-stone-800 focus:border-luxury-gold focus:outline-none py-3 text-white placeholder-stone-600 transition-colors duration-300 font-light text-sm"
                      />
                    </div>
                    
                    {/* Email */}
                    <div className="relative flex flex-col space-y-1">
                      <label htmlFor="email" className="font-sans text-[0.65rem] tracking-widest uppercase text-stone-400">Ihre E-Mail *</label>
                      <input 
                        type="email" 
                        id="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="mail@beispiel.de"
                        className="bg-transparent border-b border-stone-800 focus:border-luxury-gold focus:outline-none py-3 text-white placeholder-stone-600 transition-colors duration-300 font-light text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Phone */}
                    <div className="relative flex flex-col space-y-1">
                      <label htmlFor="phone" className="font-sans text-[0.65rem] tracking-widest uppercase text-stone-400">Telefonnummer</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+49 (0) 8456 964883"
                        className="bg-transparent border-b border-stone-800 focus:border-luxury-gold focus:outline-none py-3 text-white placeholder-stone-600 transition-colors duration-300 font-light text-sm"
                      />
                    </div>

                    {/* Subject */}
                    <div className="relative flex flex-col space-y-1">
                      <label htmlFor="subject" className="font-sans text-[0.65rem] tracking-widest uppercase text-stone-400">Ihr Anliegen</label>
                      <select 
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="bg-transparent border-b border-stone-800 focus:border-luxury-gold focus:outline-none py-3 text-stone-400 focus:text-white transition-colors duration-300 font-light text-sm"
                      >
                        <option className="bg-luxury-dark text-white" value="ankauf">Grundstücksankauf &amp; Liegenschaften</option>
                        <option className="bg-luxury-dark text-white" value="entwicklung">Projektentwicklung &amp; Architektur</option>
                        <option className="bg-luxury-dark text-white" value="kauf">Interesse an einer Wohneinheit (z.B. Kothau WHG09)</option>
                        <option className="bg-luxury-dark text-white" value="sonstiges">Sonstiges Anliegen</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="relative flex flex-col space-y-1">
                    <label htmlFor="message" className="font-sans text-[0.65rem] tracking-widest uppercase text-stone-400">Ihre Nachricht *</label>
                    <textarea 
                      id="message" 
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Wie können wir Ihnen behilflich sein?"
                      className="bg-transparent border-b border-stone-800 focus:border-luxury-gold focus:outline-none py-3 text-white placeholder-stone-600 transition-colors duration-300 font-light text-sm resize-none"
                    ></textarea>
                  </div>

                  {/* Privacy note */}
                  <div className="text-[11px] text-stone-500 font-light">
                    Mit dem Absenden erklären Sie sich mit der vertraulichen Verarbeitung Ihrer Angaben gemäß unserer{" "}
                    <button 
                      type="button" 
                      onClick={onOpenDatenschutz}
                      className="text-luxury-gold hover:underline underline-offset-2 cursor-pointer"
                    >
                      Datenschutzerklärung
                    </button>{" "}
                    einverstanden.
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="group relative overflow-hidden border border-stone-800 hover:border-[#ff8200] px-10 py-4 uppercase tracking-[0.2em] text-[0.7rem] font-sans font-light bg-transparent text-white hover:text-luxury-charcoal transition-all duration-500 cursor-pointer flex items-center justify-between gap-6 w-full md:w-auto rounded-full"
                  >
                    {/* Slide up background on hover */}
                    <span className="absolute inset-0 bg-[#ff8200] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></span>
                    <span className="relative z-10 flex items-center gap-2 font-medium">
                      Nachricht übermitteln
                    </span>
                    <Send className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </form>
              ) : (
                <div className="p-10 border border-[#ff8200]/30 bg-stone-900/60 rounded-[28px] text-center space-y-6 animate-[fadeIn_0.8s_ease-out] mt-12">
                  <div className="w-14 h-14 bg-[#ff8200]/10 rounded-full flex items-center justify-center mx-auto border border-[#ff8200]/30">
                    <Check className="w-7 h-7 text-[#ff8200]" />
                  </div>
                  <h3 className="font-serif text-2xl text-white font-light">Anfrage erfolgreich empfangen</h3>
                  <p className="font-sans text-stone-300 text-sm md:text-base leading-relaxed max-w-lg mx-auto font-light">
                    Vielen Dank für das Vertrauen in Projektentwicklung Wohnraum GmbH (Fehlner &amp; Götz), Herr/Frau {clientName}. Unser Expertenteam wird Ihre Anfrage mit absoluter Diskretion prüfen und sich innerhalb der nächsten 24 Stunden persönlich mit Ihnen in Verbindung setzen.
                  </p>
                  <div className="text-[0.65rem] tracking-[0.2em] text-stone-500 uppercase font-light">
                    Projektentwicklung Wohnraum &bull; Fehlner &amp; Götz Ingolstadt
                  </div>
                </div>
              )}
            </motion.div>

            {/* Column 2: Direct Contact details */}
            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="lg:col-span-5 space-y-12 lg:pl-10"
            >
              <div className="space-y-4">
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-[#ff8200]">Zentrale &amp; Geschäftsführung</span>
                <h2 className="font-serif text-3xl font-light leading-tight">
                  Projektentwicklung Wohnraum GmbH
                </h2>
                <p className="text-xs text-stone-400 font-light">
                  Geschäftsführer: Herbert Götz &amp; Andreas Fehlner
                </p>
              </div>

              {/* Detail List */}
              <div className="space-y-8 font-sans font-light text-stone-300">
                
                {/* Address */}
                <div className="flex items-start space-x-5 group">
                  <div className="p-3.5 border border-stone-800 rounded-2xl bg-stone-900/50 group-hover:border-[#ff8200]/50 transition-colors duration-300 mt-1">
                    <MapIcon className="w-5 h-5 text-[#ff8200]" />
                  </div>
                  <div>
                    <h4 className="text-[0.65rem] tracking-[0.15em] uppercase text-stone-500 mb-1 font-semibold">Unternehmenssitz</h4>
                    <p className="text-sm md:text-base text-stone-300">
                      Lorenz-Schmidt-Straße 38<br />
                      85055 Ingolstadt (Etting)
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-5 group">
                  <div className="p-3.5 border border-stone-800 rounded-2xl bg-stone-900/50 group-hover:border-[#ff8200]/50 transition-colors duration-300 mt-1">
                    <PhoneCall className="w-5 h-5 text-[#ff8200]" />
                  </div>
                  <div>
                    <h4 className="text-[0.65rem] tracking-[0.15em] uppercase text-stone-500 mb-1 font-semibold">Telefon &amp; Mobil</h4>
                    <p className="text-sm md:text-base text-stone-300 hover:text-[#ff8200] transition-colors duration-300">
                      <a href="tel:+498456964883">+49 (0) 8456 / 964 883</a>
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Mobil: <a href="tel:+491716535481" className="hover:text-[#ff8200] transition-colors">+49 (0) 171 / 65 35 481</a>
                    </p>
                  </div>
                </div>

                {/* E-Mail */}
                <div className="flex items-start space-x-5 group">
                  <div className="p-3.5 border border-stone-800 rounded-2xl bg-stone-900/50 group-hover:border-[#ff8200]/50 transition-colors duration-300 mt-1">
                    <MailOpen className="w-5 h-5 text-[#ff8200]" />
                  </div>
                  <div>
                    <h4 className="text-[0.65rem] tracking-[0.15em] uppercase text-stone-500 mb-1 font-semibold">E-Mail</h4>
                    <p className="text-sm md:text-base text-stone-300 hover:text-[#ff8200] transition-colors duration-300">
                      <a href="mailto:info@projektentwicklung-wohnraum.de">info@projektentwicklung-wohnraum.de</a>
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Web: <a href="https://www.projektentwicklung-wohnraum.de" target="_blank" rel="noreferrer" className="hover:text-[#ff8200] transition-colors">www.projektentwicklung-wohnraum.de</a>
                    </p>
                  </div>
                </div>

                {/* Hours & Über uns link */}
                <div className="flex items-start space-x-5 group">
                  <div className="p-3.5 border border-stone-800 rounded-2xl bg-stone-900/50 group-hover:border-[#ff8200]/50 transition-colors duration-300 mt-1">
                    <Calendar className="w-5 h-5 text-[#ff8200]" />
                  </div>
                  <div>
                    <h4 className="text-[0.65rem] tracking-[0.15em] uppercase text-stone-500 mb-1 font-semibold">Beratungstermine</h4>
                    <p className="text-sm md:text-base text-stone-300">
                      Termine und Grundstücksbegehungen nach individueller persönlicher Vereinbarung.
                    </p>
                    {onOpenUeberUns && (
                      <button
                        onClick={onOpenUeberUns}
                        className="text-xs text-[#ff8200] hover:underline mt-2 flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <span>Über unsere Philosophie &amp; Gründer erfahren</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>

          </div>

          {/* Elegant border divider */}
          <div className="border-t border-stone-900 my-16"></div>

          {/* Copyright & Legal */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 font-sans text-xs text-stone-500 font-light">
            
            {/* Copyright with strict company name */}
            <div>
              &copy; {new Date().getFullYear()} Projektentwicklung Wohnraum GmbH (Fehlner &amp; Götz). Alle Rechte vorbehalten.
            </div>

            {/* Strict Logo Text */}
            <div className="font-serif tracking-[0.2em] uppercase text-stone-400 select-none text-sm font-light">
              Projektentwicklung Wohnraum GmbH &bull; Ingolstadt
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              {onOpenUeberUns && (
                <>
                  <button 
                    onClick={onOpenUeberUns} 
                    className="hover:text-[#ff8200] transition-colors duration-300 cursor-pointer"
                  >
                    Über Uns
                  </button>
                  <span className="text-stone-800">&bull;</span>
                </>
              )}
              <button 
                onClick={onOpenImpressum} 
                className="hover:text-[#ff8200] transition-colors duration-300 cursor-pointer"
              >
                Impressum
              </button>
              <span className="text-stone-800">&bull;</span>
              <button 
                onClick={onOpenDatenschutz} 
                className="hover:text-[#ff8200] transition-colors duration-300 cursor-pointer"
              >
                Datenschutz
              </button>
            </div>

          </div>
        </div>
      </motion.section>
    </>
  );
}
