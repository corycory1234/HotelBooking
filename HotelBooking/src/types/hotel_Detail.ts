// 1. 飯店明細
export interface Hotel_Detail_Interface {
  id: string,
  name: string,
  images: {url: string, description: string}[],
  distance: string,
  rating: number | null,
  facilities: string[],
  price: number | null,
  intro: string[],
  reviews: {
    id: string, 
    name: string, 
    date: string, 
    rating: number, 
    comment: string }[]
}