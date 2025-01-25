import { HomeSVG } from "../client_Svg/client_Svg";
import { useState, useEffect } from "react";
import { Review_Type_Interface } from "@/types/hotel_Detail";
import { add_Review_Type_Interface } from "@/types/add_Hotel_Detail";
import { Customer_Rating } from "../starrating/customer_Rating";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";


export default function Hotel_Customer_Review() {
    // 6. Redux - 指定飯店明細
    const redux_Hotel_Detail = useSelector((state: RootState) => state.hotel_Detail);
    // console.log("Redux 指定飯店, 旅客評論元件", redux_Hotel_Detail);

  // 3. 低星、高星評論
  const [sorted_Review, set_Sorted_Review] = useState<add_Review_Type_Interface[]>([]);
  useEffect(() => {
    if(redux_Hotel_Detail?.review_List) {
      const sorted = [...redux_Hotel_Detail?.review_List].sort((a,b) => (b.traveler_Rating as number) - (a.traveler_Rating as number));
      set_Sorted_Review(sorted);
    }
  },[redux_Hotel_Detail])
  const rating_Arr = {...redux_Hotel_Detail}
  const select_Rating = (rating_Value: string) => {
    if (!redux_Hotel_Detail?.review_List) return;
    let sorted;
    switch (rating_Value) {
      case "lowRating":
        sorted =  [...redux_Hotel_Detail?.review_List].sort((a,b) => (a.traveler_Rating as number) - (b.traveler_Rating as number))
        break;
      case "highRating":
        sorted = [...redux_Hotel_Detail?.review_List].sort((a,b) => (b.traveler_Rating as number) - (a.traveler_Rating as number))
      default:
        sorted = [...redux_Hotel_Detail?.review_List]
    }
    set_Sorted_Review(sorted as [])
  }



  return <>

      {/** 總平均評價 */}
      <div className="flex justify-between items-center py-2 border-b border-softGray">
        <div className="flex gap-2 items-center">
          <HomeSVG name={"Star"} className="w-6 h-auto"></HomeSVG>
          <p>{redux_Hotel_Detail?.totalRating}</p>
          <p>{redux_Hotel_Detail?.review_List.length + " Reviews"}</p>
        </div>
        {/** 排序評價 */}
        <select name="" id="" className="border-2 border-softGray p-1 rounded" onChange={(event) => select_Rating(event.target.value)}>
          <option value="hightRating">High</option>
          <option value="lowRating">Low</option>
        </select>
        {/** 排序評價 */}
      </div>
      {/** 總平均評價 */}

      {/** 留言、星星評價 */}
      {sorted_Review.map((item) => {
        return <div key={item.travelerId}>
          <div className="flex justify-between">
            <p className="text-primary">{item.travelerName} - {item.date}</p>
            <div className="flex">
              <Customer_Rating rating={item.traveler_Rating as number} className="w-4 h-auto"></Customer_Rating>
            </div>
          </div>
          <p className="py-2">{item.comment}</p>

        </div>
      })}
      {/** 留言、星星評價 */}

      {/* <button className="bg-primary text-white rounded-lg p-2" onClick={() => set_Selected_Tab(1)}>Book Now</button> */}

  </>
}