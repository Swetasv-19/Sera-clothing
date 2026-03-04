import { Icon } from "@iconify/react";

export default function AddressesSection() {
  const dummyAddresses = [
    {
      id: 1,
      label: "Home",
      name: "John Doe",
      street: "123 Fashion Ave, Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
      isDefault: true,
    },
    {
      id: 2,
      label: "Office",
      name: "John Doe",
      street: "456 Corporate Blvd, Floor 12",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "United States",
      isDefault: false,
    },
  ];

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
        {dummyAddresses.map((addr) => (
          <div key={addr.id} className="card p-6 relative">
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
              <button className="btn-outline px-4 py-1.5 text-xs flex-1 justify-center !text-red-500 !border-red-500/20 hover:!bg-red-500/10 hover:!border-red-500/50">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
