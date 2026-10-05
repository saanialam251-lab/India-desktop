import { useState } from "react";
import { X, UserCircle, LogOut } from "lucide-react";
import { createAccount, loginAccount, errorText } from "../utils/api";
import { useScrollLock } from "../utils/hooks";

const digits = v => v.replace(/\D/g, "").slice(0, 10);
// Full-screen message screen. It covers the whole page (nothing of the login card shows behind it), never scrolls, and is fully animated.
const Popup = ({ kind, name, onClose, onCreate }) => (
  <div className="fade-in msg-bg fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center overflow-hidden touch-none" style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}>
    <div className="tricolour h-1 w-28 rounded-full mb-14 cj cj5" />
    {kind === "ok" ? (<>
      <div className="relative w-28 h-28 mb-7 text-[#22c55e]">
        <span className="ring" /><span className="ring ring2" /><span className="ring ring3" />
        <span className="dot" style={{ "--x": "0px", "--y": "-120px", background: "#FF9933" }} /><span className="dot" style={{ "--x": "85px", "--y": "-85px", background: "#ffffff" }} /><span className="dot" style={{ "--x": "120px", "--y": "0px", background: "#22c55e" }} /><span className="dot" style={{ "--x": "85px", "--y": "85px", background: "#FF9933" }} /><span className="dot" style={{ "--x": "0px", "--y": "120px", background: "#ffffff" }} /><span className="dot" style={{ "--x": "-85px", "--y": "85px", background: "#22c55e" }} /><span className="dot" style={{ "--x": "-120px", "--y": "0px", background: "#FF9933" }} /><span className="dot" style={{ "--x": "-85px", "--y": "-85px", background: "#ffffff" }} /><span className="dot" style={{ "--x": "60px", "--y": "-130px", background: "#22c55e" }} /><span className="dot" style={{ "--x": "130px", "--y": "-40px", background: "#FF9933" }} /><span className="dot" style={{ "--x": "-60px", "--y": "-130px", background: "#ffffff" }} /><span className="dot" style={{ "--x": "-130px", "--y": "40px", background: "#22c55e" }} />
        <svg width="112" height="112" viewBox="0 0 72 72" className="relative">
          <circle className="draw" cx="36" cy="36" r="32" fill="none" stroke="#22c55e" strokeWidth="4" />
          <path className="draw draw2" d="M22 37 l10 10 l19 -22" fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="font-oswald text-4xl cj cj3" style={{ animationDelay: ".35s" }}>Logged in successfully</h2>
      <p className="text-white/65 mt-2 cj cj5" style={{ animationDelay: ".5s" }}>Welcome{name ? `, ${name.trim().split(" ")[0]}` : ""}! Jai Hind 🇮🇳</p>
      <div className="mt-8 h-1.5 w-40 rounded-full bg-white/10 overflow-hidden cj cj0" style={{ animationDelay: ".6s" }}><div className="grow h-full bg-[#22c55e] rounded-full" style={{ animationDuration: "1.1s" }} /></div>
    </>) : (<>
      <div className="relative w-28 h-28 mb-7 text-amber-300 float">
        <span className="ring" /><span className="ring ring2" />
        <div className="wobble relative w-28 h-28 rounded-full bg-amber-400/15 border-2 border-amber-300/60 grid place-items-center font-oswald text-6xl">!</div>
      </div>
      <h2 className="font-oswald text-4xl cj cj3" style={{ animationDelay: ".15s" }}>Please create a new account</h2>
      <p className="text-white/65 mt-3 max-w-xs cj cj5" style={{ animationDelay: ".3s" }}>We could not find an account with that name and phone number.</p>
      <div className="grid gap-3 mt-9 w-full max-w-xs">
        <button onClick={onCreate} className="shine cj cj1 py-3.5 rounded-xl bg-[#0F52BA] font-semibold text-lg active:scale-[.97] transition-transform" style={{ animationDelay: ".45s" }}>Create account</button>
        <button onClick={onClose} className="cj cj2 py-3.5 rounded-xl bg-white/10 active:scale-[.97] transition-transform" style={{ animationDelay: ".55s" }}>Try again</button>
      </div>
    </>)}
  </div>);

export default function AuthModal({ start, session, onClose, onLoggedIn, onLogout }) {
  useScrollLock();
  const [view, setView] = useState(session ? "account" : start);
  const [f, setF] = useState({ name: "", email: "", phone: "" });
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [popup, setPopup] = useState(null), [created, setCreated] = useState(false);
  const set = k => e => setF({ ...f, [k]: k === "phone" ? digits(e.target.value) : e.target.value });
  const go = v => { setView(v); setError(""); setF({ name: "", email: "", phone: "" }); };

  const login = async e => {
    e.preventDefault(); setError("");
    if (!f.name.trim()) return setError("Please enter your name.");
    if (f.phone.length !== 10) return setError("Phone number must be exactly 10 digits.");
    setBusy(true);
    try {
      const r = await loginAccount(f.name, f.phone);
      if (r.ok) { setPopup("ok"); setTimeout(() => onLoggedIn(r), 1200); } else setPopup("no");
    } catch (er) { setError(errorText(er)); }
    setBusy(false);
  };
  const create = async e => {
    e.preventDefault(); setError("");
    if (f.name.trim().length < 2) return setError("Please enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) return setError("Please enter a valid email address.");
    if (f.phone.length !== 10) return setError("Phone number must be exactly 10 digits.");
    setBusy(true);
    try {
      const r = await createAccount(f.name.trim(), f.email.trim(), f.phone);
      if (r.ok) { setCreated(true); go("login"); }
      else setError(r.reason === "phone_exists" ? "This phone number already has an account. Please log in." : "Please check your details and try again.");
    } catch (er) { setError(errorText(er)); }
    setBusy(false);
  };

  const title = view === "account" ? "Your account" : view === "create" ? "Create account" : "Login";
  return (<>
  <div onClick={popup === "ok" ? undefined : onClose} className="fade-in fixed inset-0 bg-[#050d1f]/90 z-40 flex items-center justify-center p-4">
    <div onClick={e => e.stopPropagation()}
      className="relative bg-[#0a1630] border border-white/10 rounded-3xl w-full max-w-sm max-h-[90vh] overflow-y-auto scroll-thin shadow-2xl">
      <div className="tricolour h-1 rounded-t-3xl" />
      <div className="p-6 grid gap-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-oswald text-2xl flex items-center gap-2"><UserCircle size={26} className="text-[#FF9933]" />{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid place-items-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20"><X size={16} /></button>
        </div>

        {view === "account" && <div className="grid gap-3 text-sm">
          <div className="bg-white/[.04] rounded-2xl p-4 grid gap-1"><p className="font-semibold text-base">{session.name}</p><p className="text-white/60">{session.phone}</p><p className="text-white/60 truncate">{session.email}</p></div>
          <p className="text-xs text-white/45">Your account and squad are saved on the server, so you can log in again on any phone.</p>
          <button onClick={onLogout} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/15 font-semibold"><LogOut size={16} />Log out</button></div>}

        {view === "login" && <form onSubmit={login} className="grid gap-4">
          {created && <p className="text-sm text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-xl px-4 py-2.5">Account created. Please log in.</p>}
          <input value={f.name} onChange={set("name")} placeholder="Enter Your First Name" autoComplete="name" className="field" />
          <input type="tel" inputMode="numeric" maxLength={10} value={f.phone} onChange={set("phone")} placeholder="Phone number (10 digits)" autoComplete="tel" className="field" />
          {error && <p role="alert" className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5">{error}</p>}
          <button disabled={busy} className="py-3 rounded-xl bg-[#0F52BA] hover:bg-[#1660d6] font-semibold disabled:opacity-50">{busy ? "Logging in…" : "Login"}</button>
          <p className="text-center text-sm text-white/60">New here? <button type="button" onClick={() => { go("create"); setCreated(false); }} className="text-[#FF9933] font-semibold underline">Create a new account</button></p>
        </form>}

        {view === "create" && <form onSubmit={create} className="grid gap-4">
          <input value={f.name} onChange={set("name")} placeholder="Name" autoComplete="name" className="field" />
          <input type="email" value={f.email} onChange={set("email")} placeholder="Email ID" autoComplete="email" className="field" />
          <input type="tel" inputMode="numeric" maxLength={10} value={f.phone} onChange={set("phone")} placeholder="Phone number (10 digits)" autoComplete="tel" className="field" />
          {error && <p role="alert" className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5">{error}</p>}
          <button disabled={busy} className="py-3 rounded-xl bg-[#0F52BA] hover:bg-[#1660d6] font-semibold disabled:opacity-50">{busy ? "Creating…" : "Create account"}</button>
          <p className="text-center text-sm text-white/60">Already have an account? <button type="button" onClick={() => go("login")} className="text-[#FF9933] font-semibold underline">Login</button></p>
        </form>}
      </div>
    </div></div>
    {popup && <Popup kind={popup} name={f.name} onClose={() => setPopup(null)} onCreate={() => { setPopup(null); go("create"); }} />}
  </>);
}
