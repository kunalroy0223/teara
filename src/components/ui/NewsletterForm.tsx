"use client";

import { useState } from "react";
import Button from "./Button";

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "success">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setStatus("success");
            setEmail("");
        }
    };

    return (
        <div className="w-full">
            {status === "success" ? (
                <p className="text-primary font-headline text-2xl italic animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    Thank you for joining our journal.
                </p>
            ) : (
                <form onSubmit={handleSubmit} className="relative max-w-md">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full bg-transparent border-b border-outline/20 py-4 pr-32 text-lg focus:outline-none focus:border-primary transition-colors placeholder:text-outline-variant"
                    />
                    <div className="absolute right-0 bottom-2">
                        <Button type="submit" variant="text" className="px-0 min-w-0">
                            Join Journal
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
