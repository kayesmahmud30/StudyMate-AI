import Hero from "./components/Header/Hero";
import Testimonials from "./components/HeroComponents/Testimonials";
import QNA from "./components/HeroComponents/QNA";
import NewsLetter from "./components/HeroComponents/NewsLetter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Testimonials />
      <QNA />
      <NewsLetter />
    </>
  );
}
