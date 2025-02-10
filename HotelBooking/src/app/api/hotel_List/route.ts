import hotel_List_Json from "@/fakeData/hotel_List.json";
import { NextRequest, NextResponse } from "next/server";
import { add_Hotel_Detail_Interface } from "@/types/add_Hotel_Detail";

// 1. 飯店列表 API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {destination, dateRange, date_Start, date_End, adult, child, room, rangeslider, rating, bedType, facility} = body;
    let new_Hotel_List = [...hotel_List_Json];
    new_Hotel_List = hotel_List_Json.filter((hotel: add_Hotel_Detail_Interface) => {
    return (
      hotel.hotel_Name?.toLowerCase().includes(destination.toLowerCase()) ||
      hotel.city?.toLowerCase().includes(destination.toLowerCase()) ||
      hotel.country?.toLowerCase().includes(destination.toLowerCase())
    )
  });


    return NextResponse.json({
      status: 200,
      data: new_Hotel_List,
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
