// 0. 飯店列表 - 陣列
export type Hotel_List_Type = create_Hotel_Interface[]

// 1. 飯店明細 - 物件
export interface create_Hotel_Interface {
  hotel_Id: string | null,
  hotel_Name: string | null,
  // hotelImageList: {url: string}[],
  // hotelImageList: {url?: string;  // 可能是後端上傳完回傳的連結
  //   file?: File;  }[],
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
  longitude: number | null,
  is_Open: string | null,
  hotel_Phone: string | null,
  hotel_Email: string | null,
  cancellation_Policy: string | null,
  transportation: string | null,
  recommendation: string | null,
  review_List: create_Review_Interface[],
  roomType_List: create_Hotel_Room_Type_Interface[],
  isCollected: boolean,
  offer_Id: string | null
};

// 2. 旅客評論
export interface create_Review_Interface {
  traveler_Id: string,
  traveler_Name: string,
  date: string,
  traveler_Rating: number | null,
  comment: string,
  reply: string | null
}

// 2. 房型 (主流做法：同一層就能看到 roomType、images)
export interface create_Hotel_Room_Type_Interface {
  // 2.1 以 roomType 區分單人房 / 雙人房 / 其他房型...
  room_Type: "singleRoom" | "doubleRoom" | "twinRoom" | "queenRoom" | "kingRoom" | string; // 2.2 有額外房型, 如familyRoom, 再透過聯合類型 | "familyRoom" 自行補上
  roomType_Id: string,
  room_Price: number | null,
  roomType_Image_List: File[],
  room_Availability: number | null,
  smoke: boolean,
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
