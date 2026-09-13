"use client";

import { useState } from "react";
import { Activity, ArrowRight, BarChart3, Check, CheckCircle2, Clock3, GitBranch, RotateCcw, ShieldAlert, Target, TriangleAlert, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { decisionOptions, demoScenario, dependencyNodes, milestones, residualRisks } from "@/lib/demo-data";

type PageId = "dashboard" | "graph" | "input" | "impact" | "decision" | "result";
const pages: { id: PageId; label: string; step: string; icon: typeof Activity }[] = [
  { id: "dashboard", label: "项目概览", step: "01", icon: BarChart3 },
  { id: "graph", label: "依赖关系", step: "02", icon: GitBranch },
  { id: "input", label: "风险输入", step: "03", icon: ShieldAlert },
  { id: "impact", label: "影响分析", step: "04", icon: Activity },
  { id: "decision", label: "决策中心", step: "05", icon: Target },
  { id: "result", label: "重排结果", step: "06", icon: RotateCcw },
];

export default function Home() {
  const [page, setPage] = useState<PageId>("dashboard");
  const [selectedNode, setSelectedNode] = useState(2);
  const [delay, setDelay] = useState(String(demoScenario.event.delayDays));
  const [decisions, setDecisions] = useState<string[]>([]);
  const [analyzed, setAnalyzed] = useState(false);
  const [applied, setApplied] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
  const delayDays = Math.max(0, Number.parseInt(delay, 10) || 0);
  const projectedDay = demoScenario.baselineDay + delayDays;
  const isModeled = decisions.length === 2 && decisions.includes("critical") && decisions.includes("placeholder");

  function analyze() { setApplied(false); setAnalyzed(true); setPage("impact"); }
  function applyDecision() { if (!isModeled) return; setApplied(true); setPage("result"); }
  function reset() { setPage("dashboard"); setDelay("3"); setDecisions([]); setAnalyzed(false); setApplied(false); setDemoRunning(false); }
  function runQuickDemo() {
    setDemoRunning(true); setDelay("3"); setDecisions([]); setAnalyzed(false); setApplied(false); setPage("input");
    window.setTimeout(() => { setAnalyzed(true); setPage("impact"); }, 650);
    window.setTimeout(() => { setDecisions(["critical", "placeholder"]); setPage("decision"); }, 1400);
    window.setTimeout(() => { setApplied(true); setPage("result"); setDemoRunning(false); }, 2300);
  }

  return <main className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><GitBranch size={19}/></span><div><strong>交付风险模拟器</strong><small>Feature Delivery Risk Simulator</small></div></div>
      <nav aria-label="六步演示流程">{pages.map((item) => { const Icon = item.icon; return <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => setPage(item.id)}><Icon size={17}/><span>{item.label}</span><small>{item.step}</small></button>; })}</nav>
      <div className="sidebar-foot"><span>V1.0 DEMO</span><strong>Alpha Scenario</strong></div>
    </aside>
    <section className="workspace">
      <header className="topbar"><div><span>示例场景</span><strong>多人首领Feature</strong></div><div className="top-status"><span>Alpha · D40</span><b><i/>风险中 AT RISK</b></div></header>
      <div className="content">
        {page === "dashboard" && <Dashboard onGraph={() => setPage("graph")} onInput={() => setPage("input")} onDemo={runQuickDemo} demoRunning={demoRunning}/>}
        {page === "graph" && <Graph selected={selectedNode} setSelected={setSelectedNode} onNext={() => setPage("input")}/>}
        {page === "input" && <RiskInput delay={delay} setDelay={setDelay} onAnalyze={analyze}/>}
        {page === "impact" && <Impact analyzed={analyzed} delayDays={delayDays} projectedDay={projectedDay} onNext={() => setPage("decision")}/>}
        {page === "decision" && <Decision decisions={decisions} setDecisions={(value) => { setDecisions(value); setApplied(false); }} onApply={applyDecision}/>}
        {page === "result" && <Result delayDays={delayDays} projectedDay={projectedDay} applied={applied} onDecision={() => setPage("decision")} onReset={reset}/>}
      </div>
    </section>
  </main>;
}

function PageTitle({ kicker, title, desc, action }: { kicker: string; title: string; desc: string; action?: React.ReactNode }) {
  return <div className="page-title"><div><span>{kicker}</span><h1>{title}</h1><p>{desc}</p></div>{action}</div>;
}

function Dashboard({ onGraph, onInput, onDemo, demoRunning }: { onGraph: () => void; onInput: () => void; onDemo: () => void; demoRunning: boolean }) {
  return <>
    <section className="hero"><span className="hero-tag">游戏研发 · Feature交付</span><h1>游戏研发Feature交付风险分析模拟器</h1><h2>Feature Delivery Risk Simulator</h2><p>输入研发偏差，分析Dependency影响与Milestone风险，比较决策方案并完成Replan。</p><div className="hero-actions"><Button onClick={onDemo} disabled={demoRunning}>{demoRunning ? "演示进行中…" : "播放完整示例"}<ArrowRight size={16}/></Button><Button variant="outline" onClick={onInput}>输入研发偏差</Button></div></section>
    <section className="scenario-banner"><div><span>示例场景</span><strong>多人首领Feature｜Alpha目标 D40</strong></div><p><TriangleAlert size={18}/>Phase 2关键动画因机制可读性返工，预计延期3个工作日。</p></section>
    <section className="panel static-fallback"><PanelTitle kicker="完整案例链 · Static Overview" title="不操作也能看懂的交付判断" badge="V1.0固定场景"/><div className="fallback-flow"><FlowStep index="01" title="AN03关键动画延期 +3D" text="机制可读性返工" tone="risk"/><ArrowRight/><FlowStep index="02" title="依赖传播" text="Event → VFX → Integration → Multiplayer → QA"/><ArrowRight/><FlowStep index="03" title="D40 Alpha风险" text="未重排风险暴露 ≈ D43" tone="risk"/><ArrowRight/><FlowStep index="04" title="B + C决策" text="Critical First + Placeholder"/><ArrowRight/><FlowStep index="05" title="Replan" text="D40核心Scope恢复可行路径" tone="success"/><ArrowRight/><FlowStep index="06" title="Residual Risk" text="替换、可读性、回归与资源仍需跟踪"/></div></section>
    <div className="metric-grid">
      <Metric label="当前状态" value="高风险" detail="HIGH / AT RISK" risk/><Metric label="任务" value="36" detail="WBS任务总数"/><Metric label="延期" value="1" detail="AN03 · +3工作日"/><Metric label="剩余工作日" value="15" detail="至Alpha验收"/>
    </div>
    <div className="dashboard-grid">
      <section className="panel"><PanelTitle kicker="当前偏差" title="AN03｜Phase 2关键动画" badge="质量返工"/><p className="lead">关键机制动画与Event、VFX Timing未稳定对齐，存在机制预告可读性风险。</p><dl className="compact-list"><div><dt>Owner</dt><dd>动画</dd></div><div><dt>计划</dt><dd>D27–D32</dd></div><div><dt>预计</dt><dd className="risk-text">D35</dd></div><div><dt>主要风险</dt><dd>关键动画返工</dd></div></dl><Button className="full" onClick={onInput}>分析影响<ArrowRight size={15}/></Button></section>
      <section className="panel"><PanelTitle kicker="影响链" title="为什么Alpha有风险" badge="Critical Path"/><p className="lead">AN03位于关键链路，延期会压缩VFX、集成、多人验证与QA窗口。</p><div className="chain compact"><Chain items={["动画 +3D", "Animation Event", "VFX", "集成", "多人验证", "QA", "Alpha Risk"]}/></div><Button variant="outline" className="full" onClick={onGraph}>查看依赖关系<ArrowRight size={15}/></Button></section>
    </div>
    <section className="panel milestone-panel"><PanelTitle kicker="Milestone" title="Feature交付节点" badge="Baseline"/><div className="milestone-strip">{milestones.map((m) => <div className={m.active ? "active" : ""} key={m.name}><span>D{m.day}</span><strong>{m.name}</strong></div>)}</div></section>
    <p className="disclaimer">Portfolio scenario simulation based on publicly available information; all schedules and task data are hypothetical.</p>
  </>;
}

function Metric({ label, value, detail, risk = false }: { label: string; value: string; detail: string; risk?: boolean }) { return <div className={`metric ${risk ? "risk" : ""}`}><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>; }
function PanelTitle({ kicker, title, badge }: { kicker: string; title: string; badge?: string }) { return <div className="panel-title"><div><span>{kicker}</span><h2>{title}</h2></div>{badge && <b>{badge}</b>}</div>; }
function Chain({ items }: { items: string[] }) { return <>{items.map((item, index) => <div className="chain-piece" key={item}><span>{item}</span>{index < items.length - 1 && <ArrowRight size={15}/>}</div>)}</>; }
function FlowStep({ index, title, text, tone = "" }: { index: string; title: string; text: string; tone?: string }) { return <div className={`flow-step ${tone}`}><small>{index}</small><strong>{title}</strong><span>{text}</span></div>; }

function Graph({ selected, setSelected, onNext }: { selected: number; setSelected: (value: number) => void; onNext: () => void }) {
  const node = dependencyNodes[selected];
  return <><PageTitle kicker="依赖关系 · Dependency Graph" title="风险暴露投影" desc="当前展示Risk-exposed Projection；D40 Alpha与D60 Feature Ready仍为冻结Baseline。" action={<Button onClick={onNext}>进入风险输入<ArrowRight size={16}/></Button>}/>
    <div className="graph-layout">
      <section className="panel graph-panel"><div className="legend"><span><i className="hard"/>Hard Dependency：必须完成才能继续</span><span><i className="soft"/>Soft Dependency：可用临时方案部分解耦</span><span><i className="validation"/>Validation Dependency：交付前必须验证</span></div><div className="graph-scroll"><div className="graph-flow">{dependencyNodes.map((item, index) => <div className="graph-step" key={item.id}><button onClick={() => setSelected(index)} className={`${item.state} ${selected === index ? "selected" : ""}`} title={item.detail}><small>{item.id}</small><strong>{item.name}</strong><span>{item.status}</span></button>{index < dependencyNodes.length - 1 && <ArrowRight size={19}/>}</div>)}</div></div><div className="projection"><TriangleAlert size={18}/><div><strong>Alpha Risk Exposure ≈ D43</strong><span>风险暴露不等于必然延期；正式Feature Ready为D60。</span></div></div></section>
      <aside className="panel detail"><PanelTitle kicker="任务详情" title={`${node.id}｜${node.name}`} badge={node.status}/><dl><div><dt>Owner</dt><dd>{node.owner}</dd></div><div><dt>Status</dt><dd>{node.status}</dd></div><div><dt>计划</dt><dd>{node.schedule}</dd></div>{node.projected && <div><dt>预计完成</dt><dd className="risk-text">{node.projected}</dd></div>}<div><dt>Dependency</dt><dd>{node.dependency}</dd></div>{node.predecessor && <div><dt>前置任务</dt><dd>{node.predecessor}</dd></div>}{node.downstream && <div><dt>下游影响</dt><dd>{node.downstream}</dd></div>}</dl><p>{node.detail}</p></aside>
    </div>
  </>;
}

function RiskInput({ delay, setDelay, onAnalyze }: { delay: string; setDelay: (value: string) => void; onAnalyze: () => void }) {
  return <><PageTitle kicker="风险输入" title="记录已发生的研发偏差" desc="将偏差映射到固定依赖链，计算对Alpha交付的风险暴露。"/><section className="panel form-panel">
    <div className="field"><Label>Task</Label><Select defaultValue="an03"><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="an03">AN03｜Phase 2关键动画</SelectItem></SelectContent></Select></div>
    <div className="field"><Label>Issue Type</Label><Select defaultValue="quality-delay"><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="quality-delay">质量返工导致延期</SelectItem><SelectItem value="delay">延期</SelectItem><SelectItem value="technical">技术阻塞</SelectItem><SelectItem value="resource">资源不足</SelectItem><SelectItem value="dependency">依赖阻塞</SelectItem><SelectItem value="scope">Scope变化</SelectItem></SelectContent></Select></div>
    <div className="field"><Label htmlFor="delay">Delay</Label><div className="delay-control"><span>+</span><Input id="delay" type="number" min="0" max="20" value={delay} onChange={(event) => setDelay(event.target.value)}/><span>工作日</span></div></div>
    <div className="field"><Label>Reason</Label><Select defaultValue="quality"><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="quality">Quality Rework｜质量返工</SelectItem><SelectItem value="resource">Resource Shortage｜资源不足</SelectItem><SelectItem value="dependency">Dependency Block｜依赖阻塞</SelectItem><SelectItem value="technical">Technical Issue｜技术问题</SelectItem><SelectItem value="scope">Scope Change｜范围变化</SelectItem></SelectContent></Select></div>
    <div className="field wide"><Label htmlFor="description">Description</Label><Textarea id="description" defaultValue={demoScenario.event.description}/></div>
    <div className="form-footer"><span><ShieldAlert size={16}/>基于当前Dependency Graph计算</span><Button onClick={onAnalyze}>分析影响<Wand2 size={16}/></Button></div>
  </section></>;
}

function Impact({ analyzed, delayDays, projectedDay, onNext }: { analyzed: boolean; delayDays: number; projectedDay: number; onNext: () => void }) {
  return <><PageTitle kicker="影响分析" title="AN03偏差影响已展开" desc={`Phase 2关键动画延期 +${delayDays} 工作日 · Quality Rework`} action={<span className="status risk-status"><i/>风险中 AT RISK</span>}/>
    <section className="panel projection-summary"><div><span>原Alpha目标</span><strong>D40</strong></div><ArrowRight/><div><span>未重排风险暴露</span><strong className="risk-text">≈ D{projectedDay}</strong></div><p><b>风险暴露 ≠ 必然延期。</b> 这是当前依赖不调整时的风险投影，用于支持制作决策。</p></section>
    <div className="impact-grid"><section className="panel"><PanelTitle kicker="直接影响" title="Animation Event"/><p>正式Timing与事件节点尚未锁定，直接影响下游表现制作。</p></section><section className="panel"><PanelTitle kicker="间接影响" title="下游验证窗口"/><ul><li>VFX与Audio同步</li><li>Feature Integration</li><li>Multiplayer Validation</li><li>QA Validation</li></ul></section><section className="panel"><PanelTitle kicker="Milestone影响" title={`Alpha · D40 → 风险暴露D${projectedDay}`}/><p>AN03位于关键链路，延期会连续压缩VFX、集成、多人验证与QA窗口。</p></section></div>
    <section className="panel"><PanelTitle kicker="Impact Chain" title="风险传导路径" badge={analyzed ? "基于本次输入" : "示例预设"}/><div className="chain"><Chain items={[`AN03关键动画 +${delayDays}工作日`, "Animation Event", "VFX", "全链路集成", "多人验证", "QA", "D40 Alpha风险"]}/></div></section>
    <section className="panel"><PanelTitle kicker="Risk Assessment" title="四维风险评估"/><div className="risk-grid"><RiskItem label="进度风险" level="高" text="关键链路验证窗口被压缩。"/><RiskItem label="质量风险" level="高" text="关键机制可读性不足。"/><RiskItem label="资源风险" level="中" text="返工持续占用动画资源。" medium/><RiskItem label="范围风险" level="低" text="当前未直接改变Feature核心Scope。" low/></div></section>
    <div className="next-action"><p>系统提供方案权衡，最终选择由制作策划完成。</p><Button onClick={onNext}>进入决策中心<ArrowRight size={16}/></Button></div>
  </>;
}
function RiskItem({ label, level, text, medium, low }: { label: string; level: string; text: string; medium?: boolean; low?: boolean }) { return <div className={`risk-item ${medium ? "medium" : low ? "low" : "high"}`}><span>{label}</span><strong>{level}</strong><p>{text}</p></div>; }

function Decision({ decisions, setDecisions, onApply }: { decisions: string[]; setDecisions: (value: string[]) => void; onApply: () => void }) {
  const isModeled = decisions.length === 2 && decisions.includes("critical") && decisions.includes("placeholder");
  const toggle = (id: string) => setDecisions(decisions.includes(id) ? decisions.filter((item) => item !== id) : [...decisions, id]);
  return <><PageTitle kicker="决策中心" title="比较方案并做出人工选择" desc="系统辅助判断，不自动替代制作决策。请勾选要采用的方案。" action={<span className="selection-count">已选 {decisions.length} 项</span>}/>
    <div className="decision-layout"><div className="option-list">{decisionOptions.map((option) => { const checked = decisions.includes(option.id); return <label key={option.id} className={`option ${checked ? "selected" : ""}`}><Checkbox checked={checked} onCheckedChange={() => toggle(option.id)}/><span className="option-letter">{option.letter}</span><div className="option-copy"><div><h2>{option.title}</h2><small>{option.en}</small></div><p><b>收益：</b>{option.benefit}</p><p><b>代价：</b>{option.cost}</p></div><em className={option.status === "推荐" ? "recommended" : ""}>{option.status}</em></label>; })}</div>
      <aside className="panel decision-summary"><PanelTitle kicker="决策摘要" title="当前组合"/>{decisions.length === 0 ? <p className="empty">尚未选择方案。推荐组合会在快速演示中呈现，但不会自动代替你的选择。</p> : <div className="selected-options">{decisionOptions.filter((option) => decisions.includes(option.id)).map((option) => <span key={option.id}><Check size={14}/>{option.letter} · {option.title}</span>)}</div>}{isModeled ? <><div className="tradeoffs"><div><b>Time</b><p>保护D40核心交付</p></div><div><b>Quality</b><p>保留关键可读性要求</p></div><div><b>Resource</b><p>不新增资源，但产生跨团队并行与替换成本</p></div><div><b>Scope</b><p>非关键表现进入已登记的Polish Backlog</p></div></div><p className="why"><b>为什么可用Placeholder？</b>Animation → VFX属于可部分解耦的Soft Dependency，下游可以先用临时Event推进。</p></> : decisions.length > 0 && <p className="notice"><TriangleAlert size={16}/>本Demo仅建模B + C重排路径，当前组合不会直接得出“D40可行”。</p>}<Button className="full" disabled={!isModeled} onClick={onApply}>应用决策并重新排期<ArrowRight size={16}/></Button></aside>
    </div>
  </>;
}

function Result({ delayDays, projectedDay, applied, onDecision, onReset }: { delayDays: number; projectedDay: number; applied: boolean; onDecision: () => void; onReset: () => void }) {
  if (!applied) return <><PageTitle kicker="重排结果 · Replan" title="尚未生成可行重排" desc="只有选择B关键动画优先 + C Placeholder临时联调，才能运行本Demo建模的重排路径。"/><section className="panel empty-result"><TriangleAlert/><p>请返回决策中心完成B + C人工选择。</p><Button onClick={onDecision}>返回决策中心</Button></section></>;
  return <><section className="result-hero"><CheckCircle2 size={42}/><span>✅ 可行路径恢复</span><h1>D40 Alpha核心Scope重新具备可行交付路径。</h1><p>风险通过Replan重新进入可管理状态，但尚未消失。</p><div><Button variant="outline" onClick={onDecision}>调整决策</Button><Button variant="outline" onClick={onReset}><RotateCcw size={15}/>重置模拟</Button></div></section>
    <section className="panel"><PanelTitle kicker="Replan" title="前后排期对比" badge="B + C"/><div className="schedule-grid"><div><h3>Before · Baseline</h3><Schedule rows={["AN03：D27–D32", "VFX：D33–D38", "Integration：D38–D40", "Alpha：D40"]}/></div><div className="deviation"><h3>Deviation</h3><strong>AN03 +{delayDays}D</strong><p>未重排风险暴露：Alpha ≈ D{projectedDay}</p></div><div><h3>After · Replan</h3><Schedule rows={["AN03 Critical：D27–D35", "Placeholder VFX：继续推进", "正式替换：D36–D38", "Integration：仍目标D40"]} success/></div></div></section>
    <section className="panel logic-note"><PanelTitle kicker="决策逻辑" title="进度风险被转化，而不是消失"/><p><b>Critical First</b>保护关键机制动画和可读性验收；<b>Placeholder</b>让VFX与集成提前并行。临时策略因此把部分进度风险转化为正式替换与回归风险。</p></section>
    <section className="residual"><div className="section-title"><div><span>剩余风险 · Residual Risk</span><h2>Replan不代表风险消失。</h2></div><p>以下风险仍需Owner持续跟踪与关闭。</p></div><div className="residual-grid">{residualRisks.map((risk) => <article className="panel" key={risk.id}><span>{risk.id}</span><h3>{risk.title}</h3><div><small>Owner</small><strong>{risk.owner}</strong></div><p>{risk.action}</p></article>)}</div></section>
  </>;
}
function Schedule({ rows, success = false }: { rows: string[]; success?: boolean }) { return <div className={`schedule ${success ? "success" : ""}`}>{rows.map((row) => <div key={row}>{row}</div>)}</div>; }

