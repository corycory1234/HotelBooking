'use client';
import Previous_Page from "@/components/previous_Page/previous_Page"
import { OtherSVG } from "@/components/client_Svg/client_Svg";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import how_Many_Nights from "@/utils/how_Many_Nights";
import Offer_List_Json from "@/fakeData/offer_List.json";
import Link from "next/link";

export default function Booking_Completed () {
  // 1. 當前頁面 - 頂端文字，props傳遞給 <Previous_Page>
  const current_Page_Name = "Booking Completed";

  // 2. Redux - 相關數據
  const redux_Form_Search = useSelector((state: RootState) => state.formSearch);
  const redux_The_Booked_Room = useSelector((state: RootState) => state.booked_Room);
  const redux_Hotel_Detail = useSelector((state: RootState) => state.hotel_Detail);

  // 3. 優惠券資訊
  const the_Offer = Offer_List_Json.find((offer) => offer.offer_Id === redux_Hotel_Detail.offer_Id);

  return <div className="mb-[100px] lg:py-4 lg:mb-0">
    {/********** 手機版 - 回上一頁 **********/}
      {/* <Previous_Page current_Page_Name={current_Page_Name}></Previous_Page> */}
      <div className="lg:hidden flex justify-center items-center text-white bg-primary py-2">
        <p>Booking Completed</p>
      </div>
    {/********** 手機板 - 回上一頁 **********/}

    <div className="flex flex-col gap-2 p-4 rounded justify-center items-center lg:w-1/2 lg:mx-auto lg:shadow-lg">

      <div className="flex flex-col gap-2 items-center">
        <OtherSVG name="tickpayment" className="w-20 h-auto"></OtherSVG>
        <p className="font-semibold text-center">Payment Successful! Thanks for Your Booking</p>
      </div>
      
      <div className="border-b w-full border-softGray"></div>

      <div className="flex flex-col gap-4">
        <div className="flex">
          <div className="w-1/2 flex flex-col">
            <p className="text-gray">Booking Number</p>
            <p>#1234567</p>
          </div>
          <div className="flex flex-col">
            <p className="text-gray">Booking Date</p>
            <p>{new Date().getFullYear() + "-" + (new Date().getMonth() +1) + "-" + new Date().getDate()}</p>
          </div>
        </div>

        <div className="flex">
          <div className="w-1/2 flex flex-col">
            <p className="text-gray">Checkin Date</p>
            <p>{redux_Form_Search.start_Date as string}</p>
          </div>
          <div className="w-1/2 flex flex-col">
            <p className="text-gray">Checkout Date</p>
            <p>{redux_Form_Search.end_Date as string}</p>
          </div>
        </div>

        <div className="border-b border-softGray"></div>

      {/********** 訂單明細 **********/}
        <div className="flex flex-col gap-2">
          <p className="font-semibold">Booking Detail</p>
          <div className="bg-[#f3f3f3] rounded flex flex-col gap-2 p-4 lg:flex-row">
            <img src={redux_The_Booked_Room.roomType_Image_List[0].url} alt={redux_The_Booked_Room.roomType_Image_List[0].description} 
              className="rounded lg:w-1/4"/>
              
            <div className="flex flex-col justify-between gap-2">
              <div>
                <p className="font-semibold">{redux_Hotel_Detail.hotel_Name}</p>
                <p>{redux_The_Booked_Room.bed_Type}</p>
                <div className="flex gap-2">
                  <p>{how_Many_Nights(redux_Form_Search.start_Date as string, redux_Form_Search.end_Date as string)} Nights</p>
                  <p>{redux_Form_Search.room} Rooms</p>
                  <p>{redux_Form_Search.adult} Adults</p>
                  <p>{redux_Form_Search.child >0 ? redux_Form_Search.child + "Childs" : ""}</p>
                </div>
              </div>
              
              <div className="flex gap-2 px-2 bg-[#DCFCE7] rounded w-7/12 lg:w-8/12">
                {redux_The_Booked_Room.smoke === "false" ? <>
                  <OtherSVG name="nosmoking" className="w-4 h-auto"></OtherSVG> <p className="text-[#166534]">No Smoking</p>
                </>
                : <>
                <OtherSVG name="smoking" className="w-4 h-auto"></OtherSVG> <p className="text-[#166534]">Smoking</p>
                </>
                }
              </div>
            </div>
          </div>
        </div>
      {/********** 訂單明細 **********/}


    {/********** 付款資訊 **********/}
      <div className="flex flex-col gap-2">
        <p className="font-semibold">Payment Detail</p>
        <div className="bg-[#f3f3f3] rounded flex flex-col gap-2 p-4">
          <div className="flex justify-between">
            <p>Room Price</p>
            <p>$ {redux_The_Booked_Room.room_Price}</p>
          </div>
          <div className="flex justify-between">
            <p>Tax</p>
            <p>$ {redux_Hotel_Detail.tax as number * (redux_The_Booked_Room.room_Price as number)}</p>
          </div>
          <div className="flex justify-between">
            <p>{the_Offer?.offer_Name} Offer</p>
            <p className="text-primary">{the_Offer?.offer_Price as number * 100} %OFF</p>
          </div>

          <div className="border-b border-softGray"></div>
          
          <div className="flex justify-between">
            <p>Total</p>
            <p>$ { ((redux_The_Booked_Room.room_Price as number + 
              (redux_Hotel_Detail.tax as number * (redux_The_Booked_Room.room_Price as number))) *
              (1 - (the_Offer?.offer_Price as number))).toFixed(2)
              }
            </p>
          </div>
        </div>
      </div>
    {/********** 付款資訊 **********/}

    
    {/********** 電子郵件寄至 **********/}
      <div className="flex flex-col gap-2 justify-center items-center lg:flex-row">
        <OtherSVG name="email" className="w-4 h-auto"></OtherSVG>
        <p className="text-center">Confirmed Booking mailed to 1234@gmail.com</p>
      </div>
    {/********** 電子郵件寄至 **********/}
    
  {/********** 返回首頁、查定訂單 **********/}
    <div className="flex justify-center items-center gap-2">
      <button className="bg-primary text-white rounded p-2">Check Booking</button>
      <Link href="/" className="bg-primary text-white rounded p-2">Back to Home</Link>
    </div>
  {/********** 返回首頁、查定訂單 **********/}

  </div>

  </div>
</div>
}