export default function Footer() {
  return (
    <footer className="border-t border-[#DCC9A6]/20 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row">

        <div>
          <h3 className="text-xl font-bold text-[#101418]">
            Bookkeeper
            <span className="text-[#B08D57]"> From The Future</span>
          </h3>

          <p className="mt-4 max-w-md text-[#2C3E50]">
            Modern bookkeeping, payroll, tax preparation,
            reporting and financial operations support.
          </p>
        </div>

        <div>
          <p className="font-semibold text-[#101418]">
            Quick Links
          </p>

          <div className="mt-4 space-y-2 text-[#2C3E50]">
            <p>Services</p>
            <p>About</p>
            <p>Contact</p>
          </div>
        </div>

      </div>
    </footer>
  );
}