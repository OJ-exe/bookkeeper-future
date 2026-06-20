export default function Industries() {
  const industries = [
    "Professional Services",
    "Construction",
    "Healthcare",
    "E-Commerce",
    "Technology",
    "Real Estate",
    "Non-Profit",
    "Manufacturing",
  ];

  return (
    <section className="bg-[#101418] px-6 py-24">
      <div className="mx-auto max-w-7xl">

        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#B08D57]">
            Industries
          </p>

          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            Expertise across industries.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-4">
          {industries.map((industry) => (
            <div
              key={industry}
              className="rounded-[28px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur"
            >
              <h3 className="font-semibold text-white">
                {industry}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}