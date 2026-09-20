import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  FileText, 
  BookmarkCheck, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Check, 
  PhoneCall, 
  ChevronRight,
  BadgePercent
} from "lucide-react";
import { Unit } from "./Wohnen";

interface WohnenReservierenModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUnits: Unit[];
  allUnits: Unit[];
  initialMode?: "reserve" | "expose";
  onToggleUnit: (id: string) => void;
  onClearSelection: () => void;
}

export default function WohnenReservierenModal({
  isOpen,
  onClose,
  selectedUnits,
  allUnits,
  initialMode = "reserve",
  onToggleUnit,
  onClearSelection
}: WohnenReservierenModalProps) {
  const [activeMode, setActiveMode] = useState<"reserve" | "expose">(initialMode);
  const [salutation, setSalutation] = useState<"Herr" | "Frau">("Herr");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState<"Eigennutzer" | "Kapitalanleger">("Eigennutzer");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setActiveMode(initialMode);
    setIsSubmitted(false);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const totalSelectedPrice = selectedUnits.reduce((sum, u) => sum + u.price, 0);
  const totalSelectedArea = selectedUnits.reduce((sum, u) => sum + u.area, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Apple Blur Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-md"
        />

        {/* Apple Liquid Glass Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl text-stone-900 rounded-[32px] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.25)] border border-stone-200/90 overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-stone-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#ff8200] flex items-center justify-center">
                {activeMode === "reserve" ? (
                  <BookmarkCheck className="w-5 h-5" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
              </div>
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase font-mono font-semibold text-[#ff8200] block">
                  Neubau Konrad-Strobl-Straße 6 &bull; Ingolstadt Etting
                </span>
                <h3 className="text-xl font-semibold text-stone-900">
                  {activeMode === "reserve" ? "Wohnung unverbindlich reservieren" : "Exposé anfordern"}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            
            {/* Mode Switcher */}
            <div className="flex p-1 rounded-2xl bg-stone-100 border border-stone-200/70">
              <button
                type="button"
                onClick={() => {
                  setActiveMode("reserve");
                  setIsSubmitted(false);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  activeMode === "reserve"
                    ? "bg-white text-stone-900 shadow-xs font-semibold"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                Wohnung reservieren ({selectedUnits.length > 0 ? selectedUnits.length : "Alle"})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMode("expose");
                  setIsSubmitted(false);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  activeMode === "expose"
                    ? "bg-white text-stone-900 shadow-xs font-semibold"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                Exposé &amp; Grundrisse
              </button>
            </div>

            {/* Selected Units Summary (if reserve mode) */}
            {activeMode === "reserve" && selectedUnits.length > 0 && (
              <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200/90 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono font-bold text-[#ff8200]">
                  <span>Vorgemerkte Einheiten:</span>
                  <span>{selectedUnits.length} gewählt</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedUnits.map(u => (
                    <span
                      key={u.id}
                      className="px-2.5 py-1 bg-white border border-orange-200 rounded-lg text-xs font-mono font-medium text-stone-800"
                    >
                      {u.name} &bull; {u.area} m² &bull; € {u.price.toLocaleString("de-DE")}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-stone-600 pt-1 border-t border-orange-200/60">
                  <span>Gesamtwohnfläche: {totalSelectedArea} m²</span>
                  <span className="font-bold text-stone-900">
                    Kaufpreis: € {totalSelectedPrice.toLocaleString("de-DE")}
                  </span>
                </div>
              </div>
            )}

            {/* Psychological Scarcity / Trust Banner */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60 text-xs text-stone-600">
              <ShieldCheck className="w-4 h-4 text-[#ff8200] shrink-0" />
              <span>
                <strong>100% Provisionsfrei</strong> direkt von Fehlner &amp; Götz. 14 Tage kostenfreie Vorab-Reservierung ohne Verpflichtung.
              </span>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block mb-1">
                      Anrede
                    </label>
                    <div className="flex gap-2">
                      {(["Herr", "Frau"] as const).map((sal) => (
                        <button
                          key={sal}
                          type="button"
                          onClick={() => setSalutation(sal)}
                          className={`flex-1 py-2 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                            salutation === sal
                              ? "bg-stone-900 text-white border-stone-900 font-semibold"
                              : "bg-white text-stone-600 border-stone-200"
                          }`}
                        >
                          {sal}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block mb-1">
                      Kaufabsicht
                    </label>
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value as any)}
                      className="w-full py-2 px-3 rounded-xl border border-stone-200 bg-white text-stone-800 text-xs font-mono focus:outline-none focus:border-[#ff8200]"
                    >
                      <option value="Eigennutzer">Eigennutzer</option>
                      <option value="Kapitalanleger">Kapitalanleger</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block mb-1">
                    Vor- und Nachname *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Max Mustermann"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#ff8200] shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block mb-1">
                      E-Mail-Adresse *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@beispiel.de"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#ff8200] shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block mb-1">
                      Telefonnummer *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+49 171 1234567"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#ff8200] shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block mb-1">
                    Ihre Anmerkung / Wunschtermin (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="z. B. Bevorzugte Kontaktaufnahme am Vormittag oder Fragen zum KfW-40-Darlehen..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#ff8200] shadow-2xs resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#ff8200] hover:bg-[#e67500] text-white font-mono text-xs font-semibold uppercase tracking-widest shadow-[0_10px_25px_-5px_rgba(255,130,0,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Übertrage Anfrage...</span>
                  ) : (
                    <>
                      <span>
                        {activeMode === "reserve" 
                          ? "Ausgewählte Wohnung unverbindlich reservieren" 
                          : "Exposé jetzt anfordern"}
                      </span>
                      <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>

                <p className="text-[10px] font-mono text-stone-400 text-center">
                  Direkter Kontakt zu Herbert Götz &amp; Andreas Fehlner &bull; Keine Vermittlungsprovision
                </p>

              </form>
            ) : (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-[fadeIn_0.5s_ease-out]">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-xl font-semibold text-stone-900">
                  Anfrage erfolgreich übermittelt!
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
                  Vielen Dank, {salutation} {name}. Ihre {activeMode === "reserve" ? "Reservierungsanfrage" : "Exposé-Anfrage"} für das Neubauprojekt in Ingolstadt Etting (Konrad-Strobl-Straße 6) wurde an die Bauträger Herbert Götz &amp; Andreas Fehlner übermittelt. Wir melden uns umgehend bei Ihnen.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-full bg-stone-900 text-white text-xs font-mono uppercase tracking-wider cursor-pointer hover:bg-stone-800"
                >
                  Schließen
                </button>
              </div>
            )}

          </div>

          {/* Footer Direct Contact Bar */}
          <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200/80 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-2">
            <span>Direktkontakt Bauträger:</span>
            <div className="flex items-center gap-4">
              <a href="tel:+498456964883" className="hover:text-[#ff8200] font-mono font-medium flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>+49 (0) 8456 / 964 883</span>
              </a>
              <a href="tel:+491716535481" className="hover:text-[#ff8200] font-mono font-medium hidden sm:inline">
                Mobil: 0171 / 65 35 481
              </a>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
