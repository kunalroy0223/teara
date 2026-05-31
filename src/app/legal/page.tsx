import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";

export default function LegalPage() {
    return (
        <main>
            <Navbar />
            <section className="pt-40 pb-20 px-6 md:px-12">
                <div className="max-w-3xl mx-auto">
                    <SectionHeading
                        label="Information"
                        title="Legal & Privacy"
                        description="Our commitment to transparency, data protection, and ethical business practices."
                        className="mb-16"
                    />

                    <div className="prose prose-sm max-w-none space-y-12 text-on-surface-variant leading-loose">
                        <section>
                            <h3 className="text-xl font-headline text-on-surface mb-4">Terms of Service</h3>
                            <p>By accessing and using Teara, you agree to follow the guidelines and terms outlined here. Our products are intended for personal use and wellness ritual enhancement.</p>
                        </section>
                        <section>
                            <h3 className="text-xl font-headline text-on-surface mb-4">Privacy Policy</h3>
                            <p>Your privacy is paramount. We only collect the data necessary to fulfill your orders and provide a personalized journal experience. We never sell your information to third parties.</p>
                        </section>
                        <section>
                            <h3 className="text-xl font-headline text-on-surface mb-4">Shipping & Returns</h3>
                            <p>We ship plastic-free. If you are not satisfied with your ritual, we offer a 30-day return policy for unopened products. Sustainable beauty should be stress-free.</p>
                        </section>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
