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
                            hotel_Name: hotelData.hotel_Name,
                            hotel_Image_List: hotelData.hotel_Image_List || [],
                            distance: hotelData.distance,
                            totalRating: hotelData.totalRating.toString(),
                            facility_List: hotelData.facility_List || [],
                            price: hotelData.price.toString(),
                            hotel_Intro: hotelData.hotel_Intro,
                            review_List: (hotelData.review_List || []).map(review => ({
                                traveler_Id: review.traveler_Id,
                                traveler_Name: review.traveler_Name,
                                date: review.date,
                                traveler_Rating: review.traveler_Rating,
                                comment: review.comment,
                                reply: review.reply
                            })),
                            address: hotelData.address,
                            country: hotelData.country,
                            city: hotelData.city,
                            tax: (_a = hotelData.tax) === null || _a === void 0 ? void 0 : _a.toString(),
                            checkin: hotelData.checkin,
                            checkout: hotelData.checkout,
                            latitude: (_b = hotelData.latitude) === null || _b === void 0 ? void 0 : _b.toString(),
                            longitude: (_c = hotelData.longitude) === null || _c === void 0 ? void 0 : _c.toString(),
                            is_Open: (_d = hotelData.is_Open) !== null && _d !== void 0 ? _d : true,
                            hotel_Phone: hotelData.hotel_Phone,
                            hotel_Email: hotelData.hotel_Email,
                            cancellation_Policy: hotelData.cancellation_Policy,
                            transportation: hotelData.transportation,
                            recommendation: hotelData.recommendation,
                            isCollected: (_e = hotelData.isCollected) !== null && _e !== void 0 ? _e : false,
                            offer_Id: hotelData.offer_Id,
                            owner_Id: user.id
                        }).returning();
                        // 新增房型 - 確保資料型別正確
                        const roomPromises = hotelData.roomType_List.map(room => tx.insert(schema_1.roomTypes).values({
                            room_Type: room.room_Type,
                            room_Price: room.room_Price.toString(),
                            roomType_Image_List: room.roomType_Image_List || [],
                            room_Availability: room.room_Availability,
                            smoke: room.smoke,
                            amenity_List: room.amenity_List || [],
                            room_Size: room.room_Size.toString(),
                            max_People: room.max_People,
                            view: room.view,
                            bed_Type: room.bed_Type,
                            hotelId: newHotel.hotel_Id,
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
        if (!data.hotel_Name) {
            return { isValid: false, error: "飯店名稱為必填" };
        }
        if (!data.address) {
            return { isValid: false, error: "地址為必填" };
        }
        if (!data.country || !data.city) {
            return { isValid: false, error: "國家和城市為必填" };
        }
        if (!data.hotel_Phone || !data.hotel_Email) {
            return { isValid: false, error: "聯絡資訊為必填" };
        }
        if (data.totalRating < 0 || data.totalRating > 5) {
            return { isValid: false, error: "評分必須在 0-5 之間" };
        }
        if (data.price <= 0) {
            return { isValid: false, error: "價格必須大於 0" };
        }
        if (!((_a = data.roomType_List) === null || _a === void 0 ? void 0 : _a.length)) {
            return { isValid: false, error: "至少需要一個房型" };
        }
        // 驗證每個房型
        for (const room of data.roomType_List) {
            if (!room.room_Type) {
                return { isValid: false, error: "房型名稱為必填" };
            }
            if (room.room_Price <= 0) {
                return { isValid: false, error: "房型價格必須大於 0" };
            }
            if (room.room_Availability <= 0) {
                return { isValid: false, error: "房間數量必須大於 0" };
            }
            if (room.room_Size <= 0) {
                return { isValid: false, error: "房間大小必須大於 0" };
            }
            if (room.max_People <= 0) {
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
                .select({ hotel_Image_List: schema_1.hotels.hotel_Image_List })
                .from(schema_1.hotels)
                .where((0, drizzle_orm_1.eq)(schema_1.hotels.hotel_Id, hotelId));
            const uploadResults = yield this.uploadImages(files, `hotels/${hotelId}`);
            const newImages = [
                ...(hotel[0].hotel_Image_List || []),
                ...uploadResults.map(image => (Object.assign(Object.assign({}, image), { description: '' })))
            ];
            yield db_1.db
                .update(schema_1.hotels)
                .set({
                hotel_Image_List: newImages,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(schema_1.hotels.hotel_Id, hotelId));
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
                .where((0, drizzle_orm_1.eq)(schema_1.hotels.hotel_Id, hotelId))
                .then(rows => rows[0]);
            if (!hotel) {
                throw new HotelServiceError('飯店不存在', 404);
            }
            if (hotel.owner_Id !== user.id) {
                throw new HotelServiceError('無權限刪除照片', 403);
            }
            // 過濾出要保留的照片
            const updatedImages = (hotel.hotel_Image_List || []).filter((img) => !imageUrls.includes(img.url));
            // 更新資料庫
            yield db_1.db
                .update(schema_1.hotels)
                .set({
                hotel_Image_List: updatedImages,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(schema_1.hotels.hotel_Id, hotelId));
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
                .where((0, drizzle_orm_1.eq)(schema_1.roomTypes.roomType_Id, roomTypeId))
                .then(rows => rows[0]);
            if (!roomType) {
                throw new HotelServiceError('房型不存在', 404);
            }
            const uploadResults = yield this.uploadImages(files, `room-types/${roomTypeId}`);
            const newImages = [
                ...(roomType.roomType_Image_List || []),
                ...uploadResults.map(image => (Object.assign(Object.assign({}, image), { description: '' })))
            ];
            yield db_1.db
                .update(schema_1.roomTypes)
                .set({
                roomType_Image_List: newImages,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(schema_1.roomTypes.roomType_Id, roomTypeId));
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
                .where((0, drizzle_orm_1.eq)(schema_1.roomTypes.roomType_Id, roomTypeId))
                .then(rows => rows[0]);
            if (!roomType) {
                throw new HotelServiceError('房型不存在', 404);
            }
            if (roomType.createdBy !== user.id) {
                throw new HotelServiceError('無權限刪除照片', 403);
            }
            // 過濾出要保留的照片
            const updatedImages = (roomType.roomType_Image_List || []).filter((img) => !imageUrls.includes(img.url));
            // 更新資料庫
            yield db_1.db
                .update(schema_1.roomTypes)
                .set({
                roomType_Image_List: updatedImages,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(schema_1.roomTypes.roomType_Id, roomTypeId));
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
                if (params.min_Price && params.min_Price > 0) {
                    conditions.push((0, drizzle_orm_1.sql) `CAST(${schema_1.hotels.price} AS DECIMAL) >= ${params.min_Price}`);
                }
                if (params.max_Price && params.max_Price > 0) {
                    conditions.push((0, drizzle_orm_1.sql) `CAST(${schema_1.hotels.price} AS DECIMAL) <= ${params.max_Price}`);
                }
                if (params.rating && params.rating > 0) {
                    conditions.push((0, drizzle_orm_1.sql) `CAST(${schema_1.hotels.totalRating} AS DECIMAL) >= ${params.rating}`);
                }
                if ((_b = params.search_Query) === null || _b === void 0 ? void 0 : _b.trim()) {
                    conditions.push((0, drizzle_orm_1.sql) `(
                    ${schema_1.hotels.hotel_Name} ILIKE ${`%${params.search_Query.trim()}%`} OR 
                    ${schema_1.hotels.address} ILIKE ${`%${params.search_Query.trim()}%`}
                )`);
                }
                // 加入設施條件 - 修改這部分
                if (params.facilities && params.facilities.length > 0) {
                    // 將設施列表轉換為 PostgreSQL 陣列格式
                    const facilitiesArray = `{${params.facilities.join(',')}}`;
                    conditions.push((0, drizzle_orm_1.sql) `${schema_1.hotels.facility_List} ?& ${facilitiesArray}`);
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
                const hotel = yield db_1.db
                    .select({
                    hotel: schema_1.hotels,
                    rooms: schema_1.roomTypes
                })
                    .from(schema_1.hotels)
                    .leftJoin(schema_1.roomTypes, (0, drizzle_orm_1.eq)(schema_1.hotels.hotel_Id, schema_1.roomTypes.hotelId))
                    .where((0, drizzle_orm_1.eq)(schema_1.hotels.hotel_Id, hotelId))
                    .then(rows => {
                    if (rows.length === 0) {
                        throw new HotelServiceError('飯店不存在', 404);
                    }
                    const hotelInfo = rows[0].hotel;
                    const roomsList = rows
                        .filter(row => row.rooms !== null)
                        .map(row => row.rooms);
                    return Object.assign(Object.assign({}, hotelInfo), { roomType_List: roomsList });
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
