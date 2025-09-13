"use client";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="w-full bg-background py-12 sm:py-16 lg:py-20 text-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#121212] leading-tight sm:leading-snug mb-4 sm:mb-6">
          Create Your Story with Someone Who Truly Gets You
        </h2>

        {/* Subtext */}
        <p className="text-base sm:text-lg text-[#121212]/80 mb-6 sm:mb-8 leading-relaxed">
          "Find your life partner within your own values, traditions, and trust"
        </p>

        {/* CTA → goes to /login */}
        <Link
          href="/login"
          className="inline-block bg-[#851E3E] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-base sm:text-lg shadow-md hover:bg-[#6a172f] transition transform hover:scale-105 active:scale-95"
        >
          Find Your Partner
        </Link>
      </div>
    </section>
  );
}
