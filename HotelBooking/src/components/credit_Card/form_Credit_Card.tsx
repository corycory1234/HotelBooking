'use client';
import { useState } from "react";
import { useFormState } from "react-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Pay } from "@/actions/pay";

// 0. Zod 錯誤訊息初始值
const initialState = "";

export default function Form_Credit_Card () {
 // 1. 透過 useFormState 套用 Server Actino函式 以及 zod錯誤訊息
  const [state, formAction] = useFormState(Pay, initialState)

  // 2. 信用卡卡號
  const [cardNumber, set_CardNumber] = useState("")
  const handle_CardNumber_Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '') // 拿掉非數字之字串
    // 2.1 每4個數字, 插入1個空格
    value = value.match(/.{1,4}/g)?.join(' ') || '';
    set_CardNumber(value);
  };

  // 3. 到期日
  const [expired_Date, set_Expired_Date] = useState("");
  const handle_ExpiredDate_Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    set_Expired_Date(value)
  };

  // 4. CVV欄位
  const [cvv, set_Cvv] = useState("");
  const handle_Cvv_Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '');
    if(value.length >4) {value = value.slice(0,3)}; // 只接受3碼 CVV
    set_Cvv(value)
  };
  
  // 5. 拿取 Redux 預定房型之數據
  const redux_Booked_Room = useSelector((state: RootState) => state.booked_Room);

  // 6. 拿取 Redux 指定飯店 Tax 數據
  const redux_Hotel_Tax = useSelector((state: RootState) => state.hotel_Detail.tax);

  return <div className="bg-primary rounded-t-3xl p-4">
    
    <form action={formAction} className="flex flex-col gap-6">
    {/** 信用卡所有<input> */}
      <div className="bg-white flex flex-col gap-2 rounded-lg p-4">

        {/** 信用卡持有人姓名 */}
        <label htmlFor="name" className="text-sm text-gray">Card Holder Name</label>
        <input type="text" id="name" name="name" className="border-b border-strokeGray py-1" placeholder="Your Name">
        </input>
        <p aria-live="polite" className="text-customRed">{state.nameError}</p>
        {/** 信用卡持有人姓名 */}
        
        {/** 信用卡卡號 */}
        <label htmlFor="cardnumber" className="text-sm text-gray">Card Number</label>
        <input type="text" id="cardnumber" name="cardnumber" value={cardNumber}
        className="border-b border-strokeGray py-1"
        onChange={handle_CardNumber_Change} maxLength={19} placeholder="0000 0000 0000 0000">
        </input>
        <p aria-live="polite" className="text-customRed">{state.cardnumberError}</p>
        {/** 信用卡卡號 */}

        <div className="flex justify-between gap-2">
          {/** 到期日 */}
          <div className="w-1/2 flex flex-col gap-2">
            <label htmlFor="expireddate" className="text-sm text-gray">Expired Date</label>
            <input type="text" id="expireddate" name="expireddate" className="border-b border-strokeGray py-1"
            onChange={handle_ExpiredDate_Change} maxLength={5} placeholder="MM/YY" value={expired_Date}>
            </input>
            <p aria-live="polite" className="text-customRed">{state.expireddateError}</p>
          </div>
          {/** 到期日 */}
          
          {/** CVV */}
          <div className="w-1/2 flex flex-col gap-2">
            <label htmlFor="cvv" className="text-sm text-gray">CVV</label>
            <input type="text" id="cvv" name="cvv" className="border-b border-strokeGray py-1"
            onChange={handle_Cvv_Change} maxLength={3} placeholder="000" value={cvv}>
            </input>
            <p aria-live="polite" className="text-customRed">{state.cvvError}</p>
          </div>
          {/** CVV */}
        </div>
      </div>
    {/** 信用卡所有<input> */}

    {/* 所有金額統計 */}
    <div className="bg-white flex flex-col gap-2 rounded-lg p-4">
      <div className="flex justify-between">
        <p className="text-sm text-gray">Hotel Price</p>
        {/** 房間價格 */}
        <p className="font-bold">$ {redux_Booked_Room.room_Price}</p>
        {/** 房間價格 */}
      </div>
      
      <div className="flex justify-between">
        <p className="text-sm text-gray">Tax</p>
        <p className="font-bold">{"+" + Math.round((redux_Hotel_Tax as number) * (redux_Booked_Room.room_Price ?? 0))}</p>
      </div>

      <div className="flex justify-between">
        <p className="text-sm text-gray">Black Friday Offer</p>
        <p className="font-bold">-$500</p>
      </div>

      <div className="border-b border-dashed border-[#D6E1EF]"></div>

      <div className="flex justify-between">
        <p className="text-sm text-gray">Total Amount</p>
        <p className="font-bold text-primary">{redux_Booked_Room.room_Price as number + (Math.round((redux_Hotel_Tax as number) * (redux_Booked_Room.room_Price ?? 0)) - 500) }</p>
      </div>
    </div>
    {/* 所有金額統計 */}

    <button 
      className="bg-secondary text-white text-center font-semibold py-4 rounded-lg">
      Proceed
    </button>

    </form>
  </div>
}