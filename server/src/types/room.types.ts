export interface RoomType {
    id: string;
    hotelId: string;
    roomTypeId: string;
    roomType: string;
    roomPrice: string;
    roomAvailability: number;  // 改用與 schema 一致的欄位名稱
    roomTypeImageList: Array<{
        url: string;
        description: string;
    }> | null;
    smoke: boolean;
    amenityList: string[] | null;
    roomSize: string;
    maxPeople: number;
    view?: string;
    bedType?: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    createdBy: string | null;
}