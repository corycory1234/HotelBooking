'use server';

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid Email"),
  password: z.string()
  .min(8, {message: "Must be 8 or more characters long"})
  .max(20, {message: "Must be 12 or fewer characters long"})
})


// 1. <form> 登入
export async function Submit_Login(prevState: any, formData: FormData) {
  const email = formData.get("account");
  const password = formData.get("password");
  // console.log(account, password);

  const validateFields = schema.safeParse({email, password});

  if(!validateFields.success) {
    const { fieldErrors } = validateFields.error.flatten();
    return {
      ...prevState,
      // 這邊 emailError 或 passwordError 都可能是陣列
      emailError: fieldErrors.email?.[0] || "", // 只取第一個錯誤訊息
      passwordError: fieldErrors.password?.[0] || ""
    }
  }

  try {
    const login_Url = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/login";

    const response = await fetch(login_Url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email, password})
    });

    const data = await response.json();
    console.log(data, "成功, 登入返回之response");

    if(!response.ok){
      return {...prevState,success: false,message: data.message}
    };

    return { ...prevState, success: true, message: "登入成功"}
    

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
      message: 'Login Failed'
    }
  }


  // return {
  //   ...prevState,
  //   message: "Success!",
  //   emailError: "",
  //   passwordError: ""
  // }

}