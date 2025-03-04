import Link from "next/link"
import { OtherSVG } from "../client_Svg/client_Svg"
import { useTranslations } from "next-intl"

const footer_List = [
  {name:"Privacy", url:"/privacy"},
  {name:"Cookie Policy", url: "cookie"},
  {name:"About", url: "about"},
]

export default function Footer () {
  // 1. next-intl i18n 翻譯
  const t  = useTranslations("Footer");

  return <div className="hidden lg:flex lg:flex-col lg:gap-4 lg:py-4 lg:bottom-0 lg:border-t lg:border-softGray">
    
    <div className="flex items-center gap-4 ">
      {footer_List.map((item, index) => <Link href={item.url} className="hover:text-primary cursor-pointer"
        key={index}>
        {t (item.name)}</Link>)}
    </div>

    <div className="border-b border-softGray"></div>

    <div className="flex justify-between items-center">
      <p className="text-xs">© Kory and Daniel Group, Inc.</p>
      <div className="flex gap-2">
        <OtherSVG name="fb" className="w-5 h-auto cursor-pointer"></OtherSVG>
        <OtherSVG name="ig" className="w-5 h-auto cursor-pointer"></OtherSVG>
      </div>
    </div>  
  
  </div>
}