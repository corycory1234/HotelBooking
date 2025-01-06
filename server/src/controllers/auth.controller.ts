import { Request, Response } from "express";
import { supabase } from "../db";

export const authController = {
    // 註冊
    async register(req: Request, res: Response) {
        try {
            const { email, password, name } = req.body;

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            res.status(201).json({
                status: "success",
                data,
            });
        } catch (error) {
            res.status(400).json({
                status: "error",
                message: (error as Error).message,
            });
        }
    },

    // 登入
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            console.log(data);
            

            res.json({
                status: "success",
                data,
            });
        } catch (error) {
            res.status(400).json({
                status: "error",
                message: (error as Error).message,
            });
        }
    },
};
