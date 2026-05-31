import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export const useGsap = (
    callback: (tl: gsap.core.Timeline) => void,
    deps: React.DependencyList = []
) => {
    const root = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();
            callback(tl);
        }, root);

        return () => ctx.revert();
    }, [callback, ...deps]);

    return root;
};