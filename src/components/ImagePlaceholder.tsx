import { Image } from "lucide-react";

export const ImagePlaceholder = () => {
  return (
    <div
      className="
          flex h-full w-full min-w-48 cursor-default flex-col items-center justify-center gap-2 bg-gray-200 rounded"
    >
      <Image className="size-8 text-gray-800" />
    </div>
  );
};
