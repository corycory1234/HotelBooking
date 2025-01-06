import { Hotel_Detail_Interface } from "@/types/hotel_Detail";

export const create_Initial_HotelDetail = (): Hotel_Detail_Interface => ({
  id: "",
  name: "",
  images: [{ url: "", description: "" }],
  distance: "",
  rating: null,
  facilities: [],
  price: null,
  intro: [],
  reviews: [
    {
      id: "",
      name: "",
      date: "",
      rating: 0,
      comment: ""
    }
  ],
  address: "",
  roomType: [
    { id: "", roomType: "singleRoom", price: 0, images: [{ url: "", description: "" }], availability: 0 },
    { id: "", roomType: "doubleRoom", price: 0, images: [{ url: "", description: "" }], availability: 0 }
  ]
});