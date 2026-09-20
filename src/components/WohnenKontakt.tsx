import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Check, 
  PhoneCall, 
  MailOpen, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  FileText, 
  BookmarkCheck, 
  Building2, 
  User, 
  Calendar,
  ChevronRight,
  BadgePercent
} from "lucide-react";
import { Unit } from "./Wohnen";

interface WohnenKontaktProps {
  selectedUnits: Unit[];
  allUnits: Unit[];
  onToggleUnit: (id: string) => void;
  onClearSelection: () => void;
  intentMode?: "reserve" | "expose" | "general";
}

export default function WohnenKontakt({
  selectedUnits,
  allUnits,
  onToggleUnit,
  onClearSelection,
  intentMode = "reserve"
}: WohnenKontaktProps) {
  const [selectedIntent, setSelectedIntent] = useState<"reserve" | "expose" | "consultation">(
    intentMode === "expose" ? "expose" : selectedUnits.length > 0 ? "reserve" : "reserve"
  );

  // Sync if selectedUnits changes
  useEffect(() => {
    if (selectedUnits.length > 0 && selectedIntent === "expose") {
      setSelectedIntent("reserve");
    }
  }, [selectedUnits.length]);

  // Form State
  const [salutation, setSalutation] = useState<"Herr" | "Frau">("Herr");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState<"Eigennutzer" | "Kapitalanleger" | "Noch offen">("Eigennutzer");
  const [message, setMessage] = useState("");
  const [wantsExpose, setWantsExpose] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSelectedPrice = selectedUnits.reduce((sum, u) => sum + u.price, 0);
  const totalSelectedArea = selectedUnits.reduce((sum, u) => sum + u.area, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <section id="wohnen-kontakt" className="pt-8 scroll-mt-24 space-y-16">
      
      {/* SECTION HEADER: Psychology & Sales Focus */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-4xl mx-auto space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-[#ff8200] text-xs font-mono uppercase tracking-widest font-semibold">
          <BadgePercent className="w-3.5 h-3.5" />
          <span>0 % Maklerprovision &bull; Bauträger-Direktvertrieb</span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-stone-900 leading-[1.1]">
          Sichern Sie sich Ihr Zuhause. <br />
          <span className="text-[#ff8200]">Direkt. Unverbindlich. Exklusiv.</span>
        </h2>

        <p className="text-base sm:text-xl text-stone-500 font-light max-w-2xl mx-auto leading-relaxed">
          Nur 11 Einheiten im Neubauprojekt Konrad-Strobl-Straße 6 in Ingolstadt Etting. 
          Reservieren Sie Ihre Wunschwohnung vorab für 14 Tage oder fordern Sie das vollständige Exposé an.
        </p>

        {/* 3 PSYCHOLOGICAL CONVERSION HIGHLIGHTS (APPLE GLASS PILLS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-left">
          
          <div className="rounded-2xl p-5 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/60 text-[#ff8200] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-900">Keine Maklerkosten</h4>
              <p className="text-xs text-stone-500 font-light mt-1">
                Sie erwerben direkt von den Bauträgern Fehlner &amp; Götz. Keine versteckten Vermittlungsgebühren.
              </p>
            </div>
          </div>

          <div className="rounded-2xl p-5 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/60 text-[#ff8200] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-900">14 Tage Vorab-Reservierung</h4>
              <p className="text-xs text-stone-500 font-light mt-1">
                100% risikofreie Prüfzeit für Finanzierung und Kaufvertragsprüfung mit gesichertem Vorzug.
              </p>
            </div>
          </div>

          <div className="rounded-2xl p-5 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/60 text-[#ff8200] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-900">KfW-40-QNG Zinsvorteil</h4>
              <p className="text-xs text-stone-500 font-light mt-1">
                Bis zu 150.000 € zinsgünstiges Förderdarlehen pro Wohneinheit mit Tilgungszuschüssen.
              </p>
            </div>
          </div>

        </div>
      </motion.div>

      {/* MAIN CONVERSION CARD (APPLE LIQUID GLASS STYLE) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-[36px] bg-white/90 backdrop-blur-2xl border border-stone-200/90 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.08)] overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* LEFT: INTERACTIVE FORM (7 COLUMNS) */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 space-y-8 border-b lg:border-b-0 lg:border-r border-stone-200/80">
            
            {/* INTENT SWITCHER PILLS */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 font-bold block">
                Ihr Anliegen:
              </span>
              <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-stone-100/90 border border-stone-200/70">
                <button
                  type="button"
                  onClick={() => setSelectedIntent("reserve")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-mono font-medium transition-all text-center cursor-pointer ${
                    selectedIntent === "reserve"
                      ? "bg-white text-stone-900 shadow-xs font-semibold"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  Wohnung reservieren
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIntent("expose")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-mono font-medium transition-all text-center cursor-pointer ${
                    selectedIntent === "expose"
                      ? "bg-white text-stone-900 shadow-xs font-semibold"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  Exposé anfordern
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIntent("consultation")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-mono font-medium transition-all text-center cursor-pointer ${
                    selectedIntent === "consultation"
                      ? "bg-white text-stone-900 shadow-xs font-semibold"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  Beratungstermin
                </button>
              </div>
            </div>

            {/* SELECTED UNITS CALLOUT (IF ANY) */}
            {selectedUnits.length > 0 ? (
              <div className="p-5 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#ff8200] flex items-center gap-1.5">
                    <BookmarkCheck className="w-4 h-4" />
                    Vormerkung für {selectedUnits.length} {selectedUnits.length === 1 ? "Einheit" : "Einheiten"}:
                  </span>
                  <button
                    type="button"
                    onClick={onClearSelection}
                    className="text-[11px] font-mono text-stone-400 hover:text-stone-700 cursor-pointer underline"
                  >
                    Zurücksetzen
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedUnits.map((u) => (
                    <span
                      key={u.id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-orange-200 rounded-xl text-xs font-mono text-stone-800 shadow-2xs"
                    >
                      <span className="font-bold text-[#ff8200]">{u.name}</span>
                      <span>({u.area} m² &bull; € {u.price.toLocaleString("de-DE")})</span>
                      <button
                        type="button"
                        onClick={() => onToggleUnit(u.id)}
                        className="text-stone-400 hover:text-red-500 font-bold ml-1"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs font-mono text-stone-600 pt-1 border-t border-orange-200/60">
                  <span>Kombinierte Wohnfläche: {totalSelectedArea} m²</span>
                  <span className="font-bold text-stone-900">
                    Gesamtpreis: € {totalSelectedPrice.toLocaleString("de-DE")}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs text-stone-500 flex items-center justify-between gap-4">
                <span>
                  Noch keine Wohnung gewählt? Sie können oben im 3D-Modell oder in der Liste Einheiten vormerken.
                </span>
                <a
                  href="#apartments-overview"
                  className="text-xs font-mono uppercase font-semibold text-[#ff8200] hover:underline whitespace-nowrap"
                >
                  Zu den Wohnungen &darr;
                </a>
              </div>
            )}

            {/* FORM OR SUCCESS MESSAGE */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Salutation & Purpose */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-stone-500 block mb-2 font-medium">
                      Anrede
                    </label>
                    <div className="flex gap-2">
                      {(["Herr", "Frau"] as const).map((sal) => (
                        <button
                          key={sal}
                          type="button"
                          onClick={() => setSalutation(sal)}
                          className={`flex-1 py-2.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                            salutation === sal
                              ? "bg-stone-900 text-white border-stone-900 font-semibold"
                              : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                          }`}
                        >
                          {sal}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-stone-500 block mb-2 font-medium">
                      Kaufinteresse
                    </label>
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value as any)}
                      className="w-full py-2.5 px-3 rounded-xl border border-stone-200 bg-white text-stone-800 text-xs font-mono focus:outline-none focus:border-[#ff8200] transition-colors"
                    >
                      <option value="Eigennutzer">Eigennutzer</option>
                      <option value="Kapitalanleger">Kapitalanleger</option>
                      <option value="Noch offen">Noch in Überlegung</option>
                    </select>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-stone-500 block mb-1.5 font-medium">
                    Vor- und Nachname *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="z. B. Maximilian Muster"
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-stone-200/90 text-stone-900 text-sm focus:outline-none focus:border-[#ff8200] focus:ring-4 focus:ring-[#ff8200]/10 transition-all shadow-2xs"
                  />
                </div>

                {/* Contact: Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-stone-500 block mb-1.5 font-medium">
                      E-Mail-Adresse *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@beispiel.de"
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-stone-200/90 text-stone-900 text-sm focus:outline-none focus:border-[#ff8200] focus:ring-4 focus:ring-[#ff8200]/10 transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-stone-500 block mb-1.5 font-medium">
                      Telefonnummer * (für direkte Rücksprache)
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+49 171 1234567"
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-stone-200/90 text-stone-900 text-sm focus:outline-none focus:border-[#ff8200] focus:ring-4 focus:ring-[#ff8200]/10 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Custom Message or Questions */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-stone-500 block mb-1.5 font-medium">
                    Ihre Nachricht / Wunschtermin
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Geben Sie hier Ihre Fragen, Wunsch-Wohnung oder Terminpräferenzen für eine persönliche Besichtigung an..."
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-stone-200/90 text-stone-900 text-sm focus:outline-none focus:border-[#ff8200] focus:ring-4 focus:ring-[#ff8200]/10 transition-all shadow-2xs resize-none"
                  />
                </div>

                {/* Expose Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={wantsExpose}
                    onChange={(e) => setWantsExpose(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-stone-300 text-[#ff8200] focus:ring-[#ff8200]"
                  />
                  <span className="text-xs text-stone-600 font-light group-hover:text-stone-900 transition-colors">
                    Bitte senden Sie mir das vollständige Exposé mit allen Grundrissen, Baubeschreibung und Preisliste kostenfrei per E-Mail zu.
                  </span>
                </label>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-8 rounded-2xl bg-[#ff8200] hover:bg-[#e67500] text-white font-mono text-xs font-semibold uppercase tracking-widest shadow-[0_12px_28px_-6px_rgba(255,130,0,0.38)] transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Wird übertragen...</span>
                  ) : (
                    <>
                      <span>
                        {selectedIntent === "reserve" 
                          ? "Wohnung jetzt unverbindlich anfragen & reservieren" 
                          : selectedIntent === "expose" 
                          ? "Vollständiges Exposé anfordern" 
                          : "Beratungstermin anfordern"}
                      </span>
                      <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-stone-400 text-center font-light">
                  Ihre Anfrage ist absolut unverbindlich und kostenfrei. Wir behandeln Ihre Daten mit höchster Diskretion.
                </p>

              </form>
            ) : (
              <div className="p-8 sm:p-10 rounded-3xl bg-emerald-50/80 border border-emerald-200 text-center space-y-5 animate-[fadeIn_0.6s_ease-out]">
                <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-7 h-7 stroke-[3]" />
                </div>
                <h3 className="text-2xl font-semibold text-stone-900">
                  Vielen Dank, {salutation} {fullName}!
                </h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  Ihre Anfrage für das Neubauprojekt Ingolstadt Etting (Konrad-Strobl-Straße 6) ist erfolgreich bei uns eingegangen. 
                  {selectedUnits.length > 0 && (
                    <span className="block font-medium text-stone-900 mt-2">
                      Ihre Vormerkung für {selectedUnits.map(u => u.name).join(", ")} ist vorläufig vermerkt.
                    </span>
                  )}
                  Die Geschäftsführer Herbert Götz &amp; Andreas Fehlner werden sich innerhalb von 24 Stunden persönlich mit Ihnen in Verbindung setzen.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-white border border-stone-200 text-xs font-mono uppercase tracking-wider text-stone-700 hover:text-stone-950 shadow-xs cursor-pointer"
                >
                  Neue Anfrage senden
                </button>
              </div>
            )}

          </div>

          {/* RIGHT: DIRECT BUILDER CONTACT & PROJECT DATA (5 COLUMNS) */}
          <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 bg-stone-50/70 space-y-10 flex flex-col justify-between">
            
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#ff8200] font-bold block mb-1">
                  Bauträger &bull; Persönliche Betreuung
                </span>
                <h3 className="text-2xl font-semibold tracking-tight text-stone-900">
                  Fehlner &amp; Götz
                </h3>
                <p className="text-xs text-stone-500 font-light mt-1">
                  Geschäftsführer: Herbert Götz &amp; Andreas Fehlner
                </p>
              </div>

              {/* Direct Telephone Cards */}
              <div className="space-y-3">
                <a
                  href="tel:+498456964883"
                  className="p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-[#ff8200]/50 shadow-2xs flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff8200] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                        Zentrale Telefon
                      </span>
                      <span className="text-sm font-semibold text-stone-900 group-hover:text-[#ff8200] transition-colors">
                        +49 (0) 8456 / 964 883
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-[#ff8200] group-hover:translate-x-1 transition-all" />
                </a>

                <a
                  href="tel:+491716535481"
                  className="p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-[#ff8200]/50 shadow-2xs flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff8200] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                        Mobil / WhatsApp
                      </span>
                      <span className="text-sm font-semibold text-stone-900 group-hover:text-[#ff8200] transition-colors">
                        +49 (0) 171 / 65 35 481
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-[#ff8200] group-hover:translate-x-1 transition-all" />
                </a>

                <a
                  href="mailto:info@projektentwicklung-wohnraum.de"
                  className="p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-[#ff8200]/50 shadow-2xs flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff8200] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <MailOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                        E-Mail Direkt
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-[#ff8200] transition-colors truncate max-w-[200px] block">
                        info@projektentwicklung-wohnraum.de
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-[#ff8200] group-hover:translate-x-1 transition-all" />
                </a>
              </div>

              {/* Project & Office Locations */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200/80 space-y-4 shadow-2xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#ff8200] shrink-0 mt-1" />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                      Projekt-Standort
                    </span>
                    <span className="text-sm font-medium text-stone-900 block">
                      Konrad-Strobl-Straße 6
                    </span>
                    <span className="text-xs text-stone-500">
                      85055 Ingolstadt (Etting)
                    </span>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-3 flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-stone-400 shrink-0 mt-1" />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                      Unternehmenssitz
                    </span>
                    <span className="text-sm font-medium text-stone-900 block">
                      Lorenz-Schmidt-Straße 38
                    </span>
                    <span className="text-xs text-stone-500">
                      85055 Ingolstadt
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Quality & Trust Badges */}
            <div className="pt-4 border-t border-stone-200/80 space-y-2">
              <div className="flex items-center gap-2 text-xs text-stone-600">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>25+ Jahre Erfahrung im Ingolstädter Wohnungsbau</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-600">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>Festpreis- &amp; Fertigstellungsgarantie</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-600">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>Regionale Meisterhandwerker aus Bayern</span>
              </div>
            </div>

          </div>

        </div>
      </motion.div>

    </section>
  );
}
