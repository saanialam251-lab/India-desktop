import { useState, useEffect, useRef, useCallback, memo } from "react";
import { UserCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { byId, count, RULES } from "./data/players";
import BackgroundFX from "./components/BackgroundFX"; import HeroJerseys from "./components/HeroJerseys";

import PlayerGrid from "./components/PlayerGrid";
import SquadLocker from "./components/SquadLocker";
import SubmitModal from "./components/SubmitModal";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import AuthModal from "./components/AuthModal";
import SquadCelebration from "./components/SquadCelebration";
import { getStats, serverReady } from "./utils/api";
import { getSession, saveSession, clearSession, restoreSquads, loadCommunity, saveCommunity } from "./utils/storage";

const MAX = {
  bat: 7,
  bowl: 8,
  ar: 4,
  wk: 2,
};

const GROUP_NAME = {
  bat: "batters",
  bowl: "bowlers",
  ar: "all-rounders",
  wk: "wicket-keepers",
};

const groupOf = (id) => {
  const r = byId[id].role;
  return r === "fast" || r === "spin" ? "bowl" : r;
};

const PlayerGridM = memo(PlayerGrid), AnalyticsM = memo(AnalyticsDashboard), HeroM = memo(HeroJerseys);

export default function App() {
  const [sel, setSel] = useState([]);
  const selRef = useRef(sel); selRef.current = sel;
  const [toast, setToast] = useState(null);
  const [shake, setShake] = useState(0);

  const [roles, setRoles] = useState({
    cap: "",
    vc: "",
    wk: "",
  });

  const [modal, setModal] = useState(false);
  const [auth, setAuth] = useState(null);
  const [session, setSession] = useState(getSession);
  const [community, setCommunity] = useState(loadCommunity);
  const [celebrate, setCelebrate] = useState(null);

  const refreshStats = () => { if (serverReady()) getStats().then(l => { if (Array.isArray(l)) { setCommunity(l); saveCommunity(l); } }).catch(() => {}); };
  useEffect(() => { refreshStats(); restoreSquads().then(s => { if (s) setSession(s); }); }, []);

  const notify = (msg, ok = false) => {
    setToast({ msg, ok });
    if (!ok) {
      setShake((s) => s + 1);
    }
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  const total = community.reduce((a, q) => a + (q.sends || 1), 0);

  const onLoggedIn = r => {
    const acc = { token: r.token, name: r.name, email: r.email, phone: r.phone };
    saveSession(acc); setSession(acc); setAuth(null);
    if (r.squad && sel.length === 0) {
      const ids = r.squad.selected.filter(id => byId[id]);
      if (ids.length === 15) { setSel(ids); setRoles({ cap: r.squad.cap, vc: r.squad.vc, wk: r.squad.wk }); notify("Welcome back – your saved squad is loaded", true); }
    }
  };
  const onDone = (squad) => {
    setModal(false); setCelebrate(squad); setSel([]); setRoles({ cap: "", vc: "", wk: "" });
    refreshStats();
  };
  const onLogout = () => { clearSession(); setSession(null); setAuth(null); };
  const finalize = () => { if (!session) { setAuth("login"); notify("Please log in to send your squad", true); } else setModal(true); };

  const blockReason = useCallback((id) => {
    const sel = selRef.current;
    const group = groupOf(id);
    const nextCount = count([...sel, id]);

    if (sel.length >= 15) {
      return "Squad is full";
    }

    if (nextCount[group] > MAX[group]) {
      return `Max ${MAX[group]} ${GROUP_NAME[group]} reached`;
    }

    return "";
  }, []);

  const pick = useCallback((id) => {
    const sel = selRef.current;
    if (sel.includes(id)) {
      setSel(sel.filter((x) => x !== id));
      setRoles((r) => ({
        cap: r.cap === id ? "" : r.cap,
        vc: r.vc === id ? "" : r.vc,
        wk: r.wk === id ? "" : r.wk,
      }));
      return;
    }

    const why = blockReason(id);

    if (why) {
      return notify(`${why} – remove a player first`);
    }

    setSel([...sel, id]);
  }, []);

  const c = count(sel);

  const keepers = sel.filter(
    (id) => byId[id].role === "wk"
  );

  const { cap, vc } = roles;

  const wk =
    roles.wk ||
    (keepers.length === 1 ? keepers[0] : "");

  const setRole = (key, id) => {
    setRoles((r) => {
      const next = {
        ...r,
        [key]: r[key] === id ? "" : id,
      };

      if (key === "cap" && next.vc === id) {
        next.vc = "";
      }

      if (key === "vc" && next.cap === id) {
        next.cap = "";
      }

      return next;
    });
  };

  const problem =
    sel.length !== 15
      ? ""
      : c.bat < RULES.bat[0]
        ? "Need at least 4 batters"
        : c.bowl < RULES.bowl[0]
          ? "Need at least 5 bowlers"
          : c.fast < RULES.minFast
            ? "Need at least 3 fast bowlers"
            : c.spin < RULES.minSpin
              ? "Need at least 1 spinner"
              : c.ar < RULES.ar[0]
                ? "Need at least 1 all-rounder"
                : c.wk < RULES.wk[0]
                  ? "Need at least 1 wicket-keeper"
                  : "";

  const ready = sel.length === 15 && !problem;

  const go =
    ready &&
    cap &&
    vc &&
    wk &&
    cap !== vc;

  return (
    <>
      <BackgroundFX />

      <button onClick={() => setAuth("login")} aria-label={session ? "My account" : "Login or create account"}
        className="fixed left-3 z-30 grid place-items-center w-11 h-11 rounded-full glass bg-[#0a1630]/90 text-white/90 active:scale-95 transition"
        style={{ top: "calc(env(safe-area-inset-top) + 12px)" }}>
        {session ? <span className="grid place-items-center w-8 h-8 rounded-full bg-[#FF9933] text-[#050d1f] font-oswald text-sm">{session.name.trim()[0]?.toUpperCase()}</span> : <UserCircle size={28} />}
      </button>

      <HeroM
        step={go ? 2 : ready ? 1 : 0}
        fans={total}
      />

      <main className="max-w-[1400px] mx-auto px-3 sm:px-4 pb-20 overflow-x-clip">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          <div className="flex-1 min-w-0">
            <PlayerGridM
              selected={sel}
              onPick={pick}
              blockReason={blockReason}
            />
          </div>

          <div className="lg:w-[400px] shrink-0 self-start lg:sticky lg:top-5 w-full min-w-0">
            <div className="grid grid-cols-[minmax(0,1fr)] gap-4">

              <SquadLocker
                selected={sel}
                onRemove={pick}
                shake={shake}
                cap={cap}
                vc={vc}
                wk={wk}
                setRole={setRole}
                problem={problem}
                go={go}
                onFinalize={finalize}
              />

            </div>
          </div>
        </div>

        <AnalyticsM squads={community} total={total} />
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{
              y: 40,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full text-sm z-50 shadow-xl ${
              toast.ok
                ? "bg-[#138808]"
                : "bg-red-600"
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {auth && <AuthModal start={auth} session={session} onClose={() => setAuth(null)} onLoggedIn={onLoggedIn} onLogout={onLogout} />}
      {modal && session && (
        <SubmitModal
          account={session}
          selected={sel}
          cap={cap}
          vc={vc}
          wk={wk}
          onClose={() => setModal(false)}
          onDone={onDone}
          onSaved={(l) => { if (l.length) { setCommunity(l); saveCommunity(l); } else refreshStats(); }}
        />
      )}
      {celebrate && <SquadCelebration squad={celebrate} fans={total} onClose={() => { setCelebrate(null); window.scrollTo(0, 0); }} />}
    </>
  );
}
