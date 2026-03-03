export default function ShopPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-10">
      <div className="rounded-2xl card-shadow p-6 sm:p-10" style={{ backgroundColor: "#FFF3E6" }}>
        <h1
          className="text-3xl md:text-4xl font-serif font-bold mb-4"
          style={{ color: "#004643" }}
        >
          Shop
        </h1>
        <p
          className="text-base md:text-lg max-w-2xl"
          style={{ color: "rgba(0, 70, 67, 0.7)" }}
        >
          Explore our full range of clothing and accessories. Filters, categories,
          and products will appear here.
        </p>
      </div>
    </div>
  );
}
