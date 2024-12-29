// 1. ranking 之 TS問題 尚未解決
export default function StarRating ({ ranking }: {ranking: number}) {
  
  return <>
  <div className="flex">
      {Array.from({ length: ranking }, (_, index) => (
        <img
          key={index}
          src="/home/Star.svg"
          alt="Star"
          className="w-[7px]"
        />
      ))}
    </div>
  
  </>
}