# IBM SkillsBuild Prototype

这是一个使用 React、TypeScript、Vite 和 Tailwind CSS 构建的纯前端交互原型。页面数据均为本地模拟数据，不需要后端、数据库或环境变量。

## 本地运行

需要安装 Node.js 20.19+ 或 22.12+。

```bash
cd src
npm install
npm run dev
```

开发服务器默认运行在 <http://localhost:5173>。

## 构建与预览

```bash
cd src
npm run build
npm run preview
```

生产文件会生成在 `src/dist`。

## 部署到 Vercel

在 Vercel 中导入此仓库即可。推荐保持仓库根目录为项目根目录：

- Root Directory：`.`（留空即可）
- Install Command：由根目录 `vercel.json` 配置
- Build Command：由根目录 `vercel.json` 配置
- Output Directory：由根目录 `vercel.json` 配置

根目录配置会进入 `src` 安装依赖和构建，并支持 React Router 的单页应用路由。如果 Vercel 项目已经将 Root Directory 设置为 `src`，`src/vercel.json` 也提供了相同配置。

也可以通过命令行部署：

```bash
cd src
npx vercel --prod
```
