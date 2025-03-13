import { Metadata } from "next";
interface metaHotelId_Interface {
  params: {
    id?: string; // 想拿的 飯店params.id
    // [key: string]: any;   // 其他參數也可以放這裡
  };
};

// 2. 透過 generateMetadata, 取得「Sever組件的 params參數」
export async function generateMetadata({ params }: metaHotelId_Interface): Promise<Metadata> {
  // 2.1 從 URL 取得參數
  // console.log(params.id);

  // 2.2 如果想要後端 API (Supabase / Node.js) 回傳更精準的 Keyword，可在這裡 fetch
  const hotel_Detail_Url = process.env.NEXT_PUBLIC_API_BASE_URL + `/hotels/${params.id}`;
  const res = await fetch(hotel_Detail_Url, {
    // 也可{ cache: "no-store" } 不緩存
  });
  const data = await res.json();

  // 2.3 回傳 Metadata
  return {
    // title: `GoTour | ${finalKeyword}`,
    title: `${data.data.hotel_Name}`,
    description: `${data.data.hotel_Name}`,
  };
}

export default function Hotel_Detail_Layout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <div className="lg:min-h-screen">
      {children}
    </div>
  );
}
