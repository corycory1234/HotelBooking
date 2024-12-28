'use server';

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
// 2. Zod 校驗 <form>
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Email格式不正確"),
  password: z.string()
  .min(8, {message: "Must be 8 or more characters long"})
  .max(12, {message: "Must be 12 or fewer characters long"})
})


// 1. <form> 登入
export async function Submit_Login(prevState: any, formData: FormData) {
  // console.log(account, password);

  const validateFields = schema.safeParse({
    email: formData.get("account"),
    password: formData.get("password")
  });

  if(!validateFields.success) {
    const { fieldErrors } = validateFields.error.flatten();
    return {
      ...prevState,
      // 這邊 emailError 或 passwordError 都可能是陣列
      emailError: fieldErrors.email?.[0] || "", // 只取第一個錯誤訊息
      passwordError: fieldErrors.password?.[0] || ""
    }
  }

  if(validateFields.success) {
    revalidatePath("/");
    redirect("/");
  };

  return {
    ...prevState,
    message: "Success!",
    emailError: "",
    passwordError: ""
  }

}