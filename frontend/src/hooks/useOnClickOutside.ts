import { useEffect } from "react";
import type { RefObject } from "react";

/**
 * Calls `onOutsideClick` when a pointer event occurs outside the
 * referenced element. Useful for closing dropdowns/popovers/menus.
 */
export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutsideClick: () => void
): void {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const node = ref.current;
      if (node && !node.contains(event.target as Node)) {
        onOutsideClick();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutsideClick]);
}
