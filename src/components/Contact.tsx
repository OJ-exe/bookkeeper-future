export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-[#101418] px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">

        <div className="text-center">

          <span className="rounded-full border border-[#B08D57]/30 px-4 py-2 text-sm text-[#DCC9A6]">
            Contact Us
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
            Let&apos;s talk about your finances.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Whether you need bookkeeping,
            payroll support, tax preparation
            or financial reporting, we&apos;re here
            to help.
          </p>

        </div>

        <div className="mt-16 rounded-[40px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-12">

          <div className="grid gap-6 md:grid-cols-2">

            <input
              type="text"
              placeholder="Full Name"
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white outline-none transition-all focus:border-[#B08D57]"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white outline-none transition-all focus:border-[#B08D57]"
            />

          </div>

          <input
            type="text"
            placeholder="Business Name"
            className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white outline-none transition-all focus:border-[#B08D57]"
          />

          <textarea
            rows={6}
            placeholder="Tell us about your bookkeeping or financial needs..."
            className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white outline-none transition-all focus:border-[#B08D57]"
          />

          <button className="mt-6 rounded-full bg-[#B08D57] px-8 py-4 font-semibold text-[#101418] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#B08D57]/30">
            Send Inquiry
          </button>

        </div>

      </div>
    </section>
  );
}