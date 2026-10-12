import { useEffect, useState } from "react";

/**
 * Tracks whether a CSS media query currently matches. Useful when a
 * responsive decision needs to happen in JS/logic rather than pure
 * CSS (e.g. choosing a different chart height on mobile).
 *
 * Example: `const isDesktop = useMediaQuery("(min-width: 1024px)");`
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(mediaQueryList.matches);
    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
