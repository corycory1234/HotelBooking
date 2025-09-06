export interface CreateReviewDTO {
    bookingId: string;
    rating: number;
    comment: string;
}

export interface ReviewResponse {
    traveler_Id: string;
    traveler_Name: string;
    date: string;
    traveler_Rating: number;
    comment: string;
    reply: string | null;
}
