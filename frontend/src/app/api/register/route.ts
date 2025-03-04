import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// 1. 密碼最小8, 最長12, 必須有1個字母大寫
const schema = z.object({
    email: z.string().email("Invalid Email"),
    password: z.string()
      .min(8, { message: "Must be 8 or more characters long" })
      .max(20, { message: "Must be 12 or fewer characters long" })
      .refine((value) => /[A-Z]/.test(value), {
        message: "Must Contain 1 Upper Character",
      }),
    // 3. Zod 校驗「密碼」與「再次確認密碼」  
    confirm: z.string(),
  }).refine((data) => data.password === data.confirm,
    {
      message: "Password doesn't match",
      path: ["confirm"], // 這裡表示，如果不符合，會把錯誤提示掛在 confirm 這個欄位上
    }
  );

// 2. 定義後端回傳型別 (純參考，實際可自行擴充)
interface RegisterResponse {
  message: string;
  data?: any;
  error?: string;
}

// 3. 處理 POST 請求
export async function POST(request: NextRequest) {
  try {
    // 3.1 取得前端傳來的 JSON
    const { email, password, confirm } = await request.json();

    // 3.2 Zod 驗證
    const validateFields = schema.safeParse({ email, password, confirm });
    if (!validateFields.success) {
      const { fieldErrors } = validateFields.error.flatten();

      // 回傳前端對應的欄位錯誤
      return NextResponse.json(
        {
          success: false,
          emailError: fieldErrors.email?.[0] || "",
          passwordError: fieldErrors.password?.[0] || "",
          confirmError: fieldErrors.confirm?.[0] || "",
        },
        { status: 400 }
      );
    }

    // 3.3 API 請求：打你後端的 /auth/register Endpoint
    const register_Url = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/register";

    // 3.4 後端還需要 "name", "userType" 之類的欄位
    const name = "tester";
    const userType = "hotelier";

    const response = await fetch(register_Url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, userType }),
    });

    // 3.5 拿回Response
    const data: RegisterResponse = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message},
        { status: response.status }
      );
    }

    // 3.4 成功：回傳成功訊息
    return NextResponse.json({
      success: true,
      message: "Registration OK",
      // data: data.data // 如果後端有回傳更多資料可帶回
    });
    
  } catch (error: any) {
    // 3.5 其他非預期錯誤處理
    console.error("API /register Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Registration Fails",
      },
      { status: 500 }
    );
  }
}
