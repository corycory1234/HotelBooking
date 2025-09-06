import { Request, Response } from "express";
import { db } from "../db";
import { roomBasicTypes } from "../db/schema/roomBasicTypes";

export const getRoomBasicTypes = async (req: Request, res: Response) => {
    try {
        const types = await db.select().from(roomBasicTypes);
        res.status(200).json(types);
    } catch (error) {
        console.error("Error fetching room basic types:", error);
        res.status(500).json({ 
            message: "無法獲取房型資料",
            error: error instanceof Error ? error.message : "未知錯誤"
        });
    }
};
