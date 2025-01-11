// 1. 飯店明細
export interface add_Hotel_Detail_Interface {
  hotel_Id: string,
  hotel_Name: string | null,
  hotel_Image_List: {url: string, description: string}[] | null,
  // distance: string,
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
  review_List: add_Review_Type_Interface[],
  // roomType: add_Hotel_Room_Type_Interface[]
}[];

// 2. 旅客評論
export interface add_Review_Type_Interface {
  travelerId: string,
  travelerName: string,
  date: string,
  traveler_Rating: number | null,
  comment: string,
}

// 2. 房型 (主流做法：同一層就能看到 roomType、images)
export interface add_Hotel_Room_Type_Interface {
  // 2.1 以 roomType 區分單人房 / 雙人房 / 其他房型...
  roomType: "singleRoom" | "doubleRoom"; // 2.2 有額外房型, 如familyRoom, 再透過聯合類型 | "familyRoom" 自行補上
  id: string,
  price: number | null,
  images: {url: string, description: string}[],
  availability: number,
  smoke: boolean | null,
  amenity: string[],
  roomsize: number | null,
  maxOccupancy: number | null;
}