'use client';
import Previous_Page from "@/components/previous_Page/previous_Page";
import { OtherSVG } from "@/components/client_Svg/client_Svg";
import My_Collection_Json from "@/fakeData/my_Collection_List.json";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function My_Collection () {
  // 0. 路由
  const router = useRouter();
  
  // 1. 當前頁面
  const current_Page_Name = "My Collection";

  // 2. 本地State 接收 我的收藏 - JSON假數據
  const [collection_List, set_Collection_List] = useState(My_Collection_Json);

  // 3. 查看「指定飯店明細」
  const check_Hotel_Detail = (hotel_Id: string) => {
    const the_Hotel = collection_List.find((item) => item.id === hotel_Id);
    
    if(the_Hotel){
      router.push(`/hotellist/${hotel_Id}`)
    }
  }

  // 4. 刪除指定收藏飯店
  const delete_The_Collection = (hotel_Id: string) => {
    const new_Collection_List = collection_List.filter((item) => {
      return item.id !== hotel_Id;
    });
    set_Collection_List(new_Collection_List)
    console.log(collection_List,"我的最愛");
  }


  return <div className={`customized-bg-gradient min-h-screen ${collection_List.length >0 ? 'pb-20' : ''}`}>
    <Previous_Page current_Page_Name={current_Page_Name}></Previous_Page>

    <div className="flex-1 flex flex-col gap-2 p-4">

      {/** 沒有我的最愛.SVG */}
      {collection_List.length <=0 ? <div className="flex-1 flex flex-col justify-center items-center gap-4">
          <OtherSVG name="collection" className="w-10 h-auto"></OtherSVG>
          <p className="text-gray">You have No Collection</p>
        </div>
      
      
      : collection_List.map((item) => {
        {/** 有我的最愛 - 陣列 */}
        return <div className="relative" key={item.id}>
        
        <div className="absolute top-2 right-5 bg-softGray rounded-full cursor-pointer"
          onClick={() => delete_The_Collection(item.id)}>
          <OtherSVG name="trashcan" className="w-7 h-auto"></OtherSVG>
        </div>


        <img src={item.images[0].url} alt={item.images[0].description} className="w-full rounded h-[189px] cursor-pointer"
          onClick={() => check_Hotel_Detail(item.id)}/>
        <p className="absolute bottom-7 left-2 text-white font-semibold">{item.name}</p>
        <p className="absolute bottom-2 left-2 text-white font-semibold">{`${item.country}, ${item.city}`}</p>
        
        </div>
      })}
      {/** 有我的最愛 - 陣列 */}

    </div>
  </div>
}