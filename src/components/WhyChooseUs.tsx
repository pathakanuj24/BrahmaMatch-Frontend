// "use client";
// import { ShieldCheck, Users, Lock, MapPin } from "lucide-react";

// const features = [
//   {
//     icon: <ShieldCheck className="w-8 h-8 text-foreground" />,
//     title: "Verified Profiles",
//     description: "Genuine connections, no fake profiles.",
//   },
//   {
//     icon: <Users className="w-8 h-8 text-foreground" />,
//     title: "Community-First Matchmaking",
//     description: "Matches that understand your values and culture.",
//   },
//   {
//     icon: <Lock className="w-8 h-8 text-foreground" />,
//     title: "Safe & Private Environment",
//     description: "Your information stays private. Always.",
//   },
//   {
//     icon: <MapPin className="w-8 h-8 text-foreground" />,
//     title: "Preferences-Based Suggestions",
//     description: "Find matches effortlessly.",
//   },
// ];

// export default function WhyChooseUs() {
//   return (
//     <section className="w-full bg-background py-20">
//       <div className="w-[1440px] mx-auto px-6">
//         {/* Section Title */}
//         <h2 className="text-3xl font-bold text-foreground mb-12">
//           Why Choose Us
//         </h2>

//         {/* Feature Cards */}
//         <div className="grid grid-cols-4 gap-8">
//           {features.map((feature, idx) => (
//             <div
//               key={idx}
//               className="bg-[#F7F5F3FF] p-8 rounded-lg shadow-md hover:shadow-lg transition"
//             >
//               <div className="mb-4">{feature.icon}</div>
//               <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
//               <p className="text-sm text-foreground/80">{feature.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";
import { ShieldCheck, Users, Lock, MapPin } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-[#121212]" />,
    title: "Verified Profiles",
    description: "Genuine connections, no fake profiles.",
  },
  {
    icon: <Users className="w-8 h-8 text-[#121212]" />,
    title: "Community-First Matchmaking",
    description: "Matches that understand your values and culture.",
  },
  {
    icon: <Lock className="w-8 h-8 text-[#121212]" />,
    title: "Safe & Private Environment",
    description: "Your information stays private. Always.",
  },
  {
    icon: <MapPin className="w-8 h-8 text-[#121212]" />,
    title: "Preferences-Based Suggestions",
    description: "Find matches effortlessly.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full bg-background py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[#121212] mb-10 sm:mb-12">
          Why Choose Us
        </h2>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-[#F7F5F3] p-6 sm:p-8 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-lg text-[#121212] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[#121212]/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
