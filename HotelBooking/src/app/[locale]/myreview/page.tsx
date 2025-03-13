'use client';
import Previous_Page from "@/components/previous_Page/previous_Page";
// import Booking_List_Json from "@/fakeData/trip_List.json";
// import { Booking_Detail_Interface } from "@/types/booking_Detail";
import { useEffect, useState } from "react";
import { OtherSVG } from "@/components/client_Svg/client_Svg";
import how_Many_Nights from "@/utils/how_Many_Nights";
import Modal from "@/components/modal/modal";
import { FiveStarSVG } from "@/components/client_Svg/client_Svg";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function My_Review () {
  // 0. Redux - 令牌
  const redux_Access_Token = useSelector((state: RootState) => state.access_Token.data.tokens.access_token)

  // 1. 當前頁面
  const current_Page_Name = "My Review";

  // 2. 本地State - 訂單狀態
  // const [booking_List_Completed, set_Booking_List_Completed] = useState<any[]>([]);
  // useEffect(() => {
  //   // 2.1 篩出 訂單狀態 - "completed", 才可以「看留言 或 留留言」
  //   if(Booking_List_Json.length >0 ) {
  //     const filter_Booking_Status_Completed = Booking_List_Json.filter((item: any) => item.booking_Status === "completed");
  //     set_Booking_List_Completed(filter_Booking_Status_Completed);

  //   }
  // },[])

  // 3. Modal留言視窗 - 本地State開關
  const [modal_Boolean, set_Modal_Boolean] = useState<boolean>(false);

  // 4. 指定訂單明細 - 本地state
  const [booking_Detail, set_Booking_Detail] = useState<any>();

  // 5. 打開 「指定訂單 留言視窗」
  const open_Review_Modal = (booking_Id: string) => {
    // 5.1 先訂單ID匹配, 返回「指定訂單」
    const the_Booking_Detail = review_List.find((item) => item.id === booking_Id);
    // console.log(the_Booking_Detail);
    // 5.2 本地「指定訂單明細」 - 更新
    set_Booking_Detail(the_Booking_Detail);
    // 5.3 本地「指定訂單明細 之 留言」 - 更新
    set_Review(the_Booking_Detail?.review || "");
    // 5.4 本地「指定訂單明細 之 5星評價」 - 更新
    set_Hover_Star(the_Booking_Detail?.starRating || 0)
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
    set_Booking_Detail((prev: any) => {
      if(!prev) { 
        return prev; // 防禦性寫法，避免出現 null
      } else {
        return {...prev, review: new_Review}
      }  
    })
    console.log(booking_Detail, "看看喔");
  };

  // 9. 送出 評價+留言
  const submit_Review = (event:  React.FormEvent, booking_Id: string) => {
    event.preventDefault();
    set_My_Booking_List((prev_List) => {
      return prev_List.map((item) => {
        if(item.id === booking_Id) {
          return {...item, review: booking_Detail?.review as string, starRating: hover_Star}
        }
        return item;
      })
    })
    set_Modal_Boolean(false);
  };
  const fetch_Review = async (event:  React.FormEvent, booking_Id: string) =>{
    event.preventDefault();
    try {
      const send_Review_Url = process.env.NEXT_PUBLIC_API_BASE_URL + `/reviews/${booking_Id}`
      const response = await fetch(send_Review_Url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `bearer ${redux_Access_Token}`
        },
        body: JSON.stringify({
          rating: hover_Star,
          comment: review
        }),
        credentials: "include"
      });
      if(!response.ok) {throw new Error("SERVER ERROR~~!")};
      const result = await response.json();
      console.log(result, "查看送出評價後之API返回");
      set_My_Booking_List((prev_List) => {
        return prev_List.map((item) => {
          if(item.id === booking_Id) {
            return {...item, review: booking_Detail?.review as string, starRating: hover_Star}
          }
          return item;
        })
      })
      set_Modal_Boolean(false);

    } catch (error) {
      console.log(error);
    } finally {
      set_Modal_Boolean(false);
    }
  }

  // 10. Skeleton動畫 - 佔位符
  const Placeholder_Card = () => {
  return <div className="flex flex-col gap-2 p-4 lg:px-20 lg:mt-[70px]">
    <div className="w-full h-[200px] object-cover object-top rounded animate-pulse bg-softGray"></div>
    <h3 className="animate-pulse bg-softGray w-3/4 h-6 rounded"></h3>
    <h3 className="animate-pulse bg-softGray w-1/2 h-6 rounded"></h3>

    <div className="w-full h-[200px] object-cover object-top rounded animate-pulse bg-softGray"></div>
    <h3 className="animate-pulse bg-softGray w-3/4 h-6 rounded"></h3>
    <h3 className="animate-pulse bg-softGray w-1/2 h-6 rounded"></h3>

    <div className="w-full h-[200px] object-cover object-top rounded animate-pulse bg-softGray"></div>
    <h3 className="animate-pulse bg-softGray w-3/4 h-6 rounded"></h3>
    <h3 className="animate-pulse bg-softGray w-1/2 h-6 rounded"></h3>
  </div>
  };

  // 11.
  const [show_Review_List, set_show_Review_List] = useState<boolean>(false);

  // 12. 我的訂單 - API
  const my_Bookings_Url = process.env.NEXT_PUBLIC_API_BASE_URL + "/bookings/my-bookings";
  const [my_Booking_List, set_My_Booking_List] = useState<any[]>([]);
  const [review_List, set_Review_List] = useState<any[]>([]);
  const get_My_Booking = async () => {
    try {
      set_show_Review_List(false);
      const response = await fetch(my_Bookings_Url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `bearer ${redux_Access_Token}`
        },
        credentials: 'include'
      });
      if(!response.ok) {throw new Error(`伺服器錯誤`)};
      const result = await response.json();
      set_My_Booking_List(result.data);
    } catch (error) {
      console.log(error);
    } finally {
      set_show_Review_List(true);
    }
  };

  // 13. 篩出 status: "confirmed", 列出 可評論 or 可查看評論 之陣列
  const get_Review_List = () => {
    const new_Review_List = my_Booking_List.filter((item) => item.status === "confirmed");
    set_Review_List(new_Review_List);
  }

  // 14. 一進 /myreview, 串接我的訂單 - API
  useEffect(() => {
    get_My_Booking()
  },[]);
  useEffect(() => {
    get_Review_List();
  },[my_Booking_List]);
  useEffect(() => {
    console.log(review_List, "我的評論, 篩選後之數據");
  },[review_List]);

  // 15. next-intl i18n-翻譯
  const t = useTranslations("MyReview");

  
  return <div className="lg:min-h-[75vh] lg:mt-[70px] lg:p-4">
    <Previous_Page current_Page_Name={current_Page_Name}></Previous_Page>
    <p className="hidden lg:block font-semibold">{t ("My Reviews")}</p>

    {show_Review_List === false && <Placeholder_Card></Placeholder_Card>}

    {show_Review_List === true && review_List.length === 0 && <div className="flex flex-col justify-center items-center gap-2 min-h-[50vh]">
      <OtherSVG name="review" className="w-10 h-auto"></OtherSVG>
      <p className="font-semibold">{t ("You have NO Review")}</p>
      </div>
    }
    
    {show_Review_List === true && 
      <>
        <div className="flex flex-col p-4 gap-2 pb-20 lg:grid lg:grid-cols-2 lg:pb-0 lg:px-0">
          {review_List.map((item, index) => {
            return <div className="flex flex-col border border-softGray rounded" key={index}>
            
            {/* 卡片上方 */}
            <div className="flex gap-2 border-b border-softGray" >
                <div className="w-1/3 lg:w-1/4">
                  <img src={item.bookingImage} alt="" className="w-[170px] h-[170px] rounded object-cover"/>
                </div>
                <div className="flex flex-col">
                  <p>{item.hotel_Name}</p>
                  <div className="flex gap-2">
                    <OtherSVG name="marker" className="w-4 h-auto"></OtherSVG>
                    <p>{item.city + ", " + item.country }</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <OtherSVG name="bed" className="w-4 h-auto"></OtherSVG>
                    <p>{t (item.roomTypes.room_Type)}</p>
                  </div>
                </div>
              </div>
              {/* 卡片上方 */}


              {/* 卡片中間 */}
              <div className="flex p-2 gap-2">
                  <div className="flex flex-col">
                    <p className="text-gray text-[14px]">{t ("Check-In")}</p>
                    <p className="text-[14px] font-semibold">{item.checkInDate}</p>
                  </div>
                  <p className="text-gray text-[14px]">→</p>
                  <div className="flex flex-col">
                    <p className="text-gray text-[14px]">{t ("Check-Out")}</p>
                    <p className="text-[14px] font-semibold">{item.checkOutDate}</p>
                  </div>
                  <div className="border-r border-x-softGray"></div>

                  <div className="flex flex-col">
                    <p className="text-gray text-[14px]">{t ("Nights")}</p>
                    <p className="text-[14px] font-semibold">{how_Many_Nights(item.checkInDate as string, item.checkOutDate as string)}</p>
                  </div>

                  <div className="border-r border-x-softGray"></div>

                  <div className="flex flex-col">
                    <p className="text-gray text-[14px]">{t ("Rooms")}</p>
                    <p className="text-[14px] font-semibold">{item.roomCount}</p>
                  </div>
              </div>
              {/* 卡片中間 */}


              {/** 卡片下方 */}
              <div className="flex items-center gap-2 p-2">
                <div className="relative">
                  <OtherSVG name="star" className="w-8 h-auto"></OtherSVG>
                  <p className="absolute top-2 left-3 text-sm">{item.starRating}</p>
                </div>
                <p>{item.review}</p>

                {/** 尚未留言, 才可以點擊按鈕 >> 彈跳視窗 >> 進行留言 */}
                {item.review === null ? <>
                  <button className="bg-secondary rounded text-white w-full py-2" onClick={() => open_Review_Modal(item.id)}>
                    Review Your Stay
                  </button> 
                  
                  <Modal isOpen={modal_Boolean} onClose={() => set_Modal_Boolean(false)}>
                    <div className="flex flex-col gap-4 px-4 pt-20">
                      <p className="font-semibold">Hotel: {booking_Detail?.hotel_Name}</p>
                      <p>Name: {booking_Detail?.travelerName}</p>


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


                      <form onSubmit={(event) => fetch_Review(event, booking_Detail?.id as string)} className="flex flex-col gap-2">
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
                {/** 尚未留言, 才可以點擊按鈕 >> 彈跳視窗 >> 進行留言 */}
              </div>
              {/** 卡片下方 */}


            </div>
          })}
        </div>
      </>
    
    
    }
    
  </div>
}