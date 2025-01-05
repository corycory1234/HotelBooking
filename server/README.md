我幫你更新 README.md，主要根據當前專案結構和使用的技術進行調整：

```markdown
# Hotel Booking API

這是一個使用 Node.js、Express、TypeScript、Drizzle ORM 和 Supabase 建立的飯店訂房系統 API。

## 技術堆疊

- Node.js
- Express
- TypeScript
- Drizzle ORM
- Supabase

## 專案設置

### 先決條件

- Node.js >= 16
- npm >= 8
- Supabase 帳號和專案

### 安裝步驟

1. 複製專案
```bash
git clone [repository-url]
cd hotel-booking-api
```

2. 安裝依賴
```bash
npm install
```

3. 環境設置
```bash
# 複製環境變數範例檔案
cp .env.example .env

# 編輯 .env 檔案，填入你的 Supabase 設定
```

## 環境變數說明

```env
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_supabase_connection_string
```

## 專案結構

```
src/
├── db/
│   ├── schema/
│   │   ├── users.ts       # 用戶相關表格
│   │   ├── hotels.ts      # 飯店相關表格
│   │   ├── rooms.ts       # 房型相關表格
│   │   ├── bookings.ts    # 訂單相關表格
│   │   ├── reviews.ts     # 評價相關表格
│   │   ├── favorites.ts   # 收藏相關表格
│   │   └── index.ts       # Schema 匯出
│   └── index.ts           # 資料庫連線設定
├── routes/
│   └── v1/
│       ├── auth.ts        # 認證相關路由
│       ├── hotels.ts      # 飯店相關路由
│       ├── bookings.ts    # 訂單相關路由
│       ├── reviews.ts     # 評價相關路由
│       └── index.ts       # 路由整合
├── controllers/           # API 控制器
├── utils/                 # 工具函數
├── middlewares/          # 中間件
└── index.ts              # 主程式入口
```

## API 路由

### 認證相關
- POST `/api/v1/auth/register` - 用戶註冊
- POST `/api/v1/auth/login` - 用戶登入
- POST `/api/v1/auth/google` - Google 登入

### 飯店相關
- GET `/api/v1/hotels` - 獲取飯店列表
- GET `/api/v1/hotels/:id` - 獲取飯店詳情
- GET `/api/v1/hotels/:id/rooms` - 獲取飯店房型
- POST `/api/v1/hotels` - 新增飯店（需要認證）

### 訂單相關
- POST `/api/v1/bookings` - 建立訂單
- GET `/api/v1/bookings` - 獲取訂單列表
- GET `/api/v1/bookings/:id` - 獲取訂單詳情
- DELETE `/api/v1/bookings/:id` - 取消訂單

### 評價相關
- POST `/api/v1/reviews/hotels/:hotelId` - 新增評價
- GET `/api/v1/reviews/hotels/:hotelId` - 獲取評價列表

## 開發指南

1. 新增資料表
   - 在 `src/db/schema` 資料夾中建立新的 schema 檔案
   - 在 `src/db/schema/index.ts` 匯出新增的 schema
   - 確保相關的表格關聯正確設置

2. 新增 API 路由
   - 在 `src/routes/v1` 資料夾中建立新的路由檔案
   - 在路由檔案中實作對應的邏輯
   - 在 `src/routes/v1/index.ts` 中註冊新路由

3. 錯誤處理
   - 所有的 API 回應都應該遵循統一的格式
   - 成功回應：
     ```json
     {
       "status": "success",
       "data": {...}
     }
     ```
   - 錯誤回應：
     ```json
     {
       "status": "error",
       "message": "錯誤訊息"
     }
     ```

## 待開發功能

- [ ] 會員系統完善
- [ ] 訂單管理系統
- [ ] 評價系統
- [ ] 房型管理
- [ ] 訂單取消與退款流程
- [ ] 後台管理系統

## License

MIT
```
