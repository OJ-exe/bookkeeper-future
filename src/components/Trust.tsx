export default function Trust() {
  const values = [
    {
      title: "Accurate Financial Records",
      description:
        "Stay organized with consistent bookkeeping and reconciliations that keep your business on track.",
    },
    {
      title: "Clear Financial Reporting",
      description:
        "Understand performance with reports that transform numbers into actionable insights.",
    },
    {
      title: "Payroll & Compliance Support",
      description:
        "Reduce administrative burden while staying aligned with payroll and filing requirements.",
    },
    {
      title: "Modern Cloud-Based Workflows",
      description:
        "Access financial information securely and collaborate efficiently from anywhere.",
    },
  ];

  return (
    <section className="bg-[#FBF6EE] px-6 py-32">
      <div className="mx-auto max-w-7xl">

        <div className="max-w-3xl">
          <span className="rounded-full border border-[#B08D57]/30 px-4 py-2 text-sm text-[#B08D57]">
            Why Businesses Choose Us
          </span>

          <h2 className="mt-8 text-5xl font-bold text-[#101418] md:text-6xl">
            Financial operations
            <br />
            without the complexity.
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-[#2C3E50]">
            We help businesses simplify bookkeeping, reporting,
            payroll, and compliance so they can focus on growth.
          </p>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-2">

          {values.map((value) => (
            <div
              key={value.title}
              className="group rounded-[40px] border border-[#DCC9A6]/30 bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(176,141,87,0.12)]"
            >
              <div className="mb-6 h-2 w-16 rounded-full bg-[#B08D57] transition-all duration-500 group-hover:w-24" />

              <h3 className="text-2xl font-semibold text-[#101418]">
                {value.title}
              </h3>

              <p className="mt-4 leading-relaxed text-[#2C3E50]">
                {value.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}