'use server';

import { z } from "zod";

// 1. zod 校驗規則
const schema = z.object({
  name: z.string().min(1, {message: "Must be 1 or more characters"})
                  .max(20, {message: "Must be 20 or fewer characters"}),
  surname: z.string().min(1, {message: "Must be 1 or more characters"})
                    .max(20, {message: "Must be 20 or fewer characters "}),
  email: z.string().email("Invalid Email"),
  phone: z.string().min(10, {message: "Must be 10 or more"})
                  .max(20, {message: "Must be 20 or fewer"})
                  .regex(/^\d+$/, { message: "Phone number must contain only digits" }) // 只能輸入數字
});

// 2. 送出旅客資訊
export async function Submit_Traveler_Info(prevState: any, formData: FormData) {
  const name = formData.get("name");
  const surname = formData.get("surname");
  const email = formData.get("email");
  const phone = formData.get("phone") as string;

  const validateFields = schema.safeParse({
    name, surname, email, phone
  });

  // 2.2 若驗證失敗, 篩選出個別錯誤訊息
  if(!validateFields.success) {
    const { fieldErrors } = validateFields.error.flatten();
    return {
      ...prevState,
      nameError: fieldErrors.name?.[0] || "",
      surnameError: fieldErrors.surname?.[0] || "",
      emailError: fieldErrors.email?.[0] || "",
      phoneError: fieldErrors.phone?.[0] || "",
    }
  };

  // 2.4 串接 API
  try {
    const traveler_Info_Url = process.env.BACKEND_URL || 'http://localhost:3000';
    console.log(traveler_Info_Url, "環境變數URL");
    
    const response = await fetch(`${traveler_Info_Url}/traveler_Info`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, surname, email, phone})
    });

    const data: any = await response.json();
    console.log(data, "API返回之 Response");
    
    if(!response.ok) {
      return {
        ...prevState,
        message: data.error || "傳遞旅客資料失敗"
      }
    }
    
  } catch (error) {
    console.log(error);
    return {
      ...prevState,
      message: "傳遞旅客資料失敗"
    }
  }
  
}