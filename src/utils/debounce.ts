export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
) {
  let timeoutId: number | undefined;

  const debounced = (...args: Parameters<T>) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };

  debounced.cancel = () => {
    window.clearTimeout(timeoutId);
  };

  return debounced;
}
