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

4. 資料庫遷移
```bash
# 生成遷移檔案
npm run generate

# 執行遷移
npm run migrate
```

5. 啟動開發伺服器
```bash
npm run dev
```

## 可用的指令

- `npm run dev`: 啟動開發伺服器
- `npm run build`: 建立生產版本
- `npm run start`: 執行生產版本
- `npm run generate`: 生成資料庫遷移檔案
- `npm run migrate`: 執行資料庫遷移

## 專案結構

```
src/
├── db/                 # 資料庫相關
│   ├── schema/        # 資料表定義
│   ├── migrations/    # 遷移檔案
│   └── index.ts       # 資料庫連線設定
├── routes/            # API 路由
├── controllers/       # 控制器
├── services/         # 業務邏輯
└── index.ts          # 主程式入口
```

## API 文件

[待補充]

## 環境變數說明

- `PORT`: 伺服器執行的埠號
- `SUPABASE_URL`: Supabase 專案 URL
- `SUPABASE_ANON_KEY`: Supabase 匿名金鑰
- `DATABASE_URL`: 資料庫連線字串

## 開發指南

1. 新增資料表
   - 在 `src/db/schema` 資料夾中建立新的 schema 檔案
   - 執行 `npm run generate` 生成遷移檔案
   - 執行 `npm run migrate` 更新資料庫

2. 新增 API 路由
   - 在 `src/routes` 資料夾中建立新的路由檔案
   - 在 `src/controllers` 建立對應的控制器
   - 在主程式中註冊路由

## 貢獻指南

[待補充]

## 授權

[授權方式]
```
