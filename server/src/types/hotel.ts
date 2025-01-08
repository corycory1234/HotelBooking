export interface HotelImage {
    url: string;
    description: string;
  }
export interface HotelReview{
    id: string;
    name: string;
    date: string;
    rating: number;
    comment: string;
  }
  

  export interface Hotel {
    images: HotelImage[];
    reviews: HotelReview[];
  }