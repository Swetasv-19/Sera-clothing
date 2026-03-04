import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { orderService } from "@/services/order.service";
import { Order } from "@/types/user";

export default function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getOrders(1, 10);
        if (res.success && res.data) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Icon
          icon="mdi:loading"
          className="animate-spin text-[var(--accent-primary)]"
          width={32}
        />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-center animate-fadeIn">
        <div className="space-y-4 opacity-70">
          <div className="flex justify-center">
            <Icon icon="mdi:cart-outline" width={40} className="text-muted" />
          </div>

          <h2 className="text-xl font-semibold text-foreground">
            No orders yet
          </h2>

          <p className="text-sm text-muted mb-6">
            You haven't placed any orders yet.
          </p>

          <button className="btn-outline text-sm px-5 py-2 mt-6 button-top-margin">
            Explore Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="dash-section-head">
        <h1 className="dash-section-title">My Orders</h1>
        <p className="dash-section-sub">View and track your recent orders.</p>
      </div>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="card flex flex-col md:flex-row md:items-center justify-between p-5 gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--surface-alt)] text-[var(--foreground)] flex font-serif text-lg font-bold items-center justify-center shrink-0">
                <Icon icon="mdi:package-variant-closed" width={24} />
              </div>
              <div>
                <div className="font-semibold text-[0.95rem] text-foreground mb-0.5">
                  Order #{order._id.slice(-6).toUpperCase()}
                </div>
                <div className="text-sm text-muted">
                  {new Date(order.createdAt).toLocaleDateString()} •{" "}
                  {order.orderItems?.length || 0} Items
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0">
              <div className="text-left md:text-right">
                <div className="font-semibold text-foreground mb-0.5">
                  ${order.totalPrice?.toFixed(2) || "0.00"}
                </div>
                <div
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    order.status === "Delivered"
                      ? "text-emerald-500"
                      : order.status === "Cancelled"
                        ? "text-red-500"
                        : "text-amber-500"
                  }`}
                >
                  {order.status}
                </div>
              </div>
              <button className="btn-outline px-4 py-2 text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
