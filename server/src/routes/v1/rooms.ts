import express from "express";
import { getRoomBasicTypes } from "../../controllers/roomBasicTypes.controller";

const router = express.Router();

router.get("/types", getRoomBasicTypes);

export default router;
