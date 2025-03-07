'use client';
import Previous_Page from "@/components/previous_Page/previous_Page";
import { OtherSVG } from "@/components/client_Svg/client_Svg";
// import My_Collection_Json from "@/fakeData/my_Collection_List.json";
import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { update_My_Collection, delete_My_Collection} from "@/store/my_Collection/my_Collection_Slice";
import { add_Hotel_Detail_Interface } from "@/types/add_Hotel_Detail";
import { to_Empty_Heart } from "@/store/hotel_List/hotel_List_Slice";
import StarRating from "@/components/starrating/star-Rating";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

export default function My_Collection () {

  // 0. 一進 /mycollection, 串接API
  const my_Collection_Url = process.env.NEXT_PUBLIC_API_BASE_URL + "/favorites";
  const [collection_List, set_Collection_List] = useState<any[]>([]);
  const fetch_My_Collection = async () => {
    try {
      set_Is_Loading(true)
      const response = await fetch(my_Collection_Url, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `bearer ${redux_Access_Token}`
        },
        credentials: "include"
      });
      if(!response.ok) {throw new Error("SERVER ERROR~~!")}
      const result = await response.json()
      set_Collection_List(result);
    } catch (error) {
      console.log(error);
    } finally {
      set_Is_Loading(false);
    }
  };
  useEffect(() => {
    fetch_My_Collection()
  },[])
  // useEffect(() => {
  //   console.log(collection_List, "我的最愛 - API返回");
  // },[collection_List])

  // 1. 路由
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  
  // 2. 當前頁面
  const current_Page_Name = "My Collection";

  // 3. 本地State 接收 我的收藏 - JSON假數據
  // const [collection_List, set_Collection_List] = useState(My_Collection_Json);
  const redux_Collection_List = useSelector((state: RootState) => state.my_Collection.collection_List);
  const redux_Verify_Session = useSelector((state: RootState) => state.verify_Session);
  const redux_Access_Token = useSelector((state: RootState) => state.access_Token.data.tokens.access_token)
  // useEffect(() => {
  //   dispatch(update_My_Collection(My_Collection_Json))
  // },[])

  // 4. 查看「指定飯店明細」
  const check_Hotel_Detail = (hotel_Id: string) => {
    const the_Hotel = redux_Collection_List.find((item) => item.hotel_Id === hotel_Id);
    
    if(the_Hotel){
      router.push(`/hotellist/${hotel_Id}`)
    }
  }

  // 5. 刪除指定收藏飯店
  // const delete_The_Collection = (hotel: add_Hotel_Detail_Interface) => {
  //   dispatch(delete_My_Collection(hotel));
  //   dispatch(to_Empty_Heart(hotel));
  // };
  const delete_The_Collection = async (item: add_Hotel_Detail_Interface) => {
    // 5.1 沒登入, 不給收藏
    if(redux_Access_Token === '') { 
      toast.error("Please Login First", {icon: "⚠️", duration: 2000})
      return;
    };
    const delete_Collectiono_Url = process.env.NEXT_PUBLIC_API_BASE_URL + `/favorites/${item.hotel_Id}`;
    try {
      set_Is_Loading(true)
      // 5.2 暫時 先切換愛心 優先 打API
      dispatch(delete_My_Collection({hotel_Id: item.hotel_Id as string, isCollected:item.isCollected}));
      const response = await fetch(delete_Collectiono_Url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `bearer ${redux_Access_Token}`
        },
        credentials: "include",
        body: JSON.stringify({
          hotelId: item.hotel_Id
        })
      });
      if(!response.ok) {throw new Error("SERVER ERROR~~!")};
      await fetch_My_Collection()
    } catch (error) {
      console.log(error);
    } finally {
      set_Is_Loading(false)
    }
  };

  // 6. <Skeleton> 讀取樣式開關
  const [is_Loading, set_Is_Loading] = useState<boolean>(false);
  const Placeholder_Card = () => {
    return <div className="flex flex-col gap-2 p-4">
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

  // 7. next-intl i18n-翻譯
  const t = useTranslations("MyCollection");

  return <div className={`customized-bg-gradient min-h-screen ${collection_List.length >0 ? 'pb-20' : ''} 
    lg:mt-[70px] lg:p-4 lg:bg-none`}>
    <Previous_Page current_Page_Name={current_Page_Name}></Previous_Page>
    { is_Loading === true ? <Placeholder_Card></Placeholder_Card> 

      :
      <>
      {collection_List.length >0 &&<p className="hidden lg:flex font-semibold">{t ("Collection List")}</p>}
      
      <div className="flex-1 flex flex-col gap-4 p-4 lg:grid lg:grid-cols-3 lg:px-0">

        {/** 沒有我的最愛.SVG */}
        {collection_List.length <=0 ? <div className="flex-1 flex flex-col justify-center items-center gap-4 lg:col-span-3 lg:row-span-1 min-h-[50vh]">
            <OtherSVG name="collection" className="w-10 h-auto"></OtherSVG>
            <p className="text-gray">{t ("You have No Collection")}</p>
          </div>
        
        
        : collection_List.length >0 && collection_List.map((item, index) => {

          {/** 有我的最愛 - 陣列 */}
          return <div className="relative" key={index}>
          <div className="absolute top-2 right-2 bg-softGray rounded-full cursor-pointer"
            onClick={() => delete_The_Collection(item.hotel)}>
            <OtherSVG name="trashcan" className="w-7 h-auto"></OtherSVG>
          </div>

            
            <img src={item.hotel.hotel_Image_List[0].url} alt={item.hotel.hotel_Image_List[0].description} 
              className="w-full rounded h-[189px] cursor-pointer"
              onClick={() => check_Hotel_Detail(item.hotelId as string)}/>
            
            <p className="absolute bottom-7 left-2 text-white font-semibold 
              lg:static lg:text-primary">{item.hotel.hotel_Name}</p>
            <p className="absolute bottom-2 left-2 text-white font-semibold 
              lg:static lg:text-black lg:text-xs lg:font-normal">{`${item.hotel.country}, ${item.hotel.city}`}</p>

            <div className="hidden lg:flex gap-2 text-xs">
              <StarRating ranking={item.hotel.totalRating as number}></StarRating>
              <p>{item.hotel.totalRating}</p>
              <p>({item.hotel.review_List.length} {t ("Reviews")})</p>
            </div>
          </div>
        })}
        {/** 有我的最愛 - 陣列 */}

      </div>
      
      </>
    }

  </div>
}