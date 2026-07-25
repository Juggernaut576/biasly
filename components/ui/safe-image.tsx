"use client";

import { useState, useEffect } from "react";

const DEFAULT_FALLBACK =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80";

export function SafeImage({
  src,
  alt,
  className = "",
  fill,
  priority,
  sizes,
  ...props
}: any) {
  const isValidUrl = (url: any): boolean => {
    if (!url || typeof url !== "string" || url.trim().length === 0) return false;
    if (url === "undefined" || url === "null") return false;
    return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
  };

  const [imgSrc, setImgSrc] = useState<string>(() =>
    isValidUrl(src) ? src : DEFAULT_FALLBACK
  );

  useEffect(() => {
    if (isValidUrl(src)) {
      setImgSrc(src);
    } else {
      setImgSrc(DEFAULT_FALLBACK);
    }
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt || "News article"}
      className={`w-full h-full object-cover ${className}`}
      onError={() => {
        if (imgSrc !== DEFAULT_FALLBACK) {
          setImgSrc(DEFAULT_FALLBACK);
        }
      }}
      {...props}
    />
  );
}
