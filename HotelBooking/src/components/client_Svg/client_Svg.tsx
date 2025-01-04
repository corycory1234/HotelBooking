"use client";
import dynamic from "next/dynamic";
import React from "react";
import InlineSVG from "react-inlinesvg";

// 關閉 SSR 避免錯誤
const InlineSVGNoSSR = dynamic(() => import("react-inlinesvg"), {
  ssr: false,
});

interface Props {
  name: string;      // 例如 "bar"
  className?: string;
}

export default function FacilitySVG({ name, className }: Props) {
  // 假設放在 /public/facility/bar.svg
  const src = `/facility/${name}.svg`;

  return (
    <InlineSVGNoSSR src={src} className={className} loader={<span>Loading...</span>} />
  );
}