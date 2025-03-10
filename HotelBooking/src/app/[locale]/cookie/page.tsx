import Cookie_Policy_Json from "@/fakeData/cookie_Policy.json"
import { useTranslations } from "next-intl";

export default function Cookie () {
  const { title, effectiveDate, introduction, sections, contact } = Cookie_Policy_Json.cookiePolicy;
  const t = useTranslations("CookiePolicy");

  return <>

  <div className="flex flex-col gap-2 px-10 pt-20 overflow-y-auto">
      <h2 className="text-xl font-bold">{t (title)}</h2>
      <p className="text-xs text-gray">{t ("Effective Date")}: {effectiveDate}</p>
      <div className="border-b-2 border-softGray"></div>

      <p className="text-lg font-semibold">{t ("Introduction")}:</p>
      <p>{t (introduction)}</p>

      <ul className="flex flex-col gap-4">
        {sections.map((section, index) => (
          <li key={index} className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">{index +1 + "."} {t (section.title)}</h2>
            <p className="text-gray-700">{t (section.content)}</p>
            <div className="border-b-2 border-softGray"></div>
          </li>
        ))}
      </ul>

      <div className="py-4">
        <h2 className="text-lg font-semibold">{t ("Contact Us")}</h2>
        <p className="text-sm text-gray-600">{t ("Email")}: { contact.email}</p>
        <p className="text-sm text-gray-600">{t ("Phone")}: { contact.phone}</p>
      </div>
  </div>

  </>
}