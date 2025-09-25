export function useFadeIn(y = 20, duration = 0.3) {
  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y },
    transition: { duration },
  };
}
