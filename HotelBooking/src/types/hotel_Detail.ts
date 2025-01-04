// 1. 飯店明細
export interface Hotel_Detail_Interface {
  id: string,
  name: string,
  images: {url: string, description: string}[],
  distance: string,
  rating: number,
  facilities: string[],
  price: number,
  intro: string[]
}