
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import ImageCarousel from "@/components/ImageCarousel";
import WhyChooseUs from "@/components/WhyChooseUs";
import Stories from "@/components/Stories";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <main className="bg-background min-h-screen flex flex-col">
      <Navbar />
      <HeroSection/>
      <ImageCarousel/>
      <WhyChooseUs />
      <Stories/>
      <FAQSection/>
      <Footer/>

    </main>
  );
}
