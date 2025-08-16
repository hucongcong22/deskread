# deskread 项目结构规范文档

## 1. 项目概述

deskread 是一个基于 Electron 的桌面应用程序，结合 Vue 和 TypeScript 开发的小说阅读器。项目遵循 Electron 的标准架构，采用主进程、预加载脚本和渲染进程的三层结构。

## 2. 技术栈

- Electron：桌面应用框架
- Vue 3：前端框架
- TypeScript：类型安全的 JavaScript 超集
- Vite：构建工具
- ESLint + Prettier：代码规范和格式化工具

## 3. 项目结构

```
deskread/
├── build/                      # 构建相关资源
├── out/                        # 编译输出目录
├── resources/                  # 应用资源文件
├── src/                        # 源代码目录
│   ├── main/                   # 主进程代码
│   │   └── index.ts            # 主进程入口文件
│   ├── preload/                # 预加载脚本
│   │   ├── index.d.ts          # 预加载脚本类型定义
│   │   └── index.ts            # 预加载脚本入口
│   └── renderer/               # 渲染进程代码
│       ├── index.html          # 渲染进程入口 HTML
│       └── src/                # 渲染进程源码
│           ├── assets/         # 静态资源
│           │   ├── base.css    # 基础样式
│           │   ├── main.css    # 主样式文件
│           │   └── images/     # 图片资源
│           ├── components/     # Vue 组件
│           │   ├── Bookshelf.vue  # 书架组件（核心功能）
│           │   ├── NovelList.vue  # 小说列表组件（旧）
│           │   └── Versions.vue   # 版本信息组件
│           ├── views/          # 页面视图（可扩展）
│           ├── store/          # 状态管理（可扩展）
│           ├── router/         # 路由配置（可扩展）
│           ├── App.vue         # 根组件
│           ├── main.ts         # 渲染进程入口
│           └── env.d.ts        # 环境类型声明
├── .editorconfig               # 编辑器配置
├── .gitignore                  # Git 忽略文件配置
├── .npmrc                      # NPM 配置
├── .prettierignore             # Prettier 忽略文件配置
├── .prettierrc.yaml            # Prettier 配置
├── electron-builder.yml        # Electron 构建配置
├── electron.vite.config.ts     # Vite 配置
├── eslint.config.mjs           # ESLint 配置
├── package.json                # 项目配置和依赖
├── README.md                   # 项目说明文档
├── tsconfig.json               # TypeScript 配置入口
├── tsconfig.node.json          # Node.js 环境 TypeScript 配置
└── tsconfig.web.json           # Web 环境 TypeScript 配置
```

## 4. 各模块详细说明

### 4.1 主进程 (Main Process)

**路径**: `src/main/index.ts`

主进程负责管理应用程序的生命周期，包括：
- 创建和管理浏览器窗口
- 处理原生操作系统交互
- 管理应用的启动和退出
- 处理系统托盘、菜单等原生功能

### 4.2 预加载脚本 (Preload Scripts)

**路径**: `src/preload/`

预加载脚本运行在渲染进程和主进程之间，提供安全的 API 桥接：
- 暴露有限的 Electron API 给渲染进程
- 确保渲染进程无法直接访问 Node.js API
- 提供上下文隔离的安全机制

### 4.3 渲染进程 (Renderer Process)

**路径**: `src/renderer/src/`

渲染进程负责应用的用户界面：
- 使用 Vue 3 构建用户界面
- 实现组件化开发模式
- 管理用户交互和数据展示

#### 4.3.1 组件结构

1. **基础组件** (`components/`)
   - Bookshelf.vue: 核心书架功能组件
   - Versions.vue: 版本信息展示组件

2. **页面视图** (`views/`)
   - 可扩展的页面组件目录

3. **状态管理** (`store/`)
   - 可扩展的状态管理目录

4. **路由** (`router/`)
   - 可扩展的路由配置目录

## 5. 配置文件说明

### 5.1 构建和开发配置

- `electron.vite.config.ts`: Vite 构建配置
- `electron-builder.yml`: Electron 打包配置
- `tsconfig*.json`: TypeScript 编译配置
- `eslint.config.mjs`: 代码质量检查配置
- `.prettierrc.yaml`: 代码格式化配置

### 5.2 项目配置

- `package.json`: 项目依赖和脚本命令
- `.editorconfig`: 编辑器统一配置
- `.gitignore`: Git 版本控制忽略配置

## 6. 开发规范

### 6.1 代码规范

1. 使用 TypeScript 进行类型安全编程
2. 遵循 ESLint 规则进行代码检查
3. 使用 Prettier 统一代码格式
4. 组件化开发，遵循单一职责原则

### 6.2 命名规范

1. 文件名使用小写字母，多个单词用连字符分隔
2. 组件名使用大驼峰命名法 (PascalCase)
3. 变量和函数使用小驼峰命名法 (camelCase)

### 6.3 Git 提交规范

1. 使用清晰明确的提交信息
2. 按功能模块进行提交
3. 遵循 conventional commits 规范

## 7. 开发和构建命令

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 类型检查
npm run typecheck

# 代码格式化
npm run format

# 代码检查
npm run lint

# 构建应用
npm run build

# 构建各平台应用
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

## 8. 扩展建议

1. **状态管理**: 引入 Pinia 或 Vuex 管理复杂状态
2. **路由系统**: 使用 Vue Router 实现多页面应用
3. **数据持久化**: 使用本地数据库（如 SQLite）替代 localStorage
4. **单元测试**: 添加 Jest 或 Vitest 进行单元测试
5. **国际化**: 添加 i18n 支持多语言