import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";

const discoveryCards = [
    { title: "Botanical Raw Materials", category: "Origin" },
    { title: "The Science of High Altitude", category: "Research" },
    { title: "Elevated Application", category: "Ritual" },
    { title: "Restoration Projects", category: "Planet" },
];

export default function DiscoveryPage() {
    return (
        <main>
            <Navbar />
            <section className="pt-40 pb-20 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <FadeIn>
                        <SectionHeading
                            label="Explore"
                            title="Discovery"
                            description="A visual journey through the elements that define the Teara experience."
                            className="mb-20"
                        />
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {discoveryCards.map((card, i) => (
                            <FadeIn key={card.title} delay={0.1 * i}>
                                <div className="group relative aspect-[16/9] overflow-hidden rounded-sm cursor-pointer">
                                    <Image
                                        src="/images/brand/discovery.png"
                                        alt={card.title}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                                    <div className="absolute bottom-10 left-10 text-surface">
                                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-70 mb-2 block">{card.category}</span>
                                        <h3 className="text-3xl font-headline">{card.title}</h3>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
