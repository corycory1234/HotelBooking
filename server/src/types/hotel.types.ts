export interface Hotel_Image {
    url: string;
    description: string;
}

export interface Hotel_Review {
    traveler_Id: string;
    traveler_Name: string;
    date: string;
    traveler_Rating: number;
    comment: string;
    reply: string;
}

export interface Room_Type {
    room_Type: string;
    room_Price: number;
    roomType_Image_List: Hotel_Image[];
    room_Availability: number;
    smoke: boolean;
    amenity_List: string[];
    room_Size: number;
    max_People: number;
    view?: string;
    bed_Type?: string;
}

export interface CreateHotelDTO {
    hotel_Name: string;
    hotel_Image_List: Hotel_Image[];
    distance?: string;
    totalRating: number;
    facility_List: string[];
    price: number;
    hotel_Intro?: string;
    review_List: Hotel_Review[];
    address: string;
    country: string;
    city: string;
    tax?: number;
    checkin: string;
    checkout: string;
    latitude?: number;
    longitude?: number;
    is_Open?: boolean;
    hotel_Phone: string;
    hotel_Email: string;
    cancellation_Policy?: string;
    transportation?: string;
    recommendation?: string;
    isCollected?: boolean;
    offer_Id?: string;
    roomType_List: Room_Type[];
}

export interface Hotel {
    images: Hotel_Image[];
    reviews: Hotel_Review[];
}

export interface SearchHotelsParams {
    page: number;
    limit: number;
    city?: string;
    country?: string;
    min_Price?: number;
    max_Price?: number;
    rating?: number;
    search_Query?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
}