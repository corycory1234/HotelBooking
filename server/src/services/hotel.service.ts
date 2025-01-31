import { BaseService } from "./base.service";
import { db } from '../db';
import { hotels, roomTypes } from '../db/schema';
import { CreateHotelDTO } from '../types/hotel.types';
import { eq } from 'drizzle-orm';

class HotelServiceError extends Error {
    constructor(message: string, public code: number = 500) {
        super(message);
        this.name = 'HotelServiceError';
    }
}

export class HotelService extends BaseService {
    async createHotel(hotelData: CreateHotelDTO, token: string) {
        try {
            const {
                data: { user },
                error: authError,
            } = await this.supabase.auth.getUser(token);

            if (authError || !user) {
                throw new HotelServiceError('無效的認證信息', 401);
            }

            return await db.transaction(async (tx) => {
                try {
                    // 新增飯店 - 確保資料型別正確
                    const [newHotel] = await tx.insert(hotels).values({
                        name: hotelData.name,
                        address: hotelData.address,
                        country: hotelData.country,
                        city: hotelData.city,
                        rating: hotelData.rating.toString(), // 轉換為字串
                        price: hotelData.price.toString(), // 轉換為字串
                        hotelPhone: hotelData.hotelPhone,
                        hotelEmail: hotelData.hotelEmail,
                        facilities: hotelData.facilities || [],
                        checkin: hotelData.checkin,
                        checkout: hotelData.checkout,
                        images: [],
                        ownerId: user.id
                    }).returning();

                    // 新增房型 - 確保資料型別正確
                    const roomPromises = hotelData.roomTypes.map(room => 
                        tx.insert(roomTypes).values({
                            roomType: room.roomType,
                            price: room.price.toString(), // 轉換為字串
                            availability: room.availability,
                            roomSize: room.roomSize.toString(), // 轉換為字串
                            maxOccupancy: room.maxOccupancy,
                            smoke: room.smoke || false,
                            amenity: room.amenity || [],
                            hotelId: newHotel.id,
                            createdBy: user.id
                        }).returning()
                    );

                    const createdRooms = await Promise.all(roomPromises);

                    return {
                        hotel: newHotel,
                        rooms: createdRooms.map(room => room[0])
                    };
                } catch (txError) {
                    console.error('Transaction error:', txError);
                    throw new HotelServiceError('建立飯店資料失敗', 500);
                }
            });
        } catch (error) {
            console.error('CreateHotel error:', error);
            if (error instanceof HotelServiceError) {
                throw error;
            }
            throw new HotelServiceError(
                error instanceof Error ? error.message : '未知錯誤',
                500
            );
        }
    }

    validateHotelData(data: CreateHotelDTO): { isValid: boolean; error?: string } {
        if (!data.name) {
            return { isValid: false, error: "飯店名稱為必填" };
        }
        if (!data.address) {
            return { isValid: false, error: "地址為必填" };
        }
        if (!data.country || !data.city) {
            return { isValid: false, error: "國家和城市為必填" };
        }
        if (!data.hotelPhone || !data.hotelEmail) {
            return { isValid: false, error: "聯絡資訊為必填" };
        }
        if (data.rating < 0 || data.rating > 5) {
            return { isValid: false, error: "評分必須在 0-5 之間" };
        }
        if (data.price <= 0) {
            return { isValid: false, error: "價格必須大於 0" };
        }
        if (!data.roomTypes?.length) {
            return { isValid: false, error: "至少需要一個房型" };
        }

        // 驗證每個房型
        for (const room of data.roomTypes) {
            if (!room.roomType) {
                return { isValid: false, error: "房型名稱為必填" };
            }
            if (room.price <= 0) {
                return { isValid: false, error: "房型價格必須大於 0" };
            }
            if (room.availability <= 0) {
                return { isValid: false, error: "房間數量必須大於 0" };
            }
            if (room.roomSize <= 0) {
                return { isValid: false, error: "房間大小必須大於 0" };
            }
            if (room.maxOccupancy <= 0) {
                return { isValid: false, error: "最大入住人數必須大於 0" };
            }
        }

        return { isValid: true };
    }
}

export const hotelService = new HotelService();
