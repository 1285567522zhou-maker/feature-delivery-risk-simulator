"use client";

import { useState, type ComponentProps } from "react";
import { Activity, ArrowRight, BarChart3, Check, CheckCircle2, Clock3, GitBranch, RotateCcw, ShieldAlert, Target, TriangleAlert, Wand2 } from "lucide-react";
import { decisionOptions, demoScenario, dependencyNodes, issueTypes, milestones, reasons, recommendationByReason, residualRisks, riskTasks } from "@/lib/demo-data";

function Button({ className, variant = "default", ...props }: ComponentProps<"button"> & { variant?: "default" | "outline" }) {
  return <button className={["ui-button", variant === "outline" ? "outline" : "", className].filter(Boolean).join(" ")} {...props}/>;
}

type PageId = "dashboard" | "graph" | "input" | "impact" | "decision" | "result";
type RiskTaskId = (typeof riskTasks)[number]["id"];
type IssueTypeId = (typeof issueTypes)[number]["id"];
type ReasonId = (typeof reasons)[number]["id"];
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
  const [taskId, setTaskId] = useState<RiskTaskId>("AN03");
  const [issueTypeId, setIssueTypeId] = useState<IssueTypeId>("quality");
  const [delayDays, setDelayDays] = useState(3);
  const [reasonId, setReasonId] = useState<ReasonId>("quality");
  const [description, setDescription] = useState<string>(demoScenario.event.description);
  const [decisions, setDecisions] = useState<string[]>([]);
  const [analyzed, setAnalyzed] = useState(false);
  const [applied, setApplied] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
  const task = riskTasks.find((item) => item.id === taskId) ?? riskTasks[0];
  const projectedDay = demoScenario.baselineDay + Math.max(1, delayDays + task.exposureModifier);
  const recommendedIds = recommendationByReason[reasonId];
  const isOfficialScenario = taskId === "AN03" && issueTypeId === "quality" && delayDays === 3 && reasonId === "quality";
  const isModeled = isOfficialScenario && decisions.includes("critical") && decisions.includes("placeholder");

  function analyze() { setApplied(false); setAnalyzed(true); setPage("impact"); }
  function applyDecision() { if (!isModeled) return; setApplied(true); setPage("result"); }
  function resetScenario() {
    setTaskId("AN03"); setIssueTypeId("quality"); setDelayDays(3); setReasonId("quality");
    setDescription(demoScenario.event.description); setDecisions([]); setAnalyzed(false); setApplied(false);
  }
  function reset() { setPage("dashboard"); resetScenario(); setDemoRunning(false); }
  function runQuickDemo() {
    setDemoRunning(true); resetScenario(); setPage("input");
    window.setTimeout(() => { setAnalyzed(true); setPage("impact"); }, 650);
    window.setTimeout(() => { setDecisions(["critical", "placeholder"]); setPage("decision"); }, 1400);
    window.setTimeout(() => { setApplied(true); setPage("result"); setDemoRunning(false); }, 2300);
  }

  return <main className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><GitBranch size={19}/></span><div><strong>交付风险模拟器</strong><small>Feature Delivery Risk Simulator</small></div></div>
      <nav aria-label="六步演示流程">{pages.map((item) => { const Icon = item.icon; return <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => setPage(item.id)}><Icon size={17}/><span>{item.label}</span><small>{item.step}</small></button>; })}</nav>
      <div className="sidebar-foot"><span>V1.0 FINAL</span><strong>Interactive Risk Scenario</strong></div>
    </aside>
    <section className="workspace">
      <header className="topbar"><div><span>示例场景</span><strong>多人首领Feature</strong></div><div className="top-status"><span>Alpha · D40</span><b><i/>风险中 · At Risk</b></div></header>
      <div className="content">
        {page === "dashboard" && <Dashboard onGraph={() => setPage("graph")} onInput={() => setPage("input")} onDemo={runQuickDemo} demoRunning={demoRunning}/>}
        {page === "graph" && <Graph selected={selectedNode} setSelected={setSelectedNode} onNext={() => setPage("input")}/>}
        {page === "input" && <RiskInput taskId={taskId} setTaskId={setTaskId} issueTypeId={issueTypeId} setIssueTypeId={setIssueTypeId} delayDays={delayDays} setDelayDays={setDelayDays} reasonId={reasonId} setReasonId={(value) => { setReasonId(value); setDecisions([]); setApplied(false); }} description={description} setDescription={setDescription} onAnalyze={analyze}/>} 
        {page === "impact" && <Impact analyzed={analyzed} taskId={taskId} issueTypeId={issueTypeId} reasonId={reasonId} description={description} delayDays={delayDays} projectedDay={projectedDay} onNext={() => setPage("decision")}/>} 
        {page === "decision" && <Decision decisions={decisions} recommendedIds={recommendedIds} reasonId={reasonId} isOfficialScenario={isOfficialScenario} setDecisions={(value) => { setDecisions(value); setApplied(false); }} onApply={applyDecision}/>} 
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
    <section className="hero"><span className="hero-tag">游戏研发 · Feature交付</span><h1>游戏研发Feature交付风险分析模拟器</h1><h2>Feature Delivery Risk Simulator</h2><p>本 Demo 为个人制作管理研究原型，用于展示游戏研发Feature中的依赖传播、风险判断、方案取舍与Replan逻辑，不代表任何真实项目或公司内部流程。</p><div className="hero-actions"><Button onClick={onDemo} disabled={demoRunning}>{demoRunning ? "演示进行中…" : "快速演示"}<ArrowRight size={16}/></Button><Button variant="outline" onClick={onInput}>输入研发偏差</Button></div></section>
    <section className="scenario-banner"><div><span>示例场景</span><strong>多人首领Feature｜Alpha目标 D40</strong></div><p><TriangleAlert size={18}/>Phase 2关键动画因机制可读性返工，预计延期3个工作日。</p></section>
    <section className="panel static-fallback"><PanelTitle kicker="完整案例链 · 静态概览" title="不操作也能看懂的交付判断" badge="V1.0 Final官方场景"/><div className="fallback-flow"><FlowStep index="01" title="AN03关键动画延期 +3D" text="机制可读性返工" tone="risk"/><ArrowRight/><FlowStep index="02" title="依赖传播" text="Event → VFX → Integration → Multiplayer → QA"/><ArrowRight/><FlowStep index="03" title="D40 Alpha风险" text="未重排风险暴露 ≈ D43" tone="risk"/><ArrowRight/><FlowStep index="04" title="B + C决策" text="关键优先 + Placeholder"/><ArrowRight/><FlowStep index="05" title="重新排期 Replan" text="D40核心Scope恢复可行路径" tone="success"/><ArrowRight/><FlowStep index="06" title="剩余风险 Residual Risk" text="替换、可读性、回归与资源竞争仍需跟踪"/></div></section>
    <div className="metric-grid">
      <Metric label="当前状态" value="高风险" detail="High · At Risk" risk/><Metric label="任务" value="36" detail="WBS任务总数"/><Metric label="延期" value="1" detail="AN03 · +3工作日"/><Metric label="剩余工作日" value="15" detail="至Alpha验收"/>
    </div>
    <div className="dashboard-grid">
      <section className="panel"><PanelTitle kicker="当前偏差" title="AN03｜Phase 2关键动画" badge="质量返工"/><p className="lead">关键机制动画与Event、VFX Timing未稳定对齐，存在机制预告可读性风险。</p><dl className="compact-list"><div><dt>负责人 Owner</dt><dd>动画</dd></div><div><dt>计划</dt><dd>D27–D32</dd></div><div><dt>预计</dt><dd className="risk-text">D35</dd></div><div><dt>主要风险</dt><dd>关键动画返工</dd></div></dl><Button className="full" onClick={onInput}>查看风险事件<ArrowRight size={15}/></Button></section>
      <section className="panel"><PanelTitle kicker="影响链" title="为什么Alpha有风险" badge="Critical Path"/><p className="lead">AN03位于关键链路，延期会压缩VFX、集成、多人验证与QA窗口。</p><div className="chain compact"><Chain items={["动画 +3D", "Animation Event", "VFX", "集成", "多人验证", "QA", "Alpha Risk"]}/></div><Button variant="outline" className="full" onClick={onGraph}>查看依赖<ArrowRight size={15}/></Button></section>
    </div>
    <section className="panel milestone-panel"><PanelTitle kicker="Milestone" title="Feature交付节点" badge="Baseline"/><div className="milestone-strip">{milestones.map((m) => <div className={m.active ? "active" : ""} key={m.name}><span>D{m.day}</span><strong>{m.name}</strong></div>)}</div></section>
    <p className="disclaimer">本项目为个人游戏研发制作管理研究Demo；全部任务、排期、依赖、风险与决策均为模拟数据。</p>
  </>;
}

function Metric({ label, value, detail, risk = false }: { label: string; value: string; detail: string; risk?: boolean }) { return <div className={`metric ${risk ? "risk" : ""}`}><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>; }
function PanelTitle({ kicker, title, badge }: { kicker: string; title: string; badge?: string }) { return <div className="panel-title"><div><span>{kicker}</span><h2>{title}</h2></div>{badge && <b>{badge}</b>}</div>; }
function Chain({ items }: { items: string[] }) { return <>{items.map((item, index) => <div className="chain-piece" key={`${index}-${item}`}><span>{item}</span>{index < items.length - 1 && <ArrowRight size={15}/>}</div>)}</>; }
function FlowStep({ index, title, text, tone = "" }: { index: string; title: string; text: string; tone?: string }) { return <div className={`flow-step ${tone}`}><small>{index}</small><strong>{title}</strong><span>{text}</span></div>; }

function Graph({ selected, setSelected, onNext }: { selected: number; setSelected: (value: number) => void; onNext: () => void }) {
  const node = dependencyNodes[selected];
  return <><PageTitle kicker="依赖关系 · Dependency Graph" title="风险暴露投影" desc="当前展示Risk-exposed Projection；D40 Alpha与D60 Feature Ready仍为冻结Baseline。" action={<Button onClick={onNext}>进入风险输入<ArrowRight size={16}/></Button>}/>
    <div className="graph-layout">
      <section className="panel graph-panel"><div className="legend"><span><i className="hard"/>强依赖 Hard：必须完成才能继续</span><span><i className="soft"/>软依赖 Soft：可用临时方案部分解耦</span><span><i className="validation"/>验收依赖 Validation：交付前必须验证</span></div><div className="graph-scroll"><div className="graph-flow">{dependencyNodes.map((item, index) => <div className="graph-step" key={item.id}><button onClick={() => setSelected(index)} className={`${item.state} ${selected === index ? "selected" : ""}`} title={item.detail}><small>{item.id}</small><strong>{item.name}</strong><span>{item.status}</span></button>{index < dependencyNodes.length - 1 && <ArrowRight size={19}/>}</div>)}</div></div><div className="projection"><TriangleAlert size={18}/><div><strong>Alpha风险暴露 ≈ D43</strong><span>风险暴露不等于必然延期；正式Feature Ready为D60。</span></div></div></section>
      <aside className="panel detail"><PanelTitle kicker="任务详情" title={`${node.id}｜${node.name}`} badge={node.status}/><dl><div><dt>负责人 Owner</dt><dd>{node.owner}</dd></div><div><dt>状态</dt><dd>{node.status}</dd></div><div><dt>计划</dt><dd>{node.schedule}</dd></div>{node.projected && <div><dt>预计完成</dt><dd className="risk-text">{node.projected}</dd></div>}<div><dt>依赖类型 Dependency</dt><dd>{node.dependency}</dd></div>{node.predecessor && <div><dt>前置任务</dt><dd>{node.predecessor}</dd></div>}{node.downstream && <div><dt>下游影响</dt><dd>{node.downstream}</dd></div>}</dl><p>{node.detail}</p></aside>
    </div>
  </>;
}

function RiskInput({ taskId, setTaskId, issueTypeId, setIssueTypeId, delayDays, setDelayDays, reasonId, setReasonId, description, setDescription, onAnalyze }: {
  taskId: RiskTaskId; setTaskId: (value: RiskTaskId) => void;
  issueTypeId: IssueTypeId; setIssueTypeId: (value: IssueTypeId) => void;
  delayDays: number; setDelayDays: (value: number) => void;
  reasonId: ReasonId; setReasonId: (value: ReasonId) => void;
  description: string; setDescription: (value: string) => void; onAnalyze: () => void;
}) {
  return <><PageTitle kicker="风险输入" title="记录研发偏差" desc="选择关键链路节点与风险条件，系统将用轻量规则生成影响传播与方案推荐。"/><section className="panel form-panel">
    <div className="frozen-note"><ShieldAlert size={16}/><span><b>官方演示场景</b>：AN03 +3D、质量返工与B+C仍可通过首页“快速演示”一键播放。</span></div>
    <div className="field"><label htmlFor="task">任务 Task</label><select id="task" value={taskId} onChange={(event) => setTaskId(event.target.value as RiskTaskId)}>{riskTasks.map((task) => <option key={task.id} value={task.id}>{task.id}｜{task.name}</option>)}</select></div>
    <div className="field"><label htmlFor="issue-type">风险类型 Issue Type</label><select id="issue-type" value={issueTypeId} onChange={(event) => setIssueTypeId(event.target.value as IssueTypeId)}>{issueTypes.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
    <div className="field"><label htmlFor="delay">延期时间 Delay</label><select id="delay" value={delayDays} onChange={(event) => setDelayDays(Number(event.target.value))}>{[1,2,3,4,5].map((day) => <option key={day} value={day}>+{day} 工作日</option>)}</select></div>
    <div className="field"><label htmlFor="reason">原因 Reason</label><select id="reason" value={reasonId} onChange={(event) => setReasonId(event.target.value as ReasonId)}>{reasons.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
    <div className="field wide"><label htmlFor="description">说明 Description</label><textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} /></div>
    <div className="form-footer"><span><ShieldAlert size={16}/>基于当前Dependency Graph计算</span><Button onClick={onAnalyze}>分析影响<Wand2 size={16}/></Button></div>
  </section></>;
}

function Impact({ analyzed, taskId, issueTypeId, reasonId, description, delayDays, projectedDay, onNext }: {
  analyzed: boolean; taskId: RiskTaskId; issueTypeId: IssueTypeId; reasonId: ReasonId; description: string;
  delayDays: number; projectedDay: number; onNext: () => void;
}) {
  const task = riskTasks.find((item) => item.id === taskId) ?? riskTasks[0];
  const taskIndex = dependencyNodes.findIndex((node) => node.id === task.nodeId);
  const downstream = dependencyNodes.slice(taskIndex + 1);
  const direct = downstream[0];
  const secondary = downstream.slice(1).filter((node) => node.id !== "D40");
  const issue = issueTypes.find((item) => item.id === issueTypeId)?.label ?? "延期";
  const reason = reasons.find((item) => item.id === reasonId)?.label ?? "";
  const exposure = projectedDay - demoScenario.baselineDay;
  const scheduleHigh = exposure >= 3;
  const qualityHigh = issueTypeId === "quality" || reasonId === "quality";
  const resourceHigh = issueTypeId === "resource" || reasonId === "resource";
  const scopeHigh = issueTypeId === "scope" || reasonId === "scope";
  return <><PageTitle kicker="影响分析" title={`${task.id}偏差影响已展开`} desc={`${task.name} · +${delayDays}工作日 · ${issue} · ${reason}`} action={<span className="status risk-status"><i/>{exposure >= 4 ? "高风险" : "风险中"} · At Risk</span>}/>
    <section className="panel projection-summary"><div><span>原Alpha目标</span><strong>D40</strong></div><ArrowRight/><div><span>未重排风险暴露</span><strong className="risk-text">≈ D{projectedDay}</strong></div><p><b>风险暴露 ≠ 必然延期。</b> {task.milestoneNote}<br/><small>记录说明：{description || "未填写"}</small></p></section>
    <div className="impact-grid"><section className="panel"><PanelTitle kicker="直接影响" title={direct ? `${direct.id}｜${direct.name}` : "D40 Alpha"}/><p>{task.name}发生偏差后，首先压缩{direct?.name ?? "Alpha验收"}的开始与验证窗口。</p></section><section className="panel"><PanelTitle kicker="间接影响" title={`${secondary.length}个下游节点`}/><ul>{secondary.length ? secondary.map((node) => <li key={node.id}>{node.id}｜{node.name}</li>) : <li>无额外间接任务，直接影响Alpha验收。</li>}</ul></section><section className="panel"><PanelTitle kicker="Milestone影响" title={`Alpha · D40 → 风险暴露D${projectedDay}`}/><p>{task.milestoneNote} 当前简单规则计入约{exposure}个工作日风险暴露。</p></section></div>
    <section className="panel"><PanelTitle kicker="影响链 Impact Chain" title="风险传导路径" badge={analyzed ? "基于本次输入" : "示例预设"}/><div className="chain"><Chain items={[`${task.id} ${task.name} +${delayDays}D`, ...downstream.filter((node) => node.id !== "D40").map((node) => node.name), `Alpha风险 D${projectedDay}`]}/></div></section>
    <section className="panel"><PanelTitle kicker="风险评估 Risk Assessment" title="四维风险评估"/><div className="risk-grid"><RiskItem label="进度风险" level={scheduleHigh ? "高" : "中"} text={`Alpha风险暴露约D${projectedDay}。`} medium={!scheduleHigh}/><RiskItem label="质量风险" level={qualityHigh ? "高" : "中"} text={qualityHigh ? "质量返工或可读性需要重点验证。" : "需关注下游集成质量。"} medium={!qualityHigh}/><RiskItem label="资源风险" level={resourceHigh ? "高" : "中"} text={resourceHigh ? "资源不足直接限制并行处理。" : "偏差会占用既有处理资源。"} medium={!resourceHigh}/><RiskItem label="范围风险" level={scopeHigh ? "高" : "低"} text={scopeHigh ? "Scope变化需要重新确认验收口径。" : "当前未直接改变Feature核心Scope。"} low={!scopeHigh}/></div></section>
    <div className="next-action"><p>系统提供方案权衡，最终选择由制作策划完成。</p><Button onClick={onNext}>进入决策中心<ArrowRight size={16}/></Button></div>
  </>;
}
function RiskItem({ label, level, text, medium, low }: { label: string; level: string; text: string; medium?: boolean; low?: boolean }) { return <div className={`risk-item ${medium ? "medium" : low ? "low" : "high"}`}><span>{label}</span><strong>{level}</strong><p>{text}</p></div>; }

function Decision({ decisions, recommendedIds, reasonId, isOfficialScenario, setDecisions, onApply }: { decisions: string[]; recommendedIds: string[]; reasonId: ReasonId; isOfficialScenario: boolean; setDecisions: (value: string[]) => void; onApply: () => void }) {
  const isModeled = isOfficialScenario && decisions.includes("critical") && decisions.includes("placeholder");
  const reason = reasons.find((item) => item.id === reasonId)?.label ?? "当前原因";
  const toggle = (id: string) => setDecisions(decisions.includes(id) ? decisions.filter((item) => item !== id) : [...decisions, id]);
  return <><PageTitle kicker="决策中心" title="比较方案并做出人工选择" desc={`当前原因：${reason}。推荐会随原因变化，但不会替代人工决策。`} action={<span className="selection-count">已选 {decisions.length} 项</span>}/>
    <div className="decision-layout"><div className="option-list">{decisionOptions.map((option) => { const checked = decisions.includes(option.id); const recommended = recommendedIds.includes(option.id); return <label key={option.id} className={`option ${checked ? "selected" : ""}`}><input className="decision-check" type="checkbox" checked={checked} onChange={() => toggle(option.id)}/><span className="option-letter">{option.letter}</span><div className="option-copy"><div><h2>{option.title}</h2><small>{option.en}</small></div><p><b>收益：</b>{option.benefit}</p><p><b>代价：</b>{option.cost}</p>{!recommended && <small className="comparison-label">可比较；不是当前原因的优先推荐</small>}</div><em className={recommended ? "recommended" : ""}>{recommended ? "优先推荐" : "可比较"}</em></label>; })}</div>
      <aside className="panel decision-summary"><PanelTitle kicker="决策摘要" title="当前组合"/>{decisions.length === 0 ? <p className="empty">尚未选择方案。带“优先推荐”的方案由当前原因规则生成。</p> : <div className="selected-options">{decisionOptions.filter((option) => decisions.includes(option.id)).map((option) => <span key={option.id}><Check size={14}/>{option.letter} · {option.title}</span>)}</div>}{isModeled ? <><div className="tradeoffs"><div><b>时间</b><p>保护D40核心交付</p></div><div><b>质量</b><p>保留关键可读性要求</p></div><div><b>资源</b><p>不新增资源，但产生跨团队并行与替换成本</p></div><div><b>范围</b><p>非关键表现进入已登记的Polish Backlog</p></div></div><p className="why"><b>为什么可用Placeholder？</b>Animation → VFX属于可部分解耦的软依赖，下游可以先用临时Event推进。</p></> : <p className="notice"><TriangleAlert size={16}/>{isOfficialScenario ? "请选择B关键内容优先 + C Placeholder，运行官方Replan路径。" : "推荐已按当前原因更新；V1.0 Final仅对官方AN03 +3D、质量返工、B+C场景生成完整Replan。"}</p>}<Button className="full" disabled={!isModeled} onClick={onApply}>应用决策并重新排期<ArrowRight size={16}/></Button></aside>
    </div>
  </>;
}

function Result({ delayDays, projectedDay, applied, onDecision, onReset }: { delayDays: number; projectedDay: number; applied: boolean; onDecision: () => void; onReset: () => void }) {
  if (!applied) return <><PageTitle kicker="重排结果 · Replan" title="尚未生成可行重排" desc="只有选择B关键动画优先 + C Placeholder临时联调，才能运行本Demo建模的重排路径。"/><section className="panel empty-result"><TriangleAlert/><p>请返回决策中心完成B + C人工选择。</p><Button onClick={onDecision}>返回决策中心</Button></section></>;
  return <><section className="result-hero"><CheckCircle2 size={42}/><span>✅ 可行路径恢复</span><h1>D40 Alpha核心Scope重新具备可行交付路径。</h1><p>风险通过Replan重新进入可管理状态，但尚未消失。</p><div><Button variant="outline" onClick={onDecision}>调整决策</Button><Button variant="outline" onClick={onReset}><RotateCcw size={15}/>重置模拟</Button></div></section>
    <section className="panel"><PanelTitle kicker="重新排期 Replan" title="前后排期对比" badge="B + C"/><div className="schedule-grid"><div><h3>调整前 · Baseline</h3><Schedule rows={["AN03：D27–D32", "VFX：D33–D38", "功能集成：D38–D40", "Alpha：D40"]}/></div><div className="deviation"><h3>偏差</h3><strong>AN03 +{delayDays}D</strong><p>未重排风险暴露：Alpha ≈ D{projectedDay}</p></div><div><h3>调整后 · Replan</h3><Schedule rows={["AN03关键部分：D27–D35", "Placeholder VFX：继续推进", "正式替换：D36–D38", "功能集成：仍目标D40"]} success/></div></div></section>
    <section className="panel logic-note"><PanelTitle kicker="决策逻辑" title="进度风险被转化，而不是消失"/><p><b>Critical First</b>保护关键机制动画和可读性验收；<b>Placeholder</b>让VFX与集成提前并行。临时策略因此把部分进度风险转化为正式替换与回归风险。</p></section>
    <section className="residual"><div className="section-title"><div><span>剩余风险 · Residual Risk</span><h2>Replan不代表风险消失。</h2></div><p>以下风险仍需负责人持续跟踪与关闭。</p></div><div className="residual-grid">{residualRisks.map((risk) => <article className="panel" key={risk.id}><span>{risk.id}</span><h3>{risk.title}</h3><div><small>负责人 Owner</small><strong>{risk.owner}</strong></div><p>{risk.action}</p></article>)}</div></section>
  </>;
}
function Schedule({ rows, success = false }: { rows: string[]; success?: boolean }) { return <div className={`schedule ${success ? "success" : ""}`}>{rows.map((row) => <div key={row}>{row}</div>)}</div>; }

