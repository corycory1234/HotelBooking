import { HomeSVG } from "../client_Svg/client_Svg";

interface Props {
  rating: number;
  className?: string;
}

export function Customer_Rating({ rating, className }: Props) {
  return (
    <div className="flex">
      {Array.from({ length: rating }).map((_, index) => (
        <HomeSVG
          key={index} // React需要唯一的key
          name="Star" // 這裡的 `name` 是你 SVG 文件的名稱，例如 "star"
          className={className}
        />
      ))}
    </div>
  );
}