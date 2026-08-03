import {
  type RefObject,
  useLayoutEffect,
  useState,
} from "react";

export type ConnectionGeometry = {
  startX: number;
  startY: number;
  length: number;
  angle: number;
};

type ConnectionRefs = {
  rootRef: RefObject<HTMLElement | null>;
  anchorRef: RefObject<SVGCircleElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  enabled: boolean;
};

export function useConnectionLine({
  rootRef,
  anchorRef,
  panelRef,
  enabled,
}: ConnectionRefs): ConnectionGeometry | null {
  const [geometry, setGeometry] = useState<ConnectionGeometry | null>(null);

  useLayoutEffect(() => {
    if (!enabled) {
      setGeometry(null);
      return;
    }

    const root = rootRef.current;
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!root || !anchor || !panel) return;

    let frame = 0;

    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rootRect = root.getBoundingClientRect();
        const anchorRect = anchor.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();

        const startX = anchorRect.left + anchorRect.width / 2 - rootRect.left;
        const startY = anchorRect.top + anchorRect.height / 2 - rootRect.top;

        const panelIsBeside = panelRect.left > anchorRect.right;
        const targetX = panelIsBeside
          ? panelRect.left - rootRect.left + 4
          : panelRect.left + panelRect.width / 2 - rootRect.left;
        const targetY = panelIsBeside
          ? panelRect.top + panelRect.height * 0.35 - rootRect.top
          : panelRect.top - rootRect.top + 4;

        const dx = targetX - startX;
        const dy = targetY - startY;

        setGeometry({
          startX,
          startY,
          length: Math.hypot(dx, dy),
          angle: Math.atan2(dy, dx) * (180 / Math.PI),
        });
      });
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(root);
    observer.observe(panel);
    window.addEventListener("resize", measure, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [anchorRef, enabled, panelRef, rootRef]);

  return geometry;
}
