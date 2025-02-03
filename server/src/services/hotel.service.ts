import { BaseService } from "./base.service";
import { db } from '../db';
import { hotels, roomTypes } from '../db/schema';
import { CreateHotelDTO } from '../types/hotel.types';
import { eq } from 'drizzle-orm';
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
            .select({ images: hotels.images })
            .from(hotels)
            .where(eq(hotels.id, hotelId))
            .then(rows => rows[0]);

        if (!hotel) {
            throw new HotelServiceError('飯店不存在', 404);
        }

        const uploadResults = await this.uploadImages(files, `hotels/${hotelId}`);
        const newImages = [...(hotel.images || []), ...uploadResults];

        await db
            .update(hotels)
            .set({
                images: newImages,
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
        const updatedImages = (hotel.images || []).filter(
            (img: { url: string }) => !imageUrls.includes(img.url)
        );

        // 更新資料庫
        await db
            .update(hotels)
            .set({
                images: updatedImages,
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
        const newImages = [...(roomType.images || []), ...uploadResults];

        await db
            .update(roomTypes)
            .set({
                images: newImages,
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
        const updatedImages = (roomType.images || []).filter(
            (img: { url: string }) => !imageUrls.includes(img.url)
        );

        // 更新資料庫
        await db
            .update(roomTypes)
            .set({
                images: updatedImages,
                updatedAt: new Date()
            })
            .where(eq(roomTypes.id, roomTypeId));

        // 從 S3 刪除檔案
        await Promise.all(imageUrls.map(url => this.deleteFromS3(url)));
    }
}

export const hotelService = new HotelService();
