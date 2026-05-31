import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export default function CheckoutPage() {
    return (
        <main>
            <Navbar />

            <section className="pt-40 pb-20 px-6 md:px-12">
                <div className="max-w-4xl mx-auto">
                    <SectionHeading
                        label="Checkout"
                        title="Complete your order"
                        className="mb-16"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <h3 className="text-xl font-headline border-b border-outline/10 pb-4">Shipping Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="First Name" className="bg-transparent border-b border-outline/20 py-2 focus:outline-none text-sm" />
                                    <input placeholder="Last Name" className="bg-transparent border-b border-outline/20 py-2 focus:outline-none text-sm" />
                                </div>
                                <input placeholder="Address" className="w-full bg-transparent border-b border-outline/20 py-2 focus:outline-none text-sm" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="City" className="bg-transparent border-b border-outline/20 py-2 focus:outline-none text-sm" />
                                    <input placeholder="Postal Code" className="bg-transparent border-b border-outline/20 py-2 focus:outline-none text-sm" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-headline border-b border-outline/10 pb-4">Payment</h3>
                                <input placeholder="Card Number" className="w-full bg-transparent border-b border-outline/20 py-2 focus:outline-none text-sm" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="MM/YY" className="bg-transparent border-b border-outline/20 py-2 focus:outline-none text-sm" />
                                    <input placeholder="CVC" className="bg-transparent border-b border-outline/20 py-2 focus:outline-none text-sm" />
                                </div>
                            </div>

                            <Button className="w-full">Place Order — $95.00</Button>
                        </div>

                        <div className="bg-surface-container p-8 rounded-sm self-start">
                            <h3 className="text-xl font-headline mb-8">Order Summary</h3>
                            <div className="space-y-6 mb-8 pb-8 border-b border-outline/10">
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 bg-surface relative overflow-hidden rounded-sm">
                                            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-outline-variant">Image</div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Restorative Balm</p>
                                            <p className="text-[10px] text-on-surface-variant">Qty: 1</p>
                                        </div>
                                    </div>
                                    <p className="text-sm">$95.00</p>
                                </div>
                            </div>

                            <div className="space-y-4 text-sm font-bold">
                                <div className="flex justify-between opacity-70">
                                    <span>Subtotal</span>
                                    <span>$95.00</span>
                                </div>
                                <div className="flex justify-between opacity-70">
                                    <span>Shipping</span>
                                    <span>FREE</span>
                                </div>
                                <div className="flex justify-between text-lg pt-4 border-t border-outline/10">
                                    <span className="font-headline">Total</span>
                                    <span className="font-headline">$95.00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
