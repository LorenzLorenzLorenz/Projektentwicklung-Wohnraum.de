import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  ShieldCheck, 
  Lock, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  UserCheck, 
  Server, 
  Cookie, 
  Mail, 
  Phone, 
  MapPin, 
  Search,
  Scale
} from "lucide-react";

interface DatenschutzModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenImpressum?: () => void;
}

export default function DatenschutzModal({ isOpen, onClose, onOpenImpressum }: DatenschutzModalProps) {
  const [activeSection, setActiveSection] = useState<string>("allgemein");
  const contentRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef<boolean>(false);

  const sections = [
    { id: "allgemein", title: "1. Verantwortlicher & Datenschutz", icon: ShieldCheck },
    { id: "rechte", title: "2. Betroffenenrechte (Art. 15-21)", icon: Scale },
    { id: "server", title: "3. Server-Logfiles & Hosting", icon: Server },
    { id: "kontakt", title: "4. Kontaktaufnahme & Anfragen", icon: Mail },
    { id: "cookies", title: "5. Cookies & Speicher (TDDDG)", icon: Cookie },
    { id: "widerspruch", title: "6. Widerspruchsrecht Art. 21", icon: Lock },
    { id: "sicherheit", title: "7. Datensicherheit & Urheber", icon: FileText }
  ];

  // Dynamically track active section as user scrolls through main content
  const handleScroll = useCallback(() => {
    if (!contentRef.current || isProgrammaticScroll.current) return;

    const container = contentRef.current;
    const scrollPosition = container.scrollTop;

    // Calculate relative offsets of all sections
    const sectionOffsets = sections.map((sec) => {
      const el = document.getElementById(`ds-${sec.id}`);
      if (!el) return { id: sec.id, top: Infinity };
      return {
        id: sec.id,
        top: el.offsetTop - container.offsetTop
      };
    });

    // Find current section in view (last section whose offsetTop is reached)
    const current = sectionOffsets
      .filter((sec) => sec.top <= scrollPosition + 120)
      .pop();

    if (current && current.id !== activeSection) {
      setActiveSection(current.id);
    } else if (!current && sectionOffsets.length > 0 && activeSection !== sectionOffsets[0].id) {
      setActiveSection(sectionOffsets[0].id);
    }
  }, [sections, activeSection]);

  // Scroll to selected section from sidebar
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    isProgrammaticScroll.current = true;

    const container = contentRef.current;
    const el = document.getElementById(`ds-${sectionId}`);

    if (container && el) {
      const targetScroll = Math.max(0, el.offsetTop - container.offsetTop - 15);
      container.scrollTo({
        top: targetScroll,
        behavior: "smooth"
      });

      // Re-enable scroll listener after smooth scroll finishes
      setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 600);
    } else {
      isProgrammaticScroll.current = false;
    }
  };

  // Reset to first section when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveSection("allgemein");
      isProgrammaticScroll.current = false;
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
        }
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 overflow-hidden">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0a0a0a]/80 backdrop-blur-md transition-all duration-300"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-[#faf9f8] text-[#1c1917] rounded-xl shadow-2xl border border-stone-200/80 overflow-hidden flex flex-col h-[92vh] max-h-[850px] z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 sm:py-5 border-b border-stone-200 bg-white/95 backdrop-blur-md shrink-0 z-20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#ff8200]/10 flex items-center justify-center border border-[#ff8200]/30 text-[#ff8200]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold text-[#ff8200] block">
                  Rechtliche Grundlagen &bull; DSGVO-konform
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 tracking-tight">
                  Datenschutzerklärung
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors duration-200 cursor-pointer"
                title="Schließen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subheader / Info Banner */}
          <div className="bg-stone-100/90 px-6 py-2.5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600 font-sans shrink-0">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Gültige Fassung nach EU-DSGVO &amp; TDDDG</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Verantwortlicher: <strong>Herbert Götz</strong></span>
              {onOpenImpressum && (
                <button 
                  onClick={() => {
                    onClose();
                    onOpenImpressum();
                  }}
                  className="text-[#ff8200] hover:underline font-medium cursor-pointer"
                >
                  Zum Impressum &rarr;
                </button>
              )}
            </div>
          </div>

          {/* Mobile horizontal section picker */}
          <div className="md:hidden flex overflow-x-auto bg-stone-100/80 border-b border-stone-200 px-3 py-2 gap-1.5 no-scrollbar shrink-0">
            {sections.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-sans whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#ff8200] text-white font-medium shadow-sm"
                      : "bg-white text-stone-600 border border-stone-200"
                  }`}
                >
                  {sec.title}
                </button>
              );
            })}
          </div>

          {/* Main Body with Fixed Sidebar & Scroll-Spied Content */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* Sidebar nav (Desktop) */}
            <div className="hidden md:flex flex-col w-72 bg-stone-50/90 border-r border-stone-200 p-4 shrink-0 overflow-y-auto justify-between">
              <div className="space-y-1">
                <div className="text-[10px] tracking-wider uppercase font-semibold text-stone-400 px-3 py-2">
                  Inhaltsverzeichnis
                </div>
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-sans flex items-center justify-between gap-2.5 transition-all duration-200 cursor-pointer ${
                        isActive 
                          ? "bg-[#ff8200]/15 text-[#ff8200] font-semibold border-l-4 border-[#ff8200] shadow-xs" 
                          : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 border-l-4 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${isActive ? "text-[#ff8200]" : "text-stone-400"}`} />
                        <span className="truncate">{sec.title}</span>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff8200] shrink-0 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-stone-200/70 px-3 space-y-2 mt-4">
                <div className="text-[11px] font-medium text-stone-700">Schnellkontakt Datenschutz</div>
                <div className="text-xs text-stone-500 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#ff8200] shrink-0" />
                  <span>0841 98123088</span>
                </div>
                <div className="text-xs text-stone-500 flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-[#ff8200] shrink-0" />
                  <a href="mailto:info@projektentwicklung-wohnraum.de" className="hover:text-[#ff8200] truncate">
                    info@projektentwicklung-wohnraum.de
                  </a>
                </div>
              </div>
            </div>

            {/* Content Area with dynamic onScroll listener */}
            <div 
              ref={contentRef}
              onScroll={handleScroll}
              className="flex-1 p-6 md:p-8 space-y-10 font-sans text-stone-700 text-sm leading-relaxed overflow-y-auto scroll-smooth"
            >
              
              {/* Introduction Callout */}
              <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                <div className="font-semibold text-amber-950 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#ff8200]" />
                  Transparenz und Schutz Ihrer personenbezogenen Daten
                </div>
                <p>
                  Wir verarbeiten personenbezogene Daten unserer Nutzer stets im Einklang mit den Bestimmungen der Europäischen Datenschutz-Grundverordnung (EU-DSGVO) und dem Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz (TDDDG).
                </p>
              </div>

              {/* 1. Verantwortlicher & Datenschutzbeauftragter */}
              <section id="ds-allgemein" className="space-y-4 pt-2 scroll-mt-6">
                <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                  <div className="w-6 h-6 rounded-md bg-[#ff8200]/10 flex items-center justify-center text-[#ff8200]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-lg font-normal text-stone-900">
                    1. Verantwortlicher &amp; Datenschutzbeauftragter
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 rounded-lg border border-stone-200">
                  <div className="space-y-2">
                    <div className="text-xs tracking-wider uppercase font-semibold text-stone-400">Verantwortliche Stelle</div>
                    <div className="font-medium text-stone-900 text-base">Projektentwicklung Wohnraum GmbH</div>
                    <div className="text-xs text-stone-600 space-y-1">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#ff8200]" />
                        Lorenz-Schmidt-Straße 38, 85055 Ingolstadt (Etting)
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#ff8200]" />
                        +49 (0) 841 | 98 12 30 88
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[#ff8200]" />
                        info@projektentwicklung-wohnraum.de
                      </p>
                      <p className="text-stone-500">Registergericht: Amtsgericht Ingolstadt HRB 7830</p>
                    </div>
                  </div>

                  <div className="space-y-2 md:border-l md:border-stone-100 md:pl-6">
                    <div className="text-xs tracking-wider uppercase font-semibold text-stone-400">Datenschutzbeauftragter</div>
                    <div className="font-medium text-stone-900 text-base">Herbert Götz</div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Für alle Fragen bezüglich des Datenschutzes und zur Ausübung Ihrer Betroffenenrechte können Sie sich direkt an unseren bestellten Datenschutzbeauftragten wenden:
                    </p>
                    <div className="text-xs text-stone-600 space-y-1">
                      <p>E-Mail: <a href="mailto:info@projektentwicklung-wohnraum.de" className="text-[#ff8200] hover:underline font-medium">info@projektentwicklung-wohnraum.de</a></p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Ihre Betroffenenrechte */}
              <section id="ds-rechte" className="space-y-4 pt-2 scroll-mt-6">
                <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                  <div className="w-6 h-6 rounded-md bg-[#ff8200]/10 flex items-center justify-center text-[#ff8200]">
                    <Scale className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-lg font-normal text-stone-900">
                    2. Ihre Betroffenenrechte (Art. 15 bis 21 DSGVO)
                  </h3>
                </div>

                <p className="text-stone-600">
                  Unter den oben angegebenen Kontaktdaten können Sie gemäß EU-Datenschutz-Grundverordnung (DSGVO) jederzeit folgende Rechte gegenüber der Projektentwicklung Wohnraum GmbH geltend machen:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-md bg-white border border-stone-200 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#ff8200] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-stone-900 text-xs">Recht auf Auskunft (Art. 15 DSGVO)</div>
                      <div className="text-xs text-stone-500 mt-0.5">Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten und deren Verarbeitungszwecke.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-md bg-white border border-stone-200 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#ff8200] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-stone-900 text-xs">Recht auf Berichtigung (Art. 16 DSGVO)</div>
                      <div className="text-xs text-stone-500 mt-0.5">Unverzügliche Berichtigung unrichtiger oder Vervollständigung unvollständiger Daten.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-md bg-white border border-stone-200 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#ff8200] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-stone-900 text-xs">Recht auf Löschung (Art. 17 DSGVO)</div>
                      <div className="text-xs text-stone-500 mt-0.5">Löschung Ihrer bei uns gespeicherten Daten („Recht auf Vergessenwerden“), sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-md bg-white border border-stone-200 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#ff8200] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-stone-900 text-xs">Einschränkung der Verarbeitung (Art. 18 DSGVO)</div>
                      <div className="text-xs text-stone-500 mt-0.5">Sperrung der Daten, falls gesetzliche Pflichten eine sofortige Löschung untersagen.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-md bg-white border border-stone-200 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#ff8200] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-stone-900 text-xs">Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</div>
                      <div className="text-xs text-stone-500 mt-0.5">Erhalt Ihrer bereitgestellten Daten in einem strukturierten, gängigen und maschinenlesbaren Format.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-md bg-white border border-stone-200 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#ff8200] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-stone-900 text-xs">Widerspruchsrecht (Art. 21 DSGVO)</div>
                      <div className="text-xs text-stone-500 mt-0.5">Jederzeitiges Widerspruchsrecht gegen die Verarbeitung aus Gründen Ihrer besonderen Situation.</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600 space-y-2">
                  <p>
                    <strong>Widerrufsrecht bei Einwilligungen:</strong> Sofern Sie uns eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese jederzeit mit Wirkung für die Zukunft ohne Angabe von Gründen widerrufen.
                  </p>
                  <p>
                    <strong>Beschwerderecht bei der Aufsichtsbehörde:</strong> Sie haben das Recht, sich jederzeit mit einer Beschwerde an eine zuständige Datenschutz-Aufsichtsbehörde zu wenden (z.B. Bayerisches Landesamt für Datenschutzaufsicht, BayLDA, Promenade 18, 91522 Ansbach).
                  </p>
                  <p>
                    Eine Übersicht aller Aufsichtsbehörden finden Sie beim Bundesbeauftragten für den Datenschutz und die Informationsfreiheit (BfDI) unter:{" "}
                    <a 
                      href="https://www.bfdi.bund.de/DE/Infothek/Anschriften_Links/anschriften_links-node.html" 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-[#ff8200] inline-flex items-center gap-1 hover:underline font-medium"
                    >
                      BfDI Anschriften der Aufsichtsbehörden <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </section>

              {/* 3. Server-Logfiles */}
              <section id="ds-server" className="space-y-4 pt-2 scroll-mt-6">
                <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                  <div className="w-6 h-6 rounded-md bg-[#ff8200]/10 flex items-center justify-center text-[#ff8200]">
                    <Server className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-lg font-normal text-stone-900">
                    3. Erfassung allgemeiner Informationen beim Besuch unserer Website (Server-Logfiles)
                  </h3>
                </div>

                <div className="space-y-3 text-xs md:text-sm text-stone-600">
                  <p>
                    Wenn Sie auf unsere Website zugreifen, d.h., wenn Sie sich nicht registrieren oder anderweitig Informationen übermitteln, werden automatisch Informationen allgemeiner Natur erfasst. Diese Informationen (Server-Logfiles) beinhalten etwa:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-2 text-stone-700">
                    <li>Art und Version des verwendeten Webbrowsers</li>
                    <li>Das verwendete Betriebssystem</li>
                    <li>Referrer URL (die zuvor besuchte Seite)</li>
                    <li>Hostname des zugreifenden Rechners / IP-Adresse</li>
                    <li>Uhrzeit und Datum der Serveranfrage</li>
                  </ul>
                  <p>
                    <strong>Zweck der Verarbeitung:</strong> Die Verarbeitung erfolgt zur Gewährleistung eines reibungslosen Verbindungsaufbaus der Website, zur Sicherstellung einer technisch fehlerfreien Darstellung, zur Systemsicherheit und Missbrauchserkennung. Wir verwenden Ihre Daten nicht, um Rückschlüsse auf Ihre Person zu ziehen.
                  </p>
                  <p>
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO auf Basis unseres berechtigten Interesses an der Stabilität und Betriebssicherheit unseres Webangebots.
                  </p>
                  <p>
                    <strong>Speicherdauer:</strong> Daten in Server-Log-Dateien werden maximal <strong>30 Tage</strong> gespeichert, es sei denn, dass ein sicherheitsrelevantes Ereignis (z.B. DDoS-Angriff) eine längere Speicherung zur Beweissicherung und Aufklärung erfordert.
                  </p>
                </div>
              </section>

              {/* 4. Kontaktaufnahme */}
              <section id="ds-kontakt" className="space-y-4 pt-2 scroll-mt-6">
                <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                  <div className="w-6 h-6 rounded-md bg-[#ff8200]/10 flex items-center justify-center text-[#ff8200]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-lg font-normal text-stone-900">
                    4. Kontaktaufnahme (Kontaktformular, E-Mail, Telefon)
                  </h3>
                </div>

                <div className="space-y-3 text-xs md:text-sm text-stone-600">
                  <p>
                    Auf unserer Website stehen Ihnen interaktive Kontaktformulare für Investoren, Eigennutzer und Grundstücksverkäufer zur Verfügung. Nehmen Sie diese Möglichkeit wahr, werden die in den Eingabemasken angegebenen Daten (Name, E-Mail-Adresse, Telefonnummer, Wohnungs- oder Projektinteresse, Freitextnachricht) an uns übermittelt und verschlüsselt gespeichert.
                  </p>
                  <p>
                    Ebenso können Sie uns per E-Mail oder Telefon kontaktieren. Hierbei speichern wir Ihre Kontaktdaten zur individuellen Beantwortung und Betreuung Ihrer Anfrage.
                  </p>
                  <div className="p-4 bg-white rounded-lg border border-stone-200 space-y-2">
                    <p>
                      <strong>Rechtsgrundlagen:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-2 text-stone-700">
                      <li>Berechtigtes Interesse an einer unkomplizierten Kommunikation mit Interessenten: <strong>Art. 6 Abs. 1 lit. f DSGVO</strong></li>
                      <li>Zur Durchführung vorvertraglicher Maßnahmen bei konkreten Kauf-, Miet- oder Investitionsanfragen: <strong>Art. 6 Abs. 1 lit. b DSGVO</strong></li>
                    </ul>
                  </div>
                  <p>
                    <strong>Speicherdauer:</strong> Anfragedaten werden spätestens <strong>6 Monate</strong> nach abschließender Bearbeitung gelöscht. Sofern aus der Anfrage ein notarieller Kauf- oder Werkvertrag entsteht, unterliegen wir den handels- und steuerrechtlichen Aufbewahrungsfristen (6 bzw. 10 Jahre nach HGB und AO).
                  </p>
                </div>
              </section>

              {/* 5. Cookies & Lokale Speicherung */}
              <section id="ds-cookies" className="space-y-4 pt-2 scroll-mt-6">
                <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                  <div className="w-6 h-6 rounded-md bg-[#ff8200]/10 flex items-center justify-center text-[#ff8200]">
                    <Cookie className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-lg font-normal text-stone-900">
                    5. Technisch notwendige Cookies &amp; Lokale Speicherung (TDDDG)
                  </h3>
                </div>

                <div className="space-y-3 text-xs md:text-sm text-stone-600">
                  <p>
                    Unsere Website verwendet ausschließlich technisch notwendige Cookies und clientseitige Zustandsspeicherungen (z.B. für Tab-Navigationen, Ausstattungs-Konfiguratoren und Berechnungsmodelle), um Ihnen eine komfortable, fehlerfreie Nutzung zu ermöglichen.
                  </p>
                  <p>
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO in Verbindung mit § 25 Abs. 2 Nr. 2 TDDDG (technisch erforderliche Speicherung).
                  </p>
                  
                  <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-2 text-xs">
                    <div className="font-medium text-stone-800">Verwaltung und Löschen von Cookies in Ihrem Browser:</div>
                    <p className="text-stone-600">
                      Sie können gespeicherte Cookies in den Einstellungen Ihres Webbrowsers jederzeit löschen oder das Setzen von Cookies grundsätzlich unterbinden:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-medium text-stone-700">
                      <a href="https://support.google.com/accounts/answer/61416?hl=de" target="_blank" rel="noreferrer" className="text-[#ff8200] hover:underline flex items-center gap-1">Google Chrome &rarr;</a>
                      <a href="https://support.mozilla.org/de/kb/cookies-loeschen-daten-von-websites-entfernen" target="_blank" rel="noreferrer" className="text-[#ff8200] hover:underline flex items-center gap-1">Mozilla Firefox &rarr;</a>
                      <a href="https://support.apple.com/kb/PH17191?locale=de_DE" target="_blank" rel="noreferrer" className="text-[#ff8200] hover:underline flex items-center gap-1">Apple Safari &rarr;</a>
                      <a href="https://support.microsoft.com/de-de/windows/verwalten-von-cookies-in-microsoft-edge-anzeigen-zulassen-blockieren-l%C3%B6schen-und-verwenden-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noreferrer" className="text-[#ff8200] hover:underline flex items-center gap-1">Microsoft Edge &rarr;</a>
                      <a href="http://www.opera.com/de/help" target="_blank" rel="noreferrer" className="text-[#ff8200] hover:underline flex items-center gap-1">Opera Browser &rarr;</a>
                    </div>
                  </div>
                </div>
              </section>

              {/* 6. Widerspruchsrecht */}
              <section id="ds-widerspruch" className="space-y-4 pt-2 scroll-mt-6">
                <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                  <div className="w-6 h-6 rounded-md bg-[#ff8200]/10 flex items-center justify-center text-[#ff8200]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-lg font-normal text-stone-900">
                    6. Information über Ihr Widerspruchsrecht nach Art. 21 DSGVO
                  </h3>
                </div>

                <div className="p-4 bg-stone-100 rounded-lg border border-stone-300/80 space-y-3 text-xs md:text-sm text-stone-700">
                  <p className="font-semibold text-stone-900">
                    Einzelfallbezogenes Widerspruchsrecht:
                  </p>
                  <p>
                    Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung Sie betreffender personenbezogener Daten, die aufgrund von Art. 6 Abs. 1 lit. f DSGVO (Datenverarbeitung auf der Grundlage einer Interessenabwägung) erfolgt, Widerspruch einzulegen.
                  </p>
                  <p>
                    Legen Sie Widerspruch ein, verarbeiten wir Ihre personenbezogenen Daten nicht mehr, es sei denn, wir können zwingende schutzwürdige Gründe für die Verarbeitung nachweisen, die Ihre Interessen, Rechte und Freiheiten überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.
                  </p>
                  <div className="pt-2 border-t border-stone-200 text-xs">
                    <strong>Empfänger des Widerspruchs:</strong><br />
                    Herbert Götz &bull; Projektentwicklung Wohnraum GmbH<br />
                    Lorenz-Schmidt-Straße 38, 85055 Ingolstadt<br />
                    E-Mail: <a href="mailto:info@projektentwicklung-wohnraum.de" className="text-[#ff8200] underline font-medium">info@projektentwicklung-wohnraum.de</a>
                  </div>
                </div>
              </section>

              {/* 7. Datensicherheit & Urheberrecht */}
              <section id="ds-sicherheit" className="space-y-4 pt-2 scroll-mt-6">
                <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                  <div className="w-6 h-6 rounded-md bg-[#ff8200]/10 flex items-center justify-center text-[#ff8200]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-lg font-normal text-stone-900">
                    7. Änderung unserer Datenschutzerklärung &amp; Urheberrecht
                  </h3>
                </div>

                <div className="space-y-2 text-xs text-stone-600">
                  <p>
                    Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen, z.B. bei der Einführung neuer digitaler Services. Für Ihren erneuten Besuch gilt dann die jeweils aktuelle Datenschutzerklärung.
                  </p>
                  <p className="text-stone-400 italic pt-2">
                    Diese Datenschutzerklärung wurde u.a. mit Unterstützung der activeMind AG erstellt (Version #2024-10-25 / 2026).
                  </p>
                </div>
              </section>

            </div>
          </div>

          {/* Footer actions */}
          <div className="px-6 py-4 border-t border-stone-200 bg-white flex items-center justify-between">
            <div className="text-xs text-stone-500 font-sans">
              Stand: <strong>August 2026</strong> &bull; Projektentwicklung Wohnraum GmbH
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-md bg-stone-900 hover:bg-[#ff8200] text-white text-xs font-sans uppercase tracking-widest transition-colors duration-300 cursor-pointer shadow-sm"
            >
              Schließen
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
