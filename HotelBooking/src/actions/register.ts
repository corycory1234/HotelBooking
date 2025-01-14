'use server';

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// 1. 密碼最小8, 最長12, 必須有1個字母大寫
const schema = z.object({
  email: z.string().email("Invalid Email"),
  password: z.string()
    .min(8, { message: "Must be 8 or more characters long" })
    .max(12, { message: "Must be 12 or fewer characters long" })
    .refine((value) => /[A-Z]/.test(value), {message: "Must Contain 1 Upper Character"}),
  // 3. Zod 校驗「密碼」與「再次確認密碼」  
  confirm: z.string()
}).refine((data) => data.password === data.confirm, 
{
  message: "Password doesn't match",
  path: ["confirm"] // 這裡表示，如果不符合，會把錯誤提示掛在 confirm 這個欄位上
});

// 4. 定義API返回之類型
interface RegisterResponse {
  message: string,
  data?: any;
  error?: string;
}



// 1. <form> 註冊
export async function Submit_Register(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const name = "tester"; // 1.1 後端額外需要之欄位
  const userType = "hotelier"; // 1.1 後端額外需要之欄位
  const confirm = formData.get("confirm");
  const rawFormData = Object.fromEntries(formData)
  console.log(email, password, confirm);
  console.log(rawFormData, "Form表單資料");
  
  // 2. zod 校驗
  const validateFields = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirm: formData.get("confirm")
  });

  if(!validateFields.success) {
    const { fieldErrors } = validateFields.error.flatten();
    return {
      ...prevState,
      // 這邊 emailError 或 passwordError 都可能是陣列
      emailError: fieldErrors.email?.[0] || "", // 只取第一個錯誤訊息
      passwordError: fieldErrors.password?.[0] || "",
      confirmError: fieldErrors.confirm?.[0] || ""
    }
  }

  // 3. 打API
  try {
    const register_Url = process.env.NEXT_PUBLIC_API_BASE_URL;
    const register_Endpoint = `${register_Url}/auth/register`;
    console.log(register_Endpoint, "註冊API");
    
    const response = await fetch(register_Endpoint, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password, name, userType })
    });

    const data: RegisterResponse = await response.json();
    console.log(data, "註冊返回之response");
    
    if(!response.ok) {
      return {
        ...prevState,
        success: false,
        message: data.error || 'Registration Fails'
      }
    };

    return {
      ...prevState,
      success: true,
      message: data.message || "Registration Succeeds"
    }


  } catch (error) {
     // 4. 若是 NEXT_REDIRECT，代表要做跳轉，不能算真正失敗
    if(error instanceof Error && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")){
      // 4.1 重新丟出讓 Next.js 處理跳轉
      throw error 
    }
    console.log(error);
    return {
      ...prevState,
      success: false,
      message: 'Registration Fails'
    }
  }

  // if(validateFields.success) {
  //   revalidatePath("/");
  //   redirect("/");
  // };


}