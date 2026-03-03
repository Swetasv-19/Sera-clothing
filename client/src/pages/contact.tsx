export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-16 py-10">
      <div className="rounded-2xl card-shadow p-6 sm:p-8" style={{ backgroundColor: "#FFF3E6" }}>
        <h1
          className="text-3xl md:text-4xl font-serif font-bold mb-4"
          style={{ color: "#004643" }}
        >
          Contact Us
        </h1>
        <p
          className="text-base md:text-lg mb-6"
          style={{ color: "rgba(0, 70, 67, 0.7)" }}
        >
          Have a question about your order, sizing, or our collections? Reach out
          and we&apos;ll get back to you as soon as possible.
        </p>
        {/* Contact form or details can be added here */}
      </div>
    </div>
  );
}
