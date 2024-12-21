// 1. 位處該路由, SVG圖片亮Primary色, 還沒處理完
'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  {name: 'Home', Imgurl: '/home/menu/Home.svg', url: "/"},
  {name: 'Search', Imgurl: '/home/menu/Search.svg', url: "/search"},
  {name: 'Trip', Imgurl: '/home/menu/Trip.svg', url: "/trip"},
  {name: 'Offers', Imgurl: '/home/menu/Offer.svg', url: "/offers"},
  {name: 'Profile', Imgurl: '/home/menu/Profile.svg', url: "/profile"},
]

export default function Menu () {
  const pathName = usePathname();

  return <>
    <div className="bg-white flex justify-between p-4 fixed bottom-0 left-0 right-0 z-10">
      {menu.map((item, index) => 
        <Link href={`${item.url}`} className="flex flex-col justify-center items-center gap-2" key={index}>
          <img src={item.Imgurl} alt="" className={`${item.url === pathName ? 'text-primary' : ''}`}/>
          <p className={`text-xs ${item.url === pathName ? 'text-primary' : ''}`}>{item.name}</p>
        </Link>
      )}
    </div>
  
  </>
}