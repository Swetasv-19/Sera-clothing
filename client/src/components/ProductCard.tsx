"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ backgroundColor: '#FFF3E6' }}>
      <div className="relative overflow-hidden">
        <Link href={`/product/${product.id}`}>
          <div className="aspect-square overflow-hidden" style={{ backgroundColor: '#F0EDE5' }}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          {product.isNew && (
            <span className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: '#381932' }}>
              NEW
            </span>
          )}
          {product.discount && (
            <span className="absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: '#dc2626' }}>
              -{product.discount}%
            </span>
          )}
        </Link>
        
        {/* Quick Actions */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1" style={{ backgroundColor: '#004643', color: '#FFF3E6' }}>
            <Icon icon="mdi:eye" width="16" height="16" />
            Quick View
          </button>
          <button className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1" style={{ backgroundColor: '#381932', color: '#FFF3E6' }}>
            <Icon icon="mdi:shopping-cart" width="16" height="16" />
            Add to Cart
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs font-medium uppercase tracking-wide" style={{ color: 'rgba(0, 70, 67, 0.6)' }}>
            {product.category}
          </span>
        </div>
        
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:opacity-80 transition-colors duration-200 line-clamp-2 font-serif" style={{ color: '#004643' }}>
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold" style={{ color: '#004643' }}>
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discount && (
              <span className="text-sm line-through" style={{ color: 'rgba(0, 70, 67, 0.4)' }}>
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          
          <button className="p-2 rounded-lg transition-colors duration-200 hover:bg-opacity-50" style={{ color: '#004643' }}>
            <Icon icon="mdi:heart-outline" width="20" height="20" />
          </button>
        </div>
        
        {/* Rating */}
        <div className="flex items-center mt-3">
          <div className="flex" style={{ color: '#eab308' }}>
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                icon={i < 4 ? "mdi:star" : "mdi:star-outline"}
                width="14"
                height="14"
                style={i < 4 ? { color: '#eab308' } : { color: 'rgba(0, 70, 67, 0.2)' }}
              />
            ))}
          </div>
          <span className="text-xs ml-2" style={{ color: 'rgba(0, 70, 67, 0.6)' }}>(4.0)</span>
        </div>
      </div>
    </div>
  );
}
