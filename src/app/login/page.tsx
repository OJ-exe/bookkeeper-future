export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#101418]">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="relative hidden overflow-hidden lg:flex">

          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#101418] via-[#1B2730] to-[#2C3E50]" />

          <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-[#B08D57]/10 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-[#DCC9A6]/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12">

            <div>
              <h1 className="text-3xl font-bold text-white">
                Bookkeeper
              </h1>

              <p className="text-[#B08D57]">
                From The Future
              </p>
            </div>

            <div>

              <span className="rounded-full border border-[#B08D57]/30 px-4 py-2 text-sm text-[#DCC9A6]">
                Financial Operations Platform
              </span>

              <h2 className="mt-8 text-5xl font-bold leading-tight text-white">
                Financial clarity
                <br />
                for modern businesses.
              </h2>

              <p className="mt-6 max-w-lg text-lg text-gray-400">
                Access reports, payroll records,
                bookkeeping data and financial
                insights from a single platform.
              </p>

            </div>

            {/* Dashboard Preview */}
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-400">
                    Monthly Revenue
                  </p>

                  <h3 className="mt-2 text-4xl font-bold text-white">
                    $128K
                  </h3>
                </div>

                <div className="rounded-full bg-[#B08D57]/20 px-4 py-2 text-[#DCC9A6]">
                  +18%
                </div>

              </div>

              <div className="mt-8 flex h-28 items-end gap-2">

                <div className="h-10 w-full rounded-t-lg bg-[#DCC9A6]/40" />
                <div className="h-16 w-full rounded-t-lg bg-[#DCC9A6]/50" />
                <div className="h-14 w-full rounded-t-lg bg-[#DCC9A6]/60" />
                <div className="h-24 w-full rounded-t-lg bg-[#B08D57]" />
                <div className="h-20 w-full rounded-t-lg bg-[#DCC9A6]/70" />

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-6 py-12">

          <div className="w-full max-w-md">

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

              <h2 className="text-3xl font-bold text-white">
                Welcome back
              </h2>

              <p className="mt-2 text-gray-400">
                Sign in to your client portal.
              </p>

              <div className="mt-8 space-y-4">

                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white outline-none transition focus:border-[#B08D57]"
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white outline-none transition focus:border-[#B08D57]"
                />

              </div>

              <div className="mt-4 flex justify-end">
                <button className="text-sm text-[#DCC9A6] hover:text-[#B08D57]">
                  Forgot Password?
                </button>
              </div>

              <button className="mt-6 w-full rounded-2xl bg-[#B08D57] py-4 font-semibold text-[#101418] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#B08D57]/30">
                Sign In
              </button>

              <div className="mt-8 text-center text-sm text-gray-400">
                Don&apos;t have an account?
                <a
                  href="/signup"
                  className="ml-2 text-[#DCC9A6] hover:text-[#B08D57]"
                >
                  Start Free Trial
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}