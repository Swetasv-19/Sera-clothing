import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { wishlistService } from "@/services/wishlist.service";
import toast from "react-hot-toast";

export default function WishlistSection() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await wishlistService.getWishlist();
        if (res.success && res.data) {
          setWishlist(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    try {
      const res = await wishlistService.removeFromWishlist(productId);
      if (res.success) {
        setWishlist((prev) => prev.filter((item) => item._id !== productId));
        toast.success("Removed from wishlist");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to remove item");
    }
  };

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

  if (wishlist.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-center animate-fadeIn">
        <div className="space-y-4 opacity-70">
          <div className="flex justify-center">
            <Icon icon="mdi:heart-outline" width={40} className="text-muted" />
          </div>

          <h2 className="text-xl font-semibold text-foreground">
            Your wishlist is empty
          </h2>

          <p className="text-sm text-muted mb-6">
            Save your favorite items here while you shop to easily find them
            later.
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
        <h1 className="dash-section-title">My Wishlist</h1>
        <p className="dash-section-sub">Items you've saved for later.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div key={item._id} className="card overflow-hidden group">
            <div className="aspect-[4/5] bg-[var(--surface-alt)] relative overflow-hidden">
              <img
                src={
                  item.image || "https://via.placeholder.com/150?text=Product"
                }
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <button
                onClick={() => handleRemove(item._id)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-black/50 text-[var(--foreground)] flex items-center justify-center backdrop-blur-md hover:bg-[var(--accent-primary)] hover:text-[var(--background)] transition-colors"
                title="Remove from Wishlist"
              >
                <Icon icon="mdi:close" width={16} />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-foreground text-sm mb-1 truncate">
                {item.name}
              </h3>
              <div className="text-[var(--accent-primary)] font-semibold mb-4">
                ₹{item.price?.toFixed(2) || "0.00"}
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
