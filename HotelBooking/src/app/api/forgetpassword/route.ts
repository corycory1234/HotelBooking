import {NextRequest, NextResponse}  from 'next/server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email("Invalid Email")
});

// 1, 忘記密碼 API
export async function POST(request: NextRequest) {
  try {
    // 2. 取得前端 <form> 電子郵件之 <input>
    const {email} = await request.json()

    // 3. Zod 驗證
    const validateFields = schema.safeParse({email});

    // 3.1 Zod 校驗之錯誤訊息
    if(!validateFields.success) {
      const { fieldErrors} = validateFields.error.flatten();
      return NextResponse.json(
        {
          success: false,
          emailError: fieldErrors.email?.[0] || ""
        },
        { status: 400 }
      )
    };

    // 4. API接口: /auth/forgetpassword
    const forget_Password_Url = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/forgot-password";
    const response = await fetch(forget_Password_Url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email})
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
    return NextResponse.json({
      success: true,
      message: "The password has been sent to your email"
    });
  }

  // 7. 其他API錯誤處理
  catch (error) {
    console.error("API /forget-password Error", error);
    return NextResponse.json(
      {success: false,message: "Forget Password fails"},
      {status: 500}
    )
  }
}