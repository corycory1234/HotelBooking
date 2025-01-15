import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid Email"),
  password: z.string()
  .min(8, {message: "Must be 8 or more characters long"})
  .max(20, {message: "Must be 12 or fewer characters long"})
})

// 1. Login 登入 API
export async function POST(request: NextRequest) {
  try {
    // 2 取得 前端 <form> 帳號、密碼 之 <input>
    const {email, password} = await request.json();

    // 3. Zod 驗證
    const validateFields = schema.safeParse({email, password});

    // 3.1 Zod 校驗之錯誤訊息
    if(!validateFields.success) {
      const { fieldErrors } = validateFields.error.flatten();
      return NextResponse.json(
      {
          success: false,
          // 這邊 emailError 或 passwordError 都可能是陣列
          emailError: fieldErrors.email?.[0] || "", // 只取第一個錯誤訊息
          passwordError: fieldErrors.password?.[0] || ""
        },
        { status: 400 }
      )      
    };

    // 4. API接口: /auth/login
    const login_Url = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/login";
    const response = await fetch(login_Url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email, password})
    });

    // 4.1 拿回Response
    const data = await response.json();

    // 5. 若API返回錯誤
    if(!response.ok) {
      return NextResponse.json(
        {success: false, message: data.message},
        {status: response.status}
      )
    };

    // 6. API返回成功
    return NextResponse.json({success: true, message: "Login OK"})

  } 
  // 7. 其他API錯誤處理
  catch (error) {
    console.error("API /login Error", error );
    return NextResponse.json({success: false, message: "Login Fails"},
      {status: 500}
    )
  }
}