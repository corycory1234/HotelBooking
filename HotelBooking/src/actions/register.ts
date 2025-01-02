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



// 1. <form> 註冊
export async function Submit_Register(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const confirm = formData.get("confirm");
  console.log(email, password, confirm);

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

  if(validateFields.success) {
    revalidatePath("/");
    redirect("/");
  };

  return {
    ...prevState,
    message: "Success!",
    emailError: "",
    passwordError: "",
    confirm: ""
  }

}