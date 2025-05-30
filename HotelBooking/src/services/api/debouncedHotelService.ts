import { DebouncedHotel } from "@/types/debouncedHotel";

// 1. URL - Query參數
interface SearchParams {
  q: string;
  city?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
  ratings?: string;
  facilities?: string[];
  bedTypes?: string;
  page?: number;
};

export async function fetchDebouncedHotels (params: SearchParams): Promise<DebouncedHotel[]> {
  const query_Params = new URLSearchParams({
    page: String(params.page ?? 1),
    city: params.city ?? "",
    country: params.country ?? "",
    minPrice: String(params.minPrice ?? ""),
    maxPrice: String(params.maxPrice ?? ""),
    ratings: String(params.ratings ?? ""),
    q: params.q,
    facilities: (params.facilities ?? []).join(","),
    bedTypes: params.bedTypes ?? "",
  }).toString();
  
  const hotel_List_Url = process.env.NEXT_PUBLIC_API_BASE_URL + `/hotels?${query_Params}`;
  const response = await fetch(hotel_List_Url, {
    method: "GET",
    headers: {"Content-Type": "application/json"},
    credentials: "include"
  });
  
  if(!response.ok) {throw new Error(`伺服器錯誤`)};
  const result = await response.json();
  return result.data.data;
}