"use client";

import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { Icon } from "@iconify/react";

// Sample product data
const featuredProducts = [
  {
    id: "1",
    name: "Elegant Silk Blouse",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop",
    category: "Tops",
    isNew: true,
  },
  {
    id: "2",
    name: "Classic Wool Coat",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
    category: "Outerwear",
    discount: 20,
  },
  {
    id: "3",
    name: "Floral Summer Dress",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
    category: "Dresses",
    isNew: true,
  },
  {
    id: "4",
    name: "Tailored Trousers",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    category: "Bottoms",
  },
  {
    id: "5",
    name: "Cashmere Sweater",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    category: "Knitwear",
    discount: 15,
  },
  {
    id: "6",
    name: "Leather Handbag",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    category: "Accessories",
    isNew: true,
  },
  {
    id: "7",
    name: "Silk Scarf",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1584813357593-a5f89b6721db?w=400&h=400&fit=crop",
    category: "Accessories",
  },
  {
    id: "8",
    name: "Denim Jacket",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1576871337622-98d48d90cf26?w=400&h=400&fit=crop",
    category: "Outerwear",
    discount: 10,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen space-y-16">
      <Hero />
      
      {/* Featured Products Section */}
      <section className="py-16" style={{ backgroundColor: '#F0EDE5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: '#004643' }}>
              Featured Collection
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(0, 70, 67, 0.7)' }}>
              Discover our handpicked selection of premium pieces that define modern elegance
            </p>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
