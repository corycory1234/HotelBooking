'use client';
import { kMaxLength } from "buffer";
import { useState } from "react"

export default function Form_Credit_Card () {

  // 1. 信用卡卡號
  const [cardNumber, set_CardNumber] = useState("")
  const handle_CardNumber_Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '') // 拿掉非數字之字串
    // 每4個數字, 插入1個空格
    value = value.match(/.{1,4}/g)?.join(' ') || '';
    set_CardNumber(value);
  };

  // 2. 到期日
  const [expired_Date, set_Expired_Date] = useState("");
  const handle_ExpiredDate_Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    set_Expired_Date(value)
  };

  // 3. CVV欄位
  const [cvv, set_Cvv] = useState("");
  const handle_Cvv_Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '');
    if(value.length >4) {value = value.slice(0,3)}; // 只接受3碼 CVV
    set_Cvv(value)
  }

  return <div className="bg-primary rounded-t-3xl p-4">
    
    <form action="" className="flex flex-col gap-6">
    {/** 信用卡所有<input> */}
      <div className="bg-white flex flex-col gap-2 rounded-lg p-4">
        <label htmlFor="name" className="text-sm text-gray">Card Holder Name</label>
        <input type="text" id="name" name="name" className="border-b border-strokeGray py-1" placeholder="Your Name"></input>
        
        {/** 信用卡卡號 */}
        <label htmlFor="cardnumber" className="text-sm text-gray">Card Number</label>
        <input type="text" id="cardnumber" name="cardnumber" value={cardNumber}
        className="border-b border-strokeGray py-1"
        onChange={handle_CardNumber_Change} maxLength={19} placeholder="0000 0000 0000 0000"></input>
        {/** 信用卡卡號 */}

        <div className="flex justify-between gap-2">
          {/** 到期日 */}
          <div className="w-1/2 flex flex-col gap-2">
            <label htmlFor="expireddate" className="text-sm text-gray">Expired Date</label>
            <input type="text" id="expireddate" name="expireddate" className="border-b border-strokeGray py-1"
            onChange={handle_ExpiredDate_Change} maxLength={5} placeholder="MM/YY" value={expired_Date}></input>
          </div>
          {/** 到期日 */}
          
          {/** CVV */}
          <div className="w-1/2 flex flex-col gap-2">
            <label htmlFor="cvv" className="text-sm text-gray">CVV</label>
            <input type="text" id="cvv" name="cvv" className="border-b border-strokeGray py-1"
            onChange={handle_Cvv_Change} maxLength={3} placeholder="000"></input>
          </div>
          {/** CVV */}
        </div>
      </div>
    {/** 信用卡所有<input> */}

    {/* 所有金額統計 */}
    <div className="bg-white flex flex-col gap-2 rounded-lg p-4">
      <div className="flex justify-between">
        <p className="text-sm text-gray">Hotel Price</p>
        <p className="font-bold">$1200</p>
      </div>
      
      <div className="flex justify-between">
        <p className="text-sm text-gray">Tax</p>
        <p className="font-bold">+$200</p>
      </div>

      <div className="flex justify-between">
        <p className="text-sm text-gray">Black Friday Offer</p>
        <p className="font-bold">-$500</p>
      </div>

      <div className="border-b border-dashed border-[#D6E1EF]"></div>

      <div className="flex justify-between">
        <p className="text-sm text-gray">Total Amount</p>
        <p className="font-bold text-primary">$900</p>
      </div>
    </div>
    {/* 所有金額統計 */}

    <button type="button" 
      className="bg-secondary text-white text-center font-semibold py-4 rounded-lg">
      Proceed
    </button>

    </form>
  </div>
}