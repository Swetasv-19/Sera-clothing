"use client";

import { Icon } from "@iconify/react";
import { CartItem as CartItemType } from "@/context/CartContext";
import QuantitySelector from "./QuantitySelector";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const subtotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      {/* Product image */}
      <div className="cart-item__image-wrap">
        <img
          src={item.image || "/placeholder-product.jpg"}
          alt={item.name}
          className="cart-item__image"
        />
      </div>

      {/* Product details */}
      <div className="cart-item__details">
        <div className="cart-item__info">
          <h3 className="cart-item__name">{item.name}</h3>
          {item.variant && (
            <span className="cart-item__variant">{item.variant}</span>
          )}
          <span className="cart-item__price">₹{item.price.toFixed(2)}</span>
        </div>

        <div className="cart-item__actions">
          <QuantitySelector
            quantity={item.quantity}
            onQuantityChange={(qty) => onUpdateQuantity(item.id, qty)}
          />

          <div className="cart-item__right">
            <span className="cart-item__subtotal">₹{subtotal.toFixed(2)}</span>
            <button
              className="cart-item__remove"
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${item.name} from cart`}
              type="button"
            >
              <Icon icon="mdi:delete-outline" width={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
