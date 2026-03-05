"use client";

import { Icon } from "@iconify/react";
import { ProductFilters } from "@/types/product";

interface FilterSidebarProps {
  categories: string[];
  currentFilters: ProductFilters;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
  onClose?: () => void;
}

export default function FilterSidebar({
  categories,
  currentFilters,
  onFilterChange,
  onClose,
}: FilterSidebarProps) {
  const handleCategoryClick = (category: string) => {
    const isSelected = currentFilters.category === category;
    onFilterChange({ category: isSelected ? undefined : category });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value ? Number(value) : undefined });
  };

  const handleClear = () => {
    onFilterChange({
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      search: undefined,
      page: 1,
    });
  };

  const hasFilters = !!(
    currentFilters.category ||
    currentFilters.minPrice !== undefined ||
    currentFilters.maxPrice !== undefined ||
    currentFilters.search
  );

  return (
    <div className="shop-side-card">
      {/* Categories Section */}
      <div className="shop-side-section">
        <h3 className="shop-side-title">
          <Icon icon="mdi:tag-outline" />
          Categories
        </h3>
        <div className="shop-side-list">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`shop-side-item ${
                currentFilters.category === cat ? "shop-side-item--active" : ""
              }`}
            >
              <span className="capitalize">{cat}</span>
              {currentFilters.category === cat && (
                <Icon icon="mdi:check" className="text-(--accent-primary)" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-(--divider) opacity-50" />

      {/* Price Range Section */}
      <div className="shop-side-section">
        <h3 className="shop-side-title">
          <Icon icon="mdi:currency-usd" />
          Price Range
        </h3>
        <div className="shop-price-grid">
          <div className="shop-price-field">
            <label className="shop-price-label">Min</label>
            <input
              type="number"
              name="minPrice"
              value={currentFilters.minPrice || ""}
              onChange={handlePriceChange}
              placeholder="0"
              className="shop-price-input"
            />
          </div>
          <div className="shop-price-field">
            <label className="shop-price-label">Max</label>
            <input
              type="number"
              name="maxPrice"
              value={currentFilters.maxPrice || ""}
              onChange={handlePriceChange}
              placeholder="8000"
              className="shop-price-input"
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-(--divider) opacity-50" />

      {/* Clear Button */}
      <button
        onClick={handleClear}
        className="shop-clear-btn"
        disabled={!hasFilters}
      >
        <Icon icon="mdi:filter-off-outline" />
        Clear All Filters
      </button>
    </div>
  );
}
