import HotelListCard from "@/components/hotelList/hotelListCard";
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
  
  // 2.2 回傳 Metadata
  return {
    title: `GoTour | Hotels in ${dynamicKeyword}`,
    description: `The best price from GoTour「${dynamicKeyword}」!`,
  };
}


export default function HotelList () {

  return <>
    {/** 飯店列表卡片 */}
      <HotelListCard></HotelListCard>
    {/** 飯店列表卡片 */}
  </>
}