import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";

export default function SustainabilityPage() {
    return (
        <main>
            <Navbar />

            <section className="pt-40 pb-20 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <FadeIn>
                        <SectionHeading
                            label="Commitment"
                            title="Plastic neutral by 2025. Earth positive forever."
                            description="Sustainability is not a goal at Teara; it is our baseline. Every decision, from how we source our Reishi to the type of ink on our boxes, is guided by our commitment to the planet."
                        />
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
                        <FadeIn delay={0.1}>
                            <h4 className="text-xl font-headline mb-4">Ethical Sourcing</h4>
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                                We work directly with Himalayan smallholder farmers, ensuring fair wages and supporting the preservation of traditional botanical knowledge.
                            </p>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <h4 className="text-xl font-headline mb-4">Circular Packaging</h4>
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                                Our glass jars are infinitely recyclable, and our secondary packaging is made from FSC-certified paper with vegetable-based inks.
                            </p>
                        </FadeIn>
                        <FadeIn delay={0.3}>
                            <h4 className="text-xl font-headline mb-4">Ecological Restoration</h4>
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                                For every product sold, we contribute to high-altitude reforestation projects in the Darjeeling region.
                            </p>
                        </FadeIn>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 md:px-12 bg-primary text-surface">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <FadeIn>
                        <h2 className="text-4xl md:text-5xl font-headline mb-8 leading-tight">Zero Waste Ambition</h2>
                        <p className="text-lg opacity-80 leading-relaxed mb-10">
                            We are currently transitioning to a fully refillable model for our core essentials. Our goal is to eliminate single-use components from our system entirely by the end of next year.
                        </p>
                    </FadeIn>
                    <div className="aspect-video relative rounded-sm overflow-hidden border border-surface/20">
                        <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbc3dXmS1Ad_O09YsTMrAvkjmiF0halQl3jMBk4aFC78TB3St7ovAmSbHkOI__S3vHXC2fR6ZiMImowWKHPUgcKJQa66OZ5U0YLD4w7jMS2voY9OWntgjGnaLqalAleafivfDokx2ECKf4bBJu9-yY3AJCmfH8W_ZTZAL389ahqWpgsc2-yhsSSbjktZv-H0Q_fhJPDpYIE4Tato63QXSpM7H8kcYu3dxHkBmvklbM1oz7ZeEpymtyztEIFSh6PYTAtKCmgR1vFSvt"
                            alt="Sustainability visual"
                            fill
                            className="object-cover opacity-80"
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
