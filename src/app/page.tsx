"use client";

import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import NewsletterForm from "@/components/ui/NewsletterForm";
import { useGsap } from "@/hooks/useGsap";
import { useRef } from "react";
import gsap from "gsap";

export default function Home() {
  const featuredProducts = products.slice(1, 4);
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useGsap((tl) => {
    // Hero background animation - slow floating zoom
    gsap.to(".hero-bg", {
      scale: 1.15,
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Parallax effect on scroll for hero background
    gsap.to(".hero-bg", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Parallax for hero content
    gsap.to(".hero-content", {
      yPercent: -20,
      opacity: 0.5,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Philosophy section parallax and reveal
    const philosophyTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".philosophy-section",
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1
      }
    });

    philosophyTl.from(".philosophy-image", {
      y: 100,
      scale: 0.9,
      ease: "power2.out"
    });

    // Product reveal stagger
    gsap.from(".product-grid > div", {
      y: 60,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".product-grid",
        start: "top 85%"
      }
    });

    // Editorial Spread parallax
    gsap.to(".editorial-image", {
      yPercent: -15,
      ease: "none",
      scrollTrigger: {
        trigger: ".editorial-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  return (
    <main ref={containerRef} className="relative overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="hero-bg absolute inset-0">
            <Image
              src="/images/brand/hero.png"
              alt="Editorial Background"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] luxury-noise" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full mt-20 hero-content">
          <div className="max-w-4xl">
            <FadeIn delay={0.2}>
              <h1 className="text-7xl md:text-[11rem] font-headline text-surface leading-[0.82] tracking-tighter mb-8 mix-blend-plus-lighter">
                Ritual<br />over<br />routine.
              </h1>
            </FadeIn>
            <FadeIn delay={0.4}>
              <p className="text-surface font-body text-lg md:text-xl max-w-sm mb-12 leading-relaxed opacity-90 border-l border-surface/30 pl-8">
                Thoughtfully crafted formulas designed to bring balance and calm to your daily life. Conscious simplicity for everyday radiance.
              </p>
            </FadeIn>
            <FadeIn delay={0.6}>
              <Button href="/collections" variant="ghost" className="border-surface text-surface hover:bg-surface hover:text-primary backdrop-blur-md">
                Explore Collections
              </Button>
            </FadeIn>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.4em] text-surface opacity-50 font-bold">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-surface/50 to-transparent" />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="philosophy-section py-section-gap px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <FadeIn>
              <SectionHeading
                label="Philosophy"
                title="New philosophy of selfcare: healthy skin & mind."
                description="Teara is about conscious simplicity — effective formulas, thoughtful ingredients, and soft textures designed for real everyday life. We believe skincare should support your skin, not overwhelm it."
              />
              <div className="mt-10">
                <Button href="/philosophy" variant="text">Learn more about Teara</Button>
              </div>
            </FadeIn>
          </div>
          <div className="philosophy-image relative aspect-[4/5] bg-surface-container overflow-hidden rounded-lg shadow-2xl">
            <Image
              src="/images/brand/philosophy.png"
              alt="Philosophy Image"
              fill
              className="object-cover scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-section-gap bg-surface-container/50 luxury-noise">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <SectionHeading
              label="The Essentials"
              title="Pure care by nature."
              className="max-w-xl"
            />
            <Button href="/collections" variant="text">View All Collections</Button>
          </div>

          <div className="product-grid grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            {featuredProducts.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All-in-One Complex Editorial Spread */}
      <section className="editorial-section py-section-gap px-6 md:px-12">
        <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden bg-primary text-surface relative shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 md:p-24 flex flex-col justify-center relative z-10">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold mb-8 block opacity-60">
                Featured Innovation
              </span>
              <h2 className="text-5xl md:text-8xl font-headline mb-10 leading-[0.95] tracking-tight">
                All-in-One<br />Skincare<br />Complex
              </h2>
              <p className="text-lg md:text-xl opacity-80 leading-relaxed mb-16 max-w-md">
                Multifunctional line designed to simplify your daily routine without compromising results. Each formula combines hydration, barrier support, and balancing ingredients.
              </p>
              <Button href="/products/all-in-one" variant="ghost" className="border-surface/40 text-surface hover:bg-surface hover:text-primary w-fit">
                Discover the Complex
              </Button>
            </div>
            <div className="min-h-[500px] lg:min-h-full relative overflow-hidden">
              <div className="editorial-image absolute inset-0 scale-125">
                <Image
                  src="/images/brand/rituals.png"
                  alt="Ritual Visual"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-section-gap-mobile md:py-section-gap px-6 md:px-12 border-t border-outline/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <SectionHeading
            label="The Journal"
            title="Join the Journal"
            description="Subscribe for quiet reflections on self-care, exclusive access to new rituals, and a slower approach to beauty."
          />
          <NewsletterForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
