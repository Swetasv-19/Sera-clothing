"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
  categories: string[];
  brands: string[];
}

export default function FilterSidebar({ onFilterChange, categories, brands }: FilterSidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const sizes = ["S", "M", "L", "XL", "XXL"];

  const handleCategoryChange = (cat: string) => {
    const newCat = selectedCategory === cat ? "" : cat;
    setSelectedCategory(newCat);
    onFilterChange({ category: newCat });
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(newSizes);
    onFilterChange({ sizes: newSizes });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-8 p-2">
      {/* Categories */}
      <div className="flex flex-col items-center w-full">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 text-[var(--muted)] mb-4 w-full text-center">
          <Icon icon="mdi:tag-outline" className="w-4 h-4" /> Categories
        </h3>
        <div className="space-y-2 w-full px-2 max-w-[200px]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`block w-full text-center px-4 py-2 rounded-[7px] text-sm font-semibold transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-[var(--accent-primary)] text-[var(--background)] shadow-lg scale-105"
                  : "hover:bg-[var(--muted-light)] text-[var(--foreground)] hover:scale-105"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-[var(--divider)] w-2/3 opacity-30 shrink-0" />

      {/* Price Range */}
      <div className="flex flex-col items-center w-full">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 text-[var(--muted)] mb-4 w-full text-center">
          <Icon icon="mdi:currency-usd" className="w-4 h-4" /> Price Range
        </h3>
        <div className="space-y-3 w-full px-2 text-center max-w-[200px]">
          <div className="flex flex-col items-center gap-3">
            <input
              type="number"
              placeholder="Min Price"
              className="w-full text-center px-4 py-2 bg-[var(--surface-alt)] border border-[var(--divider)] rounded-[7px] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-all"
              onChange={(e) => onFilterChange({ minPrice: Number(e.target.value) })}
            />
            <span className="text-[var(--muted)] text-xs font-bold opacity-50 uppercase tracking-widest">TO</span>
            <input
              type="number"
              placeholder="Max Price"
              className="w-full text-center px-4 py-2 bg-[var(--surface-alt)] border border-[var(--divider)] rounded-[7px] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-all"
              onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-[var(--divider)] w-2/3 opacity-30 shrink-0" />

      {/* Sizes */}
      <div className="flex flex-col items-center w-full">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 text-[var(--muted)] mb-4 w-full text-center">
          <Icon icon="mdi:format-size" className="w-4 h-4" /> Sizes
        </h3>
        <div className="flex flex-wrap justify-center gap-3 px-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeToggle(size)}
              className={`w-12 h-12 rounded-[7px] border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                selectedSizes.includes(size)
                  ? "bg-[var(--accent-primary)] text-[var(--background)] border-[var(--accent-primary)] shadow-md scale-110"
                  : "bg-[var(--background)] text-[var(--foreground)] border-[var(--divider)] hover:border-[var(--foreground)] hover:scale-105"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
