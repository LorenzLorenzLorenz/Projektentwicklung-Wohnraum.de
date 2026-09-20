import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cookie, ShieldCheck, Check, Settings, X } from "lucide-react";

interface CookieBannerProps {
  onOpenDatenschutz: () => void;
}

export default function CookieBanner({ onOpenDatenschutz }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("pwr_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("pwr_cookie_consent", "all");
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem("pwr_cookie_consent", "necessary");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-[#faf9f8]/95 backdrop-blur-xl text-stone-800 p-5 rounded-xl border border-stone-200/90 shadow-2xl space-y-3.5 font-sans"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ff8200]/10 flex items-center justify-center text-[#ff8200] shrink-0 border border-[#ff8200]/20">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] tracking-widest uppercase font-semibold text-[#ff8200]">
                Privatsphäre &amp; Cookies
              </div>
              <h4 className="font-serif text-base font-normal text-stone-900 leading-tight">
                Transparenz nach EU-DSGVO &amp; TDDDG
              </h4>
            </div>
          </div>

          <button
            onClick={handleAcceptNecessary}
            className="text-stone-400 hover:text-stone-700 transition-colors p-1"
            title="Schließen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-stone-600 font-light leading-relaxed">
          Wir setzen ausschließlich technisch notwendige Cookies ein, um Ihnen eine fehlerfreie Navigation, Ausstattungs-Berechnungen und interaktive Visualisierungen zu ermöglichen. Weitere Details finden Sie in unserer{" "}
          <button
            onClick={onOpenDatenschutz}
            className="text-[#ff8200] underline font-medium hover:text-[#e07300] cursor-pointer"
          >
            Datenschutzerklärung
          </button>.
        </p>

        <div className="flex items-center gap-2.5 pt-1">
          <button
            onClick={handleAccept}
            className="flex-1 px-4 py-2 rounded-lg bg-stone-900 hover:bg-[#ff8200] text-white text-xs font-medium uppercase tracking-wider transition-colors duration-300 cursor-pointer text-center"
          >
            Einverstanden
          </button>
          <button
            onClick={handleAcceptNecessary}
            className="px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors duration-300 cursor-pointer"
          >
            Nur Notwendige
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
