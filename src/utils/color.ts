export function stringToColor(str: string): string {
  let hue = 0;
  for (let i = 0; i < str.length; i++) {
    hue += str.charCodeAt(i);
  }
  hue %= 360;
  const saturation = '45%';
  const lightness = '65%';
  return `hsl(${hue}, ${saturation}, ${lightness})`;
}
