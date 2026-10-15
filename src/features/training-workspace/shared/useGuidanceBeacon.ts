import { hints, type Hints } from "driver.js/hints";
import { useEffect, useRef } from "react";
import "driver.js/dist/hints.css";

const beacon = {
  side: "right",
  align: "center",
  animate: true,
  className: "training-driver-hint",
} as const;

/**
 * Shows one non-blocking turquoise Driver.js beacon next to the active semantic target
 * (`data-training-target`). Passing no target hides the beacon (e.g. Independent Test).
 */
export function useGuidanceBeacon(
  activeTarget: string | undefined,
  guidance: { id: string } | null | undefined,
) {
  const hintsRef = useRef<Hints | null>(null);

  useEffect(() => {
    const currentHints = hintsRef.current ?? hints({ overlay: false, beacon });
    hintsRef.current = currentHints;

    currentHints.hide();
    if (!activeTarget || !guidance) {
      currentHints.setHints([]);
      return;
    }

    const target = document.querySelector(
      `[data-training-target="${activeTarget}"]`,
    );
    if (!target) {
      currentHints.setHints([]);
      return;
    }

    currentHints.setHints([{ id: guidance.id, element: target, beacon }]);
    currentHints.show();

    return () => {
      currentHints.hide();
    };
    // The guidance object changes with every state change, so the beacon is re-anchored after re-renders.
  }, [activeTarget, guidance]);

  useEffect(
    () => () => {
      hintsRef.current?.hide();
      hintsRef.current = null;
    },
    [],
  );
}
