import { useEffect, useState } from "react";
import { ImagePlaceholder } from "./ImagePlaceholder";

type ProductImageProps = {
  src?: string;
  alt?: string;
  className?: string;
};

export const ProductImage = ({
  src,
  alt = "Product Image",
  className,
}: ProductImageProps) => {
  const [imageToShow, setImageToShow] = useState<JSX.Element>(<></>);

  useEffect(() => {
    const img = new Image();
    img.src = src || "";
    img.alt = alt;
    img.className = className || "";

    img.onload = () => {
      setImageToShow(
        <img src={src} alt={alt} className="w-40 h-40 object-cover rounded" />
      );
    };

    img.onerror = () => {
      setImageToShow(<ImagePlaceholder />);
    };
  }, [src, alt, className]);

  return imageToShow;
};
