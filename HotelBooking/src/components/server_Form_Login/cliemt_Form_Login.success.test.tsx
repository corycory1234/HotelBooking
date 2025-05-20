import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Login from './client_Form_Login'
import { vi, expect, test } from 'vitest'

/* ---------- Mock 區 ---------- */

// 1) Next.js router
const push = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => ({ get: () => '/' })
}))

// 2) i18n
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key
}))

// 3) toast —— 把 spy 生在工廠裡
vi.mock('react-hot-toast', () => {
  const success = vi.fn()
  const error   = vi.fn()
  return {
    __esModule: true,               // 讓 ESM default 匯出正常
    default: { success, error }
  }
})

// 4) redux
vi.mock('react-redux', async () => {
  const actual = await vi.importActual<typeof import('react-redux')>('react-redux')
  return { ...actual, useSelector: () => 'DUMMY', useDispatch: () => vi.fn() }
})

// 5) sleep
vi.mock('@/utils/sleep', () => ({ sleep: () => Promise.resolve() }))

/* ---------- 測試 ---------- */
test('登入成功後會呼叫 toast.success 並導向首頁', async () => {
  // 讓 fetch 假裝成功
  global.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: async () => ({ tokens: { access_token: 'abc' } })
  }) as any

  render(<Login />)

  fireEvent.change(screen.getByLabelText('Enter Email'), { target: { value: 'testgotour@gmail.com' } })
  fireEvent.change(screen.getByLabelText(/password/i),    { target: { value: 'Abc123456' } })
  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))

  // 重新拿出剛才工廠裡那支 spy
  const toast = await import('react-hot-toast')      // ESM 動態載入
  const toastSuccess = toast.default.success

  await waitFor(() => {
    expect(toastSuccess).toHaveBeenCalled()   // ✅ 成功訊息
    expect(push).toHaveBeenCalledWith('/')    // ✅ 導向首頁
    expect(global.fetch).toHaveBeenCalledTimes(1) // ✅ 有打 API
  })
})
