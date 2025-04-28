import { useToast } from "../hooks/use-toast";
import { Product, ToastType } from "../types";
import { storeBaseUrl, productBaseUrl } from "../utils/consts";
import { ProductImage } from "./ProductImage";
import { Tooltip } from "./Tooltip";
import { ShoppingCart, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();

  const handleAddToCart = async () => {
    const payload = {
      quantity: 1,
      variantId: product.title,
      productId: product.id,
    };

    try {
      const response = await fetch(storeBaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to add to cart");
      toast({
        type: ToastType.Success,
        title: "Added to cart!",
        description: "Check your cart for details.",
      });
    } catch (err) {
      console.error(err);
      toast({
        type: ToastType.Error,
        title: "Error!",
        description: "Failed to add to cart. Please try again.",
      });
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden m-1 p-2 transition-shadow hover:shadow-[4px_6px_10px_rgba(0,0,0,0.2)]">
      <div className="flex items-center justify-center h-48">
        <ProductImage
          className="w-full h-48 object-contain object-center bg-gray-50"
          src={product.image}
          alt={product.title}
        />
      </div>
      <div className="p-1.5">
        <h3 className="text-xs font-semibold text-gray-800 line-clamp-1">
          {product.title}
        </h3>
        <p className="text-[10px] text-gray-600 mt-0.5 line-clamp-2">
          {product.description}
        </p>
        <p className="text-sm font-bold text-blue-600 mt-1">
          ${product.price.toFixed(2)}
        </p>
      </div>
      <div className="absolute flex flex-col gap-1 p-3 top-0 right-0">
        <Tooltip title="View Product" side="left">
          <a
            href={`${productBaseUrl}/${product.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-8 h-8 items-center justify-center p-2 rounded-full bg-gray-300 hover:bg-gray-500 transition duration-200 cursor-pointer text-white shadow-sm shadow-gray-400"
          >
            <Eye />
          </a>
        </Tooltip>
        <Tooltip title="Add to Cart" side="left">
          <button className="flex w-8 h-8 items-center justify-center p-2 rounded-full bg-gray-300 hover:bg-gray-500 transition duration-200 cursor-pointer text-white shadow-sm shadow-gray-400">
            <ShoppingCart onClick={handleAddToCart} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
