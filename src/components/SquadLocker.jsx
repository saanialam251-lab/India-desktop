import { useEffect } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { Check, X } from "lucide-react";
import { byId, count, RULES, ROLE_LABEL, ROLE_COLOR, initials } from "../data/players";
const ORDER = ["bat", "wk", "ar", "fast", "spin"];
const GROUPS = [["Batters", "bat", RULES.bat], ["Keepers", "wk", RULES.wk], ["All-rounders", "ar", RULES.ar], ["Bowlers", "bowl", RULES.bowl], ["Pace", "fast", [RULES.minFast]], ["Spin", "spin", [RULES.minSpin]]];
const Tag = ({ on, label, title, onClick }) => <button onClick={onClick} title={title} aria-pressed={on}
  className={`w-7 h-7 shrink-0 rounded-lg text-[10px] font-bold transition ${on ? "bg-[#FF9933] text-[#050d1f]" : "bg-white/[.06] text-white/50 hover:bg-white/15 hover:text-white"}`}>{label}</button>;
export default function SquadLocker({ selected, onRemove, shake, cap, vc, wk, setRole, problem, go, onFinalize }) {
  const c = count(selected), controls = useAnimationControls();
  const full = selected.length === 15;
  const sorted = [...selected].sort((a, b) => ORDER.indexOf(byId[a].role) - ORDER.indexOf(byId[b].role));
  const missing = full && !problem ? [!cap && "captain", !vc && "vice-captain", !wk && "wicket-keeper"].filter(Boolean) : [];
  useEffect(() => { if (shake) controls.start({ x: [0, -8, 8, -6, 6, 0], transition: { duration: .4 } }); }, [shake]);
  
  return (<motion.div animate={controls} className="glass rounded-3xl p-4 sm:p-5 w-full min-w-0 overflow-hidden">
    <div className="flex items-baseline justify-between mb-3">
      <h2 className="font-oswald text-2xl">Squad Locker</h2>
      <span className={`font-oswald text-xl ${full ? "text-[#22c55e]" : "text-white/80"}`}>{selected.length}<span className="text-white/40">/15</span></span>
    </div>
    <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4"><motion.div className={`h-full ${full ? "bg-[#22c55e]" : "bg-[#FF9933]"}`} animate={{ width: `${selected.length / 15 * 100}%` }} /></div>
    <div className="grid grid-cols-2 min-[400px]:grid-cols-3 gap-1.5 mb-4">
      {GROUPS.map(([label, k, [min, max]]) => { const n = c[k], ok = n >= min;
        return <div key={k} className={`rounded-xl px-2.5 py-1.5 border text-[11px] ${ok ? "border-[#22c55e]/35 bg-[#22c55e]/[.07]" : "border-white/10 bg-white/[.03]"}`}>
          <p className="text-white/55 flex items-center justify-between">{label}{ok && <Check size={12} className="text-[#22c55e]" />}</p>
          <p className="font-semibold text-sm">{n}<span className="text-white/40 font-normal text-[11px]"> {max ? `/ ${min}–${max}` : `/ min ${min}`}</span></p>
        </div>; })}
    </div>
    {!selected.length ? <p className="text-sm text-white/50 text-center py-6 border border-dashed border-white/15 rounded-2xl">Tap players on the left to add them to your squad.</p> : <>
      <p className="text-[11px] text-white/45 mb-2">Tap <b className="text-white/70">C</b>, <b className="text-white/70">VC</b> or <b className="text-white/70">WK</b> to assign roles.</p>
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-1.5 max-h-[46vh] overflow-y-auto scroll-thin pr-1"><AnimatePresence initial={false}>{sorted.map(id => { const p = byId[id], color = ROLE_COLOR[p.role];
        return <motion.li key={id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          className="flex items-center gap-1.5 min-w-0 bg-white/[.04] rounded-xl pl-2 pr-1.5 py-1.5 text-sm">
          <span className="grid place-items-center shrink-0 w-7 h-7 rounded-full text-[11px] font-oswald" style={{ background: `${color}26`, color }}>{initials(p.name)}</span>
          <span className="flex-1 min-w-0"><span className="block truncate leading-tight">{p.name}</span><span className="text-[11px]" style={{ color }}>{ROLE_LABEL[p.role]}</span></span>
          <Tag on={cap === id} label="C" title="Make captain" onClick={() => setRole("cap", id)} />
          <Tag on={vc === id} label="VC" title="Make vice-captain" onClick={() => setRole("vc", id)} />
          {p.role === "wk" ? <Tag on={wk === id} label="WK" title="Make main wicket-keeper" onClick={() => setRole("wk", id)} /> : <span className="w-7 shrink-0" />}
          <button onClick={() => onRemove(id)} aria-label={`Remove ${p.name}`} className="grid place-items-center w-7 h-7 rounded-lg text-white/40 hover:text-white hover:bg-red-500/20"><X size={15} /></button>
        </motion.li>; })}</AnimatePresence></ul></>}
    {(problem || missing?.length > 0) && <p className="text-amber-300 text-xs mt-3">{problem || `Choose a ${missing.join(", ")} above.`}</p>}
    {!full && selected.length > 0 && <p className="text-white/45 text-xs mt-3">Add {15 - selected.length} more player{15 - selected.length > 1 ? "s" : ""}.</p>}
    <motion.button whileHover={go ? { scale: 1.02 } : {}} whileTap={go ? { scale: .98 } : {}} disabled={!go} onClick={onFinalize}
      className="mt-4 w-full bg-[#0F52BA] disabled:bg-white/10 disabled:text-white/40 disabled:shadow-none rounded-xl py-3 font-semibold shadow-[0_10px_30px_rgba(15,82,186,.4)] transition-colors">Finalize Your Squad</motion.button>
  </motion.div>);
}
