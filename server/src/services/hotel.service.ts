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
                        hotelId: hotelData.hotelId,
                        hotelName: hotelData.hotelName,
                        hotelImageList: hotelData.hotelImageList || [],
                        distance: hotelData.distance,
                        totalRating: hotelData.totalRating.toString(),
                        facilityList: hotelData.facilityList || [],
                        price: hotelData.price.toString(),
                        hotelIntro: hotelData.hotelIntro,
                        reviewList: hotelData.reviewList || [],
                        address: hotelData.address,
                        country: hotelData.country,
                        city: hotelData.city,
                        tax: hotelData.tax?.toString(),
                        checkin: hotelData.checkin,
                        checkout: hotelData.checkout,
                        latitude: hotelData.latitude?.toString(),
                        longitude: hotelData.longitude?.toString(),
                        isOpen: hotelData.isOpen ?? true,
                        hotelPhone: hotelData.hotelPhone,
                        hotelEmail: hotelData.hotelEmail,
                        cancellationPolicy: hotelData.cancellationPolicy,
                        transportation: hotelData.transportation,
                        recommendation: hotelData.recommendation,
                        isCollected: hotelData.isCollected ?? false,
                        offerId: hotelData.offerId,
                        ownerId: user.id
                    }).returning();

                    // 新增房型 - 確保資料型別正確
                    const roomPromises = hotelData.roomTypeList.map(room => 
                        tx.insert(roomTypes).values({
                            roomTypeId: room.roomTypeId,
                            roomType: room.roomType,
                            roomPrice: room.roomPrice.toString(),
                            roomTypeImageList: room.roomTypeImageList || [],
                            roomAvailability: room.roomAvailability,
                            smoke: room.smoke,
                            amenityList: room.amenityList || [],
                            roomSize: room.roomSize.toString(),
                            maxPeople: room.maxPeople,
                            view: room.view,
                            bedType: room.bedType,
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
        if (!data.hotelName) {
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
        if (data.totalRating < 0 || data.totalRating > 5) {
            return { isValid: false, error: "評分必須在 0-5 之間" };
        }
        if (data.price <= 0) {
            return { isValid: false, error: "價格必須大於 0" };
        }
        if (!data.roomTypeList?.length) {
            return { isValid: false, error: "至少需要一個房型" };
        }

        // 驗證每個房型
        for (const room of data.roomTypeList) {
            if (!room.roomType) {
                return { isValid: false, error: "房型名稱為必填" };
            }
            if (room.roomPrice <= 0) {
                return { isValid: false, error: "房型價格必須大於 0" };
            }
            if (room.roomAvailability <= 0) {
                return { isValid: false, error: "房間數量必須大於 0" };
            }
            if (room.roomSize <= 0) {
                return { isValid: false, error: "房間大小必須大於 0" };
            }
            if (room.maxPeople <= 0) {
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
            .select({ hotelImageList: hotels.hotelImageList })
            .from(hotels)
            .where(eq(hotels.id, hotelId))
            .then(rows => rows[0]);

        if (!hotel) {
            throw new HotelServiceError('飯店不存在', 404);
        }

        const uploadResults = await this.uploadImages(files, `hotels/${hotelId}`);
        const newImages = [
            ...(hotel.hotelImageList || []),
            ...uploadResults.map(image => ({ ...image, description: '' }))
        ];

        await db
            .update(hotels)
            .set({
                hotelImageList: newImages,
                updatedAt: new Date()
            })
            .where(eq(hotels.id, hotelId));

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
            .where(eq(hotels.id, hotelId))
            .then(rows => rows[0]);

        if (!hotel) {
            throw new HotelServiceError('飯店不存在', 404);
        }

        if (hotel.ownerId !== user.id) {
            throw new HotelServiceError('無權限刪除照片', 403);
        }

        // 過濾出要保留的照片
        const updatedImages = (hotel.hotelImageList || []).filter(
            (img: { url: string }) => !imageUrls.includes(img.url)
        );

        // 更新資料庫
        await db
            .update(hotels)
            .set({
                hotelImageList: updatedImages,
                updatedAt: new Date()
            })
            .where(eq(hotels.id, hotelId));

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
            .where(eq(roomTypes.id, roomTypeId))
            .then(rows => rows[0]);

        if (!roomType) {
            throw new HotelServiceError('房型不存在', 404);
        }

        const uploadResults = await this.uploadImages(files, `room-types/${roomTypeId}`);
        const newImages = [
            ...(roomType.roomTypeImageList || []),
            ...uploadResults.map(image => ({ ...image, description: '' }))
        ];

        await db
            .update(roomTypes)
            .set({
                roomTypeImageList: newImages,
                updatedAt: new Date()
            })
            .where(eq(roomTypes.id, roomTypeId));

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
            .where(eq(roomTypes.id, roomTypeId))
            .then(rows => rows[0]);

        if (!roomType) {
            throw new HotelServiceError('房型不存在', 404);
        }

        if (roomType.createdBy !== user.id) {
            throw new HotelServiceError('無權限刪除照片', 403);
        }

        // 過濾出要保留的照片
        const updatedImages = (roomType.roomTypeImageList || []).filter(
            (img: { url: string }) => !imageUrls.includes(img.url)
        );

        // 更新資料庫
        await db
            .update(roomTypes)
            .set({
                roomTypeImageList: updatedImages,
                updatedAt: new Date()
            })
            .where(eq(roomTypes.id, roomTypeId));

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

            if (params.minPrice && params.minPrice > 0) {
                conditions.push(sql`CAST(${hotels.price} AS DECIMAL) >= ${params.minPrice}`);
            }

            if (params.maxPrice && params.maxPrice > 0) {
                conditions.push(sql`CAST(${hotels.price} AS DECIMAL) <= ${params.maxPrice}`);
            }

            if (params.rating && params.rating > 0) {
                conditions.push(sql`CAST(${hotels.totalRating} AS DECIMAL) >= ${params.rating}`);
            }

            if (params.searchQuery?.trim()) {
                conditions.push(sql`(
                    ${hotels.hotelName} ILIKE ${`%${params.searchQuery.trim()}%`} OR 
                    ${hotels.address} ILIKE ${`%${params.searchQuery.trim()}%`}
                )`);
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
            // 獲取飯店基本資訊和房型
            const hotel = await db
                .select({
                    hotel: hotels,
                    rooms: roomTypes
                })
                .from(hotels)
                .leftJoin(roomTypes, eq(hotels.id, roomTypes.hotelId))
                .where(eq(hotels.id, hotelId))
                .then(rows => {
                    if (rows.length === 0) {
                        throw new HotelServiceError('飯店不存在', 404);
                    }

                    // 整理資料結構
                    const hotelInfo = rows[0].hotel;
                    const roomsList = rows
                        .filter(row => row.rooms !== null)
                        .map(row => row.rooms);

                    return {
                        ...hotelInfo,
                        roomTypes: roomsList
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
