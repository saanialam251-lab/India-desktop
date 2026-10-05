import { Preferences } from "@capacitor/preferences";
// Accounts and squads live on the server. The phone only remembers who is logged in (and the last community numbers).
const SESSION = "india2027-session", COMMUNITY = "india2027-community";
// Old versions kept squads only on the device; those are removed.
try { localStorage.removeItem("india2027-squads"); } catch {}
Preferences.remove({ key: "india2027-squads" }).catch(() => {});

export const getSession = () => { try { return JSON.parse(localStorage.getItem(SESSION)); } catch { return null; } };
export const saveSession = s => { const v = JSON.stringify(s); try { localStorage.setItem(SESSION, v); } catch {} Preferences.set({ key: SESSION, value: v }).catch(() => {}); };
export const clearSession = () => { try { localStorage.removeItem(SESSION); } catch {} Preferences.remove({ key: SESSION }).catch(() => {}); };
export const loadCommunity = () => { try { return JSON.parse(localStorage.getItem(COMMUNITY)) || []; } catch { return []; } };
export const saveCommunity = l => { try { localStorage.setItem(COMMUNITY, JSON.stringify(l)); } catch {} };

// Called once at start-up: if the WebView's localStorage was wiped but the native copy survived, bring the login back.
export async function restoreSquads() {
  try { if (getSession()) return getSession(); const { value } = await Preferences.get({ key: SESSION }); const s = JSON.parse(value || "null"); if (s?.token) { try { localStorage.setItem(SESSION, value); } catch {} return s; } } catch {}
  return null;
}
