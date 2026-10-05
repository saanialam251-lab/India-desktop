import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Plus, Search } from "lucide-react";
import { PLAYERS, ROLE_LABEL, ROLE_COLOR, initials } from "../data/players";
const FILTERS = ["all", "bat", "wk", "ar", "fast", "spin"];
const stats = p => [p.avg != null && `Avg ${p.avg}`, p.sr != null && `SR ${p.sr}`, p.bavg != null && `Bowl avg ${p.bavg}`, p.econ != null && `Econ ${p.econ}`].filter(Boolean).join(" · ");
export default function PlayerGrid({ selected, onPick, blockReason }) {
  const [f, setF] = useState("all"), [q, setQ] = useState(""), box = useRef(null);
  useEffect(() => { box.current?.scrollTo({ top: 0 }); }, [f, q]);   // new filter / search: start the list from the top
  const list = PLAYERS.filter(p => (f === "all" || p.role === f) && p.name.toLowerCase().includes(q.trim().toLowerCase()));
  const picked = k => selected.filter(id => k === "all" || PLAYERS.find(p => p.id === id).role === k).length;
  return (<section className="flex-1 min-w-0">
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      <label className="relative flex-1 max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search players" className="field pl-10 py-2.5" />
      </label>
      <div className="flex gap-1 p-1 rounded-2xl bg-white/[.04] border border-white/10 overflow-x-auto scroll-thin min-w-0 max-w-full">
        {FILTERS.map(k => <button key={k} onClick={() => setF(k)}
          className={`shrink-0 px-3.5 py-1.5 rounded-xl text-sm flex items-center gap-1.5 transition ${f === k ? "bg-white text-[#050d1f] font-semibold" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
          {k !== "all" && <span className="w-2 h-2 rounded-full" style={{ background: ROLE_COLOR[k] }} />}
          {k === "all" ? "All" : ROLE_LABEL[k]}
          {picked(k) > 0 && <span className={`text-[11px] rounded-full px-1.5 ${f === k ? "bg-[#050d1f]/10" : "bg-white/10"}`}>{picked(k)}</span>}
        </button>)}
      </div>
    </div>
    {!list.length && <p className="text-white/50 text-sm py-10 text-center">No players match “{q}”.</p>}
    {/* Only about 5 players are visible; the list scrolls up/down inside this box (never sideways), so the page itself stays short. */}
    <div ref={box} className="max-h-[600px] min-[420px]:max-h-[400px] md:max-h-[340px] overflow-y-auto overflow-x-hidden scroll-thin pr-1.5 -mr-1.5 rounded-2xl">
    <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3 pb-1">
      {list.map((p, i) => { const on = selected.includes(p.id), blocked = !on && blockReason(p.id), color = ROLE_COLOR[p.role];
        return <motion.button key={p.id} style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }} whileTap={{ scale: .96 }} onClick={() => onPick(p.id)} aria-pressed={on} title={blocked || undefined}
          className={`card-in cj cj${i % 6} ${on ? "sel-bounce" : ""} group relative overflow-hidden rounded-2xl p-4 text-left border transition-colors ${on ? "bg-[#FF9933]/[.12] border-[#FF9933]" : "glass hover:border-white/25"} ${blocked ? "opacity-45" : ""}`}>
          <span className="absolute inset-x-0 top-0 h-1" style={{ background: color }} />
          <div className="flex items-center gap-3">
            <span className="grid place-items-center shrink-0 w-11 h-11 rounded-full font-oswald text-lg" style={{ background: `${color}26`, color, boxShadow: `inset 0 0 0 1.5px ${color}66` }}>{initials(p.name)}</span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold leading-tight truncate">{p.name}</p>
              <p className="text-xs mt-0.5" style={{ color }}>{ROLE_LABEL[p.role]}</p>
            </div>
            <span key={on ? "on" : "off"} className={`grid place-items-center shrink-0 w-7 h-7 rounded-full transition ${on ? "cj cj0 " : ""}${on ? "bg-[#FF9933] text-[#050d1f]" : "bg-white/10 text-white/60 group-hover:bg-white/20 group-hover:text-white"}`}>
              {on ? <Check size={16} strokeWidth={3} /> : <Plus size={16} />}
            </span>
          </div>
          {p.tag && <p className="text-[11px] text-white/70 mt-2 leading-snug">{p.tag}</p>}
          {stats(p) && <p className="text-xs text-white/55 mt-3" title="ODI career">{stats(p)}</p>}
          {blocked && <p className="text-[11px] text-amber-300/90 mt-2">{blocked}</p>}
        </motion.button>; })}
    </div>
    </div>
  </section>);
}
