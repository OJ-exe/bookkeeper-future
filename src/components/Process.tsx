export default function Process() {
  const steps = [
    {
      number: "01",
      title: "Discovery & Assessment",
      description:
        "We evaluate your existing bookkeeping systems, workflows, reporting structure, and business goals.",
    },
    {
      number: "02",
      title: "Financial System Setup",
      description:
        "Accounts, payroll, reporting processes and cloud tools are organized for maximum efficiency.",
    },
    {
      number: "03",
      title: "Ongoing Financial Operations",
      description:
        "Bookkeeping, payroll, reconciliations, reporting and compliance are handled consistently.",
    },
    {
      number: "04",
      title: "Insights & Growth Planning",
      description:
        "Receive actionable financial intelligence that supports better decisions and long-term growth.",
    },
  ];

  return (
    <section id="process"  className="bg-[#101418] px-6 py-32">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="max-w-3xl">
          <span className="rounded-full border border-[#B08D57]/30 px-4 py-2 text-sm text-[#DCC9A6]">
            Our Process
          </span>

          <h2 className="mt-8 text-5xl font-bold text-white md:text-6xl">
            Financial operations
            <br />
            built for growth.
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-gray-400">
            A streamlined process that gives your business
            visibility, structure, and confidence.
          </p>
        </div>

        {/* Process Cards */}
        <div className="mt-24 space-y-8">

          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`group relative overflow-hidden rounded-[40px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#B08D57]/30 hover:shadow-[0_20px_60px_rgba(176,141,87,0.15)]
              ${
                index % 2 === 1
                  ? "lg:ml-32"
                  : "lg:mr-32"
              }`}
            >

              {/* Gold Glow */}
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#B08D57]/10 blur-3xl transition-all duration-700 group-hover:scale-150" />

              <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center">

                {/* Number */}
                <div className="flex-shrink-0">

                  <h3 className="text-7xl font-bold text-[#B08D57]/30 transition-all duration-500 group-hover:text-[#B08D57]">
                    {step.number}
                  </h3>

                </div>

                {/* Content */}
                <div>

                  <h4 className="text-3xl font-semibold text-white transition-all duration-300 group-hover:text-[#DCC9A6]">
                    {step.title}
                  </h4>

                  <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
                    {step.description}
                  </p>

                </div>

              </div>

            </div>
          ))}

        </div>

        {/* Bottom Metrics */}
        <div className="mt-24 grid gap-6 md:grid-cols-3">

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2">
            <h3 className="text-5xl font-bold text-[#B08D57]">
              500+
            </h3>

            <p className="mt-3 text-gray-400">
              Businesses Supported
            </p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2">
            <h3 className="text-5xl font-bold text-[#B08D57]">
              98%
            </h3>

            <p className="mt-3 text-gray-400">
              Client Retention
            </p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2">
            <h3 className="text-5xl font-bold text-[#B08D57]">
              24/7
            </h3>

            <p className="mt-3 text-gray-400">
              Financial Visibility
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}