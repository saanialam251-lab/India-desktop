import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config";
export const serverReady = () => /^https:\/\/[^/]+\.supabase\.co/i.test(SUPABASE_URL || "") && !!SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.startsWith("PASTE_");
// Calls one server function. Throws Error("network") if the server cannot be reached.
async function rpc(fn, args = {}) {
  if (!serverReady()) throw new Error("not_configured");
  let res;
  try {
    res = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/rpc/${fn}`, {
      method: "POST", headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY, ...(SUPABASE_ANON_KEY.startsWith("eyJ") ? { Authorization: `Bearer ${SUPABASE_ANON_KEY}` } : {}) }, body: JSON.stringify(args) });
  } catch { throw new Error("network"); }
  if (!res.ok) throw new Error("network");
  return res.json();
}
export const createAccount = (name, email, phone) => rpc("create_account", { p_name: name, p_email: email, p_phone: phone });
export const loginAccount = (name, phone) => rpc("login_account", { p_name: name, p_phone: phone });
export const submitSquad = (token, s) => rpc("submit_squad", { p_token: token, p_selected: s.selected, p_cap: s.cap, p_vc: s.vc, p_wk: s.wk });
export const getStats = () => rpc("get_stats");
export const errorText = e => e?.message === "not_configured" ? "The server is not set up yet. Please try again later." : "Could not reach the server. Check your internet and try again.";
