import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Printer, 
  Mail, 
  Globe, 
  UserCheck, 
  ShieldCheck, 
  Scale, 
  FileCheck2,
  Award
} from "lucide-react";

interface ImpressumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDatenschutz?: () => void;
}

export default function ImpressumModal({ isOpen, onClose, onOpenDatenschutz }: ImpressumModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 overflow-y-auto">
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
          className="relative w-full max-w-4xl bg-[#faf9f8] text-[#1c1917] rounded-xl shadow-2xl border border-stone-200/80 overflow-hidden flex flex-col max-h-[90vh] z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#ff8200]/10 flex items-center justify-center border border-[#ff8200]/30 text-[#ff8200]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold text-[#ff8200] block">
                  Rechtliche Angaben &bull; § 5 TMG &bull; § 18 MStV
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 tracking-tight">
                  Impressum
                </h2>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors duration-200 cursor-pointer"
              title="Schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 font-sans text-stone-700 text-sm leading-relaxed">
            
            {/* Top Company Card */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="text-[10px] tracking-widest uppercase font-semibold text-[#ff8200]">Unternehmen</div>
                <h3 className="font-serif text-2xl text-stone-900 font-medium">Projektentwicklung Wohnraum GmbH</h3>
                <div className="text-sm text-stone-600 space-y-1.5 pt-1">
                  <p className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#ff8200] shrink-0 mt-0.5" />
                    <span>
                      Lorenz-Schmidt-Straße 38<br />
                      85055 Ingolstadt (Etting)<br />
                      Deutschland
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 md:border-l md:border-stone-100 md:pl-6">
                <div className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">Kontakt &amp; Kommunikation</div>
                <div className="text-sm text-stone-600 space-y-2">
                  <p className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#ff8200] shrink-0" />
                    <span>Telefon: <strong>+49 (0) 841 | 98 12 30 88</strong></span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Printer className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>Telefax: +49 (0) 841 | 98 12 30 89</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#ff8200] shrink-0" />
                    <a href="mailto:info@projektentwicklung-wohnraum.de" className="text-stone-800 hover:text-[#ff8200] font-medium underline">
                      info@projektentwicklung-wohnraum.de
                    </a>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>www.projektentwicklung-wohnraum.de</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Management & Representation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-lg bg-white border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-stone-900 font-medium">
                  <UserCheck className="w-4 h-4 text-[#ff8200]" />
                  Vertretungsberechtigter Geschäftsführer
                </div>
                <div className="text-base font-serif text-stone-900 font-medium">Herbert Götz</div>
                <div className="text-xs text-stone-500">
                  Inhaltlich verantwortlich gemäß § 18 Abs. 2 MStV
                </div>
              </div>

              <div className="p-5 rounded-lg bg-white border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-stone-900 font-medium">
                  <Award className="w-4 h-4 text-[#ff8200]" />
                  Prokura
                </div>
                <div className="text-base font-serif text-stone-900 font-medium">Andreas Fehlner</div>
                <div className="text-xs text-stone-500">
                  Projektleitung &amp; Prokurist
                </div>
              </div>
            </div>

            {/* Legal Authorities, §34c GewO, Register & Chamber */}
            <div className="space-y-4">
              <h4 className="font-serif text-lg text-stone-900 border-b border-stone-200 pb-2">
                Gewerberechtliche Zulassung &amp; Aufsichtsbehörden
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                  <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-[#ff8200]" />
                    Genehmigung nach § 34c GewO erteilt durch:
                  </div>
                  <p className="text-stone-600">
                    <strong>Landratsamt Eichstätt</strong><br />
                    Dienststelle Ingolstadt<br />
                    Auf der Schanz 39, 85049 Ingolstadt
                  </p>
                </div>

                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                  <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-[#ff8200]" />
                    Zuständige Aufsichtsbehörde &amp; Kammer:
                  </div>
                  <p className="text-stone-600">
                    <strong>IHK für München und Oberbayern</strong><br />
                    Max-Joseph-Straße 2, 80333 München<br />
                    (Zuständig seit dem 01.01.2020)
                  </p>
                </div>

                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                  <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#ff8200]" />
                    Registergericht &amp; Umsatzsteuer-ID:
                  </div>
                  <p className="text-stone-600">
                    <strong>Amtsgericht Ingolstadt</strong> &bull; HRB 7830<br />
                    Sitz der Gesellschaft: Ingolstadt<br />
                    Umsatzsteuer-Identifikationsnummer (UID): <strong>DE306015545</strong>
                  </p>
                </div>

                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                  <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#ff8200]" />
                    Berufshaftpflichtversicherung:
                  </div>
                  <p className="text-stone-600">
                    <strong>Bayerischer Versicherungsverband</strong><br />
                    Maximilianstraße 53, 80530 München<br />
                    Geltungsraum der Versicherung: <strong>Deutschland</strong>
                  </p>
                </div>

              </div>
            </div>

            {/* EU Dispute Resolution */}
            <div className="p-4 bg-white rounded-lg border border-stone-200 text-xs text-stone-600 space-y-2">
              <div className="font-medium text-stone-900">Verbraucherstreitbeilegung &amp; Online-Streitbeilegung</div>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" className="text-[#ff8200] underline">
                  https://ec.europa.eu/consumers/odr
                </a>.
              </p>
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>

          </div>

          {/* Footer actions */}
          <div className="px-6 py-4 border-t border-stone-200 bg-white flex items-center justify-between">
            {onOpenDatenschutz ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenDatenschutz();
                }}
                className="text-xs text-[#ff8200] hover:underline font-medium cursor-pointer"
              >
                Zur Datenschutzerklärung &rarr;
              </button>
            ) : <div />}

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
