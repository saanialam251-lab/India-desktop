import { byId, ROLE_LABEL } from "../data/players";

// Change this one line if the BCCI gives you a dedicated address for fan suggestions.
export const BCCI_EMAIL = "office@bcci.tv";

const top = (squads, pick) => {
  const t = {};
  squads.forEach(s => (pick(s) || []).forEach(id => { if (byId[id]) t[id] = (t[id] || 0) + 1; }));
  return Object.entries(t).sort((a, b) => b[1] - a[1]);
};
const lead = (squads, key) => { const r = top(squads, s => [s[key]]); return r.length ? `${byId[r[0][0]].name} (${r[0][1]} of ${squads.length} fans)` : "-"; };

// Builds the full written email from the fan's details, their 15, and the community numbers so far.
export function buildEmail({ selected, cap, vc, wk, fanName, fanEmail, fanPhone }, squads = []) {
  const total = squads.length;
  const tag = id => [id === cap && "Captain", id === vc && "Vice-Captain", id === wk && "Wicket-Keeper"].filter(Boolean).join(", ");
  const mine = selected.map((id, i) => `${i + 1}. ${byId[id].name} - ${ROLE_LABEL[byId[id].role]}${tag(id) ? ` (${tag(id)})` : ""}`).join("\n");
  const fans = top(squads, s => s.selected).slice(0, 15).map(([id, n], i) => `${i + 1}. ${byId[id].name} - in ${n} of ${total} fan squads (${Math.round(n / total * 100)}%)`).join("\n");
  const subject = `Fan suggestion: India squad for the 2027 World Cup - from ${fanName}`;
  const body = `Respected Members of the BCCI Selection Committee,

I am a devoted follower of Indian cricket, and I would like to humbly suggest the following 15 players for India's squad for the 2027 ICC Cricket World Cup, based on their current form and performances.

MY SQUAD OF 15
${mine}

Captain: ${byId[cap].name}
Vice-Captain: ${byId[vc].name}
Wicket-Keeper: ${byId[wk].name}

WHAT OTHER FANS SUGGESTED
So far ${total} fan${total === 1 ? " has" : "s have"} submitted a squad on the Squad Lab. Most chosen captain: ${lead(squads, "cap")}. Most chosen vice-captain: ${lead(squads, "vc")}. Most chosen wicket-keeper: ${lead(squads, "wk")}.
The 15 players picked by the most fans:
${fans}

I request the Committee to kindly take this fan opinion into consideration. Thank you for your time and for everything the Blue Army gives us.

Yours sincerely,
${fanName}
Email: ${fanEmail}
Phone: ${fanPhone}`;
  return { to: BCCI_EMAIL, subject, body };
}

const crlf = t => t.replace(/\r?\n/g, "\r\n");
export const mailtoUrl = m => `mailto:${m.to}?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(crlf(m.body))}`;
export const gmailUrl = m => `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(m.to)}&su=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.body)}`;

// The user now chooses how to send (see SubmitModal): email app (mailto) or Gmail in the browser.
