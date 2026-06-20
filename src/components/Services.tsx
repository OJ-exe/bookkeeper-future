export default function Services() {
  const services = [
    {
      title: "Bookkeeping",
      description:
        "Accurate records, reconciliations and financial organization.",
    },
    {
      title: "Payroll",
      description:
        "Reliable payroll processing and employee payment management.",
    },
    {
      title: "Tax Preparation",
      description:
        "Reduce stress and stay compliant during tax season.",
    },
    {
      title: "Financial Reporting",
      description:
        "Clear reports that help you make better business decisions.",
    },
    {
      title: "Advisory Services",
      description:
        "Strategic guidance to improve profitability and growth.",
      large: true,
    },
    {
      title: "Cloud Accounting",
      description:
        "Modern accounting systems accessible anywhere.",
    },
    {
      title: "Compliance",
      description:
        "Stay aligned with regulations and reporting requirements.",
    },
  ];

  return (
    <section id="services"className="px-6 py-24">
      <div className="mx-auto max-w-7xl">

        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#B08D57]">
            Services
          </p>

          <h2 className="mt-4 text-4xl font-bold text-[#101418] md:text-5xl">
            Everything your business needs.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[#2C3E50]">
            From bookkeeping and payroll to tax preparation
            and strategic financial guidance.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">

          {services.map((service) => (
            <div
              key={service.title}
              className={`rounded-[32px] border border-[#DCC9A6]/40 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                service.large ? "md:col-span-2" : ""
              }`}
            >
              <h3 className="text-2xl font-semibold text-[#101418]">
                {service.title}
              </h3>

              <p className="mt-4 leading-relaxed text-[#2C3E50]">
                {service.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}