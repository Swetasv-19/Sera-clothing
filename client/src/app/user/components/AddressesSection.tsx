import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { addressService } from "@/services/address.service";
import { Address } from "@/types/user";
import toast from "react-hot-toast";

export default function AddressesSection() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      const res = await addressService.getAddresses();
      if (res.success && res.data) {
        setAddresses(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await addressService.deleteAddress(id);
      if (res.success) {
        setAddresses((prev) => prev.filter((addr) => addr._id !== id));
        toast.success("Address deleted");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete address");
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

  return (
    <div className="animate-fadeIn">
      <div className="dash-section-head flex items-end justify-between mb-6">
        <div>
          <h1 className="dash-section-title">Saved Addresses</h1>
          <p className="dash-section-sub">
            Manage your shipping and billing addresses.
          </p>
        </div>
        <button className="btn-primary">
          <Icon icon="mdi:plus" width={18} />
          Add New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div key={addr._id} className="card p-6 relative">
            {addr.isDefault && (
              <span className="absolute top-6 right-6 text-[0.65rem] font-bold uppercase tracking-wider bg-[var(--accent-primary)] text-[var(--background)] px-2 py-1 rounded-sm">
                Default
              </span>
            )}
            <div className="flex items-center gap-2 mb-4">
              <Icon
                icon="mdi:map-marker-outline"
                className="text-muted"
                width={20}
              />
              <h3 className="font-semibold text-foreground">{addr.label}</h3>
            </div>

            <div className="text-sm text-foreground/80 leading-relaxed mb-6">
              <span className="font-medium block mb-1 text-foreground">
                {addr.name}
              </span>
              {addr.street} <br />
              {addr.city}, {addr.state} {addr.zip} <br />
              {addr.country}
            </div>

            <div className="flex gap-3 mt-auto">
              <button className="btn-outline px-4 py-1.5 text-xs flex-1 justify-center">
                Edit
              </button>
              <button
                onClick={() => handleDelete(addr._id)}
                className="btn-outline px-4 py-1.5 text-xs flex-1 justify-center !text-red-500 !border-red-500/20 hover:!bg-red-500/10 hover:!border-red-500/50"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {addresses.length === 0 && (
          <div className="col-span-full card p-12 flex flex-col items-center justify-center text-center">
            <Icon
              icon="mdi:map-marker-outline"
              width={48}
              className="text-muted mb-4 opacity-50"
            />
            <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
              No addresses saved
            </h3>
            <p className="text-sm text-muted mb-6">
              Add your shipping address to make checkout faster.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
