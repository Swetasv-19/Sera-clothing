"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Icon } from "@iconify/react";
import EmptyCart from "@/components/cart/EmptyCart";
import CartList from "@/components/cart/CartList";
import OrderSummary from "@/components/cart/OrderSummary";
import "@/app/styles/layouts/cart.css";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();
  const isEmpty = items.length === 0;

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Breadcrumbs */}
        <nav className="cart-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/" className="cart-breadcrumb__link">
            Home
          </Link>
          <Icon icon="mdi:chevron-right" width={16} />
          <span className="cart-breadcrumb__current">Shopping Cart</span>
        </nav>

        {/* Page heading */}
        <div className="cart-header">
          <h1 className="cart-header__title">Shopping Cart</h1>
          {!isEmpty && (
            <p className="cart-header__sub">
              Review your items before checkout
            </p>
          )}
        </div>

        {isEmpty ? (
          <EmptyCart />
        ) : (
          <div className="cart-grid">
            {/* Left: Cart items */}
            <div className="cart-grid__items">
              <CartList
                items={items}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            </div>

            {/* Right: Order summary */}
            <div className="cart-grid__summary">
              <OrderSummary subtotal={cartTotal} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
