export interface HotelImage {
    url: string;
    description: string;
}

export interface Review {
    travelerId: string;
    travelerName: string;
    date: string;
    travelerRating: number;
    comment: string;
    reply: string;
}

export interface RoomType {
    roomTypeId: string;
    roomType: string;
    roomPrice: number;
    roomTypeImageList: HotelImage[];
    roomAvailability: number;
    smoke: boolean;
    amenityList: string[];
    roomSize: number;
    maxPeople: number;
    view?: string;
    bedType?: string;
}

export interface CreateHotelDTO {
    hotelId: string;
    hotelName: string;
    hotelImageList: HotelImage[];
    distance?: string;
    totalRating: number;
    facilityList: string[];
    price: number;
    hotelIntro?: string;
    reviewList: Review[];
    address: string;
    country: string;
    city: string;
    tax?: number;
    checkin: string;
    checkout: string;
    latitude?: number;
    longitude?: number;
    isOpen?: boolean;
    hotelPhone: string;
    hotelEmail: string;
    cancellationPolicy?: string;
    transportation?: string;
    recommendation?: string;
    isCollected?: boolean;
    offerId?: string;
    roomTypeList: RoomType[];
}

export interface Hotel {
    images: HotelImage[];
    reviews: Review[];
}

export interface SearchHotelsParams {
    page: number;
    limit: number;
    city?: string;
    country?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    searchQuery?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
}