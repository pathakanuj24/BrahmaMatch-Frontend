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
    <section className="w-full bg-background py-12">
      {/* Full-width row, no wrapping */}
      <div className="flex flex-row justify-center gap-6 overflow-hidden">
        {images.map((src, idx) => (
          <div
            key={idx}
            className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
          >
            <Image
              src={src}
              alt={`Couple ${idx + 1}`}
              width={360}  // each image width
              height={320} // fixed height
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
