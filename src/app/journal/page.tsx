import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import { articles } from "@/lib/data";

export default function JournalPage() {
    return (
        <main>
            <Navbar />

            <section className="pt-40 pb-20 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <FadeIn>
                        <SectionHeading
                            label="The Journal"
                            title="Reflections on beauty and nature."
                            description="Stories of origin, the science of botanicals, and the quiet art of living well."
                            className="mb-20"
                        />
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
                        {articles.map((article, i) => (
                            <FadeIn key={article.id} delay={0.1 * i}>
                                <Link href={`/journal/${article.slug}`} className="group block">
                                    <div className="relative aspect-[3/2] overflow-hidden bg-surface-container mb-8 rounded-sm">
                                        <Image
                                            src={article.image}
                                            alt={article.title}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                        <div className="absolute top-6 left-6">
                                            <span className="bg-surface/90 backdrop-blur px-4 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full">
                                                {article.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-4 block">
                                            {article.date}
                                        </span>
                                        <h3 className="text-3xl font-headline mb-4 group-hover:text-primary transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-on-surface-variant leading-relaxed mb-6">
                                            {article.excerpt}
                                        </p>
                                        <span className="text-xs uppercase tracking-widest font-bold border-b border-primary pb-1 group-hover:pr-4 transition-all duration-500">
                                            Read More
                                        </span>
                                    </div>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
