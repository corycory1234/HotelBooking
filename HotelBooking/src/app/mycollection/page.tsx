'use client';
import Previous_Page from "@/components/previous_Page/previous_Page";
import { OtherSVG } from "@/components/client_Svg/client_Svg";
import My_Collection_Json from "@/fakeData/my_Collection_List.json";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { update_My_Collection, delete_My_Collection} from "@/store/my_Collection/my_Collection_Slice";
import { add_Hotel_Detail_Interface } from "@/types/add_Hotel_Detail";
import { to_Empty_Heart } from "@/store/hotel_List/hotel_List_Slice";

export default function My_Collection () {
  // 0. 路由
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  
  // 1. 當前頁面
  const current_Page_Name = "My Collection";

  // 2. 本地State 接收 我的收藏 - JSON假數據
  const [collection_List, set_Collection_List] = useState(My_Collection_Json);
  const redux_Collection_List = useSelector((state: RootState) => state.my_Collection.my_Collection_List);
  // useEffect(() => {
  //   dispatch(update_My_Collection(My_Collection_Json))
  // },[])

  // 3. 查看「指定飯店明細」
  const check_Hotel_Detail = (hotel_Id: string) => {
    const the_Hotel = collection_List.find((item) => item.hotel_Id === hotel_Id);
    
    if(the_Hotel){
      router.push(`/hotellist/${hotel_Id}`)
    }
  }

  // 4. 刪除指定收藏飯店
  const delete_The_Collection = (hotel: add_Hotel_Detail_Interface) => {
    dispatch(delete_My_Collection(hotel));
    dispatch(to_Empty_Heart(hotel));
  }


  return <div className={`customized-bg-gradient min-h-screen ${redux_Collection_List.length >0 ? 'pb-20' : ''}`}>
    <Previous_Page current_Page_Name={current_Page_Name}></Previous_Page>

    <div className="flex-1 flex flex-col gap-2 p-4">

      {/** 沒有我的最愛.SVG */}
      {redux_Collection_List.length <=0 ? <div className="flex-1 flex flex-col justify-center items-center gap-4">
          <OtherSVG name="collection" className="w-10 h-auto"></OtherSVG>
          <p className="text-gray">You have No Collection</p>
        </div>
      
      
      : redux_Collection_List.map((item) => {
        {/** 有我的最愛 - 陣列 */}
        return <div className="relative" key={item.hotel_Id as string}>
        
        <div className="absolute top-2 right-5 bg-softGray rounded-full cursor-pointer"
          onClick={() => delete_The_Collection(item)}>
          <OtherSVG name="trashcan" className="w-7 h-auto"></OtherSVG>
        </div>


        <img src={item.hotel_Image_List[0].url} alt={item.hotel_Image_List[0].description} className="w-full rounded h-[189px] cursor-pointer"
          onClick={() => check_Hotel_Detail(item.hotel_Id as string)}/>
        <p className="absolute bottom-7 left-2 text-white font-semibold">{item.hotel_Name}</p>
        <p className="absolute bottom-2 left-2 text-white font-semibold">{`${item.country}, ${item.city}`}</p>
        
        </div>
      })}
      {/** 有我的最愛 - 陣列 */}

    </div>
  </div>
}