'use server';

import { z } from "zod";
import { redirect } from "next/navigation";     

// 1. zod 校驗規則
const schema = z.object({
  name: z.string().min(4, {message: "Must be 4 or more characters"})
          .max(20, {message: "Must be 20 or fewer characters"})
          .regex(/^[a-z]+$/, {message: "Must be Alphabet"}), // 只能輸入字母
  cardnumber: z.string().min(19, {message: "Must be 16 characters"})
          .max(19, {message: "Must be 16 characters"}),
  expireddate: z.string().min(5, {message: "Must be 5 characters"})
          .max(5, {message: "Must be 5 characters"}),
  cvv: z.string().min(3, {message: "Must be 3 characters"})
          .max(3, {message: "Must be 3 characters"})
          .regex(/^\d+$/, { message: "CVV must contain only digits" })
})

// 2. 送出信用卡資訊, 串接金流
export async function Pay(prevState: any, formData: FormData) {
  const name = formData.get("name");
  const cardnumber = formData.get("cardnumber");
  const expireddate = formData.get("expireddate");
  const cvv = formData.get("cvv");
  console.log(name, cardnumber, expireddate, cvv);
  
  const validateFields = schema.safeParse({
    name, cardnumber, expireddate, cvv
  });

  // 2.1 若驗證失敗, 篩選出個別錯誤訊息
  if(!validateFields.success) {
    const {fieldErrors} = validateFields.error.flatten();
    return {
      ...prevState,
      nameError: fieldErrors.name?.[0] || "",
      cardnumberError: fieldErrors.cardnumber?.[0] || "",
      expireddateError: fieldErrors.expireddate?.[0] || "",
      cvvError: fieldErrors.cvv?.[0] || "",
    }
  } else {
    // 2.2 暫時校驗成功, 返回首頁
    redirect("/")
  }
} 