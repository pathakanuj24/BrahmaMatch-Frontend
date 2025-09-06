"use client";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="w-full bg-background py-20 text-center">
      <div className="max-w-3xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-[#121212] leading-snug mb-6">
          Create Your Story with Someone Who Truly Gets You
        </h2>

        {/* Subtext */}
        <p className="text-lg text-[#121212]/80 mb-8">
          "Find your life partner within your own values, traditions, and trust"
        </p>

        {/* CTA → goes to /login */}
        <Link
          href="/login"
          className="inline-block bg-[#851E3E] text-white px-8 py-3 rounded-full font-medium text-lg shadow-md hover:bg-[#6a172f] transition"
        >
          Find Your Partner
        </Link>
      </div>
    </section>
  );
}
