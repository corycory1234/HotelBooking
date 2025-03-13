// import Server_Form_Search from "../../components/server-Form-Search/server-Form-Search";
// import Index_Form_Search from "../../components/form_Search/index_Form_Search";
// import { useSearchParams } from "next/navigation";
// import Client_Filter_Button from "../../components/client-Filter-Button";
import Hotel_List_Card from "@/components/hotel_List/hotel_List_Card";
// import Half_Modal from "../../components/modal/half-modal";
// import { Submit_Search } from "@/actions";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/store/store";
// import Not_Found from "@/components/not_Found/not_Found";
// import hotel_List_Json from "@/fakeData/hotel_List.json";
// import { add_Hotel_Detail_Interface } from "@/types/add_Hotel_Detail";
// import { update_Hotel_List } from "@/store/hotel_List/hotel_List_Slice";
import { Metadata } from "next";

// 1. Server Component 的 searchParams 所需要的 interface
interface metaKeywordInterface {
  searchParams: {
    destination?: string; // 想拿的 searchParams 參數 key
    // [key: string]: any;   // 其他參數也可以放這裡
  };
};

// 2. 透過 generateMetadata, 取得「Sever組件的 搜尋參數」
export async function generateMetadata({ searchParams }: metaKeywordInterface): Promise<Metadata> {
  // 2.1 從 URL 取得查詢參數
  const dynamicKeyword = searchParams.destination || "No Result";
  // 2.3 回傳 Metadata
  return {
    // title: `GoTour | ${finalKeyword}`,
    title: `GoTour | Hotels in ${dynamicKeyword}`,
    description: `The best price from GoTour「${dynamicKeyword}」!`,
  };
}

// export async function generateMetadata(): Promise<Metadata> {
//   // 1. 飯店列表 - API
//     const fetch_Hotel_List_Backend = async (page: number) => {
//       try {

//         const hotel_List_Url = process.env.NEXT_PUBLIC_API_BASE_URL + `/hotels?${query_Params}`;
//         const response = await fetch(hotel_List_Url, {
//           method: "GET",
//           headers: {"Content-Type": "application/json"},
//           credentials: 'include'
//         });
//         if(!response.ok) {throw new Error(`伺服器錯誤`)};
//         const result = await response.json();
//         // console.log(result, "飯店列表API - 返回數據");
  
//         // 14.5 Skeleton動畫 -關
//       } catch (error) {
//         console.log(error, "飯店列表API失敗");
//       }
//     }
// }


export default function HotelList () {
  // 1.  這些Params都來自於 Server Action - Submit_Form函式
  // 1.1 必須要對接這些Params, /hotellist?destination...路由, 才可以運作
  // const searchParams = useSearchParams();
  // const destination = searchParams.get("destination");
  // const dateRange = searchParams.get("dateRange");
  // const room = searchParams.get("room");
  // const adult = searchParams.get("adult");
  // const child = searchParams.get("child");
  // const timestamp = searchParams.get("timestamp");

  // 2. 監聽 Params
  // useEffect(() => {
  //   console.log(destination, room, adult, child, timestamp);
  //   Submit_Search
  // },[destination, room, adult, child, timestamp])

  // 3. Sort 彈跳Modal開關
  // const [formSort, setFormSort] = useState<boolean>(false);

  // 4. Sort 傳遞<input type="radio"> 之 Value 與 傳遞函式 set_Sort_Value
  // const [sort_Value, set_Sort_Value] = useState("");

  // 2. Skeleton動畫 - 延遲2秒 (這邊待API寫好, 於useEffect)
  // const [show_Hotel_List, set_Show_Hotel_List] = useState<boolean>(false);
  // useEffect(() => {
  //   set_Show_Hotel_List(false) // 第2次進頁面, 從 true >> false
  //   const timer = setTimeout(() => {
  //     set_Show_Hotel_List(true);
  //   }, 1500);
  //   return () => clearTimeout(timer);
  // },[timestamp])

  // 3. Skeleton動畫 - 佔位符
  // const Placeholder_Card = () => {
  //   return <div className="flex flex-col gap-2 lg:hidden">
  //     <div className="w-full h-[200px] object-cover object-top rounded animate-pulse bg-softGray"></div>
  //     <h3 className="animate-pulse bg-softGray w-3/4 h-6 rounded"></h3>
  //     <h3 className="animate-pulse bg-softGray w-1/2 h-6 rounded"></h3>

  //     <div className="w-full h-[200px] object-cover object-top rounded animate-pulse bg-softGray"></div>
  //     <h3 className="animate-pulse bg-softGray w-3/4 h-6 rounded"></h3>
  //     <h3 className="animate-pulse bg-softGray w-1/2 h-6 rounded"></h3>

  //     <div className="w-full h-[200px] object-cover object-top rounded animate-pulse bg-softGray"></div>
  //     <h3 className="animate-pulse bg-softGray w-3/4 h-6 rounded"></h3>
  //     <h3 className="animate-pulse bg-softGray w-1/2 h-6 rounded"></h3>
  //   </div>
  // }

  // 5. Redux - 飯店列表
  // const redux_Hotel_List = useSelector((state: RootState) => state.hotel_List2.hotel_List)
  // // const redux_Hotel_List = useSelector((state: RootState) => state.hotel_List);
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   const hotel_List = hotel_List_Json.filter((hotel: add_Hotel_Detail_Interface) => {
  //     // 3.1 飯店名、飯店城市、飯店國家，一同匹配
  //     return (
  //       hotel.hotel_Name?.toLowerCase().includes((destination as string).toLowerCase()) ||
  //       hotel.city?.toLowerCase().includes((destination as string).toLowerCase()) ||
  //       hotel.country?.toLowerCase().includes((destination as string).toLowerCase())
  //     )
  //   })
  //   dispatch(update_Hotel_List(hotel_List))
  // },[])
  // useEffect(() => {
  //   console.log(redux_Hotel_List, "Redux有撈到飯店嘛");
  // },[redux_Hotel_List])

  return <>

    {/** 飯店列表卡片 */}
      <Hotel_List_Card></Hotel_List_Card>
    {/** 飯店列表卡片 */}

  </>
}