"use client";
import dynamic from "next/dynamic";
import exp from "node:constants";
import React from "react";
import InlineSVG from "react-inlinesvg";

// 關閉 SSR 避免錯誤
const InlineSVGNoSSR = dynamic(() => import("react-inlinesvg"), {
  ssr: false,
});

interface SVG_Interface {
  name: string;      // 例如 "bar"
  className?: string;
  fill?: string,
  onMouseEnter?: React.MouseEventHandler<SVGSVGElement>,
  onMouseLeave?: React.MouseEventHandler<SVGSVGElement>
}

// 1. Public資料 > Facility資料 之SVG
export function FacilitySVG({ name, className }: SVG_Interface) {
  // 假設放在 /public/facility/bar.svg
  const src = `/facility/${name}.svg`;

  return (
    <InlineSVGNoSSR src={src} className={className} 
      // loader={<span>Loading...</span>} 
    />
  );
};

// 2. Public資料 > Home資料 之SVG
export function HomeSVG({name, className }: SVG_Interface) {
  const src = `/home/${name}.svg`;

  return (
    <InlineSVGNoSSR src={src} className={className} 
      // loader={<span>Loading...</span>} 
    />
  )
}

// 3. Public資料 > otherSvg資料 之SVG
export function OtherSVG({name, className }: SVG_Interface) {
  const src = `/otherSvg/${name}.svg`;

  return (
    <InlineSVGNoSSR src={src} className={className} 
      // loader={<span>Loading...</span>} 
    />
  )
};

// 4. Public資料 > dashboardsvg資料 之 SVG
export function DashboardSVG({name, className}: SVG_Interface) {
  const src = `/dashboardsvg/${name}.svg`;

  return (
    <InlineSVGNoSSR src={src} className={className} 
      // loader={<span>Loading...</span>} 
    />
  )
}

// 5. Public資料 > profilte資料 之 SVG
export function ProfileSVG({name, className}: SVG_Interface) {
  const src = `/profile/${name}.svg`;
  
  return (
    <InlineSVGNoSSR src={src} className={className}
      // loader={<span>Loading...</span>} 
    />
  )
}

// 6. Public資料 > starrating資料 之 SVG (5星評論)
export function FiveStarSVG ({name, className, fill, onMouseEnter, onMouseLeave }: SVG_Interface) {
  const src= `/starrating/${name}.svg`;
  
  return <InlineSVGNoSSR src={src} className={className} fill={fill} onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
      // loader={<span>Loading...</span>} 
    />
  
}