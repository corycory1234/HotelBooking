export default async function Refresh_Token () {
  const refresh_Token_Url = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/refresh-token";
  const respone = await fetch(refresh_Token_Url, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    credentials: "include"
  });
  if(!respone.ok) {throw new Error("SERVER ERROR~~!")};
  const result = await respone.json();
  console.log(result, "重刷Token 之 API返回");
}