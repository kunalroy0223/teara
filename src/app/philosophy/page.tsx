import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";

export default function PhilosophyPage() {
    return (
        <main>
            <Navbar />

            <section className="pt-40 pb-20 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <FadeIn>
                        <SectionHeading
                            label="Our Story"
                            title="Born in the Himalayas, refined for the world."
                            description="Teara began as a quiet observation of the resilient flora thriving in the high-altitude Darjeeling hills. We saw strength in simplicity and power in the botanical secrets passed down through generations."
                        />
                    </FadeIn>
                </div>
            </section>

            {/* Editorial Spread 1 */}
            <section className="py-20 px-6 md:px-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                    <div className="md:col-span-7">
                        <FadeIn direction="left">
                            <div className="aspect-video relative rounded-sm overflow-hidden bg-surface-container">
                                <Image
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbc3dXmS1Ad_O09YsTMrAvkjmiF0halQl3jMBk4aFC78TB3St7ovAmSbHkOI__S3vHXC2fR6ZiMImowWKHPUgcKJQa66OZ5U0YLD4w7jMS2voY9OWntgjGnaLqalAleafivfDokx2ECKf4bBJu9-yY3AJCmfH8W_ZTZAL389ahqWpgsc2-yhsSSbjktZv-H0Q_fhJPDpYIE4Tato63QXSpM7H8kcYu3dxHkBmvklbM1oz7ZeEpymtyztEIFSh6PYTAtKCmgR1vFSvt"
                                    alt="Himalayan landscape"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </FadeIn>
                    </div>
                    <div className="md:col-span-5">
                        <FadeIn direction="right" delay={0.2}>
                            <h3 className="text-3xl font-headline mb-6">High-Altitude Resilience</h3>
                            <p className="text-on-surface-variant leading-relaxed mb-8">
                                Our lead ingredients are sourced from gardens that breathe the crisp, thin air of the Himalayas. This extreme environment forces plants to develop potent antioxidants and protective compounds — the very same nutrients we bottle for your skin.
                            </p>
                            <Button href="/sustainability" variant="text">Explore our sourcing</Button>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Editorial Spread 2 (Inverted) */}
            <section className="py-20 px-6 md:px-12 bg-surface-container">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                    <div className="md:col-span-5 order-2 md:order-1">
                        <FadeIn direction="left" delay={0.2}>
                            <h3 className="text-3xl font-headline mb-6">Conscious Simplicity</h3>
                            <p className="text-on-surface-variant leading-relaxed">
                                We believe in fewer, better things. Each Teara formula is a multi-functional essential, designed to replace a cluttered shelf with a focused ritual. We strip away the noise to leave only what serves your skin and your spirit.
                            </p>
                        </FadeIn>
                    </div>
                    <div className="md:col-span-7 order-1 md:order-2">
                        <FadeIn direction="right">
                            <div className="aspect-video relative rounded-sm overflow-hidden bg-surface shadow-2xl">
                                <Image
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbc3dXmS1Ad_O09YsTMrAvkjmiF0halQl3jMBk4aFC78TB3St7ovAmSbHkOI__S3vHXC2fR6ZiMImowWKHPUgcKJQa66OZ5U0YLD4w7jMS2voY9OWntgjGnaLqalAleafivfDokx2ECKf4bBJu9-yY3AJCmfH8W_ZTZAL389ahqWpgsc2-yhsSSbjktZv-H0Q_fhJPDpYIE4Tato63QXSpM7H8kcYu3dxHkBmvklbM1oz7ZeEpymtyztEIFSh6PYTAtKCmgR1vFSvt"
                                    alt="Product still life"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
