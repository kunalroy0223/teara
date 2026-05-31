import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";

const rituals = [
    {
        title: "Morning Sun Ritual",
        time: "10 Minutes",
        focus: "Protect & Energize",
        steps: [
            "Cleanse with cool water to awaken the skin.",
            "Apply 3 drops of Botanical Serum to damp skin.",
            "Massage Moisture Cream in upward strokes.",
            "Mist with Balancing Toner for a final layer of hydration."
        ]
    },
    {
        title: "Evening Moon Ritual",
        time: "15 Minutes",
        focus: "Repair & Calm",
        steps: [
            "Double cleanse to remove the day's impurities.",
            "Press Restorative Balm into areas of concern.",
            "Deeply inhale the Reishi and Blue Tansy notes.",
            "Allow the dense formula to melt into the skin overnight."
        ]
    }
];

export default function RitualsPage() {
    return (
        <main>
            <Navbar />

            <section className="pt-40 pb-20 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <FadeIn>
                        <SectionHeading
                            label="The Rituals"
                            title="Slow down to speed up."
                            description="Skincare is not a chore; it is an opportunity for a quiet conversation with oneself. Discover our guided rituals designed for every time of day."
                        />
                    </FadeIn>

                    <div className="mt-20 space-y-32">
                        {rituals.map((ritual, i) => (
                            <FadeIn key={ritual.title} direction={i % 2 === 0 ? "left" : "right"}>
                                <div className={`grid grid-cols-1 md:grid-cols-2 gap-20 items-center ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
                                    <div className={i % 2 !== 0 ? "md:order-2" : ""}>
                                        <div className="aspect-square relative rounded-sm overflow-hidden bg-surface-container">
                                            <Image
                                                src="/images/brand/rituals.png"
                                                alt={ritual.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                            <div className="absolute inset-0 bg-primary/5" />
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-primary mb-4 block">
                                            {ritual.time} • {ritual.focus}
                                        </span>
                                        <h3 className="text-4xl font-headline mb-8">{ritual.title}</h3>
                                        <div className="space-y-6">
                                            {ritual.steps.map((step, index) => (
                                                <div key={index} className="flex gap-6 items-start pb-6 border-b border-outline/5">
                                                    <span className="text-xs font-headline opacity-30 mt-1">0{index + 1}</span>
                                                    <p className="text-on-surface-variant leading-relaxed">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-12">
                                            <Button href="/collections">Shop the Ritual</Button>
                                        </div>
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
