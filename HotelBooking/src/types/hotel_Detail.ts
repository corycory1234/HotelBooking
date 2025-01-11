// 1. 飯店明細
export interface Hotel_Detail_Interface {
  id: string,
  name: string,
  images: {url: string, description: string}[],
  distance: string,
  rating: number | null,
  facilities: string[],
  price: number | null,
  intro: string[],
  reviews: Review_Type_Interface[],
  address: string,
  country: string,
  city: string,
  tax: number,
  checkin: string,
  checkout: string,
  roomType: Hotel_Room_Type_Interface[]
}[]

// 2. 房型 (主流做法：同一層就能看到 roomType、images)
export interface Hotel_Room_Type_Interface {
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

// 3. 旅客評論
export interface Review_Type_Interface {
  id: string,
  name: string,
  date: string,
  rating: number,
  comment: string,
}