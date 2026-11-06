'use client';

import { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface Props {
  src: string;
  alt: string;
  className: string;
}

// 圖片是外部任意網域的 URL，部分商品沒有圖或連結失效，所以不用 next/image，缺圖時給佔位
export default function ProductImage({ src, alt, className }: Props) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div className={`${className} flex items-center justify-center text-gray-400`}>
        <PhotoIcon className="h-12 w-12" aria-hidden="true" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} onError={() => setBroken(true)} />;
}
