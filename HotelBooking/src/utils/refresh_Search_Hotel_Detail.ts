// 1. F5刷新 - 搜尋參數之型別(飯店列表)
export interface Search_Params_Interface {
  destination: string,
  dateRange: string,
  date_Start: string, // 請依需求替換
  date_End: string,   
  room?: string;
  adult?: string;
  child?: string;
  rangeslider?: string;
  rating?: string;
  bedType?: string[];
  facility?: string[];
};

// 2. F5刷新 - 搜尋函式(飯店列表)
export const Refresh_Search_Hotel_Detail = (params: Search_Params_Interface) => {
  const timestamp = + new Date();
  return new URLSearchParams({
    destination: params.destination,
    dateRange: params.dateRange,
    date_Start: params.date_Start, // 請依需求替換
    date_End: params.date_End,       // 請依需求替換
    room: params.room || "",
    adult: params.adult || "",
    child: params.child || "",
    rangeslider: params.rangeslider || "",
    rating: params.rating || "",
    bedtype: params.bedType ? params.bedType.join(",") : "",
    facility: params.facility ? params.facility.join(",") : "",
    timestamp: String(timestamp),
  }).toString();
};