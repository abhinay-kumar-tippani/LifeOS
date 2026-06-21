"use client";

import { memo } from "react";

interface Props {
  url: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
}

function getOptimizedUrl(url: string, w: number, h: number) {
  if (!url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/w_${w},h_${h},c_fill,f_auto,q_auto/`);
}

export const CloudinaryImage = memo(function CloudinaryImage({ url, width, height, alt, className }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={getOptimizedUrl(url, width, height)}
      width={width}
      height={height}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
});
