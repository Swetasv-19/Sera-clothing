export default function AddItem() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-16 py-10">
      <div className="rounded-2xl card-shadow p-6 sm:p-8" style={{ backgroundColor: "#FFF3E6" }}>
        <h1
          className="text-3xl md:text-4xl font-serif font-bold mb-4"
          style={{ color: "#004643" }}
        >
          Add New Item
        </h1>
        <p
          className="text-base md:text-lg mb-4"
          style={{ color: "rgba(0, 70, 67, 0.7)" }}
        >
          Create and publish new products for your store. Product details and
          form fields will appear here.
        </p>
        {/* Admin add item form goes here */}
      </div>
    </div>
  );
}
