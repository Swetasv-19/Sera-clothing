export default function AdminPanel() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-16 py-10">
      <div className="rounded-2xl card-shadow p-6 sm:p-8" style={{ backgroundColor: "#FFF3E6" }}>
        <h1
          className="text-3xl md:text-4xl font-serif font-bold mb-4"
          style={{ color: "#004643" }}
        >
          Admin Dashboard
        </h1>
        <p
          className="text-base md:text-lg mb-4"
          style={{ color: "rgba(0, 70, 67, 0.7)" }}
        >
          Overview of store performance, inventory, and orders will be displayed
          here.
        </p>
        {/* Admin dashboard content goes here */}
      </div>
    </div>
  );
}
