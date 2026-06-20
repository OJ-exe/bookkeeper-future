export default function Testimonials() {
  const stories = [
    {
      category: "Financial Operations",
      title: "Improved Financial Visibility",
      description:
        "Clear bookkeeping and structured reporting help businesses understand performance and make informed decisions.",
    },
    {
      category: "Payroll & Compliance",
      title: "Simplified Back-Office Operations",
      description:
        "Payroll, reconciliations and compliance processes are streamlined to reduce administrative burden.",
    },
    {
      category: "Growth Planning",
      title: "Better Decision Making",
      description:
        "Reliable financial information supports forecasting, planning and sustainable growth initiatives.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#101418] px-6 py-32">
      {/* Background Orbs */}
      <div className="absolute left-20 top-40 h-72 w-72 rounded-full bg-[#B08D57]/5 blur-3xl" />

      <div className="absolute right-20 bottom-20 h-96 w-96 rounded-full bg-[#DCC9A6]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">

        {/* Header */}
        <div className="max-w-3xl">

          <span className="rounded-full border border-[#B08D57]/30 px-4 py-2 text-sm text-[#DCC9A6]">
            Client Success
          </span>

          <h2 className="mt-8 text-5xl font-bold text-white md:text-6xl">
            Financial systems
            <br />
            designed for clarity.
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-gray-400">
            Modern bookkeeping, reporting, payroll and
            compliance support that helps businesses stay
            organized and focused on growth.
          </p>

        </div>

        {/* Bento Layout */}
        <div className="mt-20 grid gap-6 lg:grid-cols-3">

          {/* Large Featured Card */}
          <div className="group relative overflow-hidden rounded-[40px] border border-white/10 bg-white/5 p-10 backdrop-blur-xl transition-all duration-700 hover:-translate-y-3 hover:scale-[1.01] hover:border-[#B08D57]/40 hover:shadow-[0_25px_80px_rgba(176,141,87,0.25)] lg:col-span-2">

            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#B08D57]/10 blur-3xl transition-all duration-1000 group-hover:scale-[2]" />

            <div className="relative z-10">

              <p className="text-sm uppercase tracking-[0.25em] text-[#B08D57]">
                Featured Outcome
              </p>

              <h3 className="mt-6 text-4xl font-bold text-white transition-all duration-500 group-hover:text-[#DCC9A6]">
                Financial clarity
                <br />
                without complexity.
              </h3>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-400 transition-all duration-500 group-hover:text-gray-300">
                Organized financial records, structured
                reporting, payroll management and ongoing
                oversight provide businesses with confidence
                in their numbers and greater operational
                visibility.
              </p>

              <div className="mt-10 flex flex-wrap gap-8">

                <div className="transition-all duration-300 hover:-translate-y-1">
                  <p className="text-3xl font-bold text-[#DCC9A6]">
                    Reporting
                  </p>

                  <p className="text-sm text-gray-500">
                    Financial Visibility
                  </p>
                </div>

                <div className="transition-all duration-300 hover:-translate-y-1">
                  <p className="text-3xl font-bold text-[#DCC9A6]">
                    Payroll
                  </p>

                  <p className="text-sm text-gray-500">
                    Operational Support
                  </p>
                </div>

                <div className="transition-all duration-300 hover:-translate-y-1">
                  <p className="text-3xl font-bold text-[#DCC9A6]">
                    Compliance
                  </p>

                  <p className="text-sm text-gray-500">
                    Ongoing Oversight
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Gold Card */}
          <div className="group relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#B08D57] to-[#DCC9A6] p-8 transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_30px_80px_rgba(176,141,87,0.35)]">

            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl transition-all duration-700 group-hover:scale-150" />

            <div className="relative z-10">

              <p className="text-sm uppercase tracking-[0.25em] text-[#101418]/70">
                Our Approach
              </p>

              <h3 className="mt-6 text-3xl font-bold text-[#101418]">
                Bookkeeping
                <br />
                Reimagined.
              </h3>

              <p className="mt-6 leading-relaxed text-[#101418]/80">
                Combining bookkeeping, payroll,
                reporting and advisory support into
                one streamlined experience.
              </p>

            </div>

          </div>

          {/* Bottom Cards */}
          {stories.map((story) => (
            <div
              key={story.title}
              className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-700 hover:-translate-y-3 hover:rotate-[0.5deg] hover:scale-[1.02] hover:border-[#B08D57]/40 hover:shadow-[0_20px_60px_rgba(176,141,87,0.18)]"
            >

              <div className="mb-6 h-1 w-12 rounded-full bg-[#B08D57] transition-all duration-500 group-hover:w-24" />

              <p className="text-sm uppercase tracking-[0.15em] text-[#B08D57]">
                {story.category}
              </p>

              <h3 className="mt-4 text-2xl font-semibold text-white transition-all duration-300 group-hover:text-[#DCC9A6]">
                {story.title}
              </h3>

              <p className="mt-4 leading-relaxed text-gray-400 transition-all duration-500 group-hover:text-gray-300">
                {story.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}