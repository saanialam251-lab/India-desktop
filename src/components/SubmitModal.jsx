import { useState } from "react";
import { X, Check, Copy, Mail } from "lucide-react";
import { byId, ROLE_COLOR } from "../data/players";
import { buildEmail, mailtoUrl, gmailUrl, BCCI_EMAIL } from "../utils/emailService";
import { submitSquad, getStats, errorText } from "../utils/api";
import { useScrollLock } from "../utils/hooks";

export default function SubmitModal({ selected, cap, vc, wk, account, onClose, onSaved, onDone }) {
  useScrollLock();
  const [f, setF] = useState({ name: account.name, email: account.email, phone: account.phone });
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [res, setRes] = useState(null), [copied, setCopied] = useState(false);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const tag = id => id === cap ? "C" : id === vc ? "VC" : id === wk ? "WK" : "";

  const submit = async e => {
    e.preventDefault(); setError("");
    const name = f.name.trim(), email = f.email.trim(), phone = f.phone.replace(/\D/g, "");
    if (!name) return setError("Please enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Please enter a valid email address.");
    if (phone.length !== 10) return setError("Please enter a valid 10-digit phone number.");
    setBusy(true);
    const squad = { selected, cap, vc, wk, fanName: name, fanEmail: email, fanPhone: phone };
    try {
      const r = await submitSquad(account.token, squad);
      if (!r.ok) { setBusy(false); return setError(r.reason === "not_logged_in" ? "Please log in again." : "Could not save your squad. Please check it and try again."); }
      let all = []; try { all = await getStats(); } catch {}   // your own squad is already in the totals
      onSaved?.(all);
      setRes({ mail: buildEmail(squad, all) });
    } catch (er) { setError(errorText(er)); }
    setBusy(false);
  };
  // Once the squad is saved, closing in any way counts as "Done": the app shows your 15 and starts fresh.
  const finish = () => onDone({ selected, cap, vc, wk });
  const close = res ? finish : onClose;
  const copy = async () => { try { await navigator.clipboard.writeText(`To: ${res.mail.to}\nSubject: ${res.mail.subject}\n\n${res.mail.body}`); setCopied(true); } catch {} };

  return (<div onClick={close} className="fade-in fixed inset-0 bg-[#050d1f]/90 z-40 flex items-center justify-center p-4">
    <div onClick={e => e.stopPropagation()}
      className="pop-in relative bg-[#0a1630] border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto scroll-thin shadow-2xl">
      <div className="tricolour h-1 rounded-t-3xl" />
      <div className="p-6 grid gap-5">
        <div className="flex items-start justify-between gap-4">
          <div><h2 className="font-oswald text-2xl">{res ? "Choose how to send" : "Send your squad to BCCI"}</h2>
            <p className="text-sm text-white/55 mt-1">{res ? `Addressed to ${BCCI_EMAIL}` : "Review your 15 and add your details."}</p></div>
          <button type="button" onClick={close} aria-label="Close" className="grid place-items-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20"><X size={16} /></button>
        </div>

        {res ? (<div className="grid gap-3 text-sm">
          <p className="flex gap-2 items-start text-white/80"><Check size={18} className="text-[#22c55e] shrink-0 mt-0.5" />Your squad is saved on the server. The email is written. Pick one way to send it:</p>
          <a href={mailtoUrl(res.mail)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#0F52BA] active:scale-[.98] font-semibold"><Mail size={18} />Open in my email app</a>
          <a href={gmailUrl(res.mail)} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/10 active:scale-[.98] font-semibold"><Mail size={18} />Open Gmail in the browser</a>
          <button onClick={copy} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-white/80"><Copy size={16} />{copied ? "Copied" : "Copy the email text"}</button>
          <p className="text-white/45 text-xs">Nothing is sent until you press Send in your email.</p>
          <button onClick={finish} className="px-5 py-2.5 rounded-xl bg-[#0F52BA] font-semibold justify-self-end">Done</button></div>
        ) : (<form onSubmit={submit} className="grid gap-5">
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm bg-white/[.04] rounded-2xl p-4">
            {selected.map((id, i) => <li key={id} className="flex items-center gap-2 min-w-0">
              <span className="text-white/35 w-5 text-right text-xs">{i + 1}</span>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ROLE_COLOR[byId[id].role] }} />
              <span className="truncate">{byId[id].name}</span>
              {tag(id) && <span className="text-[10px] font-bold bg-[#FF9933] text-[#050d1f] rounded px-1.5 py-px">{tag(id)}</span>}
            </li>)}
          </ol>
          <div className="grid gap-3">
            <input value={f.name} onChange={set("name")} placeholder="Your name" autoComplete="name" className="field" />
            <input type="email" value={f.email} onChange={set("email")} placeholder="Your email" autoComplete="email" className="field" />
            <input type="tel" readOnly value={f.phone} aria-label="Phone number (from your account)" autoComplete="tel" className="field" />
          </div>
          {error && <p role="alert" className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5">{error}</p>}
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15">Cancel</button>
            <button disabled={busy} className="px-5 py-2.5 rounded-xl bg-[#0F52BA] hover:bg-[#1660d6] font-semibold disabled:opacity-50">{busy ? "Opening email…" : "Write email to BCCI"}</button>
          </div>
        </form>)}
      </div>
    </div></div>);
}
