"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotelService = exports.HotelService = void 0;
const base_service_1 = require("./base.service");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_1 = require("../utils/s3");
class HotelServiceError extends Error {
    constructor(message, code = 500) {
        super(message);
        this.code = code;
        this.name = 'HotelServiceError';
    }
}
class HotelService extends base_service_1.BaseService {
    createHotel(hotelData, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!token) {
                    throw new HotelServiceError('未提供認證信息', 401);
                }
                const { data: { user }, error: authError, } = yield this.supabase.auth.getUser(token);
                if (authError || !user) {
                    throw new HotelServiceError('無效的認證信息', 401);
                }
                return yield db_1.db.transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d, _e;
                    try {
                        // 新增飯店 - 確保資料型別正確
                        const [newHotel] = yield tx.insert(schema_1.hotels).values({
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
                            tax: (_a = hotelData.tax) === null || _a === void 0 ? void 0 : _a.toString(),
                            checkin: hotelData.checkin,
                            checkout: hotelData.checkout,
                            latitude: (_b = hotelData.latitude) === null || _b === void 0 ? void 0 : _b.toString(),
                            longitude: (_c = hotelData.longitude) === null || _c === void 0 ? void 0 : _c.toString(),
                            isOpen: (_d = hotelData.isOpen) !== null && _d !== void 0 ? _d : true,
                            hotelPhone: hotelData.hotelPhone,
                            hotelEmail: hotelData.hotelEmail,
                            cancellationPolicy: hotelData.cancellationPolicy,
                            transportation: hotelData.transportation,
                            recommendation: hotelData.recommendation,
                            isCollected: (_e = hotelData.isCollected) !== null && _e !== void 0 ? _e : false,
                            offerId: hotelData.offerId,
                            ownerId: user.id
                        }).returning();
                        // 新增房型 - 確保資料型別正確
                        const roomPromises = hotelData.roomTypeList.map(room => tx.insert(schema_1.roomTypes).values({
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
                        }).returning());
                        const createdRooms = yield Promise.all(roomPromises);
                        return {
                            hotel: newHotel,
                            rooms: createdRooms.map(room => room[0])
                        };
                    }
                    catch (txError) {
                        console.error('Transaction error:', txError);
                        throw new HotelServiceError('建立飯店資料失敗', 500);
                    }
                }));
            }
            catch (error) {
                console.error('CreateHotel error:', error);
                if (error instanceof HotelServiceError) {
                    throw error;
                }
                throw new HotelServiceError(error instanceof Error ? error.message : '未知錯誤', 500);
            }
        });
    }
    validateHotelData(data) {
        var _a;
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
        if (!((_a = data.roomTypeList) === null || _a === void 0 ? void 0 : _a.length)) {
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
    cleanFileName(fileName) {
        return fileName
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9.-]/g, '-')
            .replace(/-{2,}/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    // 通用的上傳圖片方法
    uploadImages(files, path) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () {
                const cleanedFileName = this.cleanFileName(file.originalname);
                const fileName = `${Date.now()}-${cleanedFileName}`;
                const filePath = `${path}/${fileName}`;
                const command = new client_s3_1.PutObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: filePath,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                    ACL: 'public-read'
                });
                yield s3_1.s3Client.send(command);
                return {
                    url: process.env.S3_DOMAIN + filePath
                };
            })));
        });
    }
    // 從 S3 刪除檔案
    deleteFromS3(fileUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = fileUrl.replace(process.env.S3_DOMAIN, '');
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: key
            });
            yield s3_1.s3Client.send(command);
        });
    }
    // 上傳飯店照片
    uploadHotelImages(hotelId, files, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: { user }, error: authError } = yield this.supabase.auth.getUser(token);
            if (authError || !user) {
                throw new HotelServiceError('未授權的存取', 401);
            }
            const hotel = yield db_1.db
                .select({ hotelImageList: schema_1.hotels.hotelImageList })
                .from(schema_1.hotels)
                .where((0, drizzle_orm_1.eq)(schema_1.hotels.id, hotelId))
                .then(rows => rows[0]);
            if (!hotel) {
                throw new HotelServiceError('飯店不存在', 404);
            }
            const uploadResults = yield this.uploadImages(files, `hotels/${hotelId}`);
            const newImages = [
                ...(hotel.hotelImageList || []),
                ...uploadResults.map(image => (Object.assign(Object.assign({}, image), { description: '' })))
            ];
            yield db_1.db
                .update(schema_1.hotels)
                .set({
                hotelImageList: newImages,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(schema_1.hotels.id, hotelId));
            return uploadResults;
        });
    }
    // 刪除飯店照片
    deleteHotelImages(hotelId, imageUrls, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: { user }, error: authError } = yield this.supabase.auth.getUser(token);
            if (authError || !user) {
                throw new HotelServiceError('未授權的存取', 401);
            }
            const hotel = yield db_1.db
                .select()
                .from(schema_1.hotels)
                .where((0, drizzle_orm_1.eq)(schema_1.hotels.id, hotelId))
                .then(rows => rows[0]);
            if (!hotel) {
                throw new HotelServiceError('飯店不存在', 404);
            }
            if (hotel.ownerId !== user.id) {
                throw new HotelServiceError('無權限刪除照片', 403);
            }
            // 過濾出要保留的照片
            const updatedImages = (hotel.hotelImageList || []).filter((img) => !imageUrls.includes(img.url));
            // 更新資料庫
            yield db_1.db
                .update(schema_1.hotels)
                .set({
                hotelImageList: updatedImages,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(schema_1.hotels.id, hotelId));
            // 從 S3 刪除檔案
            yield Promise.all(imageUrls.map(url => this.deleteFromS3(url)));
        });
    }
    // 上傳房型照片
    uploadRoomTypeImages(roomTypeId, files, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: { user }, error: authError } = yield this.supabase.auth.getUser(token);
            if (authError || !user) {
                throw new HotelServiceError('未授權的存取', 401);
            }
            const roomType = yield db_1.db
                .select()
                .from(schema_1.roomTypes)
                .where((0, drizzle_orm_1.eq)(schema_1.roomTypes.id, roomTypeId))
                .then(rows => rows[0]);
            if (!roomType) {
                throw new HotelServiceError('房型不存在', 404);
            }
            const uploadResults = yield this.uploadImages(files, `room-types/${roomTypeId}`);
            const newImages = [
                ...(roomType.roomTypeImageList || []),
                ...uploadResults.map(image => (Object.assign(Object.assign({}, image), { description: '' })))
            ];
            yield db_1.db
                .update(schema_1.roomTypes)
                .set({
                roomTypeImageList: newImages,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(schema_1.roomTypes.id, roomTypeId));
            return uploadResults;
        });
    }
    // 刪除房型照片
    deleteRoomTypeImages(roomTypeId, imageUrls, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: { user }, error: authError } = yield this.supabase.auth.getUser(token);
            if (authError || !user) {
                throw new HotelServiceError('未授權的存取', 401);
            }
            const roomType = yield db_1.db
                .select()
                .from(schema_1.roomTypes)
                .where((0, drizzle_orm_1.eq)(schema_1.roomTypes.id, roomTypeId))
                .then(rows => rows[0]);
            if (!roomType) {
                throw new HotelServiceError('房型不存在', 404);
            }
            if (roomType.createdBy !== user.id) {
                throw new HotelServiceError('無權限刪除照片', 403);
            }
            // 過濾出要保留的照片
            const updatedImages = (roomType.roomTypeImageList || []).filter((img) => !imageUrls.includes(img.url));
            // 更新資料庫
            yield db_1.db
                .update(schema_1.roomTypes)
                .set({
                roomTypeImageList: updatedImages,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(schema_1.roomTypes.id, roomTypeId));
            // 從 S3 刪除檔案
            yield Promise.all(imageUrls.map(url => this.deleteFromS3(url)));
        });
    }
    searchHotels(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const page = Math.max(1, params.page);
                const limit = Math.min(50, Math.max(1, params.limit)); // 確保在 1-50 之間
                const offset = (page - 1) * limit;
                let query = db_1.db.select().from(schema_1.hotels);
                // 建立搜尋條件
                const conditions = [];
                if ((_a = params.city) === null || _a === void 0 ? void 0 : _a.trim()) {
                    conditions.push((0, drizzle_orm_1.sql) `${schema_1.hotels.city} ILIKE ${`%${params.city.trim()}%`}`);
                }
                if (params.minPrice && params.minPrice > 0) {
                    conditions.push((0, drizzle_orm_1.sql) `CAST(${schema_1.hotels.price} AS DECIMAL) >= ${params.minPrice}`);
                }
                if (params.maxPrice && params.maxPrice > 0) {
                    conditions.push((0, drizzle_orm_1.sql) `CAST(${schema_1.hotels.price} AS DECIMAL) <= ${params.maxPrice}`);
                }
                if (params.rating && params.rating > 0) {
                    conditions.push((0, drizzle_orm_1.sql) `CAST(${schema_1.hotels.totalRating} AS DECIMAL) >= ${params.rating}`);
                }
                if ((_b = params.searchQuery) === null || _b === void 0 ? void 0 : _b.trim()) {
                    conditions.push((0, drizzle_orm_1.sql) `(
                    ${schema_1.hotels.hotelName} ILIKE ${`%${params.searchQuery.trim()}%`} OR 
                    ${schema_1.hotels.address} ILIKE ${`%${params.searchQuery.trim()}%`}
                )`);
                }
                // 加入搜尋條件
                if (conditions.length > 0) {
                    query = query.where((0, drizzle_orm_1.sql) `${(0, drizzle_orm_1.and)(...conditions)}`);
                }
                // 計算總數
                const totalQuery = db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_1.hotels);
                if (conditions.length > 0) {
                    totalQuery.where((0, drizzle_orm_1.sql) `${(0, drizzle_orm_1.and)(...conditions)}`);
                }
                const [{ count }] = yield totalQuery;
                // 加入分頁並執行查詢
                const results = yield query
                    .orderBy(schema_1.hotels.createdAt)
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
            }
            catch (error) {
                console.error('Search hotels error:', error);
                throw new HotelServiceError('搜尋飯店失敗', 500);
            }
        });
    }
    getHotelDetails(hotelId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 獲取飯店基本資訊和房型
                const hotel = yield db_1.db
                    .select({
                    hotel: schema_1.hotels,
                    rooms: schema_1.roomTypes
                })
                    .from(schema_1.hotels)
                    .leftJoin(schema_1.roomTypes, (0, drizzle_orm_1.eq)(schema_1.hotels.id, schema_1.roomTypes.hotelId))
                    .where((0, drizzle_orm_1.eq)(schema_1.hotels.id, hotelId))
                    .then(rows => {
                    if (rows.length === 0) {
                        throw new HotelServiceError('飯店不存在', 404);
                    }
                    // 整理資料結構
                    const hotelInfo = rows[0].hotel;
                    const roomsList = rows
                        .filter(row => row.rooms !== null)
                        .map(row => row.rooms);
                    return Object.assign(Object.assign({}, hotelInfo), { roomTypes: roomsList });
                });
                return hotel;
            }
            catch (error) {
                console.error('Get hotel details error:', error);
                if (error instanceof HotelServiceError) {
                    throw error;
                }
                throw new HotelServiceError(error instanceof Error ? error.message : '獲取飯店詳情失敗', 500);
            }
        });
    }
}
exports.HotelService = HotelService;
exports.hotelService = new HotelService();
