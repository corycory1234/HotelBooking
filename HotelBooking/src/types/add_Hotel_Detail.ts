// 0. 飯店列表 - 陣列
export type Hotel_List_Type = add_Hotel_Detail_Interface[]

// 1. 飯店明細 - 物件
export interface add_Hotel_Detail_Interface {
  hotel_Id: string | null,
  hotel_Name: string | null,
  hotel_Image_List: {url: string, description: string}[],
  distance: string,
  totalRating: number | null,
  facility_List: string[] | null,
  price: number | null,
  hotel_Intro: string | null,
  address: string | null,
  country: string | null,
  city: string | null,
  tax: number | null,
  checkin: string | null,
  checkout: string | null,
  latitude: number | null,
  longtitude: number | null,
  is_Open: string | null,
  hotel_Phone: string | null,
  hotel_Email: string | null,
  cancellation_Policy: string | null,
  transportation: string | null,
  recommendation: string | null,
  review_List: add_Review_Type_Interface[],
  roomType_List: add_Hotel_Room_Type_Interface[],
  isCollected: boolean,
  offer_Id: string | null
};

// 2. 旅客評論
export interface add_Review_Type_Interface {
  travelerId: string,
  travelerName: string,
  date: string,
  traveler_Rating: number | null,
  comment: string,
  reply: string | null
}

// 2. 房型 (主流做法：同一層就能看到 roomType、images)
export interface add_Hotel_Room_Type_Interface {
  // 2.1 以 roomType 區分單人房 / 雙人房 / 其他房型...
  room_Type: "singleRoom" | "doubleRoom" | "twinRoom" | "queenRoom" | "kingRoom" | string; // 2.2 有額外房型, 如familyRoom, 再透過聯合類型 | "familyRoom" 自行補上
  // room_Type: string | null,
  roomType_Id: string,
  room_Price: number | null,
  roomType_Image_List: {url: string, description: string}[],
  room_Availability: number | null,
  smoke: string | null,
  amenity_List: string[] | null,
  room_Size: number | null,
  max_People: number | null,
  view: string | null,
  bed_Type: string | null
}

// 3. 優惠券
export interface Hotel_Offer_Interface {
  offer_Id: string, 
  offer_Name: string, 
  offer_Price: number, 
  offer_Description: string
}
