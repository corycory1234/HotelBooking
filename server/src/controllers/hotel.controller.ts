import { Request, Response } from 'express';
import { db } from '../db';
import { hotels, roomTypes } from '../db/schema';
import { eq } from 'drizzle-orm';
import { ApiResponse } from '../utils/response';
import { CreateHotelDTO } from '../types/hotel.types';
// import { supabase } from '../utils/supabase';  // 請確保有此導入
import { hotelService } from '../services/hotel.service';

class HotelController {
    // 搜尋飯店列表
    async getHotels(req: Request, res: Response) {
        try {
            const allHotels = await db.select().from(hotels);
            res.json(ApiResponse.success(allHotels));
        } catch (error) {
            res.status(500).json(ApiResponse.error((error as Error).message));
        }
    }

    // 獲取飯店詳情
    async getHotel(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const hotel = await db
                .select()
                .from(hotels)
                .where(eq(hotels.id, id));

            if (!hotel.length) {
                return res
                    .status(404)
                    .json(ApiResponse.error("Hotel not found"));
            }

            res.json(ApiResponse.success(hotel[0]));
        } catch (error) {
            res.status(500).json(ApiResponse.error((error as Error).message));
        }
    }

    // 新增飯店
    async createHotel(req: Request, res: Response) {
        try {
            const token = req.cookies?.access_token;
            const hotelData: CreateHotelDTO = req.body;

            const validation = hotelService.validateHotelData(hotelData);
            if (!validation.isValid) {
                return res.status(400).json(
                    ApiResponse.error(validation.error || "資料格式不正確")
                );
            }

            const result = await hotelService.createHotel(hotelData, token);
            res.status(201).json(ApiResponse.success(result));
        } catch (error) {
            console.error('Create hotel error:', error);
            res.status(500).json(ApiResponse.error("建立飯店失敗"));
        }
    }

    // 上傳房型照片
    async uploadRoomTypeImages(req: Request, res: Response) {
        try {
            const { roomTypeId } = req.params;
            const files = req.files as Express.Multer.File[];
            
            if (!files || files.length === 0) {
                return res.status(400).json(
                    ApiResponse.error("No files uploaded")
                );
            }

            const uploadResults = await Promise.all(
                files.map(async (file) => {
                    const fileName = `${Date.now()}-${file.originalname}`;
                    const filePath = `room-types/${roomTypeId}/${fileName}`;

                    // 上傳到 Supabase Storage
                    // const { data, error } = await supabase.storage
                    //     .from('hotel-images')
                    //     .upload(filePath, file.buffer, {
                    //         contentType: file.mimetype,
                    //     });

                    // if (error) throw error;

                    // // 取得公開 URL
                    // const { data: { publicUrl } } = supabase.storage
                    //     .from('hotel-images')
                    //     .getPublicUrl(filePath);

                    // return {
                    //     url: publicUrl,
                    //     path: filePath
                    // };
                })
            );

            // 更新房型的圖片數組
            // await db
            //     .update(roomTypes)
            //     .set({
            //         images: uploadResults,
            //         updatedAt: new Date()
            //     })
            //     .where(eq(roomTypes.id, roomTypeId));

            // res.json(ApiResponse.success(uploadResults));
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json(ApiResponse.error("上傳照片失敗"));
        }
    }

    // 上傳飯店照片
    async uploadHotelImages(req: Request, res: Response) {
        try {
            const { hotelId } = req.params;
            const files = req.files as Express.Multer.File[];
            const { setAsMain } = req.body; // 是否設為主要圖片
            
            if (!files || files.length === 0) {
                return res.status(400).json(
                    ApiResponse.error("No files uploaded")
                );
            }

            const uploadResults = await Promise.all(
                files.map(async (file, index) => {
                    const fileName = `${Date.now()}-${file.originalname}`;
                    const filePath = `hotels/${hotelId}/${fileName}`;

                    // const { data, error } = await supabase.storage
                    //     .from('hotel-images')
                    //     .upload(filePath, file.buffer, {
                    //         contentType: file.mimetype,
                    //     });

                    // if (error) throw error;

                    // const { data: { publicUrl } } = supabase.storage
                    //     .from('hotel-images')
                    //     .getPublicUrl(filePath);

                    // return {
                    //     url: publicUrl,
                    //     path: filePath,
                    //     main: setAsMain === 'true' && index === 0 // 只將第一張設為主要圖片（如果要求的話）
                    // };
                })
            );

            // 獲取現有圖片
            const hotel = await db
                .select({ images: hotels.images })
                .from(hotels)
                .where(eq(hotels.id, hotelId))
                .then(rows => rows[0]);

            let newImages = [...(hotel?.images || [])];

            // 如果有新的主要圖片，移除舊的主要圖片標記
            // if (uploadResults.some(img => img.main)) {
            //     newImages = newImages.map(img => ({...img, main: false}));
            // }

            // // 合併新舊圖片
            // newImages = [...newImages, ...uploadResults];

            // // 更新飯店圖片
            // await db
            //     .update(hotels)
            //     .set({
            //         images: newImages,
            //         updatedAt: new Date()
            //     })
            //     .where(eq(hotels.id, hotelId));

            // res.json(ApiResponse.success(uploadResults));
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json(ApiResponse.error("上傳照片失敗"));
        }
    }
}

export const hotelController = new HotelController();
