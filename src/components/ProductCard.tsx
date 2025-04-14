import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-[160px]">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-[120px] object-cover"
      />
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{product.description}</p>
        <p className="text-base font-bold text-blue-600 mt-2">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}