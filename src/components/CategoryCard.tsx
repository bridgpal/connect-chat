import { Category } from "../types";
import { useToast } from "../hooks/use-toast";

interface CategoryCardProps {
  category: Category;
  onClick?: (category: Category) => void;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {

  const handleClick = () => {
    if (onClick) {
      onClick(category);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="relative bg-white rounded-lg shadow-md overflow-hidden m-1 p-2 transition-all hover:shadow-[4px_6px_10px_rgba(0,0,0,0.2)] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="p-2">
        <h3 className="text-sm font-semibold text-gray-800 text-center">
          {category.name}
        </h3>
      </div>
    </button>
  );
} 