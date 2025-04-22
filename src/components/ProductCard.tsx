import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden m-1 p-2 ">
      <img 
        src={product.image} 
        alt={product.title}
        className="w-full h-48 object-contain object-center bg-gray-50"
      />
      <div className="p-1.5">
        <h3 className="text-xs font-semibold text-gray-800 line-clamp-1">{product.title}</h3>
        <p className="text-[10px] text-gray-600 mt-0.5 line-clamp-2">{product.description}</p>
        <p className="text-sm font-bold text-blue-600 mt-1">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}