import { Icon } from "@iconify/react";

export default function OrdersSection() {
  const dummyOrders = [
    {
      id: "ORD-9823-112",
      date: "Oct 24, 2024",
      status: "Delivered",
      total: "$129.00",
      items: 2,
    },
    {
      id: "ORD-9934-551",
      date: "Nov 02, 2024",
      status: "Processing",
      total: "$64.50",
      items: 1,
    },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="dash-section-head">
        <h1 className="dash-section-title">My Orders</h1>
        <p className="dash-section-sub">View and track your recent orders.</p>
      </div>

      <div className="flex flex-col gap-4">
        {dummyOrders.map((order) => (
          <div
            key={order.id}
            className="card flex flex-col md:flex-row md:items-center justify-between p-5 gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--surface-alt)] text-[var(--foreground)] flex font-serif text-lg font-bold items-center justify-center shrink-0">
                <Icon icon="mdi:package-variant-closed" width={24} />
              </div>
              <div>
                <div className="font-semibold text-[0.95rem] text-foreground mb-0.5">
                  Order #{order.id}
                </div>
                <div className="text-sm text-muted">
                  {order.date} • {order.items} Items
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0">
              <div className="text-left md:text-right">
                <div className="font-semibold text-foreground mb-0.5">
                  {order.total}
                </div>
                <div
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    order.status === "Delivered"
                      ? "text-emerald-500"
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

        {dummyOrders.length === 0 && (
          <div className="card p-12 flex flex-col items-center justify-center text-center">
            <Icon
              icon="mdi:cart-outline"
              width={48}
              className="text-muted mb-4 opacity-50"
            />
            <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
              No orders yet
            </h3>
            <p className="text-sm text-muted mb-6">
              You haven't placed any orders yet. Start exploring our
              collections!
            </p>
            <button className="btn-primary">Shop Now</button>
          </div>
        )}
      </div>
    </div>
  );
}
