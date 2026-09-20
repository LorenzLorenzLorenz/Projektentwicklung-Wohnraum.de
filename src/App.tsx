import React, { useState, useEffect } from "react";
import { Menu, X, ShieldCheck, FileText, Info } from "lucide-react";
import Investieren from "./components/Investieren";
import Wohnen from "./components/Wohnen";
import Referenzen from "./components/Referenzen";
import UeberUns from "./components/UeberUns";
import DatenschutzModal from "./components/DatenschutzModal";
import ImpressumModal from "./components/ImpressumModal";
import UeberUnsModal from "./components/UeberUnsModal";
import CookieBanner from "./components/CookieBanner";

const REFERENZEN_SECTIONS = [
  { id: "philosophie", label: "Philosophie" },
  { id: "leistungen", label: "Leistungen" },
  { id: "highlights", label: "Highlights" },
  { id: "projekte-chronik", label: "Projekte" },
  { id: "foerderung", label: "Förderung" },
  { id: "kontakt", label: "Kontakt" },
] as const;

export default function App() {
  // Global Navigation & Tab States
  const [activeTab, setActiveTab] = useState<"investieren" | "wohnen" | "referenzen" | "ueber-uns">("investieren");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);

  // Legal & Company Modal States
  const [isDatenschutzOpen, setIsDatenschutzOpen] = useState(false);
  const [isImpressumOpen, setIsImpressumOpen] = useState(false);
  const [isUeberUnsOpen, setIsUeberUnsOpen] = useState(false);

  // Handle Navbar Scroll Gradient Switch and Scroll Spy for Referenzen Sections
  useEffect(() => {
    const handleScroll = () => {
      // Navbar scroll styling
      if (window.scrollY > 80) {
        setIsNavbarScrolled(true);
      } else {
        setIsNavbarScrolled(false);
      }

      // Scroll spy for Referenzen sub-sections
      if (activeTab !== "referenzen") {
        setActiveSection(null);
        return;
      }

      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;

      // Bottom of page detection (e.g. Kontakt section)
      if (scrollHeight - (scrollY + windowHeight) < 100) {
        setActiveSection("kontakt");
        return;
      }

      const headerOffset = 180;
      let currentSection: string | null = null;

      for (const section of REFERENZEN_SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= headerOffset) {
            currentSection = section.id;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab]);

  // Seamless Cross-Page Anchor Scrolling Function
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    setActiveSection(id);

    const executeScroll = () => {
      const targetElement = document.getElementById(id);
      if (targetElement) {
        const headerOffset = 90;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    };

    if (activeTab !== "referenzen") {
      setActiveTab("referenzen");
      // Short timeout to let the Referenzen component render before starting scroll measurements
      setTimeout(executeScroll, 150);
    } else {
      executeScroll();
    }
  };

  const isDark = false;

  return (
    <div className={`min-h-screen transition-colors duration-700 ${
      isDark ? "bg-[#0a0a0a] text-stone-200" : "bg-[#faf9f8] text-luxury-charcoal"
    }`}>
      {/* FIXED NAVIGATION */}
      <header 
        id="navbar" 
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 py-2 md:py-3 px-6 md:px-12 flex justify-between items-center ${
          isNavbarScrolled 
            ? isDark 
              ? "bg-[#0a0a0a]/90 border-b border-stone-900 py-3 shadow-md backdrop-blur-md" 
              : "navbar-scroll-gradient border-b border-stone-200/40 py-3 shadow-sm"
            : isDark 
              ? "bg-gradient-to-b from-[#0a0a0a]/95 to-transparent py-4 backdrop-blur-sm" 
              : "navbar-top-gradient py-4"
        }`}
      >
        {/* Logo left */}
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("investieren");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="inline-flex items-center justify-center transition-all duration-300 hover:opacity-85 focus:outline-none bg-transparent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 180" className="h-20 md:h-24 lg:h-28 w-auto">
            <rect x="110" y="10" width="80" height="80" fill="#ff8200" />
            <text x="150" y="118" fontFamily="'Segoe UI', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif" fontSize="22" fontWeight="bold" fill={isDark ? "#b0b0b0" : "#6e6e6e"} textAnchor="middle" letterSpacing="0.02em">PROJEKTENTWICKLUNG</text>
            <text x="150" y="142" fontFamily="'Segoe UI', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif" fontSize="22" fontWeight="bold" fill={isDark ? "#b0b0b0" : "#6e6e6e"} textAnchor="middle" letterSpacing="0.02em">WOHNRAUM</text>
            <text x="150" y="168" fontFamily="'Segoe UI', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif" fontSize="18" fontWeight="600" fill="#ff8200" textAnchor="middle" letterSpacing="0.05em">FEHLNER &amp; GÖTZ</text>
          </svg>
        </a>

        {/* Tab & Anchor Navigation links right */}
        <nav className="hidden md:flex items-center space-x-10">
          <button 
            onClick={() => {
              setActiveTab("investieren");
              window.scrollTo(0, 0);
            }}
            className={`nav-link font-sans text-xs tracking-[0.2em] uppercase py-2 relative transition-colors duration-300 cursor-pointer ${
              activeTab === "investieren" 
                ? "text-[#ff8200] font-semibold" 
                : isDark 
                  ? "text-stone-400 hover:text-[#ff8200]" 
                  : "text-stone-600 hover:text-[#ff8200]"
            }`}
          >
            Investieren
            {activeTab === "investieren" && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#ff8200] transition-all duration-300"></span>
            )}
          </button>
          
          <button 
            onClick={() => {
              setActiveTab("wohnen");
              window.scrollTo(0, 0);
            }}
            className={`nav-link font-sans text-xs tracking-[0.2em] uppercase py-2 relative transition-colors duration-300 cursor-pointer ${
              activeTab === "wohnen" 
                ? "text-[#ff8200] font-semibold" 
                : isDark 
                  ? "text-stone-400 hover:text-[#ff8200]" 
                  : "text-stone-600 hover:text-[#ff8200]"
            }`}
          >
            Wohnen
            {activeTab === "wohnen" && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#ff8200] transition-all duration-300"></span>
            )}
          </button>

          <button 
            onClick={() => {
              setActiveTab("referenzen");
              window.scrollTo(0, 0);
            }}
            className={`nav-link font-sans text-xs tracking-[0.2em] uppercase py-2 relative transition-colors duration-300 cursor-pointer ${
              activeTab === "referenzen" 
                ? "text-[#ff8200] font-semibold" 
                : isDark 
                  ? "text-stone-400 hover:text-[#ff8200]" 
                  : "text-stone-600 hover:text-[#ff8200]"
            }`}
          >
            Referenzen
            {activeTab === "referenzen" && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#ff8200] transition-all duration-300"></span>
            )}
          </button>

          {/* Über Uns Tab Button */}
          <button 
            onClick={() => {
              setActiveTab("ueber-uns");
              window.scrollTo(0, 0);
            }}
            className={`nav-link font-sans text-xs tracking-[0.2em] uppercase py-2 relative transition-colors duration-300 cursor-pointer ${
              activeTab === "ueber-uns" 
                ? "text-[#ff8200] font-semibold" 
                : isDark 
                  ? "text-stone-400 hover:text-[#ff8200]" 
                  : "text-stone-600 hover:text-[#ff8200]"
            }`}
          >
            Über Uns
            {activeTab === "ueber-uns" && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#ff8200] transition-all duration-300"></span>
            )}
          </button>

          {/* Sub anchors on Referenzen context */}
          <div className="flex items-center space-x-5 lg:space-x-7 pl-4 border-l border-stone-200/50">
            {REFERENZEN_SECTIONS.map((sec) => {
              const isActive = activeTab === "referenzen" && activeSection === sec.id;
              return (
                <a 
                  key={sec.id}
                  href={`#${sec.id}`} 
                  onClick={(e) => handleAnchorClick(e, sec.id)}
                  className={`nav-link font-sans text-xs tracking-[0.2em] uppercase py-2 relative transition-colors duration-300 cursor-pointer ${
                    isActive
                      ? "text-[#ff8200] font-semibold" 
                      : "text-stone-500 hover:text-[#ff8200]"
                  }`}
                >
                  {sec.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#ff8200] transition-all duration-300"></span>
                  )}
                </a>
              );
            })}
          </div>
        </nav>

        {/* Mobile menu trigger */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className={`md:hidden focus:outline-none z-50 transition-colors duration-300 cursor-pointer ${
            isDark ? "text-stone-300 hover:text-[#ff8200]" : "text-stone-800 hover:text-[#ff8200]"
          }`}
        >
          {isMobileMenuOpen ? (
            <X className={`w-6 h-6 ${isDark ? "text-stone-100" : "text-stone-900"}`} />
          ) : (
            <Menu className={`w-6 h-6 ${isDark ? "text-stone-100" : "text-stone-900"}`} />
          )}
        </button>
      </header>

      {/* Mobile menu panel */}
      <div 
        className={`fixed inset-0 bg-white/98 backdrop-blur-xl z-30 flex flex-col justify-center items-center space-y-8 transition-all duration-500 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <button 
          onClick={() => {
            setActiveTab("investieren");
            setIsMobileMenuOpen(false);
            window.scrollTo(0, 0);
          }}
          className={`font-serif text-3xl tracking-wide transition-colors duration-300 ${
            activeTab === "investieren" ? "text-[#ff8200]" : "text-stone-800 hover:text-[#ff8200]"
          }`}
        >
          Investieren
        </button>
        <button 
          onClick={() => {
            setActiveTab("wohnen");
            setIsMobileMenuOpen(false);
            window.scrollTo(0, 0);
          }}
          className={`font-serif text-3xl tracking-wide transition-colors duration-300 ${
            activeTab === "wohnen" ? "text-[#ff8200]" : "text-stone-800 hover:text-[#ff8200]"
          }`}
        >
          Wohnen
        </button>
        <button 
          onClick={() => {
            setActiveTab("referenzen");
            setIsMobileMenuOpen(false);
            window.scrollTo(0, 0);
          }}
          className={`font-serif text-3xl tracking-wide transition-colors duration-300 ${
            activeTab === "referenzen" ? "text-[#ff8200]" : "text-stone-800 hover:text-[#ff8200]"
          }`}
        >
          Referenzen
        </button>

        <button 
          onClick={() => {
            setActiveTab("ueber-uns");
            setIsMobileMenuOpen(false);
            window.scrollTo(0, 0);
          }}
          className={`font-serif text-3xl tracking-wide transition-colors duration-300 ${
            activeTab === "ueber-uns" ? "text-[#ff8200]" : "text-stone-800 hover:text-[#ff8200]"
          }`}
        >
          Über Uns
        </button>

        <div className="flex flex-col items-center space-y-4 pt-6 border-t border-stone-200/30 w-1/2">
          {REFERENZEN_SECTIONS.map((sec) => {
            const isActive = activeTab === "referenzen" && activeSection === sec.id;
            return (
              <a 
                key={sec.id}
                href={`#${sec.id}`} 
                onClick={(e) => handleAnchorClick(e, sec.id)}
                className={`font-sans text-sm tracking-[0.2em] uppercase transition-colors duration-300 ${
                  isActive ? "text-[#ff8200] font-semibold" : "text-stone-600 hover:text-[#ff8200]"
                }`}
              >
                {sec.label}
              </a>
            );
          })}
          <div className="flex items-center space-x-4 pt-4 border-t border-stone-100 text-xs">
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsImpressumOpen(true);
              }}
              className="text-stone-500 hover:text-[#ff8200]"
            >
              Impressum
            </button>
            <span>&bull;</span>
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsDatenschutzOpen(true);
              }}
              className="text-stone-500 hover:text-[#ff8200]"
            >
              Datenschutz
            </button>
          </div>
        </div>
      </div>

      {/* RENDER CURRENT TAB VIEW */}
      <main className="relative">
        {activeTab === "investieren" ? (
          <Investieren />
        ) : activeTab === "wohnen" ? (
          <Wohnen />
        ) : activeTab === "ueber-uns" ? (
          <UeberUns 
            onOpenContact={() => {
              setActiveTab("referenzen");
              setTimeout(() => {
                const el = document.getElementById("kontakt");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }, 200);
            }}
            onOpenImpressum={() => setIsImpressumOpen(true)}
            onOpenDatenschutz={() => setIsDatenschutzOpen(true)}
          />
        ) : (
          <Referenzen 
            onOpenDatenschutz={() => setIsDatenschutzOpen(true)}
            onOpenImpressum={() => setIsImpressumOpen(true)}
            onOpenUeberUns={() => {
              setActiveTab("ueber-uns");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </main>

      {/* Quick Access Legal Bar on non-referenzen tabs */}
      {activeTab !== "referenzen" && (
        <footer className="border-t border-stone-200 bg-white py-6 px-6 md:px-12 text-stone-500 text-xs font-sans">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              &copy; {new Date().getFullYear()} Projektentwicklung Wohnraum GmbH (Fehlner &amp; Götz) &bull; Lorenz-Schmidt-Straße 38, 85055 Ingolstadt &bull; <a href="mailto:info@projektentwicklung-wohnraum.de" className="hover:text-[#ff8200] transition-colors font-medium">info@projektentwicklung-wohnraum.de</a>
            </div>
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => {
                  setActiveTab("ueber-uns");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`transition-colors cursor-pointer ${
                  activeTab === "ueber-uns" ? "text-[#ff8200] font-medium" : "hover:text-[#ff8200]"
                }`}
              >
                Über Uns
              </button>
              <span>&bull;</span>
              <button 
                onClick={() => setIsImpressumOpen(true)}
                className="hover:text-[#ff8200] transition-colors cursor-pointer"
              >
                Impressum
              </button>
              <span>&bull;</span>
              <button 
                onClick={() => setIsDatenschutzOpen(true)}
                className="hover:text-[#ff8200] transition-colors cursor-pointer"
              >
                Datenschutz
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* MODALS */}
      <DatenschutzModal 
        isOpen={isDatenschutzOpen} 
        onClose={() => setIsDatenschutzOpen(false)}
        onOpenImpressum={() => {
          setIsDatenschutzOpen(false);
          setIsImpressumOpen(true);
        }}
      />

      <ImpressumModal 
        isOpen={isImpressumOpen} 
        onClose={() => setIsImpressumOpen(false)}
        onOpenDatenschutz={() => {
          setIsImpressumOpen(false);
          setIsDatenschutzOpen(true);
        }}
      />

      <UeberUnsModal 
        isOpen={isUeberUnsOpen} 
        onClose={() => setIsUeberUnsOpen(false)}
        onOpenContact={() => {
          setIsUeberUnsOpen(false);
          setActiveTab("referenzen");
          setTimeout(() => {
            const el = document.getElementById("kontakt");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }, 200);
        }}
      />

      {/* COOKIE CONSENT BANNER */}
      <CookieBanner onOpenDatenschutz={() => setIsDatenschutzOpen(true)} />
    </div>
  );
}

