'use client';
import { useState } from "react";

export default function Subscribe () {

  // 4. 訂閱電子報 - Modal彈窗
  const [modal_Subscription, set_modal_Subscription] = useState<boolean>(false);
  const [switch_Boolean, set_Switch_Boolean] = useState<boolean>(false);
  const subscribe = (value: any) => {
    set_Switch_Boolean(value)
  };

  return <div className="container mx-auto mt-[70px] flex-1 flex">
  <div className="flex-1 flex flex-col justify-center items-center gap-2 p-4 ">
      <h2 className="text-xl font-semibold">Subscription</h2>
      <div className="w-full flex flex-col items-center gap-2 p-4">

          <form action="" className="flex flex-col gap-2">
            <p className="font-semibold">Subscribe Our Latest News</p>
            <label className="flex flex-col">
              <p className="text-sm font-semibold">Email</p>
              <input type="text" id="email" name="email" className="border rounded p-2" placeholder="yourmail@email.com"/>
            </label>
            <button className="bg-primary rounded text-white p-2">Sbuscribe</button>
          </form>
      </div>
    </div>
  </div>
}