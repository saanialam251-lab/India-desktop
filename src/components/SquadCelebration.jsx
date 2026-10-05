import { useEffect } from "react";
import { useScrollLock } from "../utils/hooks";
import { byId, ROLE_COLOR, ROLE_LABEL, initials } from "../data/players";
const ORDER = ["bat", "wk", "ar", "fast", "spin"];
const CLIP = "polygon(30% 0,38% 6%,62% 6%,70% 0,100% 18%,88% 38%,76% 30%,76% 100%,24% 100%,24% 30%,12% 38%,0 18%)";

// Shown after "Done": the fan's own 15, each jersey entering with a different animation (CSS only, so it stays smooth).
export default function SquadCelebration({ squad, fans, onClose }) {
  useScrollLock();
  useEffect(() => { const t = setTimeout(onClose, 15000); return () => clearTimeout(t); }, []);
  const ids = [...squad.selected].filter(id => byId[id]).sort((a, b) => ORDER.indexOf(byId[a].role) - ORDER.indexOf(byId[b].role));
  const tag = id => id === squad.cap ? "C" : id === squad.vc ? "VC" : id === squad.wk ? "WK" : "";
  return (<div className="fade-in fixed inset-0 z-50 bg-[#050d1f] overflow-y-auto overflow-x-hidden" style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}>
    <div className="max-w-2xl mx-auto px-4 py-8 text-center">
      <div className="tricolour h-1 w-24 mx-auto rounded-full mb-4" />
      <h2 className="font-oswald text-3xl sm:text-4xl cj cj0">Your 15 for India 2027</h2>
      <p className="text-white/60 text-sm mt-1 cj cj5" style={{ animationDelay: ".15s" }}>Squad locked in and saved. Jai Hind!</p>
      <div className="celeb-grid grid grid-cols-3 sm:grid-cols-5 gap-x-2 gap-y-4 mt-7">
        {ids.map((id, i) => { const p = byId[id], c = ROLE_COLOR[p.role], t = tag(id);
          return (<div key={id} className={`cj cj${i % 6} min-w-0`} style={{ animationDelay: `${.25 + i * .07}s` }}>
            <div className="relative mx-auto w-[84px] max-w-full aspect-[84/96]">
              <div className="absolute inset-0 grid place-items-center pt-2 font-oswald text-2xl" style={{ background: `linear-gradient(160deg,${c},#06265f)`, clipPath: CLIP }}>{initials(p.name)}</div>
              {t && <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-[#FF9933] text-[#050d1f] rounded-full px-1.5 py-0.5 glow">{t}</span>}
            </div>
            <p className="text-[12px] font-semibold mt-1.5 truncate">{p.name.split(" ").slice(-1)[0]}</p>
            <p className="text-[10px] truncate" style={{ color: c }}>{ROLE_LABEL[p.role]}</p>
          </div>); })}
      </div>
      <p className="mt-8 text-sm text-white/70 cj cj5" style={{ animationDelay: "1.5s" }}>🏏 <b>{fans}</b> squad{fans === 1 ? "" : "s"} submitted by fans so far. Yours is counted!</p>
      <button onClick={onClose} className="cj cj5 mt-5 px-8 py-3 rounded-xl bg-[#0F52BA] font-semibold" style={{ animationDelay: "1.6s" }}>Back to home</button>
    </div></div>);
}
