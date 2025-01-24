'use client';
import Previous_Page from "@/components/previous_Page/previous_Page";
import Booking_List_Json from "@/fakeData/trip_List.json";
import { Booking_Detail_Interface } from "@/types/booking_Detail";
import { useEffect, useState } from "react";
import { OtherSVG } from "@/components/client_Svg/client_Svg";
import how_Many_Nights from "@/utils/how_Many_Nights";
import Modal from "@/components/modal/modal";
import { FiveStarSVG } from "@/components/client_Svg/client_Svg";

export default function My_Review () {
  // 1. 當前頁面
  const current_Page_Name = "My Review";

  // 2. 本地State - 訂單狀態
  const [booking_List_Completed, set_Booking_List_Completed] = useState<Booking_Detail_Interface[]>([]);
  useEffect(() => {
    // 2.1 篩出 訂單狀態 - "completed", 才可以「看留言 或 留留言」
    const filter_Booking_Status_Completed = Booking_List_Json.filter((item) => item.booking_Status === "completed");
    set_Booking_List_Completed(filter_Booking_Status_Completed);
  },[])

  // 3. Modal留言視窗 - 本地State開關
  const [modal_Boolean, set_Modal_Boolean] = useState<boolean>(false);

  // 4. 指定訂單明細 - 本地state
  const [booking_Detail, set_Booking_Detail] = useState<Booking_Detail_Interface>();

  // 5. 打開 「指定訂單 留言視窗」
  const open_Review_Modal = (booking_Id: string) => {
    // 5.1 先訂單ID匹配, 返回「指定訂單」
    const the_Booking_Detail = booking_List_Completed.find((item) => item.booking_Id === booking_Id);
    // console.log(the_Booking_Detail);
    // 5.2 本地「指定訂單明細」 - 更新
    set_Booking_Detail(the_Booking_Detail);
    // 5.3 本地「指定訂單明細 之 留言」 - 更新
    set_Review(the_Booking_Detail?.review || "");
    // 5.4 本地「指定訂單明細 之 5星評價」 - 更新
    set_Hover_Star(the_Booking_Detail?.star_Rating || 0)
    set_Modal_Boolean(true);
  };

  // 6. 滑動 1星~5星
  const [hover_Star, set_Hover_Star] = useState<number>(1);

  // 7. 本地 -「指定訂單明細 之 5星評價」
  const [review, set_Review] = useState<string>("");

  // 8. <textarea> 之 onChange事件 (變更留言文字內容)
  const handle_Change = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const new_Review = event.target.value
    set_Review(new_Review);
    // 8.1 (prev)要寫, 要保留更新前的狀態
    set_Booking_Detail((prev) => {
      if(!prev) { 
        return prev; // 防禦性寫法，避免出現 null
      } else {
        return {...prev, review: new_Review}
      }  
    })
    console.log(booking_Detail, "看看喔");
  };

  // 9. 送出 評價+留言
  const submit_Review = (event:  React.FormEvent, booking_Id: string, index: number) => {
    event.preventDefault();
    set_Booking_List_Completed((prev_List) => {
      return prev_List.map((item) => {
        if(item.booking_Id === booking_Id) {
          return {...item, review: booking_Detail?.review as string, star_Rating: hover_Star}
        }
        return item;
      })
    })
    set_Modal_Boolean(false);
  };

  
  return <div className="">
    <Previous_Page current_Page_Name={current_Page_Name}></Previous_Page>

    
      <div className="flex flex-col p-4 gap-2 pb-20">
      {booking_List_Completed.map((item, index) => {
        return <div className="flex flex-col border border-softGray rounded" key={index}>
        
        {/* 卡片上方 */}
        <div className="flex gap-2 border-b border-softGray" >
            <img src={item.booking_Img} alt="" className="w-1/4 rounded"/>
            <div className="flex flex-col">
              <p>{item.hotel_Name}</p>
              <div className="flex gap-2">
                <OtherSVG name="marker" className="w-4 h-auto"></OtherSVG>
                <p>{item.city + ", " + item.country }</p>
              </div>
              
              <div className="flex gap-2">
                <OtherSVG name="bed" className="w-4 h-auto"></OtherSVG>
                <p>{item.room_Type}</p>
              </div>
            </div>
          </div>
          {/* 卡片上方 */}


          {/* 卡片中間 */}
          <div className="flex p-2 gap-2">
              <div className="flex flex-col">
                <p className="text-gray text-[14px]">Check-In</p>
                <p className="text-[14px] font-semibold">{item.start_Date}</p>
              </div>
              <p className="text-gray text-[14px]">→</p>
              <div className="flex flex-col">
                <p className="text-gray text-[14px]">Check-Out</p>
                <p className="text-[14px] font-semibold">{item.end_Date}</p>
              </div>
              <div className="border-r border-x-softGray"></div>

              <div className="flex flex-col">
                <p className="text-gray text-[14px]">Nights</p>
                <p className="text-[14px] font-semibold">{how_Many_Nights(item.start_Date, item.end_Date)}</p>
              </div>

              <div className="border-r border-x-softGray"></div>

              <div className="flex flex-col">
                <p className="text-gray text-[14px]">Rooms</p>
                <p className="text-[14px] font-semibold">{item.room}</p>
              </div>
          </div>
          {/* 卡片中間 */}


          {/** 卡片下方 */}
          <div className="flex gap-2 p-2">
            <OtherSVG name="star" className="w-8 h-auto"></OtherSVG>
            <p>{item.review}</p>

            {item.review === "" ? <>
              <button className="bg-secondary rounded text-white w-full py-2" onClick={() => open_Review_Modal(item.booking_Id)}>
                Review Your Stay
              </button> 
              
              <Modal isOpen={modal_Boolean} onClose={() => set_Modal_Boolean(false)}>
                <div className="flex flex-col gap-4 px-4 pt-20">
                  <p className="font-semibold">Hotel: {booking_Detail?.hotel_Name}</p>
                  <p>Name: {booking_Detail?.traveler_Name}</p>


                  <div className="flex gap-2" >
                  {[1,2,3,4,5].map((star: number) => {
                    return <FiveStarSVG name={"emptystar"} 
                      className="w-5 h-auto hover:fill-[#ffdd00]" key={star}
                      fill={star <= hover_Star ? '#ffdd00' : 'white'}
                      onMouseEnter={() => set_Hover_Star(star)}
                      >
                    </FiveStarSVG>
                    })}
                  </div>


                  <form onSubmit={(event) => submit_Review(event, booking_Detail?.booking_Id as string, index)} className="flex flex-col gap-2">
                    <textarea name="review" id="review" rows={10} cols={50} className="border px-2"
                      placeholder="Leave comment for what you experience from this Hotel"
                      value={booking_Detail?.review ?? ""}
                      onChange={(event) => handle_Change(event)}>
                    </textarea>
                    <button className="bg-primary rounded text-white self-center w-1/2 py-2"
                      >Submit
                    </button>

                  </form>


                </div>
              </Modal>


              </>
              
              
              
              
              






              : <></>
            }
          </div>
          {/** 卡片下方 */}


        </div>
      })}
    </div>
  </div>
}