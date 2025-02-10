import { Request, Response } from 'express';
import { db } from '../db';
import { hotels } from '../db/schema';
import { eq } from 'drizzle-orm';
import { ApiResponse } from '../utils/response';
import { CreateHotelDTO, SearchHotelsParams } from '../types/hotel.types';
import { hotelService } from '../services/hotel.service';

class HotelController {
    // 搜尋飯店列表
    async getHotels(req: Request, res: Response) {
        try {
            // 驗證必填參數
            const page = parseInt(req.query.page as string);

            if (!page || isNaN(page)) {
                return res.status(400).json(
                    ApiResponse.error("頁碼(page)為必填參數")
                );
            }

            const searchParams: SearchHotelsParams = {
                page,
                limit: 10, // 固定為 10 筆
                country: req.query.country as string || undefined,
                city: req.query.city as string || undefined,
                minPrice: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
                maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
                rating: req.query.rating ? parseInt(req.query.rating as string) : undefined,
                searchQuery: req.query.q as string || undefined
            };

            const results = await hotelService.searchHotels(searchParams);
            res.json(ApiResponse.success(results));
        } catch (error) {
            console.error('Get hotels error:', error);
            res.status(500).json(ApiResponse.error(
                error instanceof Error ? error.message : '搜尋飯店失敗'
            ));
        }
    }

    // 獲取飯店詳情
    async getHotel(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const hotel = await hotelService.getHotelDetails(id);
            res.json(ApiResponse.success(hotel));
        } catch (error) {
            console.error('Get hotel error:', error);
            if (error instanceof Error && 'code' in error) {
                return res.status((error as any).code).json(
                    ApiResponse.error(error.message)
                );
            }
            res.status(500).json(ApiResponse.error(
                error instanceof Error ? error.message : '獲取飯店詳情失敗'
            ));
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
