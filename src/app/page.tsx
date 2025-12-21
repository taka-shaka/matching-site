import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Concept } from "@/components/sections/Concept";
import { Features } from "@/components/sections/Features";
import { Cases } from "@/components/sections/Cases";
import { Companies } from "@/components/sections/Companies";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <Concept />
        <Features />
        <Cases />
        <Companies />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
