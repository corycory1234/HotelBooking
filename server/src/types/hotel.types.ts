export interface HotelImage {
  url: string;
  path?: string;
  description?: string;
}

export interface HotelReview {
  id: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
}

export interface RoomType {
  roomType: string;
  price: number;
  images: HotelImage[];
  availability: number;
  smoke: boolean;
  amenity: string[];
  roomSize: number;
  maxOccupancy: number;
}

export interface CreateHotelDTO {
  name: string;
  address: string;
  country: string;
  city: string;
  rating: number;
  facilities: string[];
  price: number;
  hotelPhone: string;
  hotelEmail: string;
  checkin: string;
  checkout: string;
  images: HotelImage[];
  roomTypes: RoomType[];
}

export interface Hotel {
  images: HotelImage[];
  reviews: HotelReview[];
}