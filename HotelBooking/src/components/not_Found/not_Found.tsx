// 1. 搜尋不到任何數據專用

import { OtherSVG } from "../client_Svg/client_Svg";

export default function Not_Found ({you_Have_No_Bookings} : {you_Have_No_Bookings: string}) {

  return <>
  <div className="flex flex-col justify-center items-center">
    <OtherSVG name="notfound" className="w-10 h-auto"></OtherSVG>
    <p>{you_Have_No_Bookings}</p>
  </div>
  
  </>
}