import Link from "next/link";
export default function Hero() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl text-center">

        <span className="inline-block max-w-[280px] rounded-full border border-[#B08D57]/30 px-4 py-2 text-center text-xs sm:max-w-none sm:text-sm text-[#B08D57]">
  AI-Powered Bookkeeping & Financial Operations
</span>

        <h1 className="mt-8 text-5xl font-bold leading-tight text-[#101418] md:text-7xl">
          Browse your
          <br />
          numbers
          <span className="text-[#B08D57]"> clearly.</span>
        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-[#2C3E50]">
          Bookkeeper From The Future transforms bookkeeping,
          payroll, tax preparation, and reporting into a clear
          financial operating system for modern businesses.
        </p>

        <div className="mt-8 flex justify-center gap-4">
  <Link
  href="#services"
  className="rounded-full bg-[#B08D57] px-6 py-3 font-medium text-[#101418] transition-all duration-300 hover:scale-105 hover:shadow-lg"
>
  Explore Services
</Link>
<Link
  href="/signup"
  className="rounded-full border border-[#101418]/20 px-6 py-3 font-medium text-[#101418] transition-all duration-300 hover:bg-[#101418] hover:text-white"
>
  Book Consultation
</Link>
</div>
      </div>
    </section>
  );
}