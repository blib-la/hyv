import { useAtom } from "jotai";
import { RefObject, useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { scrollSpyAtom } from "@/docs/atoms";

export function useScrollSpy(ref: RefObject<HTMLDivElement>) {
	const [, setScrollSpy] = useAtom(scrollSpyAtom);

	useEffect(() => {
		const element = ref.current;
		// Use 5% offset
		const offset = 5;
		const intersectionObserver = new IntersectionObserver(
			async entries => {
				if (entries[0].intersectionRatio <= 0) {
					return;
				}

				if (element.id) {
					setScrollSpy(element.id);
				}
			},
			{ rootMargin: `${-offset}% 0% ${-100 + offset}%` }
		);
		if (element && element.id) {
			intersectionObserver.observe(element);
		}

		return () => {
			if (element) {
				intersectionObserver.unobserve(element);
			}
		};
	}, []);
}
