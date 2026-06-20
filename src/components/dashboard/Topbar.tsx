import {
  Search,
  Bell,
  Plus,
  Moon,
  Menu,
} from "lucide-react";

export default function Topbar() {
  return (
    <header
      className="
        flex
        flex-col
        lg:flex-row
        gap-4
        lg:items-center
        lg:justify-between
      "
    >
      {/* Left Side */}
      <div className="flex items-start gap-4">
        {/* Mobile Menu Button */}
        <button
          className="
            lg:hidden
            h-10
            w-10
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-sm
            flex
            items-center
            justify-center
          "
        >
          <Menu size={18} />
        </button>

        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-slate-900">
            Good Afternoon 👋
          </h1>

          <p className="text-slate-500 mt-1 lg:mt-2 text-sm lg:text-base">
            Here's what's happening in your business today.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div
        className="
          flex
          flex-wrap
          items-center
          gap-3
          w-full
          lg:w-auto
        "
      >
        {/* Search */}
        <div
          className="
            flex
            items-center
            gap-3
            w-full
            lg:w-96
            bg-white
            border
            border-slate-200
            rounded-2xl
            px-4
            py-3
            shadow-sm
          "
        >
          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search invoices, customers..."
            className="
              w-full
              outline-none
              bg-transparent
              text-sm
            "
          />
        </div>

        {/* Dark Mode Button */}
        <button
          className="
            h-12
            w-12
            rounded-2xl
            bg-white
            border
            border-slate-200
            shadow-sm
            flex
            items-center
            justify-center
          "
        >
          <Moon size={18} />
        </button>

        {/* Notifications */}
        <button
          className="
            h-12
            w-12
            rounded-2xl
            bg-white
            border
            border-slate-200
            shadow-sm
            flex
            items-center
            justify-center
          "
        >
          <Bell size={18} />
        </button>

        {/* New Button */}
        <button
          className="
            h-12
            px-5
            rounded-2xl
            bg-[#B08D57]
            text-white
            shadow-sm
            flex
            items-center
            gap-2
            hover:opacity-90
            transition
          "
        >
          <Plus size={18} />
          <span className="hidden sm:inline">
            New
          </span>
        </button>
      </div>
    </header>
  );
}