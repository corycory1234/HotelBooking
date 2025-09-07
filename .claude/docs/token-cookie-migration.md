# Token Cookie Migration Plan

## 專案概述
Go Tour 酒店預訂平台目前使用 Redux Persist 將 access_token 存儲在 localStorage 中，這存在安全風險。計劃遷移到更安全的 Cookie 存儲方案。

## 現況分析

### 🚨 當前存在的安全問題
1. **localStorage 存儲 Token**：JavaScript 可直接存取，容易受到 XSS 攻擊
2. **Redux Persist Token**：敏感資料持久化在客戶端，增加洩露風險
3. **雙重登入機制**：傳統登入 + Google OAuth 使用不同的 Token 管理策略

### 當前實作位置
```
├── src/store/store.ts                    # Redux persist 配置
├── src/store/access_Token/               # Token Redux slice
├── src/components/server_Form_Login/     # 傳統登入
└── src/app/[locale]/auth/callback/       # Google OAuth 回調
```

## 遷移目標

### ✅ Cookie 存儲優勢
1. **httpOnly Cookie**：JavaScript 無法存取，防止 XSS 攻擊
2. **secure + sameSite**：HTTPS only + CSRF 保護
3. **伺服器端控制**：可設定過期時間、自動清除
4. **統一管理**：兩種登入方式使用相同機制

### 統一 Token 結構
```typescript
interface SecureTokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user_id: string;
  login_type: 'traditional' | 'google_oauth';
  created_at: number;
}
```

## 實作計劃

### Phase 1: 基礎建設
- [ ] 建立 Cookie 工具函式 (`src/lib/cookie-utils.ts`)
- [ ] 建立 Token 管理服務 (`src/lib/token-service.ts`)
- [ ] 更新 TypeScript 型別定義

### Phase 2: Redux 調整
- [ ] 從 Redux persist whitelist 移除 `access_Token`
- [ ] 保留 user 基本資訊在 Redux（非敏感資料）
- [ ] 建立 Token 狀態檢查 Hook

### Phase 3: 登入流程更新
- [ ] 更新傳統登入流程使用 Cookie
- [ ] 更新 Google OAuth 回調使用 Cookie
- [ ] 統一登出邏輯清除 Cookie

### Phase 4: 安全強化
- [ ] 加入 Token 過期檢查
- [ ] 實作自動 Token 刷新
- [ ] 加入 CSRF 保護

## 技術實作細節

### Cookie 配置
```typescript
const cookieConfig = {
  name: 'hotel_auth_token',
  httpOnly: true,           // 防止 XSS
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const, // CSRF 保護
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
  path: '/'
}
```

### Redux 調整策略
```diff
// store.ts - 移除敏感 Token 持久化
const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage,
  whitelist: [
    "formSearch", 
    "hotel_Detail", 
    "booked_Room", 
    "hotel_List", 
    "verify_Session",    // 保留 user 基本資訊
    "my_Collection", 
    "hotel_List2", 
    "traveler_Info",
-   "access_Token"       // 移除 Token 持久化
  ],
}
```

## 安全性考量

### 🔒 安全措施
1. **加密存儲**：Cookie 值使用 JWT 或加密存儲
2. **定期輪換**：Token 自動刷新機制
3. **多層驗證**：結合 CSRF token
4. **過期處理**：自動清除過期 Token

### 🛡️ 攻擊防護
- **XSS**：httpOnly Cookie
- **CSRF**：sameSite + CSRF token
- **中間人攻擊**：secure flag (HTTPS)
- **Token 劫持**：短期過期 + 刷新機制

## 測試計劃

### 功能測試
- [ ] 傳統登入 → Cookie 設定正確
- [ ] Google OAuth → Cookie 設定正確
- [ ] 登出 → Cookie 正確清除
- [ ] Token 過期 → 自動刷新

### 安全測試
- [ ] JavaScript 無法讀取 Token Cookie
- [ ] HTTPS 環境下 secure flag 生效
- [ ] CSRF 攻擊防護測試

## 風險評估

### 🟨 中度風險
- **相容性**：舊版瀏覽器 sameSite 支援
- **開發體驗**：無法在開發工具直接查看 Token

### 🟢 低風險
- **功能影響**：用戶體驗基本無變化
- **效能影響**：Cookie 自動帶入，無額外請求

## 實作時程

```
Week 1: Phase 1 + Phase 2 (基礎建設 + Redux 調整)
Week 2: Phase 3 (登入流程更新)
Week 3: Phase 4 + 測試 (安全強化 + 完整測試)
```

## 驗證標準

### ✅ 完成標準
1. 所有 Token 存儲在 httpOnly Cookie
2. Redux 不再持久化敏感 Token 資料
3. 兩種登入方式使用統一 Cookie 機制
4. 通過安全測試（XSS, CSRF 防護）
5. 現有功能正常運作

---

**注意**：此遷移將顯著提升應用程式的安全性，建議在 staging 環境充分測試後再部署到 production。