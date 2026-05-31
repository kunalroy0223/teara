import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export const useGsap = (callback: (tl: gsap.core.Timeline) => void, deps: any[] = []) => {
    const root = useRef<any>();

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();
            callback(tl);
        }, root.current);

        return () => ctx.revert();
    }, [callback, ...deps]);

    return root;
};
