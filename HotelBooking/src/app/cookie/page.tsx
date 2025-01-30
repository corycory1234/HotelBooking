import Cookie_Policy_Json from "@/fakeData/cookie_Policy.json"

export default function Cookie () {
  const { title, effectiveDate, introduction, sections, contact } = Cookie_Policy_Json.cookiePolicy;


  return <>

  <div className="flex flex-col gap-2 p-10 overflow-y-auto">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-xs text-gray">Effective Date: {effectiveDate}</p>
      <div className="border-b-2 border-softGray"></div>

      <p className="text-lg font-semibold">Introduction:</p>
      <p>{introduction}</p>

      <ul className="flex flex-col gap-4">
        {sections.map((section, index) => (
          <li key={index} className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="text-gray-700">{section.content}</p>
            <div className="border-b-2 border-softGray"></div>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Contact Us</h2>
        <p className="text-sm text-gray-600">Email: {contact.email}</p>
        <p className="text-sm text-gray-600">Phone: {contact.phone}</p>
      </div>
  </div>

  </>
}