export const useHaptic = () => {
  const light = () => {
    if ('vibrate' in navigator) navigator.vibrate(10);
  };
  const medium = () => {
    if ('vibrate' in navigator) navigator.vibrate(25);
  };
  const heavy = () => {
    if ('vibrate' in navigator) navigator.vibrate(50);
  };
  return { light, medium, heavy };
};
