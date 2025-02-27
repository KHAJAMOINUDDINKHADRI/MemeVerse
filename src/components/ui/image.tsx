import NextImage from "next/image";
import { cn } from "@/lib/utils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function Image({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  ...props
}: ImageProps) {
  const isBase64Image = src.startsWith("data:");

  if (isBase64Image) {
    // We intentionally use img tag for base64 images as they cannot be optimized by Next.js
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        className={cn("transition-all duration-300", className)}
        {...props}
      />
    );
  }

  // For remote URLs, use Next.js Image component
  return (
    <NextImage
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={cn("transition-all duration-300", className)}
      priority={priority}
    />
  );
}
