import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import News from "@/components/News";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-80px)] flex-1">
        <Hero />
        <About />
        <Services />
        <News />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

