# Practice Hub - 练习中心设计文档

## 概览

Practice Hub 是 WebOS 中的一个新应用，用于聚合和管理来自各个平台的跟练视频和文章收藏，帮助用户通过练习追踪和智能推荐找到真正坚持的内容。

## 核心价值主张

1. **跨平台聚合** - B站、YouTube、小红书、抖音的内容统一管理
2. **练习追踪** - 记录练习次数、时间、笔记和进度
3. **智能标签** - 灵活的标签系统组织收藏
4. **快速启动器** - 快速找到"今天该练什么"
5. **个人笔记** - 记录要点、感受、进步情况

## 技术架构

### 技术栈

- **前端框架**: Next.js 14+ (App Router)
- **UI 库**: React 19 + TypeScript
- **状态管理**: Zustand
- **数据存储**: Supabase (云端同步)
- **动画**: Framer Motion
- **样式**: TailwindCSS + 自定义 Neomorphism
- **PWA**: manifest.json + service worker (后续)

### 数据模型

#### Collection Item (收藏项)

```typescript
interface CollectionItem {
  id: string
  user_id: string
  title: string          // 自动抓取或手动输入
  url: string            // 原始链接
  thumbnail: string      // 缩略图 URL
  platform: 'bilibili' | 'youtube' | 'xiaohongshu' | 'douyin' | 'other'
  tags: string[]         // 标签数组
  practice_count: number // 练习次数
  status: 'active' | 'mastered' | 'archived'
  created_at: Date
  last_practiced: Date | null
  notes: string          // 个人总体笔记
}
```

#### Practice Log (练习记录)

```typescript
interface PracticeLog {
  id: string
  collection_id: string
  practiced_at: Date
  note?: string          // 可选的本次笔记
}
```

#### Tag (标签)

```typescript
interface Tag {
  id: string
  user_id: string
  name: string
  color: string          // 用于视觉区分
  type: 'preset' | 'custom'
}
```

### Supabase 表结构

```sql
-- collection_items 表
CREATE TABLE collection_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail TEXT,
  platform TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  practice_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_practiced TIMESTAMP WITH TIME ZONE
);

-- practice_logs 表
CREATE TABLE practice_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID REFERENCES collection_items(id) ON DELETE CASCADE,
  practiced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  note TEXT
);

-- tags 表
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  type TEXT DEFAULT 'custom',
  UNIQUE(user_id, name)
);

-- 索引
CREATE INDEX idx_collection_items_user_id ON collection_items(user_id);
CREATE INDEX idx_collection_items_status ON collection_items(status);
CREATE INDEX idx_practice_logs_collection_id ON practice_logs(collection_id);
CREATE INDEX idx_tags_user_id ON tags(user_id);
```

## UI 设计

### 设计风格：Soft Neomorphism

基于 Widget Design、Neomorphism、Sans-serif、Soft UI 关键词。

#### 颜色系统

```css
/* 背景 */
--bg-primary: linear-gradient(135deg, #e0e5ec 0%, #f5f7fa 100%);

/* 卡片 */
--card-shadow-outer: 8px 8px 16px rgba(163, 177, 198, 0.6);
--card-shadow-inner: -6px -6px 12px rgba(255, 255, 255, 0.8);

/* 主色 */
--primary: #6C93E8;

/* 标签颜色（柔和配色） */
--tag-type: #6C93E8;    // 蓝色 - 类型标签
--tag-duration: #7BC96F; // 绿色 - 时长标签
--tag-difficulty: #F5A962; // 橙色 - 难度标签
--tag-time: #A78BFA;    // 紫色 - 时间标签
--tag-custom: #F093B0;  // 粉色 - 自定义标签
```

#### 卡片样式规范

```css
.neo-card {
  border-radius: 16px;
  padding: 16px;
  box-shadow:
    8px 8px 16px rgba(163, 177, 198, 0.6),
    -6px -6px 12px rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.neo-card:hover {
  transform: translateY(-4px);
  box-shadow:
    12px 12px 24px rgba(163, 177, 198, 0.7),
    -8px -8px 16px rgba(255, 255, 255, 0.9);
}

.neo-button {
  border-radius: 12px;
  box-shadow:
    4px 4px 8px rgba(163, 177, 198, 0.6),
    -4px -4px 8px rgba(255, 255, 255, 0.8);
}

.neo-button:active {
  box-shadow:
    inset 2px 2px 4px rgba(163, 177, 198, 0.6),
    inset -2px -2px 4px rgba(255, 255, 255, 0.8);
}
```

### 主界面布局

```
┌─────────────────────────────────────────────────────┐
│ 顶部工具栏 (Neomorphism 横条)                        │
│ [+ 添加收藏] [搜索框] [视图切换] [排序]              │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│ 标签快速筛选栏 (可横向滚动)                          │
│ [全部] [瑜伽] [健身] [晨练] [10分钟] ...            │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│ 💡 智能推荐区 (可折叠)                               │
│ - 待练习 (7天未练)                                   │
│ - 坚持中 (近期频繁)                                  │
│ - 快速练习 (10分钟内)                                │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│                   卡片网格区域                        │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐          │
│  │ 卡片1 │ │ 卡片2 │ │ 卡片3 │ │ 卡片4 │          │
│  │缩略图 │ │缩略图 │ │缩略图 │ │缩略图 │          │
│  │标题   │ │标题   │ │标题   │ │标题   │          │
│  │[标签] │ │[标签] │ │[标签] │ │[标签] │          │
│  │12次|3天│ │5次|1周│ │新添加 │ │8次|2天│          │
│  │  [+1] │ │  [+1] │ │  [+1] │ │  [+1] │          │
│  └───────┘ └───────┘ └───────┘ └───────┘          │
│  (响应式: 桌面4列, 平板3列, 手机2列)                 │
└─────────────────────────────────────────────────────┘
```

#### 顶部工具栏功能

1. **+ 添加收藏按钮** - 打开添加对话框
2. **搜索框** - 实时搜索标题和笔记
3. **排序选项**:
   - 最近添加
   - 最近练习
   - 练习次数
   - 待练时长 (上次练习距今)

#### 标签快速筛选栏

- 显示常用标签（按使用频率排序）
- 可多选标签（OR 逻辑）
- 选中状态：深色背景高亮
- 右侧"管理标签"按钮

### 卡片组件设计

#### 卡片表面信息

```
┌─────────────────┐
│                 │
│   缩略图 16:9    │
│                 │
├─────────────────┤
│ 标题 (最多2行)   │
├─────────────────┤
│ [瑜伽][晨练][+2] │
├─────────────────┤
│ 📊 12次 | 🕐 3天前│
│            [+1] │
└─────────────────┘
```

#### 卡片交互

- **点击卡片区域** → 打开详情面板
- **点击 +1 按钮** → 快速打卡（按钮内凹动画，数字+1）
- **长按卡片** → 编辑模式（修改标签、状态、删除）
- **悬停** → 轻微上浮 + 阴影加深

### 详情面板设计

右侧滑入面板（桌面端 70% 宽度，移动端全屏）：

```
┌─────────────────────────────────────┐
│ [← 返回]              [编辑] [删除]  │
├─────────────────────────────────────┤
│                                      │
│  缩略图 (大图，16:9)                  │
│                                      │
├─────────────────────────────────────┤
│  📺 标题                             │
│  🔗 原链接 [打开原页面]               │
│                                      │
│  🏷️ 标签: [瑜伽] [晨练] [15分钟]     │
│                                      │
│  📊 练习统计:                        │
│  - 总共练习 12 次                    │
│  - 上次练习: 3 天前                  │
│  - 首次添加: 2025-12-15             │
│  - 平均频率: 每周 2.5 次             │
│                                      │
│  [🎯 快速打卡 +1]  (大按钮)          │
│                                      │
│  📝 我的笔记:                        │
│  ┌────────────────────────┐        │
│  │ (可编辑文本框)          │        │
│  │                         │        │
│  └────────────────────────┘        │
│                                      │
│  📅 练习历史:                        │
│  • 2026-01-20  "今天做得很顺！"     │
│  • 2026-01-17  (无笔记)             │
│  • 2026-01-15  "第一次尝试，好难"   │
│                                      │
└─────────────────────────────────────┘
```

## 核心功能

### 1. 添加收藏流程

#### 添加对话框

点击 "+" 按钮，弹出居中对话框：

```
┌─────────────────────────────────────┐
│  添加新收藏                     [×]  │
├─────────────────────────────────────┤
│  🔗 粘贴链接:                        │
│  ┌────────────────────────────────┐ │
│  │ https://...                    │ │
│  └────────────────────────────────┘ │
│  [自动解析]                          │
│                                      │
│  ─── 解析成功后 ───                  │
│                                      │
│  📺 标题:                            │
│  ┌────────────────────────────────┐ │
│  │ (自动填充，可编辑)              │ │
│  └────────────────────────────────┘ │
│                                      │
│  🖼️ 缩略图预览:                      │
│  [缩略图显示]                        │
│                                      │
│  🏷️ 添加标签:                        │
│  快速选择: [瑜伽] [健身] [舞蹈] ...  │
│  ┌────────────────────────────────┐ │
│  │ 输入自定义标签...               │ │
│  └────────────────────────────────┘ │
│  已选: [晨练] [15分钟]               │
│                                      │
│  📝 初始笔记 (可选):                 │
│  ┌────────────────────────────────┐ │
│  │                                 │ │
│  └────────────────────────────────┘ │
│                                      │
│         [取消]  [添加到收藏]         │
└─────────────────────────────────────┘
```

#### 链接解析逻辑 (客户端方案 - MVP)

```typescript
// 平台识别
const detectPlatform = (url: string): Platform => {
  if (url.includes('bilibili.com')) return 'bilibili'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('xiaohongshu.com')) return 'xiaohongshu'
  if (url.includes('douyin.com')) return 'douyin'
  return 'other'
}

// 客户端方案 (MVP)
// - 自动识别平台
// - 用户手动输入标题
// - 缩略图使用平台默认图标或让用户粘贴
// - 快速简单，无需服务端支持

// 未来升级: 服务端 API 抓取
// - Next.js API route 做代理
// - 抓取 meta 信息 (og:title, og:image)
// - 缓存结果
```

### 2. 标签系统

#### 预设标签

```typescript
const presetTags = {
  type: ['瑜伽', '健身', '舞蹈', '烹饪', '音乐', '语言', '手工', '绘画'],
  duration: ['5分钟', '10分钟', '15分钟', '30分钟', '1小时'],
  difficulty: ['入门', '初级', '中级', '高级'],
  time: ['晨练', '午休', '晚间', '随时']
}

const tagColors = {
  type: '#6C93E8',      // 蓝色
  duration: '#7BC96F',  // 绿色
  difficulty: '#F5A962', // 橙色
  time: '#A78BFA',      // 紫色
  custom: '#F093B0'     // 粉色
}
```

#### 标签管理界面

```
┌─────────────────────────────────────┐
│  标签管理                       [×]  │
├─────────────────────────────────────┤
│  📌 预设标签 (系统提供):             │
│                                      │
│  类型:                               │
│  [瑜伽] [健身] [舞蹈] [烹饪]         │
│  [音乐] [语言] [手工] [绘画]         │
│                                      │
│  时长:                               │
│  [5分钟] [10分钟] [15分钟] [30分钟]  │
│  [1小时]                             │
│                                      │
│  难度:                               │
│  [入门] [初级] [中级] [高级]         │
│                                      │
│  时间:                               │
│  [晨练] [午休] [晚间] [随时]         │
│                                      │
│  🎨 我的标签:                        │
│  + 创建新标签                        │
│                                      │
│  [放松] (12个) [编辑] [删除]        │
│  [挑战] (5个) [编辑] [删除]         │
│  [快速] (8个) [编辑] [删除]         │
│                                      │
│           [完成]                     │
└─────────────────────────────────────┘
```

#### 筛选逻辑

- 单个标签：显示包含该标签的所有收藏
- 多个标签：OR 逻辑（包含任一标签即显示）
- 搜索框：在筛选结果中进一步搜索
- 排序保持生效

### 3. 练习追踪

#### 快速打卡流程

1. 点击卡片上的 "+1" 按钮
2. 按钮内凹动画（Neomorphism 按压效果）
3. 练习次数 +1，更新"上次练习"时间
4. 可选：弹出简单 toast "已记录练习"

#### 详细打卡（从详情面板）

1. 点击详情面板的 "快速打卡 +1" 按钮
2. 自动记录时间戳
3. 可选：在练习历史中添加本次笔记
4. 更新统计数据

#### 练习历史显示

```typescript
interface PracticeLogDisplay {
  date: string          // 2026-01-20
  note?: string         // 可选笔记
  daysAgo: string      // "3天前"
}

// 按时间倒序显示
// 最多显示最近 20 条
```

### 4. 智能推荐系统

#### 推荐区域（顶部可折叠卡片）

```
┌─────────────────────────────────────────────────────┐
│ 💡 今天练什么?                              [折叠] │
├─────────────────────────────────────────────────────┤
│ 🎯 待练习 (7天未练):                                │
│ [卡片] [卡片] [卡片] → [查看全部]                   │
│                                                       │
│ 🔥 坚持中 (近期频繁):                               │
│ [卡片] [卡片] → [查看全部]                          │
│                                                       │
│ ⚡ 快速练习 (10分钟内):                             │
│ [卡片] [卡片] [卡片]                                │
└─────────────────────────────────────────────────────┘
```

#### 智能分类逻辑

```typescript
// 1. 待练习 (需要关注)
const needPractice = items.filter(item => {
  const daysSinceLastPractice = getDaysDiff(item.last_practiced, now)
  return daysSinceLastPractice > 7
}).sort((a, b) => a.last_practiced - b.last_practiced) // 最久未练的排前面

// 2. 坚持中 (正在进步)
const activelyPracticing = items.filter(item => {
  const recentLogs = getLogsInDays(item.id, 30)
  return recentLogs.length >= 3
}).sort((a, b) => b.practice_count - a.practice_count)

// 3. 快速练习 (时间碎片)
const quickPractice = items.filter(item => {
  return item.tags.some(tag => ['5分钟', '10分钟'].includes(tag))
}).random(3) // 随机推荐3个

// 4. 可能放弃 (提醒)
const maybeAbandoned = items.filter(item => {
  const daysSinceAdded = getDaysDiff(item.created_at, now)
  return daysSinceAdded > 30 && item.practice_count <= 1
})
// 定期提示: "这些收藏好久没练了，要标记为放弃吗？"
```

### 5. 统计面板

```
┌─────────────────────────────────────┐
│ 📊 我的练习统计                      │
├─────────────────────────────────────┤
│                                      │
│ 本周练习: 15 次                      │
│ 本月练习: 42 次                      │
│ 连续天数: 5 天                       │
│                                      │
│ 📈 本周趋势:                         │
│ 周一 ▓▓▓ 3次                        │
│ 周二 ▓▓ 2次                         │
│ 周三 ▓▓▓▓ 4次                       │
│ 周四 ▓▓▓ 3次                        │
│ 周五 ▓ 1次                          │
│ 周六 ▓▓ 2次                         │
│ 周日 —                              │
│                                      │
│ 🏆 成就徽章:                         │
│ ✓ 连续7天练习                       │
│ ○ 单月30次练习 (42/30)              │
│ ✓ 收藏达到50个                      │
│                                      │
│ 🎯 收藏状态:                         │
│ - 活跃收藏: 23 个                    │
│ - 已掌握: 8 个                       │
│ - 已归档: 5 个                       │
│                                      │
└─────────────────────────────────────┘
```

## 响应式设计

### 桌面端 (>1024px)

- 4 列卡片网格
- 详情面板右侧滑出 (70% 宽度)
- 完整工具栏和标签栏
- 悬停效果丰富

### 平板端 (768px - 1024px)

- 3 列卡片网格
- 详情面板全屏覆盖
- 工具栏保持，标签栏可横向滚动

### 手机端 (<768px)

- 2 列卡片网格
- 所有对话框/面板全屏显示
- 底部固定 FAB (悬浮按钮) 用于快速添加
- 顶部简化为: 搜索图标 + 筛选图标 + 菜单
- 标签栏横向滚动

## PWA 特性 (后续实现)

### Manifest 配置

```json
{
  "name": "Practice Hub - 练习中心",
  "short_name": "Practice Hub",
  "description": "跨平台跟练视频聚合管理",
  "start_url": "/practice-hub",
  "display": "standalone",
  "theme_color": "#6C93E8",
  "background_color": "#e0e5ec",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "shortcuts": [
    {
      "name": "快速打卡",
      "url": "/practice-hub?quick-log=true",
      "icon": "/icons/shortcut-log.png"
    },
    {
      "name": "添加收藏",
      "url": "/practice-hub?add=true",
      "icon": "/icons/shortcut-add.png"
    }
  ]
}
```

### Service Worker 功能

```typescript
// 缓存策略
const CACHE_NAME = 'practice-hub-v1'

// 应用 Shell (离线可用)
const APP_SHELL = [
  '/practice-hub',
  '/practice-hub/styles.css',
  '/practice-hub/main.js',
  // ... 其他核心资源
]

// 缩略图缓存 (网络优先，失败用缓存)
// 打卡数据 (后台同步)
```

### 离线支持

1. **可离线浏览**
   - 缓存已加载的收藏列表
   - 缓存缩略图
   - 显示离线指示器

2. **离线打卡**
   - 打卡记录暂存 IndexedDB
   - 联网后自动同步到 Supabase
   - 显示"待同步"状态

3. **冲突处理**
   - 使用时间戳和设备 ID
   - 后端合并来自不同设备的记录

## 集成到 WebOS

### 应用入口

```typescript
// src/config/apps.ts
{
  id: 'practice-hub',
  name: 'Practice Hub',
  icon: '🎯', // 或自定义图标
  component: lazy(() => import('@/components/apps/PracticeHub')),
  defaultSize: { width: 1200, height: 800 },
  minSize: { width: 800, height: 600 }
}
```

### 文件结构

```
src/
├── components/
│   └── apps/
│       └── practice-hub/
│           ├── PracticeHub.tsx           # 主容器
│           ├── CollectionGrid.tsx        # 卡片网格
│           ├── CollectionCard.tsx        # 单个卡片
│           ├── DetailPanel.tsx           # 详情面板
│           ├── AddCollectionDialog.tsx   # 添加对话框
│           ├── TagManager.tsx            # 标签管理
│           ├── SmartRecommendations.tsx  # 智能推荐
│           ├── StatsPanel.tsx            # 统计面板
│           └── components/
│               ├── Toolbar.tsx           # 工具栏
│               ├── TagFilter.tsx         # 标签筛选
│               └── SearchBar.tsx         # 搜索框
├── lib/
│   └── practice-hub/
│       ├── supabase.ts                   # Supabase 客户端
│       ├── types.ts                      # TypeScript 类型
│       └── utils.ts                      # 工具函数
└── stores/
    └── practice-hub.ts                   # Zustand store
```

### Zustand Store 设计

```typescript
interface PracticeHubStore {
  // 数据
  collections: CollectionItem[]
  tags: Tag[]
  selectedTags: string[]
  searchQuery: string
  sortBy: 'recent' | 'practiced' | 'count' | 'waiting'

  // 视图状态
  detailPanelOpen: boolean
  selectedCollection: CollectionItem | null
  addDialogOpen: boolean

  // 操作
  fetchCollections: () => Promise<void>
  addCollection: (data: Partial<CollectionItem>) => Promise<void>
  updateCollection: (id: string, data: Partial<CollectionItem>) => Promise<void>
  deleteCollection: (id: string) => Promise<void>
  logPractice: (collectionId: string, note?: string) => Promise<void>

  // 标签操作
  fetchTags: () => Promise<void>
  addTag: (name: string, color: string) => Promise<void>
  deleteTag: (id: string) => Promise<void>
  toggleTagFilter: (tagName: string) => void

  // UI 操作
  setSearchQuery: (query: string) => void
  setSortBy: (sort: string) => void
  openDetailPanel: (collection: CollectionItem) => void
  closeDetailPanel: () => void
}
```

## 实现计划建议

### Phase 1: MVP 核心功能 (Week 1-2)

1. 基础 UI 框架和 Neomorphism 样式系统
2. Supabase 数据库表和认证集成
3. 添加收藏功能（客户端方案）
4. 卡片网格视图和基础交互
5. 快速打卡 +1 功能
6. 预设标签系统

### Phase 2: 增强功能 (Week 3)

1. 详情面板和练习历史
2. 标签管理和自定义标签
3. 搜索和筛选功能
4. 排序选项
5. 统计数据显示

### Phase 3: 智能推荐 (Week 4)

1. 智能分类算法
2. 推荐区域 UI
3. 统计面板和趋势图
4. 成就系统

### Phase 4: PWA 和移动优化 (Week 5+)

1. 响应式布局优化
2. PWA manifest 和 service worker
3. 离线支持
4. 后台同步

## 成功指标

1. **使用频率** - 用户每周打开应用次数
2. **打卡率** - 收藏的平均练习次数
3. **活跃收藏率** - active 状态的收藏占比
4. **标签使用** - 平均每个收藏的标签数
5. **坚持率** - 连续打卡天数

## 未来扩展可能性

1. **社交功能**
   - 分享收藏列表
   - 查看朋友的练习动态
   - 组队挑战

2. **高级统计**
   - 练习时长估算
   - 卡路里消耗估算（运动类）
   - 技能树可视化

3. **AI 推荐**
   - 基于练习历史的个性化推荐
   - 难度递进建议
   - 练习计划生成

4. **浏览器扩展**
   - 一键收藏到 Practice Hub
   - 自动同步浏览器书签

5. **更好的链接解析**
   - 服务端 API 自动抓取标题和缩略图
   - 支持更多平台
   - 视频时长自动识别

---

**文档版本**: v1.0
**创建日期**: 2026-01-23
**设计者**: Henry & Claude
