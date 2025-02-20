import hotel_List_Json from "@/fakeData/hotel_List.json";
import { NextRequest, NextResponse } from "next/server";
import { add_Hotel_Detail_Interface } from "@/types/add_Hotel_Detail";

// 1. 飯店列表 API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {destination, dateRange, date_Start, date_End, adult, child, room, rangeslider, rating, bedType, facility, page} = body;
    
    // 1.1 當前頁, 不是1 就是2以上
    const currentPage = page ? parseInt(page, 10) : 1
    // 1.2 一頁 10卡片
    const pageSize = 10;

    // 1.3 針對搜條件, 篩選飯店列表
    let new_Hotel_List = [...hotel_List_Json];
    new_Hotel_List = hotel_List_Json.filter((hotel: add_Hotel_Detail_Interface) => {
      return (
        hotel.hotel_Name?.toLowerCase().includes(destination.toLowerCase()) ||
        hotel.city?.toLowerCase().includes(destination.toLowerCase()) ||
        hotel.country?.toLowerCase().includes(destination.toLowerCase())
      )
    });

    // 1.4 飯店列表長度
    const total = new_Hotel_List.length;
    // 1.5 所有分頁頁數
    const totalPages = Math.ceil(total/pageSize);
    // 1.6 計算要切割資料的起始與結束索引
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageinated_Hotel_List = new_Hotel_List.slice(startIndex, endIndex); 



    return NextResponse.json({
      status: 200,
      // data: new_Hotel_List,
      // page: page,
      data: pageinated_Hotel_List,
      total,
      totalPages,
      currentPage,
      message: "拿到前端自己建立API回傳數據"
    })
  } 
  catch (error) {
    return NextResponse.json(
      {error: 'Internal Server Error~~~~'},
      {status: 500}
    )
  }
}
