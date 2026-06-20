"use client";

import { useState } from "react";
import {
  countries,
  currencies,
  indianStates,
} from "@/data/locationData";

export default function SignupPage() {
  const [hasPan, setHasPan] = useState(false);
  const [hasGstin, setHasGstin] = useState(false);

  return (
    <main className="min-h-screen bg-[#08111F] flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#0B1628] p-8 shadow-2xl">

        <h1 className="text-3xl font-bold text-white">
          Create Workspace
        </h1>

        <p className="mt-2 text-gray-400">
          Start a free trial without payment details,
          or subscribe immediately.
        </p>

        <div className="mt-8 space-y-5">

          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Full Name
            </label>

            <input
              placeholder="Your name"
              className="w-full rounded-xl border border-white/10 bg-[#08111F] p-3 text-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Email
            </label>

            <input
              placeholder="you@company.com"
              className="w-full rounded-xl border border-white/10 bg-[#08111F] p-3 text-white"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Password
            </label>

            <input
              type="password"
              placeholder="Create password"
              className="w-full rounded-xl border border-white/10 bg-[#08111F] p-3 text-white"
            />
          </div>

          {/* Company */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Company Name
            </label>

            <input
              placeholder="Company name"
              className="w-full rounded-xl border border-white/10 bg-[#08111F] p-3 text-white"
            />
          </div>

          {/* Address */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Registered Address
            </label>

            <textarea
              rows={3}
              placeholder="Registered business address"
              className="w-full rounded-xl border border-white/10 bg-[#08111F] p-3 text-white"
            />
          </div>

          {/* City State */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                City
              </label>

              <input
                placeholder="Mumbai"
                className="w-full rounded-xl border border-white/10 bg-[#08111F] p-3 text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                State
              </label>

              <select className="w-full rounded-xl border border-white/10 bg-[#08111F] p-3 text-white">
                <option>Select state</option>

                {indianStates.map((state) => (
                  <option key={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* PIN */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              PIN Code
            </label>

            <input
              placeholder="400001"
              className="w-full rounded-xl border border-white/10 bg-[#08111F] p-3 text-white "
            />
          </div>

          {/* Country Currency */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Country
              </label>

              <select className="w-full rounded-xl border border-white/10 bg-[#08111F] p-3 text-white">
                {countries.map((country) => (
                  <option key={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Currency
              </label>

              <select className="w-full rounded-xl border border-white/10 bg-[#08111F] p-3 text-white">
                {currencies.map((currency) => (
                  <option key={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>

          </div>

         

{/* PAN & GST CARDS */}

     {/* PAN & GST SECTION */}

<div className="space-y-4">

  {/* PAN CARD */}
  <div className="rounded-2xl border border-white/10 bg-[#08111F] p-4 transition-all duration-300 hover:border-[#B08D57]/50">

    <label className="flex cursor-pointer items-center gap-3">

      <input
        type="checkbox"
        checked={hasPan}
        onChange={() => setHasPan(!hasPan)}
        className="h-5 w-5 accent-[#B08D57]"
      />

      <span className="font-medium text-white">
        PAN available
      </span>

    </label>

    {hasPan && (
      <div className="mt-4">

        <input
          type="text"
          placeholder="ABCDE1234F"
          className="w-full rounded-xl border border-white/10 bg-[#0B1628] p-3 text-white outline-none transition-all duration-300 focus:border-[#B08D57]"
        />

      </div>
    )}

  </div>

  {/* GST CARD */}
  <div className="rounded-2xl border border-white/10 bg-[#08111F] p-4 transition-all duration-300 hover:border-[#B08D57]/50">

    <label className="flex cursor-pointer items-center gap-3">

      <input
        type="checkbox"
        checked={hasGstin}
        onChange={() => setHasGstin(!hasGstin)}
        className="h-5 w-5 accent-[#B08D57]"
      />

      <span className="font-medium text-white">
        GSTIN available
      </span>

    </label>

    {hasGstin && (
      <div className="mt-4">

        <input
          type="text"
          placeholder="27ABCDE1234F1Z5"
          className="w-full rounded-xl border border-white/10 bg-[#0B1628] p-3 text-white outline-none transition-all duration-300 focus:border-[#B08D57]"
        />

      </div>
    )}

  </div>

</div> 

          {/* Notice */}

          <div className="rounded-xl border border-white/10 p-4 text-sm text-gray-400">
            Start Free Trial does not ask for payment details.
            Subscribe from Billing anytime before the trial ends
            to keep access active.
          </div>

          {/* Buttons */}

          <div className="flex gap-3">

            <button className="flex-1 rounded-xl bg-[#F4A33D] py-3 font-semibold text-black">
              Start Free Trial
            </button>

            <button className="flex-1 rounded-xl border border-white/20 py-3 font-semibold text-white">
              Subscribe Now
            </button>

          </div>

          <p className="text-center text-sm text-gray-400">
            Already have an account?
            <a
              href="/login"
              className="ml-1 text-[#F4A33D]"
            >
              Login
            </a>
          </p>

        </div>

      </div>
    </main>
  );
}