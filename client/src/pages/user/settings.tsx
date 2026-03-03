export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-16 py-10">
      <div className="rounded-2xl card-shadow p-6 sm:p-8" style={{ backgroundColor: "#FFF3E6" }}>
        <h1
          className="text-3xl md:text-4xl font-serif font-bold mb-4"
          style={{ color: "#004643" }}
        >
          Account Settings
        </h1>
        <p
          className="text-base md:text-lg mb-4"
          style={{ color: "rgba(0, 70, 67, 0.7)" }}
        >
          Manage your personal information, preferences, and security options.
        </p>
        {/* Settings content can be added here later */}
      </div>
    </div>
  );
}
