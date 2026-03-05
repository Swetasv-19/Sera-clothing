"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import WishlistButton from '@/components/WishlistButton';
import { WishlistItem } from '@/services/wishlist.service';

export default function WishlistPage() {
  const { items, loading, error, count, clearWishlist, moveWishlistToCart } = useWishlist();
  const { addToCart } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item.productId));
    }
  };

  const handleSelectItem = (productId: string) => {
    setSelectedItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleMoveToCart = async (item: WishlistItem) => {
    try {
      await moveWishlistToCart(item.productId);
      // Add to cart
      addToCart({
        id: item.productId,
        name: item.name,
        price: item.discountPrice || item.price,
        image: item.images[0] || '',
        quantity: 1,
      });
    } catch (error) {
      console.error('Error moving to cart:', error);
    }
  };

  const handleBulkMoveToCart = async () => {
    for (const productId of selectedItems) {
      const item = items.find(item => item.productId === productId);
      if (item) {
        await handleMoveToCart(item);
      }
    }
    setSelectedItems([]);
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      await clearWishlist();
      setSelectedItems([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-[var(--accent-primary)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <Icon icon="mdi:heart-broken" className="w-16 h-16 text-[var(--muted)] mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-[var(--foreground)] mb-2">Oops!</h2>
          <p className="text-[var(--muted)] mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-[var(--foreground)] mb-2">
              My Wishlist
            </h1>
            <p className="text-[var(--muted)]">
              {count} {count === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          
          {items.length > 0 && (
            <div className="flex items-center gap-4">
              <button
                onClick={handleClearWishlist}
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors text-sm font-medium"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="text-center py-16">
            <Icon icon="mdi:heart-outline" className="w-24 h-24 text-[var(--muted)] mx-auto mb-6" />
            <h2 className="text-2xl font-serif text-[var(--foreground)] mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-[var(--muted)] mb-8 max-w-md mx-auto">
              Start adding items you love to keep track of them here.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Icon icon="mdi:shopping" className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="bg-[var(--surface-alt)] border border-[var(--card-border)] rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--foreground)] font-medium">
                    {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
                  </span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleBulkMoveToCart}
                      className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                      Move to Cart
                    </button>
                    <button
                      onClick={() => setSelectedItems([])}
                      className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Wishlist Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-[var(--surface)] border border-[var(--card-border)] rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[3/4] bg-[var(--surface-alt)]">
                    <Link href={`/product/${item.productId}`}>
                      <img
                        src={item.images[0] || '/placeholder.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    
                    {/* Wishlist Button */}
                    <div className="absolute top-4 right-4">
                      <WishlistButton productId={item.productId} size="sm" />
                    </div>

                    {/* Stock Status */}
                    {!item.inStock && (
                      <div className="absolute top-4 left-4 bg-[var(--foreground)] text-[var(--background)] px-3 py-1 rounded-full text-xs font-medium">
                        Out of Stock
                      </div>
                    )}

                    {/* Checkbox for bulk selection */}
                    <div className="absolute bottom-4 left-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.productId)}
                        onChange={() => handleSelectItem(item.productId)}
                        className="w-5 h-5 rounded border-[var(--card-border)] bg-[var(--surface)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs text-[var(--muted)] uppercase tracking-wide">
                        {item.brand}
                      </span>
                    </div>
                    
                    <Link href={`/product/${item.productId}`}>
                      <h3 className="font-serif text-[var(--foreground)] mb-2 hover:text-[var(--accent-primary)] transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[var(--foreground)]">
                          ₹{item.discountPrice || item.price}
                        </span>
                        {item.discountPrice && (
                          <span className="text-sm text-[var(--muted)] line-through">
                            ₹{item.price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        disabled={!item.inStock}
                        className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                          item.inStock
                            ? 'bg-[var(--foreground)] text-[var(--background)] hover:opacity-90'
                            : 'bg-[var(--surface-alt)] text-[var(--muted)] cursor-not-allowed'
                        }`}
                      >
                        {item.inStock ? 'Move to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedItems.length === items.length && items.length > 0}
                  onChange={handleSelectAll}
                  className="w-5 h-5 rounded border-[var(--card-border)] bg-[var(--surface)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                />
                <span className="text-[var(--foreground)]">
                  Select All ({items.length})
                </span>
              </div>
              
              <Link
                href="/shop"
                className="text-[var(--accent-primary)] hover:text-[var(--foreground)] transition-colors font-medium"
              >
                Continue Shopping →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
