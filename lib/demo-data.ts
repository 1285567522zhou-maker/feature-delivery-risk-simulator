export const demoScenario = {
  feature: "多人首领Feature",
  milestone: "Alpha",
  baselineDay: 40,
  taskCount: 36,
  delayedCount: 1,
  remainingWorkdays: 15,
  event: {
    taskId: "AN03",
    taskName: "Phase 2关键动画",
    delayDays: 3,
    issueType: "质量返工导致延期",
    reason: "Quality Rework｜质量返工",
    description: "Phase 2关键机制动画与Event、VFX Timing未能稳定对齐，当前版本存在机制预告可读性风险，需要返修。",
  },
} as const;

export const milestones = [
  { name: "Prototype", day: 15 },
  { name: "Playable", day: 25 },
  { name: "Alpha", day: 40, active: true },
  { name: "Content Complete", day: 50 },
  { name: "Feature Ready", day: 60 },
];

export const riskTasks = [
  { id: "AN03", name: "Phase 2关键动画", nodeId: "AN03", exposureModifier: 0, milestoneNote: "位于表现关键链，延期会压缩后续制作与验证窗口。" },
  { id: "FX01", name: "VFX制作", nodeId: "FX01/AU01", exposureModifier: -1, milestoneNote: "软依赖允许Placeholder吸收约1天，但正式替换仍占用回归窗口。" },
  { id: "I01", name: "功能集成", nodeId: "I01", exposureModifier: 0, milestoneNote: "处于集成关键路径，可吸收空间有限。" },
  { id: "MP04", name: "多人验证", nodeId: "MP04", exposureModifier: 1, milestoneNote: "进入验证后再发生偏差，额外压缩跨端复测窗口。" },
  { id: "QA02", name: "QA质量验证", nodeId: "QA02", exposureModifier: 2, milestoneNote: "接近Alpha验收，留给修复与回归的缓冲最少。" },
] as const;

export const issueTypes = [
  { id: "delay", label: "延期" },
  { id: "quality", label: "质量返工" },
  { id: "technical", label: "技术阻塞" },
  { id: "resource", label: "资源不足" },
  { id: "dependency", label: "依赖阻塞" },
  { id: "scope", label: "Scope变化" },
] as const;

export const reasons = [
  { id: "quality", label: "质量返工 Quality Rework" },
  { id: "resource", label: "资源不足 Resource Shortage" },
  { id: "dependency", label: "依赖阻塞 Dependency Block" },
  { id: "technical", label: "技术问题 Technical Issue" },
  { id: "scope", label: "范围变化 Scope Change" },
] as const;

export const dependencyNodes = [
  { id: "D03", name: "玩法设计 Gameplay", owner: "玩法策划", schedule: "D03", status: "已完成", dependency: "强依赖 Hard Dependency", detail: "冻结Boss关键机制与预警需求。", state: "done" },
  { id: "P02/P03", name: "Boss逻辑", owner: "玩法 / 程序", schedule: "D18–D26", status: "已完成", dependency: "强依赖 Hard Dependency", detail: "Boss逻辑与阶段流程是动画制作前置。", state: "done" },
  { id: "AN03", name: "Phase 2关键动画", owner: "动画", schedule: "D27–D32", projected: "D35", status: "延期", dependency: "强依赖 Hard Dependency", predecessor: "D03", downstream: "动画事件 / VFX / 集成", detail: "关键机制动作与事件节点返工，位于Alpha关键链路。", state: "risk" },
  { id: "AE01", name: "动画事件 Event", owner: "动画 / 技术美术", schedule: "D32–D34", status: "受影响", dependency: "软依赖 Soft Dependency", detail: "可先使用临时Event推进下游，但正式替换需要回归。", state: "affected" },
  { id: "FX01/AU01", name: "VFX / 音频", owner: "特效 / 音频", schedule: "D33–D38", status: "受影响", dependency: "软依赖 Soft Dependency", detail: "依赖动作Timing，可用Placeholder部分解耦。", state: "affected" },
  { id: "I01", name: "功能集成 Integration", owner: "客户端", schedule: "D38–D40", status: "窗口压缩", dependency: "强依赖 Hard Dependency", detail: "正式资源到位后需要完成全链路集成。", state: "waiting" },
  { id: "MP04", name: "多人验证", owner: "网络", schedule: "D38–D39", status: "窗口压缩", dependency: "验收依赖 Validation Dependency", detail: "多人环境需要验证同步、触发与可读性。", state: "waiting" },
  { id: "QA02", name: "QA质量验证", owner: "QA", schedule: "D39–D40", status: "窗口压缩", dependency: "验收依赖 Validation Dependency", detail: "Alpha前验证关键机制可读性与多人稳定性。", state: "waiting" },
  { id: "I02/QA03", name: "QA质量验证", owner: "客户端 / QA", schedule: "D39–D40", status: "窗口压缩", dependency: "验收依赖 Validation Dependency", detail: "替换正式资源后仍需完成回归验证。", state: "waiting" },
  { id: "D40", name: "Alpha", owner: "制作", schedule: "Baseline D40", status: "风险中", dependency: "Milestone", detail: "风险暴露约D43；冻结Feature Ready仍为D60。", state: "milestone" },
];

export const decisionOptions = [
  { id: "resource", letter: "A", title: "增加资源", en: "Add Resource", benefit: "提高并行处理能力。", cost: "存在上下文接入与资源成本。" },
  { id: "critical", letter: "B", title: "关键内容优先", en: "Critical First", benefit: "优先核心机制与Milestone内容。", cost: "非关键表现完整度后移。" },
  { id: "placeholder", letter: "C", title: "Placeholder临时联调", en: "Placeholder Integration", benefit: "下游使用临时资源减少等待。", cost: "产生正式替换与回归成本。" },
  { id: "scope", letter: "D", title: "缩减Alpha Scope", en: "Reduce Scope", benefit: "降低当前验收范围与交付风险。", cost: "Alpha验证范围与体验完整度下降。" },
  { id: "milestone", letter: "E", title: "整体后移", en: "Move Milestone", benefit: "保留原Scope与质量要求。", cost: "影响后续Milestone与版本计划。" },
  { id: "temporary", letter: "F", title: "临时技术方案", en: "Temporary Solution", benefit: "绕开技术阻塞，先恢复关键链路。", cost: "形成技术债与后续替换成本。" },
  { id: "review", letter: "G", title: "变更评审", en: "Change Review", benefit: "先确认变化必要性、影响面与验收口径。", cost: "增加决策协调时间。" },
];

export const recommendationByReason: Record<string, string[]> = {
  quality: ["critical", "placeholder"],
  resource: ["resource", "scope"],
  dependency: ["placeholder"],
  technical: ["temporary", "scope"],
  scope: ["review", "scope", "milestone"],
};

export const residualRisks = [
  { id: "R1", title: "Placeholder替换风险", owner: "VFX / Animation", action: "锁定正式Event替换清单与验收时间。" },
  { id: "R2", title: "机制可读性风险", owner: "Gameplay", action: "保留关键机制可读性验收，不用临时方案降低标准。" },
  { id: "R3", title: "QA回归窗口压缩", owner: "QA", action: "预留正式资源替换后的定向回归窗口。" },
  { id: "R4", title: "资源竞争风险", owner: "Animation / Production", action: "跟踪返工与Polish Backlog对动画资源的并行占用。" },
];

