import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export default function AccountPage() {
    return (
        <main>
            <Navbar />
            <section className="pt-40 pb-20 px-6 md:px-12">
                <div className="max-w-4xl mx-auto">
                    <SectionHeading
                        label="Dashboard"
                        title="Welcome back, Sarah"
                        description="Manage your orders, saved rituals, and botanical subscriptions."
                        className="mb-16"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-2 space-y-12">
                            <section>
                                <h3 className="text-xl font-headline border-b border-outline/10 pb-4 mb-8">Recent Orders</h3>
                                <div className="bg-surface-container p-6 rounded-sm flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-bold">Order #TR-8829</p>
                                        <p className="text-xs text-on-surface-variant">Placed on May 12, 2024 • Delivered</p>
                                    </div>
                                    <Button variant="text" className="min-w-0">View</Button>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xl font-headline border-b border-outline/10 pb-4 mb-8">Saved Rituals</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="border border-outline/10 p-6 rounded-sm">
                                        <p className="text-xs uppercase tracking-widest font-bold text-primary mb-2">Morning</p>
                                        <h4 className="font-headline text-lg mb-4">The Mist Garden</h4>
                                        <Button variant="text" className="px-0">Start Ritual</Button>
                                    </div>
                                    <div className="border border-outline/10 p-6 rounded-sm opacity-50 italic">
                                        <p className="text-sm">Save a ritual to see it here.</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="space-y-12">
                            <section>
                                <h3 className="text-xl font-headline border-b border-outline/10 pb-4 mb-8">Profile</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest font-bold opacity-50">Email</p>
                                        <p className="text-sm">sarah.j@example.com</p>
                                    </div>
                                    <Button variant="text" className="px-0">Edit Account</Button>
                                    <Button variant="text" className="px-0 text-red-800">Logout</Button>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
