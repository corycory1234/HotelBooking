import { Request, Response } from 'express';
import { db } from '../db';
import { hotels } from '../db/schema';
import { eq } from 'drizzle-orm';
import { ApiResponse } from '../utils/response';
import { CreateHotelDTO } from '../types/hotel.types';
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
            const token = req.cookies?.access_token;  // 改回使用 cookies
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
            const token = req.cookies?.access_token;
            const { roomTypeId } = req.params;
            const files = req.files as Express.Multer.File[];
            
            if (!files || files.length === 0) {
                return res.status(400).json(ApiResponse.error("請選擇要上傳的照片"));
            }

            const results = await hotelService.uploadRoomTypeImages(roomTypeId, files, token);
            res.json(ApiResponse.success(results));
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json(ApiResponse.error(
                error instanceof Error ? error.message : "上傳照片失敗"
            ));
        }
    }

    // 刪除飯店照片
    async deleteHotelImages(req: Request, res: Response) {
        try {
            const token = req.cookies?.access_token;
            const { hotelId } = req.params;
            const { imageUrls } = req.body;

            if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
                return res.status(400).json(ApiResponse.error("請提供要刪除的照片 URL"));
            }

            await hotelService.deleteHotelImages(hotelId, imageUrls, token);
            res.json(ApiResponse.success({ message: "照片刪除成功" }));
        } catch (error) {
            console.error('Delete images error:', error);
            res.status(500).json(ApiResponse.error(
                error instanceof Error ? error.message : "刪除照片失敗"
            ));
        }
    }

    // 刪除房型照片
    async deleteRoomTypeImages(req: Request, res: Response) {
        try {
            const token = req.cookies?.access_token;
            const { roomTypeId } = req.params;
            const { imageUrls } = req.body;

            if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
                return res.status(400).json(ApiResponse.error("請提供要刪除的照片 URL"));
            }

            await hotelService.deleteRoomTypeImages(roomTypeId, imageUrls, token);
            res.json(ApiResponse.success({ message: "照片刪除成功" }));
        } catch (error) {
            console.error('Delete images error:', error);
            res.status(500).json(ApiResponse.error(
                error instanceof Error ? error.message : "刪除照片失敗"
            ));
        }
    }

    // 清理檔案名稱
    private static cleanFileName(fileName: string): string {
        return fileName
            .normalize('NFD')                     // 分解重音字符
            .replace(/[\u0300-\u036f]/g, '')     // 移除重音符號
            .replace(/[^a-zA-Z0-9.-]/g, '-')     // 替換特殊字元為連字符
            .replace(/-{2,}/g, '-')              // 移除多餘的連字符
            .replace(/^-+|-+$/g, '');            // 移除開頭和結尾的連字符
    }

    // 上傳飯店照片
    async uploadHotelImages(req: Request, res: Response) {
        try {
            const token = req.cookies?.access_token;
            const { hotelId } = req.params;
            const files = req.files as Express.Multer.File[];
            
            if (!files || files.length === 0) {
                return res.status(400).json(ApiResponse.error("請選擇要上傳的照片"));
            }

            const results = await hotelService.uploadHotelImages(hotelId, files, token);
            res.json(ApiResponse.success(results));
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json(ApiResponse.error(
                error instanceof Error ? error.message : "上傳照片失敗"
            ));
        }
    }
}

export const hotelController = new HotelController();
