import { Icon } from "@iconify/react";

export default function WishlistSection() {
  const dummyWishlist = [
    {
      id: 1,
      name: "Classic Linen Shirt",
      price: "$65.00",
      image: "https://via.placeholder.com/150?text=Shirt",
    },
    {
      id: 2,
      name: "High-Waisted Trousers",
      price: "$85.00",
      image: "https://via.placeholder.com/150?text=Trousers",
    },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="dash-section-head">
        <h1 className="dash-section-title">My Wishlist</h1>
        <p className="dash-section-sub">Items you've saved for for later.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyWishlist.map((item) => (
          <div key={item.id} className="card overflow-hidden group">
            <div className="aspect-[4/5] bg-[var(--surface-alt)] relative overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-black/50 text-[var(--foreground)] flex items-center justify-center backdrop-blur-md hover:bg-[var(--accent-primary)] hover:text-[var(--background)] transition-colors">
                <Icon icon="mdi:close" width={16} />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-foreground text-sm mb-1 truncate">
                {item.name}
              </h3>
              <div className="text-[var(--accent-primary)] font-semibold mb-4">
                {item.price}
              </div>
              <button className="btn-primary w-full justify-center py-2 text-sm">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
