import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

export function useScrollRestoration({
  activeTab,
  setActiveTab,
  visibleCount,
  setVisibleCount,
  loading,
  productsLength,
}) {
  const pathname = usePathname();
  const hasRestored = useRef(false);

  // 1. Tell the browser to back off and let us handle scroll natively
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // 2. Restore State (Tab & Count) on Mount BEFORE products fetch
  useEffect(() => {
    const saved = sessionStorage.getItem(`scroll_${pathname}`);
    if (saved && !hasRestored.current) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.tab) setActiveTab(parsed.tab);
        if (parsed.visibleCount) setVisibleCount(parsed.visibleCount);
      } catch (e) {
        console.error("Failed to parse scroll state", e);
      }
    }
  }, [pathname, setActiveTab, setVisibleCount]);

  // 3. Perform Precise Scroll Action AFTER DOM is completely stabilized
  useEffect(() => {
    // Wait until loading is done and we actually have elements mapped
    if (loading || productsLength === 0 || hasRestored.current) return;

    const saved = sessionStorage.getItem(`scroll_${pathname}`);
    if (!saved) return;

    try {
      const { scrollY, productId } = JSON.parse(saved);

      // Double requestAnimationFrame ensures absolute DOM paint & image slotting completes
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          let targetY = scrollY;

          // Attempt to find the specific element for pixel-perfect offset calculation
          if (productId) {
            const el = document.getElementById(`prod-card-${productId}`);
            if (el) {
              const rect = el.getBoundingClientRect();
              // Calculate absolute Y position relative to document top, minus 120px for headers
              const absoluteY = window.scrollY + rect.top - 120; 
              targetY = absoluteY > 0 ? absoluteY : scrollY;
            }
          }

          // Instant behavior prevents visual flickering
          window.scrollTo({ top: targetY, behavior: "instant" });
          hasRestored.current = true;

          // Clean up to prevent ghost-restores on fresh visits
          sessionStorage.removeItem(`scroll_${pathname}`);
        });
      });
    } catch (e) {
      console.error("Scroll restoration failed", e);
    }
  }, [loading, productsLength, pathname]);

  // 4. Capture function to attach to product cards
  const captureScrollState = useCallback((productId) => {
    sessionStorage.setItem(
      `scroll_${pathname}`,
      JSON.stringify({
        tab: activeTab,
        visibleCount: visibleCount,
        scrollY: window.scrollY,
        productId,
      })
    );
  }, [pathname, activeTab, visibleCount]);

  return { captureScrollState };
}