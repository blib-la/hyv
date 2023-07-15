import { useAtom } from "jotai";
import { useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { scrollSpyAtom } from "@/docs/atoms";

export function useScrollSpy(id: string) {
	const [, setScrollSpy] = useAtom(scrollSpyAtom);

	useEffect(() => {
		const intersectionObserver = new IntersectionObserver(
			async entries => {
				if (entries[0].intersectionRatio <= 0) {
					return;
				}

				setScrollSpy(id);
			},
			{ rootMargin: "-5% 0% -95% 0%" }
		);
		intersectionObserver.observe(document.getElementById(id));
		return () => {
			intersectionObserver.unobserve(document.getElementById(id));
		};
	}, [id]);
}
