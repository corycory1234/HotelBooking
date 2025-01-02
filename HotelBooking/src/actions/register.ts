'use server';

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
// 2. Zod 校驗 <form>
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid Email"),
  password: z.string()
    .min(8, { message: "Must be 8 or more characters long" })
    .max(12, { message: "Must be 12 or fewer characters long" }),
  // 3. Zod 校驗「密碼」與「再次確認密碼」  
  confirm: z.string()
}).refine(data => {
  return data.password === data.confirm;
}, {
  message: "Passwords don't match",
  path: ["confirm"]
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
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    console.log(backendUrl, "環境變數網址");
    
    const response = await fetch(`${backendUrl}/register`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    });

    const data: RegisterResponse = await response.json();
    console.log(data, "註冊返回之response");
    
    if(!response.ok) {
      return {
        ...prevState,
        message: data.error || 'Registration 失敗'
      }
    };

    // 3.2 註冊成功，重驗證路徑並重定向
    // revalidatePath("/");
    redirect("/");

  } catch (error) {
    console.log(error);
    return {
      ...prevState,
      message: '註冊失敗, 有錯誤'
    }
  }

  // if(validateFields.success) {
  //   revalidatePath("/");
  //   redirect("/");
  // };


}