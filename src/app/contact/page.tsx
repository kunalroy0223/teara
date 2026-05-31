import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";

export default function ContactPage() {
    return (
        <main>
            <Navbar />

            <section className="pt-40 pb-20 px-6 md:px-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">
                    <FadeIn>
                        <SectionHeading
                            label="Contact"
                            title="We'd love to hear from you."
                            description="For inquiries about products, rituals, or wholesale, please reach out to our team."
                        />

                        <div className="mt-16 space-y-8">
                            <div>
                                <h4 className="text-[10px] uppercase tracking-widest font-bold text-primary mb-2">Email</h4>
                                <p className="text-xl font-headline">care@teara.com</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] uppercase tracking-widest font-bold text-primary mb-2">Journal Inquiries</h4>
                                <p className="text-xl font-headline">editorial@teara.com</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] uppercase tracking-widest font-bold text-primary mb-2">Location</h4>
                                <p className="text-on-surface-variant leading-relaxed">
                                    The Mist Garden, Gandhi Road<br />
                                    Darjeeling, West Bengal 734101
                                </p>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <form className="space-y-8 bg-surface-container p-12 rounded-sm border border-outline/5">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold">Name</label>
                                <input type="text" className="w-full bg-transparent border-b border-outline/20 py-2 focus:outline-none focus:border-primary transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold">Email</label>
                                <input type="email" className="w-full bg-transparent border-b border-outline/20 py-2 focus:outline-none focus:border-primary transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold">Subject</label>
                                <select className="w-full bg-transparent border-b border-outline/20 py-2 focus:outline-none focus:border-primary transition-colors">
                                    <option>General Inquiry</option>
                                    <option>Product Support</option>
                                    <option>Wholesale</option>
                                    <option>Press</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold">Message</label>
                                <textarea rows={4} className="w-full bg-transparent border-b border-outline/20 py-2 focus:outline-none focus:border-primary transition-colors resize-none"></textarea>
                            </div>
                            <Button type="submit" className="w-full">Send Message</Button>
                        </form>
                    </FadeIn>
                </div>
            </section>

            <Footer />
        </main>
    );
}
