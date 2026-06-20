export default function About() {
  return (
    <section
      id="about"
      className="bg-[#FBF6EE] px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Left */}
          <div>
            <span className="rounded-full border border-[#B08D57]/30 px-4 py-2 text-sm text-[#B08D57]">
              About Us
            </span>

            <h2 className="mt-6 text-4xl font-bold text-[#101418] md:text-5xl">
              Modern bookkeeping
              <br />
              for modern businesses.
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-[#2C3E50]">
              Bookkeeper From The Future helps
              businesses simplify bookkeeping,
              payroll, tax preparation and financial
              reporting through a structured,
              technology-driven approach.
            </p>

            <p className="mt-6 text-lg leading-relaxed text-[#2C3E50]">
              Our goal is to provide business owners
              with accurate financial information,
              greater visibility and confidence in
              every financial decision they make.
            </p>
          </div>

          {/* Right */}
          <div className="grid gap-6">

            <div className="rounded-[32px] border border-[#DCC9A6]/30 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">

              <h3 className="text-2xl font-bold text-[#101418]">
                Accuracy
              </h3>

              <p className="mt-4 text-[#2C3E50]">
                Detailed bookkeeping and reporting
                processes designed for reliability.
              </p>

            </div>

            <div className="rounded-[32px] border border-[#DCC9A6]/30 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">

              <h3 className="text-2xl font-bold text-[#101418]">
                Transparency
              </h3>

              <p className="mt-4 text-[#2C3E50]">
                Clear financial visibility so you
                always understand where your
                business stands.
              </p>

            </div>

            <div className="rounded-[32px] border border-[#DCC9A6]/30 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">

              <h3 className="text-2xl font-bold text-[#101418]">
                Growth Focused
              </h3>

              <p className="mt-4 text-[#2C3E50]">
                Financial systems designed to
                support sustainable business growth.
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}