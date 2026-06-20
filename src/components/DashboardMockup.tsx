export default function DashboardMockup() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-7xl">

       <div className="rounded-[40px] border border-[#DCC9A6]/20 bg-gradient-to-br from-[#101418] via-[#1B2730] to-[#2C3E50] p-6 lg:p-16">

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            {/* LEFT */}
            <div>
              <span className="rounded-full border border-[#B08D57]/30 px-4 py-2 text-sm text-[#DCC9A6]">
                CFO-Level Financial Visibility
              </span>

              <h2 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-6xl">
                Your business finances,
                <br />
                finally under
                <span className="text-[#B08D57]"> control.</span>
              </h2>

              <p className="mt-6 max-w-full text-base leading-relaxed text-gray-300 sm:max-w-lg sm:text-lg">
                Bookkeeping, payroll, tax preparation,
                reporting, and financial oversight brought
                together into a single streamlined operating
                system for your business.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button className="rounded-full bg-[#B08D57] px-6 py-3 font-medium text-[#101418]">
                  Explore Services
                </button>

                <button className="rounded-full border border-white/20 px-6 py-3 text-white">
                  Book Consultation
                </button>
              </div>
            </div>

            {/* RIGHT DASHBOARD */}
<div className="group relative">

  {/* Glow */}
  <div className="absolute -right-8 -top-8 h-64 w-64 rounded-full bg-[#B08D57]/20 blur-3xl transition-all duration-700 group-hover:scale-125" />

  <div className="relative rounded-[40px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(176,141,87,0.25)]">

    {/* Top */}
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <p className="text-sm text-gray-400">
          Financial Health Score
        </p>

        <h3 className="mt-2 text-5xl font-bold text-white">
          92/100
        </h3>
      </div>

      <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#B08D57] transition-all duration-500 hover:rotate-12">

        <div className="absolute inset-0 rounded-full bg-[#B08D57]/10 blur-xl" />

        <span className="relative text-xl font-bold text-[#B08D57]">
          92%
        </span>

      </div>

    </div>

    {/* Revenue & Expenses */}
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">

      <div className="rounded-[24px] bg-white/10 p-5 transition-all duration-300 hover:-translate-y-2 hover:bg-white/15">

        <p className="text-sm text-gray-400">
          Revenue
        </p>

        <h4 className="mt-2 text-3xl font-bold text-white">
          $128K
        </h4>

        <p className="mt-2 text-sm text-green-400">
          +18.4% this month
        </p>

      </div>

      <div className="rounded-[24px] bg-white/10 p-5 transition-all duration-300 hover:-translate-y-2 hover:bg-white/15">

        <p className="text-sm text-gray-400">
          Expenses
        </p>

        <h4 className="mt-2 text-3xl font-bold text-white">
          $85K
        </h4>

        <p className="mt-2 text-sm text-yellow-400">
          Within target
        </p>

      </div>

    </div>

    {/* Cash Flow */}
    <div className="mt-8 rounded-[28px] bg-white/10 p-5">

      <div className="flex items-center justify-between">

        <h4 className="font-semibold text-white">
          Cash Flow Trend
        </h4>

        <span className="text-sm text-[#DCC9A6]">
          Last 6 Months
        </span>

      </div>

      <div className="mt-8 flex h-48 items-end gap-3">

        <div className="h-20 w-full rounded-t-xl bg-[#DCC9A6]/40 transition-all duration-300 hover:h-28 hover:bg-[#B08D57]" />

        <div className="h-28 w-full rounded-t-xl bg-[#DCC9A6]/50 transition-all duration-300 hover:h-36 hover:bg-[#B08D57]" />

        <div className="h-24 w-full rounded-t-xl bg-[#DCC9A6]/60 transition-all duration-300 hover:h-32 hover:bg-[#B08D57]" />

        <div className="h-36 w-full rounded-t-xl bg-[#B08D57]/70 transition-all duration-300 hover:h-44" />

        <div className="h-32 w-full rounded-t-xl bg-[#DCC9A6]/70 transition-all duration-300 hover:h-40 hover:bg-[#B08D57]" />

        <div className="h-44 w-full rounded-t-xl bg-[#B08D57] transition-all duration-300 hover:h-52" />

      </div>

    </div>

    {/* Recent Activity */}
    <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-5">

      <h4 className="font-semibold text-white">
        Recent Activity
      </h4>

      <div className="mt-4 space-y-3">

        <div className="flex justify-between text-sm">
          <span className="text-gray-300">
            Payroll Processed
          </span>

          <span className="text-green-400">
            Complete
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-300">
            Tax Review
          </span>

          <span className="text-[#B08D57]">
            Pending
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-300">
            Monthly Reports
          </span>

          <span className="text-green-400">
            Delivered
          </span>
        </div>

      </div>

    </div>

    {/* Status Cards */}
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

      <div className="rounded-[24px] bg-white/10 p-4 transition-all duration-300 hover:scale-105 hover:bg-white/15">

        <p className="text-sm text-gray-400">
          Payroll
        </p>

        <p className="mt-2 font-semibold text-white">
          On Track
        </p>

      </div>

      <div className="rounded-[24px] bg-white/10 p-4 transition-all duration-300 hover:scale-105 hover:bg-white/15">

        <p className="text-sm text-gray-400">
          Tax Filing
        </p>

        <p className="mt-2 font-semibold text-white">
          Ready
        </p>

      </div>

      <div className="rounded-[24px] bg-white/10 p-4 transition-all duration-300 hover:scale-105 hover:bg-white/15">

        <p className="text-sm text-gray-400">
          AR / AP
        </p>

        <p className="mt-2 font-semibold text-white">
          Healthy
        </p>

      </div>

    </div>

        {/* Bottom Metric */}
    <div className="mt-6 rounded-[28px] bg-gradient-to-r from-[#B08D57] to-[#DCC9A6] p-5">
      <p className="text-sm text-[#101418]">
        Financial Health Improved
      </p>

      <h4 className="mt-2 text-4xl font-bold text-[#101418]">
        +18%
      </h4>

      <p className="mt-1 text-sm text-[#101418]/70">
        compared to previous quarter
      </p>
    </div>

  </div>
</div>

          </div>
        </div>
      </div>
    </section>
  );
}