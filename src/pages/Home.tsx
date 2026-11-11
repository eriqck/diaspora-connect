import Hero from "./components/Hero";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";

function Home() {
  return (
    <main className="min-h-screen bg-(--color-background) text-(--color-ink)">
      <Hero />

      <Services />

      <Testimonials />

    </main>
  );
}

export default Home;
