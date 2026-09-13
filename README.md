# 游戏研发Feature交付风险分析模拟器

Feature Delivery Risk Simulator｜V1.0 Demo

## 项目简介

这是一个面向游戏研发流程的Feature交付风险分析模拟Demo。用户输入已经发生的研发偏差后，工具会沿Dependency Graph展开影响，判断Milestone风险，展示可选决策，并模拟Replan后的可行交付路径与Residual Risk。

一句话价值：不是预测项目什么时候延期，而是在延期发生后，帮助制作团队快速理解影响、评估方案，并重新找到可交付路径。

## 为什么做

研发任务延期通常会沿依赖链影响下游集成、验证和版本节点。项目用一个固定案例展示制作策划如何完成“发现问题 → 分析影响 → 判断风险 → 制定方案 → 调整计划 → 跟踪剩余风险”的完整闭环。

## 核心流程

1. 项目概览
2. 依赖关系
3. 风险输入
4. 影响分析
5. 决策中心
6. 重排结果

## Demo场景

- Feature：多人首领Feature
- 当前阶段：Alpha
- 目标节点：D40
- 偏差事件：AN03｜Phase 2关键动画因机制可读性返工，预计延期3个工作日
- 决策路径：B 关键动画优先 + C Placeholder临时联调
- 结果口径：D40 Alpha核心Scope重新具备可行交付路径，但替换、可读性、回归窗口和资源竞争风险仍需持续跟踪

## 功能

- 固定WBS与Dependency Graph展示
- 研发偏差输入与动态D40 + Delay风险投影
- Direct / Secondary / Milestone影响分析
- 进度、质量、资源、范围四维定性评估
- 五类决策方案与人工勾选
- B + C组合Replan模拟
- Residual Risk及Owner跟踪
- 一键播放完整示例

## 数据说明

任务、Milestone、依赖、决策方案和剩余风险集中配置在 `lib/demo-data.ts`。当前版本采用JSON式Mock数据与固定规则，不依赖数据库或后端服务。

## 研究边界

Portfolio scenario simulation based on publicly available information; all schedules and task data are hypothetical.

本项目不是Jira替代品、甘特图工具、通用项目管理软件、AI聊天助手或企业管理平台，也不包含Monte Carlo、完整CPM或真实项目数据。

## 本地运行

环境要求：Node.js 22.13.0或更高版本。

```bash
npm ci
npm run dev
```

浏览器访问终端显示的本地地址。

## 在线Demo

- 主链接（GitHub Pages）：https://1285567522zhou-maker.github.io/feature-delivery-risk-simulator/
- 备用链接（Vercel）：https://feature-delivery-risk-simulator.vercel.app/
- 开发预览：https://feature-delivery-risk-simulator.green-pine-5194.chatgpt.site/

## 核心流程截图

![Feature交付风险分析完整流程](docs/demo-flow.svg)

## 简历描述

**Feature Delivery Risk Simulator｜游戏研发Feature交付风险分析模拟器**

针对游戏研发Feature交付过程中的延期与依赖风险，设计研发风险分析模拟Demo。通过任务依赖建模，实现研发偏差影响分析、Milestone风险判断、多方案决策和Replan模拟，验证制作管理过程中从问题发现到重新收敛交付的完整流程。

