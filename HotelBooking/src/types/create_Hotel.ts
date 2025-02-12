// 0. 飯店列表 - 陣列
export type Hotel_List_Type = create_Hotel_Interface[]

// 1. 飯店明細 - 物件
export interface create_Hotel_Interface {
  hotelId: string | null,
  hotelName: string | null,
  // hotelImageList: {url: string}[],
  hotelImageList: {url?: string;  // 可能是後端上傳完回傳的連結
    file?: File;  }[],
  distance: string,
  totalRating: number | null,
  facilityList: string[] | null,
  price: number | null,
  hotelIntro: string | null,
  address: string | null,
  country: string | null,
  city: string | null,
  tax: number | null,
  checkin: string | null,
  checkout: string | null,
  latitude: number | null,
  longtitude: number | null,
  isOpen: string | null,
  hotelPhone: string | null,
  hotelEmail: string | null,
  cancellationPolicy: string | null,
  transportation: string | null,
  recommendation: string | null,
  reviewList: create_Review_Interface[],
  roomTypeList: create_Hotel_Room_Type_Interface[],
  isCollected: boolean,
  offerId: string | null
};

// 2. 旅客評論
export interface create_Review_Interface {
  travelerId: string,
  travelerName: string,
  date: string,
  travelerRating: number | null,
  comment: string,
  reply: string | null
}

// 2. 房型 (主流做法：同一層就能看到 roomType、images)
export interface create_Hotel_Room_Type_Interface {
  // 2.1 以 roomType 區分單人房 / 雙人房 / 其他房型...
  roomType: "singleRoom" | "doubleRoom" | "twinRoom" | "queenRoom" | "kingRoom" | string; // 2.2 有額外房型, 如familyRoom, 再透過聯合類型 | "familyRoom" 自行補上
  // room_Type: string | null,
  roomTypeId: string,
  roomPrice: number | null,
  roomTypeImageList: {url: string, description: string}[],
  roomAvailability: number | null,
  smoke: string | null,
  amenityList: string[] | null,
  roomSize: number | null,
  maxPeople: number | null,
  view: string | null,
  bedType: string | null
}

// 3. 優惠券
export interface Hotel_Offer_Interface {
  offer_Id: string, 
  offer_Name: string, 
  offer_Price: number, 
  offer_Description: string
}
