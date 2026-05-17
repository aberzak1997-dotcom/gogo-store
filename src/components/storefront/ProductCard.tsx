import React from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { Product } from "../../types";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useStore();

  const getStockBadge = () => {
    if (product.stockQuantity >= 5) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Stock</Badge>;
    }
    if (product.stockQuantity > 0) {
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Only {product.stockQuantity} left</Badge>;
    }
    return <Badge variant="destructive">Out of Stock</Badge>;
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full group transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          {getStockBadge()}
        </div>
      </div>
      <CardContent className="p-4 flex-grow">
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">{product.brand}</p>
        <h3 className="font-semibold text-lg line-clamp-1 mb-2">{product.title}</h3>
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center text-amber-400">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-medium text-foreground ml-1">{product.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">${product.compareAtPrice.toFixed(2)}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
        <Link to={`/product/${product.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full gap-2">
            <Eye size={16} /> Details
          </Button>
        </Link>
        <Button 
          size="sm" 
          className="w-full gap-2" 
          disabled={product.stockQuantity === 0}
          onClick={() => addToCart(product.id)}
        >
          <ShoppingCart size={16} /> Add
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;