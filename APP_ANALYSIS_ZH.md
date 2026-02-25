# RTUT 内部通知 App 技术分析（React + iOS/Android）

## 1) 项目定位与业务目标
- 该项目名称为 `rtutapp`，版本 `1.11.0`，并以 `private` 方式维护，明显属于企业内部应用而非公开 SaaS 产品。 
- 代码中存在“通知 + 调查问卷 + 日历事件 + 员工常用链接 + 内置聊天机器人”的组合，符合中小企业内部通知与员工触达场景。 

## 2) 技术架构概览
- 前端基于 Create React App（CRA）构建，入口为 `src/index.js`，由 `AppNavigation` 驱动多页面流转。
- UI 使用了 React + react-native-web 混合风格：组件大量来自 `react-native`（`View`、`Text`、`Pressable`），并在 Web 容器中运行。
- 跨端采用 Capacitor：`capacitor.config.json` 指定了 `webDir=build`，并且仓库包含 `android/` 与 `ios/` 原生工程，说明是 Web 代码打包后桥接到 iOS/Android。
- 通知系统使用 Novu Headless SDK 管理消息拉取和状态，推送层使用 `@capacitor/push-notifications`。

## 3) 功能模块分析

### 3.1 身份认证与账号流程
- 登录页支持“记住密码”“显示密码”“忘记密码（手机号触发）”，并将用户名/密码可选缓存到本地存储。
- 登录成功后，先检查激活状态（`isActivated`），未激活用户进入免责声明流程，已激活用户进入主页面。
- 用户唯一 ID 由姓名哈希生成，用于通知订阅身份。

### 3.2 通知主线（核心价值）
- `App` 中初始化 Push 权限并注册 token，再把 token 发送到后端进行设备绑定。
- `NotificationProvider` 负责基于 Novu 拉取分页通知、去重、排序、标记已读、删除等能力。
- 通知列表可按消息类型分流（普通消息/调查），并支持从推送点击直接定位到具体消息。

### 3.3 日历与活动
- 通知页面同时会请求 `fetch-events` 事件接口，并缓存到 `localStorage`，用于内部日程展示。

### 3.4 员工服务链接
- 设置菜单内置了 ADP、福利平台、SDS/安全系统、EAP 电话支持等外部入口，符合公司内部门户的常见诉求。

### 3.5 内置 AI Chat
- 聊天组件对接后端 `/chat` 与 `/search`，提供“Roy Bot”问答。
- 设置了每月问题次数和 token 用量限制，避免无限调用导致成本失控。

## 4) 跨端部署可行性评估（iOS + Android）
- 结论：**可跨端部署，且工程已具备部署基础**。
- 证据：
  1. `@capacitor/android`、`@capacitor/ios` 依赖齐全；
  2. `capacitor.config.json` 已配置 appId、webDir；
  3. `android/app/build.gradle` 已设置包名、版本、Firebase Messaging（推送）；
  4. 项目目录包含完整 `ios/`、`android/`。

## 5) 代码质量与风险点

### 5.1 安全风险（优先级高）
- 登录“记住密码”将明文密码存入 `AsyncStorage`，存在本地泄露风险（尤其在越狱/Root或调试环境）。
- 客户端硬编码后端 URL（Heroku），环境切换与密钥管理弱。
- 部分日志打印了请求与用户信息，生产环境应严格收敛。

### 5.2 可维护性风险
- React Web + react-native-web + Capacitor + 原生插件 +第三方通知 SDK 叠加，技术栈偏“拼接式”，后续升级成本高。
- `notificationModal.js` 与通知上下文逻辑较重，`useEffect` 数量多，后续容易出现副作用连锁。
- 代码中同时使用 `localStorage` 与 `AsyncStorage`，状态来源分散，增加排障成本。

### 5.3 可靠性风险
- 网络重试和错误边界有一定实现，但不统一；异常处理多以 `console` 为主。
- 依赖远端 API 可用性（Heroku、AI服务、Novu），缺少明确的降级策略和可观测指标。

## 6) 面向美国小公司（1人开发）的现实判断
- 从产品形态看，这个系统非常符合“单人/小团队快速交付”的路径：
  - Web 技术复用 + Capacitor 一套代码双端上线；
  - 功能直达业务（通知、公告、调查、日程、福利链接）；
  - 快速接入第三方（Novu、Firebase、Heroku）减少自建成本。
- 但长期看，若用户规模增大或合规要求提高（例如更严格隐私与审计），需要逐步补齐安全与工程化能力。

## 7) 建议的下一步（按优先级）
1. **安全加固**：停用明文“记住密码”，改 token + refresh token 机制；敏感信息转 Keychain/Keystore。
2. **配置治理**：将 API 域名与第三方 key 环境化（dev/staging/prod），禁止硬编码。
3. **日志治理**：移除敏感日志，接入结构化错误上报（Sentry/Datadog）。
4. **模块重构**：拆分通知页面的大型副作用逻辑，降低耦合。
5. **测试补强**：至少补登录流程、通知拉取、推送点击跳转 3 条主链路的自动化测试。
6. **发布流程**：建立 Android/iOS 打包与签名流程文档，减少“只有开发者本人会发版”的单点风险。

## 8) 总结
这个 App 的技术路线是典型“务实型内部系统”：
- 以 React 为核心，借 Capacitor 完成 iOS/Android 双端覆盖；
- 通过通知 + 日历 + 调查 + 链接 + AI 问答实现“内部沟通中台”的核心价值；
- 当前最大短板不在“能不能用”，而在“安全和可持续演进”。

## 9) 依赖冲突治理与 react-spring 替代实施计划（可直接执行）

### 9.1 先修复 lock 文件一致性（第一优先级）
- 目标：让 `npm ci` 回归可重复安装，避免每次依赖安装都要 `--force`。
- 执行步骤：
  1. 在一台可访问 npm registry 且策略允许的机器，执行 `npm install --legacy-peer-deps`；
  2. 仅提交 `package-lock.json`（必要时连同 `package.json`）；
  3. CI 改为 `npm ci` 验证一致性；
  4. 记录 Node/npm 基线版本（建议锁定在团队统一版本，避免本地和 CI 解析差异）。
- 完成标准：`npm ci` 在开发机和 CI 均成功，且不再出现 lock mismatch。

### 9.2 react-spring 在本项目的实际用途（确认替代范围）
- 仅用于两个轻交互场景：
  - 通知页下拉位移与回弹；
  - 消息详情页横向拖拽与返回触发。
- 这类场景并不依赖复杂弹簧生态，可用更轻实现替代。

### 9.3 推荐替代路线（分两阶段）

#### 阶段 A（低风险）：保留手势库，替换动画库
- 维持 `@use-gesture/react`；
- 将 `react-spring` 的 `useSpring/animated.div` 改为：
  - Web 侧 CSS transform + transition，或
  - `requestAnimationFrame` 简单过渡。
- 收益：先去掉 `react-spring` 聚合依赖链，减少 `konva/three/zdog` 相关包牵引。

#### 阶段 B（长期稳态）：统一到 RN Animated/PanResponder
- 将手势与动画都迁移到 `react-native` 官方能力（`Animated` + `PanResponder`）；
- 减少“Web 动画库 + RN 组件”混搭。
- 收益：跨 iOS/Android/Web 语义更统一，维护成本更低。

### 9.4 建议时间表（1人开发可落地）
- Day 1：修 lock + 固定 Node/npm 版本 + 恢复 `npm ci`。
- Day 2：完成通知页下拉替代（阶段 A）。
- Day 3：完成消息详情页拖拽替代（阶段 A）+ 回归测试。
- Day 4~5：若稳定，再评估阶段 B（Animated/PanResponder）是否立即推进。

### 9.5 验收清单（每一步都可量化）
1. 安装稳定性：`npm ci` 连续 3 次成功。
2. 功能稳定性：
   - 下拉刷新可触发，阈值行为一致；
   - 详情页右滑返回可触发；
   - iOS/Android/Web 三端无明显手势退化。
3. 依赖收敛：移除 `react-spring` 后，`npm ls react-konva react-reconciler` 不再因其子包链新增冲突。
4. 发版可控：打包流程（Android/iOS）在无 `--force` 的情况下通过。
