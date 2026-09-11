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

在 Vercel 中导入此仓库，然后设置：

- Root Directory：`src`
- Framework Preset：`Vite`
- Build Command：`npm run build`
- Output Directory：`dist`

项目已经包含 `vercel.json`，可以支持 React Router 的单页应用路由。

也可以通过命令行部署：

```bash
cd src
npx vercel --prod
```
