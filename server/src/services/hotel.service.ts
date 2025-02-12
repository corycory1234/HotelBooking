import { BaseService } from "./base.service";
import { db } from '../db';
import { hotels, roomTypes } from '../db/schema';
import { CreateHotelDTO, PaginatedResponse, SearchHotelsParams } from '../types/hotel.types';
import { and, eq, sql } from 'drizzle-orm';
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../utils/s3";

class HotelServiceError extends Error {
    constructor(message: string, public code: number = 500) {
        super(message);
        this.name = 'HotelServiceError';
    }
}

export class HotelService extends BaseService {
    async createHotel(hotelData: CreateHotelDTO, token: string) {
        try {
            if (!token) {
                throw new HotelServiceError('未提供認證信息', 401);
            }

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
                        hotel_Name: hotelData.hotel_Name,
                        hotel_Image_List: hotelData.hotel_Image_List || [],
                        distance: hotelData.distance,
                        totalRating: hotelData.totalRating.toString(),
                        facility_List: hotelData.facility_List || [],
                        price: hotelData.price.toString(),
                        hotel_Intro: hotelData.hotel_Intro,
                        review_List: (hotelData.review_List || []).map(review => ({
                            traveler_Id: review.traveler_Id,
                            traveler_Name: review.traveler_Name,
                            date: review.date,
                            traveler_Rating: review.traveler_Rating,
                            comment: review.comment,
                            reply: review.reply
                        })),
                        address: hotelData.address,
                        country: hotelData.country,
                        city: hotelData.city,
                        tax: hotelData.tax?.toString(),
                        checkin: hotelData.checkin,
                        checkout: hotelData.checkout,
                        latitude: hotelData.latitude?.toString(),
                        longitude: hotelData.longitude?.toString(),
                        is_Open: hotelData.is_Open ?? true,
                        hotel_Phone: hotelData.hotel_Phone,
                        hotel_Email: hotelData.hotel_Email,
                        cancellation_Policy: hotelData.cancellation_Policy,
                        transportation: hotelData.transportation,
                        recommendation: hotelData.recommendation,
                        isCollected: hotelData.isCollected ?? false,
                        offer_Id: hotelData.offer_Id,
                        owner_Id: user.id
                    }).returning();

                    // 新增房型 - 確保資料型別正確
                    const roomPromises = hotelData.roomType_List.map(room => 
                        tx.insert(roomTypes).values({
                            room_Type: room.room_Type,
                            room_Price: room.room_Price.toString(),
                            roomType_Image_List: room.roomType_Image_List || [],
                            room_Availability: room.room_Availability,
                            smoke: room.smoke,
                            amenity_List: room.amenity_List || [],
                            room_Size: room.room_Size.toString(),
                            max_People: room.max_People,
                            view: room.view,
                            bed_Type: room.bed_Type,
                            hotelId: newHotel.hotel_Id,
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
        if (!data.hotel_Name) {
            return { isValid: false, error: "飯店名稱為必填" };
        }
        if (!data.address) {
            return { isValid: false, error: "地址為必填" };
        }
        if (!data.country || !data.city) {
            return { isValid: false, error: "國家和城市為必填" };
        }
        if (!data.hotel_Phone || !data.hotel_Email) {
            return { isValid: false, error: "聯絡資訊為必填" };
        }
        if (data.totalRating < 0 || data.totalRating > 5) {
            return { isValid: false, error: "評分必須在 0-5 之間" };
        }
        if (data.price <= 0) {
            return { isValid: false, error: "價格必須大於 0" };
        }
        if (!data.roomType_List?.length) {
            return { isValid: false, error: "至少需要一個房型" };
        }

        // 驗證每個房型
        for (const room of data.roomType_List) {
            if (!room.room_Type) {
                return { isValid: false, error: "房型名稱為必填" };
            }
            if (room.room_Price <= 0) {
                return { isValid: false, error: "房型價格必須大於 0" };
            }
            if (room.room_Availability <= 0) {
                return { isValid: false, error: "房間數量必須大於 0" };
            }
            if (room.room_Size <= 0) {
                return { isValid: false, error: "房間大小必須大於 0" };
            }
            if (room.max_People <= 0) {
                return { isValid: false, error: "最大入住人數必須大於 0" };
            }
        }

        return { isValid: true };
    }

    // 清理檔案名稱
    private cleanFileName(fileName: string): string {
        return fileName
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9.-]/g, '-')
            .replace(/-{2,}/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // 通用的上傳圖片方法
    private async uploadImages(files: Express.Multer.File[], path: string) {
        return Promise.all(
            files.map(async (file) => {
                const cleanedFileName = this.cleanFileName(file.originalname);
                const fileName = `${Date.now()}-${cleanedFileName}`;
                const filePath = `${path}/${fileName}`;

                const command = new PutObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME!,
                    Key: filePath,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                    ACL: 'public-read'
                });

                await s3Client.send(command);
                return {
                    url: process.env.S3_DOMAIN + filePath
                };
            })
        );
    }

    // 從 S3 刪除檔案
    private async deleteFromS3(fileUrl: string) {
        const key = fileUrl.replace(process.env.S3_DOMAIN!, '');
        const command = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: key
        });
        await s3Client.send(command);
    }

    // 上傳飯店照片
    async uploadHotelImages(hotelId: string, files: Express.Multer.File[], token: string) {
        const { data: { user }, error: authError } = await this.supabase.auth.getUser(token);
        
        if (authError || !user) {
            throw new HotelServiceError('未授權的存取', 401);
        }

        const hotel = await db
            .select({ hotel_Image_List: hotels.hotel_Image_List })
            .from(hotels)
            .where(eq(hotels.hotel_Id, hotelId))

        const uploadResults = await this.uploadImages(files, `hotels/${hotelId}`);
        const newImages = [
            ...(hotel[0].hotel_Image_List || []),
            ...uploadResults.map(image => ({ ...image, description: '' }))
        ];

        await db
            .update(hotels)
            .set({
                hotel_Image_List: newImages,
                updatedAt: new Date()
            })
            .where(eq(hotels.hotel_Id, hotelId));

        return uploadResults;
    }

    // 刪除飯店照片
    async deleteHotelImages(hotelId: string, imageUrls: string[], token: string) {
        const { data: { user }, error: authError } = await this.supabase.auth.getUser(token);
        
        if (authError || !user) {
            throw new HotelServiceError('未授權的存取', 401);
        }

        const hotel = await db
            .select()
            .from(hotels)
            .where(eq(hotels.hotel_Id, hotelId))
            .then(rows => rows[0]);

        if (!hotel) {
            throw new HotelServiceError('飯店不存在', 404);
        }

        if (hotel.owner_Id!== user.id) {
            throw new HotelServiceError('無權限刪除照片', 403);
        }

        // 過濾出要保留的照片
        const updatedImages = (hotel.hotel_Image_List || []).filter(
            (img: { url: string }) => !imageUrls.includes(img.url)
        );

        // 更新資料庫
        await db
            .update(hotels)
            .set({
                hotel_Image_List: updatedImages,
                updatedAt: new Date()
            })
            .where(eq(hotels.hotel_Id, hotelId));

        // 從 S3 刪除檔案
        await Promise.all(imageUrls.map(url => this.deleteFromS3(url)));
    }

    // 上傳房型照片
    async uploadRoomTypeImages(roomTypeId: string, files: Express.Multer.File[], token: string) {
        const { data: { user }, error: authError } = await this.supabase.auth.getUser(token);
        
        if (authError || !user) {
            throw new HotelServiceError('未授權的存取', 401);
        }

        const roomType = await db
            .select()
            .from(roomTypes)
            .where(eq(roomTypes.roomType_Id, roomTypeId))
            .then(rows => rows[0]);

        if (!roomType) {
            throw new HotelServiceError('房型不存在', 404);
        }

        const uploadResults = await this.uploadImages(files, `room-types/${roomTypeId}`);
        const newImages = [
            ...(roomType.roomType_Image_List || []),
            ...uploadResults.map(image => ({ ...image, description: '' }))
        ];

        await db
            .update(roomTypes)
            .set({
                roomType_Image_List: newImages,
                updatedAt: new Date()
            })
            .where(eq(roomTypes.roomType_Id, roomTypeId));

        return uploadResults;
    }

    // 刪除房型照片
    async deleteRoomTypeImages(roomTypeId: string, imageUrls: string[], token: string) {
        const { data: { user }, error: authError } = await this.supabase.auth.getUser(token);
        
        if (authError || !user) {
            throw new HotelServiceError('未授權的存取', 401);
        }

        const roomType = await db
            .select()
            .from(roomTypes)
            .where(eq(roomTypes.roomType_Id, roomTypeId))
            .then(rows => rows[0]);

        if (!roomType) {
            throw new HotelServiceError('房型不存在', 404);
        }

        if (roomType.createdBy !== user.id) {
            throw new HotelServiceError('無權限刪除照片', 403);
        }

        // 過濾出要保留的照片
        const updatedImages = (roomType.roomType_Image_List || []).filter(
            (img: { url: string }) => !imageUrls.includes(img.url)
        );

        // 更新資料庫
        await db
            .update(roomTypes)
            .set({
                roomType_Image_List: updatedImages,
                updatedAt: new Date()
            })
            .where(eq(roomTypes.roomType_Id, roomTypeId));

        // 從 S3 刪除檔案
        await Promise.all(imageUrls.map(url => this.deleteFromS3(url)));
    }

    async searchHotels(params: SearchHotelsParams): Promise<PaginatedResponse<typeof hotels.$inferSelect>> {
        try {
            const page = Math.max(1, params.page);
            const limit = Math.min(50, Math.max(1, params.limit)); // 確保在 1-50 之間
            const offset = (page - 1) * limit;

            let query = db.select().from(hotels);

            // 建立搜尋條件
            const conditions = [];

            if (params.city?.trim()) {
                conditions.push(sql`${hotels.city} ILIKE ${`%${params.city.trim()}%`}`);
            }

            if (params.min_Price && params.min_Price > 0) {
                conditions.push(sql`CAST(${hotels.price} AS DECIMAL) >= ${params.min_Price}`);
            }

            if (params.max_Price && params.max_Price > 0) {
                conditions.push(sql`CAST(${hotels.price} AS DECIMAL) <= ${params.max_Price}`);
            }

            if (params.rating && params.rating > 0) {
                conditions.push(sql`CAST(${hotels.totalRating} AS DECIMAL) >= ${params.rating}`);
            }

            if (params.search_Query?.trim()) {
                conditions.push(sql`(
                    ${hotels.hotel_Name} ILIKE ${`%${params.search_Query.trim()}%`} OR 
                    ${hotels.address} ILIKE ${`%${params.search_Query.trim()}%`}
                )`);
            }

            // 加入設施條件 - 修改這部分
            if (params.facilities && params.facilities.length > 0) {
                // 將設施列表轉換為 PostgreSQL 陣列格式
                const facilitiesArray = `{${params.facilities.join(',')}}`;
                conditions.push(sql`${hotels.facility_List} ?& ${facilitiesArray}`);
            }

            // 加入搜尋條件
            if (conditions.length > 0) {
                query = (query as any).where(sql`${and(...conditions)}`);
            }

            // 計算總數
            const totalQuery = db.select({ count: sql<number>`count(*)` }).from(hotels);
            if (conditions.length > 0) {
                totalQuery.where(sql`${and(...conditions)}`);
            }
            const [{ count }] = await totalQuery;

            // 加入分頁並執行查詢
            const results = await query
                .orderBy(hotels.createdAt)
                .limit(limit)
                .offset(offset);

            const totalPages = Math.ceil(count / limit);

            return {
                data: results,
                total: count,
                page,
                totalPages,
                hasMore: page < totalPages
            };
        } catch (error) {
            console.error('Search hotels error:', error);
            throw new HotelServiceError('搜尋飯店失敗', 500);
        }
    }

    async getHotelDetails(hotelId: string) {
        try {
            const hotel = await db
                .select({
                    hotel: hotels,
                    rooms: roomTypes
                })
                .from(hotels)
                .leftJoin(roomTypes, eq(hotels.hotel_Id, roomTypes.hotelId))
                .where(eq(hotels.hotel_Id, hotelId))
                .then(rows => {
                    if (rows.length === 0) {
                        throw new HotelServiceError('飯店不存在', 404);
                    }

                    const hotelInfo = rows[0].hotel;
                    const roomsList = rows
                        .filter(row => row.rooms !== null)
                        .map(row => row.rooms);

                    return {
                        ...hotelInfo,
                        roomType_List: roomsList
                    };
                });

            return hotel;
        } catch (error) {
            console.error('Get hotel details error:', error);
            if (error instanceof HotelServiceError) {
                throw error;
            }
            throw new HotelServiceError(
                error instanceof Error ? error.message : '獲取飯店詳情失敗',
                500
            );
        }
    }
}

export const hotelService = new HotelService();
