import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { Users, Crown, Shield, Trophy } from "lucide-react";
import { byId, ROLE_COLOR, ROLE_LABEL } from "../data/players";
import { useReveal } from "../utils/hooks";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);
ChartJS.defaults.font.family = "Poppins, sans-serif";
ChartJS.defaults.color = "rgba(255,255,255,.75)";
const DPR = Math.min(2, typeof window === "undefined" ? 1 : window.devicePixelRatio || 1); // crisp on retina / 4K

const tally = (squads, get) => { const t = {}; squads.forEach(s => get(s).forEach(id => { if (byId[id]) t[id] = (t[id] || 0) + 1; })); return Object.entries(t).sort((a, b) => b[1] - a[1]); };
const grad = c => ctx => { const a = ctx.chart.chartArea; if (!a) return c; const g = ctx.chart.ctx.createLinearGradient(a.left, 0, a.right, 0); g.addColorStop(0, c + "40"); g.addColorStop(1, c); return g; };
const pctLabels = { id: "pct", afterDatasetsDraw(ch) { const { ctx } = ch; ch.getDatasetMeta(0).data.forEach((b, i) => { ctx.save(); ctx.fillStyle = "#fff"; ctx.font = "600 12px Poppins"; ctx.textBaseline = "middle"; ctx.fillText(ch.data.datasets[0].data[i] + "%", b.x + 8, b.y); ctx.restore(); }); } };
const centre = { id: "centre", afterDraw(ch) { const { ctx, chartArea: a } = ch, x = (a.left + a.right) / 2, y = (a.top + a.bottom) / 2; ctx.save(); ctx.textAlign = "center"; ctx.fillStyle = "#fff"; ctx.font = "700 34px Oswald"; ctx.fillText("15", x, y + 6); ctx.font = "500 11px Poppins"; ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillText("PER SQUAD", x, y + 24); ctx.restore(); } };

const Stat = ({ icon: I, label, value, sub, d = 0 }) => (<div style={{ "--d": `${d}s` }} className="rounded-2xl border border-white/10 bg-white/[.04] p-4 min-w-0 overflow-hidden reveal-item">
  <div className="flex items-center gap-2 text-white/55 text-xs"><I size={14} />{label}</div>
  <p className="font-oswald text-2xl mt-1 truncate">{value}</p><p className="text-xs text-white/45">{sub}</p></div>);

const Leaders = ({ title, rows, n, d = 0 }) => (<div style={{ "--d": `${d}s` }} className="rounded-2xl border border-white/10 bg-white/[.04] p-4 min-w-0 overflow-hidden reveal-item">
  <h3 className="text-sm font-semibold mb-3">{title}</h3>
  <div className="grid gap-2.5">{rows.slice(0, 5).map(([id, v]) => <div key={id}>
    <div className="flex justify-between text-xs mb-1"><span>{byId[id].name}</span><span className="text-white/60">{Math.round(v / n * 100)}%</span></div>
    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="grow h-full rounded-full" style={{ width: `${v / n * 100}%`, background: ROLE_COLOR[byId[id].role] }} /></div></div>)}</div></div>);

const Tile = ({ id, rank, pct, d = 0 }) => { const p = byId[id], c = ROLE_COLOR[p.role];
  return (<div className="reveal-item w-[84px]" style={{ "--d": `${d}s` }} title={`${p.name} – ${ROLE_LABEL[p.role]} – picked by ${pct}% of fans`}>
    <div className="relative w-[84px] h-[96px]">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3 pt-2" style={{ background: `linear-gradient(160deg,${c},#06265f)`, clipPath: "polygon(30% 0,38% 6%,62% 6%,70% 0,100% 18%,88% 38%,76% 30%,76% 100%,24% 100%,24% 30%,12% 38%,0 18%)" }}>
        <span className="font-oswald text-2xl leading-none">{rank}</span><span className="text-[9px] font-semibold mt-1 leading-tight uppercase">{p.name.split(" ").pop()}</span></div></div>
    <p className="text-center text-xs font-semibold mt-1" style={{ color: c }}>{pct}%</p></div>); };

export default function AnalyticsDashboard({ squads = [], total }) {
  const n = squads.length, sent = total || n, [rootRef, seen] = useReveal(squads.length);
  if (!n) return (<section ref={rootRef} className="glass rounded-3xl p-8 mt-10 text-center"><h2 className="font-oswald text-2xl">Fan Analytics</h2>
    <p className="text-white/55 text-sm mt-2">No fan has submitted a squad yet. Be the first and the charts will appear here.</p></section>);

  const picks = tally(squads, s => s.selected), caps = tally(squads, s => [s.cap]), vcs = tally(squads, s => [s.vc]), wks = tally(squads, s => [s.wk]);
  const t15 = picks.slice(0, 15), pct = v => Math.round(v / n * 100);
  const mix = { bat: 0, wk: 0, ar: 0, fast: 0, spin: 0 };
  squads.forEach(s => s.selected.forEach(id => { if (byId[id]) mix[byId[id].role]++; }));
  const roles = Object.keys(mix);

  return (<section ref={rootRef} className={`glass rounded-3xl p-4 sm:p-6 md:p-8 mt-10 overflow-hidden ${seen ? "revealed" : ""}`}>
    <div className="flex flex-wrap items-end justify-between gap-2 mb-6"><div><h2 className="font-oswald text-3xl">Fan Analytics</h2>
      <p className="text-sm text-white/55">Live from {sent} squad{sent > 1 ? "s" : ""} sent by {n} fan{n > 1 ? "s" : ""}</p></div><div className="tricolour h-1 w-24 rounded-full" /></div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <Stat d={0.00} icon={Users} label="Squads submitted" value={sent} sub={`${n} fan${n > 1 ? "s" : ""} · ${picks.length} players picked`} />
      <Stat d={0.08} icon={Crown} label="Top captain" value={byId[caps[0][0]].name.split(" ").pop()} sub={`${pct(caps[0][1])}% of fans`} />
      <Stat d={0.16} icon={Shield} label="Top vice-captain" value={byId[vcs[0][0]].name.split(" ").pop()} sub={`${pct(vcs[0][1])}% of fans`} />
      <Stat d={0.24} icon={Trophy} label="Top keeper" value={byId[wks[0][0]].name.split(" ").pop()} sub={`${pct(wks[0][1])}% of fans`} />
    </div>

    <div className="grid lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[.04] p-4 sm:p-5 min-w-0 overflow-hidden reveal-item"><h3 className="text-sm font-semibold mb-3">Most picked players (% of squads)</h3>
        <div className="relative w-full" style={{ height: Math.max(260, t15.length * 30) }}><Bar plugins={[pctLabels]} data={{ labels: t15.map(([id]) => byId[id].name), datasets: [{ data: t15.map(([, v]) => pct(v)), backgroundColor: ctx => grad(ROLE_COLOR[byId[t15[ctx.dataIndex][0]].role])(ctx), borderRadius: 8, barThickness: 18 }] }}
          options={{ indexAxis: "y", devicePixelRatio: DPR, maintainAspectRatio: false, layout: { padding: { right: 44 } }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.raw}% of fans` } } },
            scales: { x: { max: 100, grid: { color: "rgba(255,255,255,.06)" }, ticks: { callback: v => v + "%" }, border: { display: false } }, y: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11 }, callback(v) { return this.getLabelForValue(v).split(" ").pop(); } } } } }} /></div></div>
      <div className="rounded-2xl border border-white/10 bg-white/[.04] p-4 sm:p-5 min-w-0 overflow-hidden reveal-item"><h3 className="text-sm font-semibold mb-3">Squad balance</h3>
        <div className="relative w-full h-[230px]"><Doughnut plugins={[centre]} data={{ labels: roles.map(r => ROLE_LABEL[r]), datasets: [{ data: roles.map(r => +(mix[r] / n).toFixed(1)), backgroundColor: roles.map(r => ROLE_COLOR[r]), borderColor: "#0a1630", borderWidth: 3, hoverOffset: 8 }] }}
          options={{ devicePixelRatio: DPR, maintainAspectRatio: false, cutout: "68%", plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.raw} per squad` } } } }} /></div>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-4 text-xs">{roles.map(r => <li key={r} className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: ROLE_COLOR[r] }} />{ROLE_LABEL[r]}<b className="ml-auto">{(mix[r] / n).toFixed(1)}</b></li>)}</ul></div>
    </div>

    <div className="grid md:grid-cols-3 gap-4 mb-6"><Leaders d={0.0} title="Captain choice" rows={caps} n={n} /><Leaders d={0.1} title="Vice-captain choice" rows={vcs} n={n} /><Leaders d={0.2} title="Wicket-keeper choice" rows={wks} n={n} /></div>

    <div className="grid gap-6">
      {[["Fans' Ultimate 15", picks.slice(0, 15).map(([id]) => id)]].map(([title, ids]) => (
        <div key={title} className="rounded-2xl border border-white/10 bg-white/[.04] p-4 sm:p-5 min-w-0 overflow-hidden reveal-item"><h3 className="text-sm font-semibold mb-4">{title}</h3>
          <div className="flex flex-wrap gap-1 justify-center">{ids.map((id, i) => <Tile key={id} id={id} rank={i + 1} pct={pct(picks.find(([k]) => k === id)[1])} d={i * 0.06} />)}</div></div>))}
    </div>
  </section>);
}
