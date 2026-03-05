"use client";

import { CartItem as CartItemType } from "@/context/CartContext";
import CartItem from "./CartItem";

interface CartListProps {
  items: CartItemType[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartList({
  items,
  onUpdateQuantity,
  onRemove,
}: CartListProps) {
  return (
    <div className="cart-list">
      <div className="cart-list__header">
        <h2 className="cart-list__title">Cart Items</h2>
        <span className="cart-list__count">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="cart-list__items">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}
