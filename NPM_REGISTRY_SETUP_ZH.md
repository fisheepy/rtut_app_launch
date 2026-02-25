# npm 可用源与认证方式说明（无 token 版本）

你问的“registry URL + token/账号策略”意思是：

- **registry URL**：npm 包下载地址（比如官方源或公司镜像）。
- **认证方式**：访问该源时是否需要登录凭据（token/账号密码/内网放行）。

如果你现在**没有 token**，可以按下面顺序排查。

## 0) 先确认错误类型（你这次已验证）

你贴出的日志显示：

- `npm ping` 是 `PONG`，说明 registry 可访问；
- 失败点不是 token，而是 `npm ci` 提示 **package.json 与 package-lock.json 不同步**（`EUSAGE`）；
- 还有 `EBADENGINE` 警告，说明你当前是 Node 18，而依赖里有包偏好 Node 20/22；
- `Remove-Item node_modules` 失败（目录非空），说明 Windows 下存在文件占用或权限/属性问题。

结论：你当前首要问题是 **先可靠清理 node_modules，再重建 lock 文件**，其次是 **Node 版本基线**。

---

## 1) 最简单：先尝试公开可访问源（不需要 token）

在项目目录执行：

```bash
npm config set registry https://registry.npmjs.org/
npm config get registry
npm ping
```

如果 `npm ping` 成功，说明源连通没问题，进入“第 3 节修 lock”。

---

## 2) 如果官方源 403：使用镜像（通常不需要 token）

```bash
npm config set registry https://registry.npmmirror.com
npm config get registry
npm ping
```

> 说明：这只是“先跑通安装”的应急方案。团队长期建议统一到固定镜像。

---

## 3) 你现在这个仓库的关键修复：先更新 lock，再用 ci

`npm ci` 的前提是 lock 必须与 `package.json` 完全一致。

### 3.1 建议 Node 版本

优先使用 Node 22（至少 Node 20），降低 `EBADENGINE` 风险。

```bash
node -v
npm -v
```

### 3.2 Windows 下先“强制清理” node_modules（解决 Remove-Item 失败）

按顺序执行，遇到失败再执行下一条：

```powershell
# 1) 结束可能占用文件的进程
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process code -ErrorAction SilentlyContinue | Stop-Process -Force

# 2) 去掉只读/系统属性
attrib -r -s -h .\node_modules\* /s /d 2>$null

# 3) 使用 cmd 的 rmdir 强删
cmd /c "rmdir /s /q node_modules"

# 4) 如果还删不掉，重启一次终端再删；仍失败就重启系统后先删目录
```

### 3.3 重新生成 lock（本地一次性）

```powershell
if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json }
npm install --legacy-peer-deps
```

### 3.4 验证 clean install

```powershell
cmd /c "rmdir /s /q node_modules" 2>$null
npm ci
```

如果这一步成功，再执行测试：

```powershell
$env:CI="true"
npm test -- --watch=false
```

---

## 4) 如果你在公司网络里：让运维提供“免 token 白名单源”

有些公司内网会提供只读源（按 IP 或网络段放行），不需要个人 token。
你只需要拿到一个 URL，比如：

```ini
registry=https://npm.company.internal/
always-auth=false
```

然后执行：

```bash
npm config set registry https://npm.company.internal/
npm ping --registry=https://npm.company.internal/
```

---

## 5) 仅当公司源要求认证时，才需要 token 或账号

如果 `npm ping` / `npm ci` 返回 `401/403` 且明确提示需要认证，才需要以下任一方式：

- 个人 token（最常见）
- 统一服务账号（账号密码）
- CI 专用只读 token（推荐用于流水线）

你现在没有 token 的情况下，优先让管理员提供：

1. 可匿名只读的公司 registry；或
2. 一个团队共享的只读 CI token（你本地可不配，CI 去配）。

---

## 6) 给你一套“复制即用”的最小命令（Windows PowerShell）

```powershell
npm config set registry https://registry.npmjs.org/
node -v
npm -v
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process code -ErrorAction SilentlyContinue | Stop-Process -Force
attrib -r -s -h .\node_modules\* /s /d 2>$null
cmd /c "rmdir /s /q node_modules"
if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json }
npm install --legacy-peer-deps
cmd /c "rmdir /s /q node_modules" 2>$null
npm ci
$env:CI="true"
npm test -- --watch=false
```

如果失败，把 **完整报错首段 + `node -v` + `npm -v`** 发我，我可以继续给你精确下一步。
