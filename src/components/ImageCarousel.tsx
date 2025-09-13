"use client";
import Image from "next/image";

const images = [
  "/c1.png",
  "/c2.png",
  "/c3.png",
  "/c4.png",
 
];

export default function ImageRow() {
  return (
    <section className="w-full bg-background py-8 sm:py-12">
      {/* Responsive grid for mobile, flex row for desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-row lg:justify-center gap-3 sm:gap-4 lg:gap-6 overflow-hidden px-4 sm:px-6">
        {images.map((src, idx) => (
          <div
            key={idx}
            className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            <Image
              src={src}
              alt={`Couple ${idx + 1}`}
              width={360}  // each image width
              height={320} // fixed height
              className="object-cover w-full h-48 sm:h-64 lg:h-80"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
