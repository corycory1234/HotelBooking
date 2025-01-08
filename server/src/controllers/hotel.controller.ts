import { Request, Response } from "express";
import { db } from "../db";
import { hotels, rooms } from "../db/schema";
import { eq } from "drizzle-orm";
import { ApiResponse } from "../utils/response";

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

    // 獲取飯店房型
    async getHotelRooms(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const hotelRooms = await db
                .select()
                .from(rooms)
                .where(eq(rooms.hotelId, id));

            res.json(ApiResponse.success(hotelRooms));
        } catch (error) {
            res.status(500).json(ApiResponse.error((error as Error).message));
        }
    }

    // 新增飯店
    // async createHotel(req: Request, res: Response) {
    //     try {
    //         const {
    //             name,
    //             description,
    //             address,
    //             latitude,
    //             longitude,
    //             amenities,
    //         } = req.body;

    //         const newHotel = await db
    //             .insert(hotels)
    //             .values({
    //                 name,
    //                 description,
    //                 address,
    //                 latitude,
    //                 longitude,
    //                 amenities,
    //             })
    //             .returning();

    //         res.status(201).json(ApiResponse.success(newHotel[0]));
    //     } catch (error) {
    //         res.status(500).json(ApiResponse.error((error as Error).message));
    //     }
    // }
}

export const hotelController = new HotelController();
