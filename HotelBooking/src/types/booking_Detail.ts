// 1. 訂單明細 - 物件
export interface Booking_Detail_Interface {
  booking_Id: string,
  booking_Img: string,
  hotel_Name: string,
  room_Type: string,
  booking_Status: string,
  start_Date: string,
  end_Date: string,
  checkin: string,
  checkout: string,
  price: number
  adults: number,
  childs: number,
  tax: number,
  facility: string[],
  review: string | null,
  star_Rating: number | null,
  traveler_Name: string | null,
  longtitude: number,
  latitude: number,
  address: string,
  city: string,
  country: string,
  room: number
}