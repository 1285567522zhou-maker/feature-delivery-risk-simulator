# 游戏研发Feature交付风险分析模拟器

Feature Delivery Risk Simulator｜V1.0 Final

## 项目简介

这是一个面向游戏研发流程的Feature交付风险分析模拟Demo。用户可以选择关键链路任务、风险类型、1–5个工作日延期和原因；工具沿Dependency Graph展开下游影响，以轻量规则判断Milestone风险，并按原因调整推荐方案。AN03 +3D、质量返工、B+C仍是官方完整Replan场景。

一句话价值：不是预测项目什么时候延期，而是在延期发生后，帮助制作团队快速理解影响、评估方案，并重新找到可交付路径。

## 核心问题

研发任务延期通常会沿依赖链影响下游集成、验证和版本节点。项目用一个固定案例展示制作策划如何完成“发现问题 → 分析影响 → 判断风险 → 制定方案 → 调整计划 → 跟踪剩余风险”的完整闭环。

## 演示流程

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

## 功能说明

- 固定WBS与Dependency Graph展示
- 五个关键节点的风险输入与1–5工作日偏差
- 根据Task动态生成Direct / Secondary / Milestone影响
- 根据Delay与任务阶段计算D40风险暴露日
- 根据Reason动态调整优先推荐方案
- 进度、质量、资源、范围四维定性评估
- 七类决策方案对比；完整Replan仍只建模官方B+C场景
- B + C组合Replan模拟
- Residual Risk及Owner跟踪
- 一键播放完整示例

## 数据说明

任务、Milestone、依赖、决策方案、推荐映射和剩余风险集中配置在 `lib/demo-data.ts`。当前版本采用JSON式Mock数据与简单确定性规则，不依赖数据库或后端服务。

### 轻量规则

- Task：从所选节点开始，按`dependencyNodes`顺序向下游传播。
- Delay：基础风险暴露为D40加延期天数；FX01的软依赖可吸收约1天，验证阶段的MP04与QA02分别增加1天与2天暴露。
- Reason：质量返工推荐B+C；资源不足推荐A+D；依赖阻塞推荐C；技术问题推荐F+D；Scope变化推荐G+D+E。
- Replan：只有官方AN03 +3D、质量返工与B+C组合生成完整D40重排结果，其他组合只提供影响分析和方案比较。

## 研究边界

本项目为个人游戏研发制作管理研究Demo。任务、WBS、排期、依赖、风险与决策均为模拟数据，不代表任何真实公司或项目内部流程。

本项目不是Jira替代品、甘特图工具、通用项目管理软件、AI聊天助手或企业管理平台，也不包含Monte Carlo、完整CPM或真实项目数据。

## 本地运行

环境要求：Node.js 22.13.0或更高版本。

```bash
npm ci
npm run dev
```

浏览器访问终端显示的本地地址。

本地开发不需要设置`NEXT_PUBLIC_BASE_PATH`，页面默认运行在根路径。

## 技术栈

- Next.js / React / TypeScript
- 静态Mock数据
- 静态导出，不依赖数据库或后端服务

## 在线Demo

- 正式公网链接：https://1285567522zhou-maker.github.io/feature-delivery-risk-simulator/

## 部署说明

项目通过GitHub Pages公开部署，无需登录或安装软件。推送到`main`分支后，仓库中的`Deploy GitHub Pages`工作流会自动重新发布；也可以在GitHub Actions页面手动运行该工作流。

工作流与本地统一使用锁文件安装和相同构建命令：

```bash
npm ci
npm run build
```

### Base Path

`next.config.ts`读取构建期变量`NEXT_PUBLIC_BASE_PATH`。本地不设置时使用根路径；GitHub Actions会根据仓库名自动传入`/${{ github.event.repository.name }}`。仓库改名后无需修改源码，重新运行工作流即可；正式URL会同步变为新的仓库路径。

### 最短维护流程

1. 仓库`Settings → Pages`保持`Source: GitHub Actions`。
2. 推送`main`，在Actions中确认`Deploy GitHub Pages`成功。
3. 用未登录窗口检查首页、刷新、快速演示和手机宽度。
4. 需要回滚时，在GitHub撤销问题提交，再重新运行部署工作流。

## Demo重置

在重排结果页点击“重置模拟”，或直接刷新页面，即可恢复默认的AN03延期3个工作日场景。核心Demo数据不会被访问者删除。

## 核心流程截图

![Feature交付风险分析完整流程](docs/demo-flow.svg)

## 简历描述

**Feature Delivery Risk Simulator｜游戏研发Feature交付风险分析模拟器**

针对游戏研发Feature交付过程中的延期与依赖风险，设计研发风险分析模拟Demo。通过任务依赖建模，实现研发偏差影响分析、Milestone风险判断、多方案决策和Replan模拟，验证制作管理过程中从问题发现到重新收敛交付的完整流程。

