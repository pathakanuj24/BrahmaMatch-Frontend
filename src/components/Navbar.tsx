"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full h-[72px] bg-[#F7F5F3] flex items-center justify-between px-10 relative">
      {/* Left: Brand */}
      <div className="flex items-center gap-3 ml-4">
        <span className="text-[#851E3E] font-semibold text-xl leading-7">
          BrahmaMatch
        </span>
      </div>

      {/* Desktop Links + Sign Up */}
      <div className="hidden md:flex items-center gap-8 font-medium text-base leading-6">
        <Link href="/" className="text-[#121212] hover:text-[#851E3E] transition">
          Home
        </Link>
        <Link href="#about" className="text-[#121212] hover:text-[#851E3E] transition">
          About
        </Link>
        <Link href="#community" className="text-[#121212] hover:text-[#851E3E] transition">
          Community
        </Link>
        <Link href="#events" className="text-[#121212] hover:text-[#851E3E] transition">
          Events
        </Link>

        {/* Sign Up navigates to /login */}
        <Link
          href="/login"
          className="ml-6 inline-block border border-[#851E3E] text-[#851E3E] text-base leading-6 px-8 py-2 rounded-full font-medium hover:bg-[#851E3E] hover:text-white transition"
        >
          Login
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-[#851E3E] focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-[72px] left-0 w-full bg-[#F7F5F3] flex flex-col items-center gap-6 py-6 md:hidden shadow-lg z-50">
          <Link
            href="/"
            className="text-[#121212] text-base leading-6 hover:text-[#851E3E] transition"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="#about"
            className="text-[#121212] text-base leading-6 hover:text-[#851E3E] transition"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            href="#community"
            className="text-[#121212] text-base leading-6 hover:text-[#851E3E] transition"
            onClick={() => setIsOpen(false)}
          >
            Community
          </Link>
          <Link
            href="#events"
            className="text-[#121212] text-base leading-6 hover:text-[#851E3E] transition"
            onClick={() => setIsOpen(false)}
          >
            Events
          </Link>

          {/* Mobile Sign Up navigates to /login and closes menu */}
          <Link
            href="/login"
            className="border border-[#851E3E] text-[#851E3E] text-base leading-6 px-8 py-2 rounded-full font-medium hover:bg-[#851E3E] hover:text-white transition"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
