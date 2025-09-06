"use client";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#F7F5F3] border-t border-[#00000010]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
        {/* Top: Brand + Columns */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-10">
          {/* Brand / Tagline */}
          <div className="lg:w-1/3 flex flex-col items-center lg:items-start">
            <div className="text-foreground font-semibold text-xl leading-7">
              BrahmaMatch
            </div>
            <br/>
            <p className="mt-4 italic font-semibold text-foreground text-center lg:text-left">
            “Where Traditions Meet True Love”
            </p>


          </div>

          {/* Right side: 3 compact columns */}
          <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-[#121212] mb-3">Quick Links</h4>
              <ul className="space-y-1.5 text-[#121212]/80 text-sm">
                <li><Link href="#about">About Us</Link></li>
                <li><Link href="#how">How It Works</Link></li>
                <li><Link href="#stories">Success Stories</Link></li>
                <li><Link href="#faqs">FAQs</Link></li>
                <li><Link href="#contact">Contact</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-[#121212] mb-3">Support</h4>
              <ul className="space-y-1.5 text-[#121212]/80 text-sm">
                <li><Link href="#privacy">Privacy Policy</Link></li>
                <li><Link href="#terms">Terms &amp; Conditions</Link></li>
                <li><Link href="#help">Help &amp; Support</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-[#121212] mb-3">Contact Info</h4>
              <ul className="space-y-2 text-[#121212]/80 text-sm">
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5" />
                  <span>+91 9876543210</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5" />
                  <span>support@brahmamatch</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>123 Tech Park, Bangalore, Karnataka, India – 560001</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social row centered (like your reference) */}
        <div className="mt-6 flex justify-center gap-5 text-[#121212]/80">
          <Link href="#" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></Link>
          <Link href="#" aria-label="Twitter"><Twitter className="w-5 h-5" /></Link>
          <Link href="#" aria-label="Facebook"><Facebook className="w-5 h-5" /></Link>
          <Link href="#" aria-label="Instagram"><Instagram className="w-5 h-5" /></Link>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 border-t border-[#00000010] text-xs text-[#121212]/70">
          BrahmaMatch © {new Date().getFullYear()}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
