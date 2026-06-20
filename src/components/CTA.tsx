"use client";
import Link from "next/link";
export default function CTA() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">

        <div className="overflow-hidden rounded-[40px] bg-[#101418] p-16 text-center">

          <span className="rounded-full border border-[#B08D57]/30 px-4 py-2 text-sm text-[#DCC9A6]">
            Ready To Get Started?
          </span>

          <h2 className="mt-8 text-4xl font-bold text-white md:text-6xl">
            Stop worrying about
            <br />
            your bookkeeping.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Gain clarity, confidence and control with modern
            bookkeeping and financial operations support.
          </p>
   
         <Link
        href="#contact"
  className="mt-8 inline-block rounded-full bg-[#B08D57] px-8 py-4 font-semibold text-[#101418] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#B08D57]/30"
>
  Schedule a Consultation
</Link>

        </div>

      </div>
    </section>
  );
}