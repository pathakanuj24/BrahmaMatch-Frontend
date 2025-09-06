"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do you prevent fake profiles?",
    a: "We manually verify each profile through ID checks to ensure authenticity and safety.",
  },
  {
    q: "Is my personal information secure?",
    a: "Yes. We use industry-standard encryption and give you full control over visibility.",
  },
  {
    q: "Can I search for matches in my city?",
    a: "Absolutely. Use filters to discover people close to your location.",
  },
  {
    q: "Do you allow profiles from outside the Brahmin community?",
    a: "Our focus is community-first, but you can open preferences as you wish.",
  },
  {
    q: "How much does it cost to join?",
    a: "You can start for free. Premium plans are optional for extra features.",
  },
  {
    q: "Can I hide my profile from public search?",
    a: "Yes. Turn on ‘Private Profile’ in settings to stay discoverable only to matches you allow.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="w-full bg-background py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#121212] mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="rounded-md bg-[#F7F5F3] border border-[#00000014]"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left px-4 sm:px-6 py-4"
                >
                  <span className="text-sm sm:text-base font-semibold text-[#121212]">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-[#121212]/70 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* answer */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 sm:px-6 pb-4 text-sm text-[#121212]/80">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ask Now CTA */}
        <div className="mt-12 flex flex-col items-center text-center">
          <p className="text-xs sm:text-sm font-semibold text-[#121212]/80">
            Still Have Questions?
          </p>
          <p className="mt-1 text-xs sm:text-sm text-[#121212]/70">
            We’re here to help you every step of the way.
          </p>
          <button className="mt-4 bg-foreground text-white px-6 py-2 rounded-full text-sm sm:text-base font-medium hover:bg-foreground/90 transition">
            Ask Now
          </button>
        </div>
      </div>
    </section>
  );
}
