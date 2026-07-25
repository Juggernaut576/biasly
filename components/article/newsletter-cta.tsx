"use client";

import { useState } from "react";

export function NewsletterCta() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with ${email}!`);
      setEmail("");
    }
  };

  return (
    <div className="bg-[#F3F4F6] border border-[#E5E7EB] rounded-[var(--radius-lg)] p-6 sm:p-8 mt-12 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Text */}
        <div className="space-y-1 max-w-md">
          <h3 className="text-[18px] sm:text-[20px] font-bold text-[var(--text-primary)]">
            Stay Informed. Stay Balanced.
          </h3>
          <p className="text-[13px] text-[var(--text-secondary)]">
            Get the top stories and bias analysis delivered to your inbox.
          </p>
        </div>

        {/* Right Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-2.5 rounded-[var(--radius-md)] border border-[#D1D5DB] bg-white text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[#0D0D0F] min-w-[240px]"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-[var(--radius-md)] bg-[#0D0D0F] text-white text-[13px] font-semibold hover:bg-black transition-colors cursor-pointer text-center shrink-0"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}
