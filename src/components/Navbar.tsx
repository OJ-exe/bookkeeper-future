import Link from "next/link";
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#DCC9A6]/20 bg-[#FBF6EE]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* Logo */}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#101418]">
            Bookkeeper
          </h1>

          <p className="-mt-1 text-sm text-[#B08D57]">
            From The Future
          </p>
        </div>

        {/* Navigation */}
        <nav className="hidden items-center gap-10 md:flex">

          <a
            href="#services"
            className="font-medium text-[#2C3E50] transition-colors duration-300 hover:text-[#B08D57]"
          >
            Services
          </a>

          <a
            href="#process"
            className="font-medium text-[#2C3E50] transition-colors duration-300 hover:text-[#B08D57]"
          >
            Process
          </a>

          <a
            href="#about"
            className="font-medium text-[#2C3E50] transition-colors duration-300 hover:text-[#B08D57]"
          >
            About
          </a>

          <a
            href="#contact"
            className="font-medium text-[#2C3E50] transition-colors duration-300 hover:text-[#B08D57]"
          >
            Contact
          </a>

        </nav>

        {/* CTA Buttons */}
        <div className="hidden items-center gap-4 md:flex">

         <Link
            href="/login"
            className="rounded-full border border-[#B08D57]/30 px-5 py-2.5 text-sm font-medium text-[#101418]"
            >
             Client Portal
            </Link>
         <Link
            href="/signup"
            className="rounded-full bg-[#B08D57] px-6 py-3 text-sm font-semibold text-[#101418]"
            >
            Start Free Trial
        </Link>

          

        </div>

      </div>
    </header>
  );
}