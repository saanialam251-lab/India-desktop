import { motion } from "framer-motion";
import { Shirt } from "lucide-react";
const STEPS = ["Pick 15 players", "Choose C, VC & keeper", "Send your squad"];
export default function HeroJerseys({ step, fans = 0 }) {
  return (<header className="max-w-[1400px] mx-auto px-4 pt-12 pb-8 text-center">
    <div className="flex justify-center items-end gap-3 mb-5">
      {[18, 45, 7].map((n, i) => <motion.div key={n} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * .15 }}
className="relative text-[#0F52BA]"><Shirt size={i === 1 ? 84 : 60} strokeWidth={1.2} fill="currentColor" className="drop-shadow-[0_10px_30px_rgba(15,82,186,.6)]" />
        <span className="absolute inset-0 flex items-center justify-center font-oswald text-white text-lg pt-2">{n}</span></motion.div>)}
    </div>
    <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-oswald text-5xl md:text-7xl tracking-wide">INDIA 2027</motion.h1>
    <div className="tricolour h-1 w-24 mx-auto rounded-full mt-3" />
    <p className="mt-3 text-white/70 md:text-lg">The Blue Army Squad Lab – pick your 15 for the World Cup</p>
    {fans > 0 && <p className="mt-4 inline-block rounded-full border border-[#22c55e]/40 bg-[#22c55e]/10 text-xs sm:text-sm px-3.5 py-1">🏏 <b>{fans}</b> fan{fans > 1 ? "s have" : " has"} submitted a squad</p>}
    <br />
    <ol className="mt-4 inline-flex flex-wrap justify-center gap-2 text-xs sm:text-sm">
      {STEPS.map((s, i) => { const state = i < step ? "done" : i === step ? "now" : "next";
        return <li key={s} className={`flex items-center gap-2 rounded-full pl-1.5 pr-3.5 py-1.5 border transition ${state === "now" ? "bg-[#FF9933]/15 border-[#FF9933]/60 text-white" : state === "done" ? "border-[#22c55e]/40 text-white/80" : "border-white/10 text-white/45"}`}>
          <span className={`grid place-items-center w-5 h-5 rounded-full text-[11px] font-semibold ${state === "now" ? "bg-[#FF9933] text-[#050d1f]" : state === "done" ? "bg-[#22c55e] text-[#050d1f]" : "bg-white/10"}`}>{state === "done" ? "✓" : i + 1}</span>{s}</li>; })}
    </ol>
  </header>);
}
