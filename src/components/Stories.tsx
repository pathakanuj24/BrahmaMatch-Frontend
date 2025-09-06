"use client";
import Image from "next/image";

const stories = [
  {
    text: "The location-based suggestions helped me discover someone from my hometown. We connected instantly. Also, I felt completely safe with the platform's privacy settings and verified profiles.",
    name: "Rohit, 32",
    location: "Udaipur",
    avatar: "https://placehold.co/80x80/png?text=R",
  },
  {
    text: "Being part of a community-first matchmaking experience made all the difference. The suggestions were thoughtful, and the whole process felt more human than algorithmic.",
    name: "Sneha, 27",
    location: "Chennai",
    avatar: "https://placehold.co/80x80/png?text=S",
  },
  {
    text: "I was initially skeptical about online matchmaking, but BrahmaMatch changed my perspective. I found someone who understands me and shares my values.",
    name: "Rohit M.",
    location: "Delhi",
    avatar: "https://placehold.co/80x80/png?text=M",
  },
  {
    text: "We met on BrahmaMatch and within months realized we were made for each other. Today we are happily married!",
    name: "Kavya & Amit",
    location: "Jaipur",
    avatar: "https://placehold.co/80x80/png?text=K",
  },
];

export default function Stories() {
  return (
    <section className="w-full bg-background py-20 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#121212] mb-10 sm:mb-14">
          Stories That Started Here
        </h2>

        {/* Scrolling Container */}
        <div className="relative w-full overflow-hidden">
          <div className="flex animate-marquee gap-6 sm:gap-8">
            {[...stories, ...stories].map((story, idx) => (
              <div
                key={idx}
                className="bg-[#F7F5F3] p-6 sm:p-8 md:p-10 rounded-xl shadow-lg 
                           w-[280px] sm:w-[350px] md:w-[500px] flex-shrink-0"
              >
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-[#121212]/90 mb-4 sm:mb-6">
                  “{story.text}”
                </p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <Image
                    src={story.avatar}
                    alt={story.name}
                    width={40}
                    height={40}
                    className="sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-sm sm:text-base md:text-lg text-[#121212]">
                      {story.name}
                    </p>
                    <p className="text-xs sm:text-sm text-[#121212]/70">
                      {story.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
