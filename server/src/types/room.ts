export interface RoomImage {
    url: string;
    description: string;
  }
  
  export interface RoomType {
    id: string;
    roomType: string;
    price: number;
    images: RoomImage[];
    availability: number;
    smoke: boolean;
    amenity: string[];
    roomsize: number;
    maxOccupancy: number;
  }
  
  export interface RoomTypes {
    roomType: RoomType[];
  }