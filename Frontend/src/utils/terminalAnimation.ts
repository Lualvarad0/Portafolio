export const typeWriter = (
  text: string,
  setCommand: (val: string) => void,
  speed: number = 60
) => {
  let i = 0;
  const interval = setInterval(() => {
    setCommand(text.slice(0, i));
    i++;
    if (i > text.length) clearInterval(interval);
  }, speed);
  return () => clearInterval(interval);
};
