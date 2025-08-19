// A component to generate a unique, deterministic, and beautiful SVG pattern based on an ID.
// This is used to create a visually interesting background for recipe cards without using images.

const PATTERNS = [
  (id: number, color1: string, color2: string) => (
    <div
      className="absolute inset-0 h-full w-full"
      style={{
        backgroundImage: `radial-gradient(circle at top right, ${color2} 20%, transparent 60%), radial-gradient(circle at bottom left, ${color1} 20%, transparent 60%)`,
        backgroundColor: `hsl(var(--muted))`,
        opacity: 0.7
      }}
    />
  ),
  (id: number, color1: string, color2: string) => (
    <div
      className="absolute inset-0 h-full w-full"
      style={{
        backgroundColor: color1,
        backgroundImage: `linear-gradient(135deg, ${color2} 25%, transparent 25%), linear-gradient(225deg, ${color2} 25%, transparent 25%), linear-gradient(45deg, ${color2} 25%, transparent 25%), linear-gradient(315deg, ${color2} 25%, ${color1} 25%)`,
        backgroundSize: '40px 40px',
        opacity: 0.5
      }}
    />
  ),
  (id: number, color1: string, color2: string) => (
    <svg width="100%" height="100%" className="absolute inset-0 h-full w-full" style={{opacity: 0.6}}>
      <defs>
        <pattern id={`dots-${id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle fill={color2} cx="10" cy="10" r="5" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill={color1} />
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#dots-${id})`} />
    </svg>
  ),
  (id: number, color1: string, color2: string) => (
    <div
      className="absolute inset-0 h-full w-full"
      style={{
        backgroundColor: `hsl(var(--background))`,
        backgroundImage: `repeating-linear-gradient(45deg, ${color1} 0, ${color1} 2px, transparent 0, transparent 50%)`,
        backgroundSize: '10px 10px',
        opacity: 0.7,
      }}
    />
  ),
];

const COLORS = [
  ['hsl(var(--primary))', 'hsl(var(--accent))'],
  ['hsl(var(--chart-1))', 'hsl(var(--chart-2))'],
  ['hsl(var(--chart-3))', 'hsl(var(--chart-4))'],
  ['hsl(var(--chart-5))', 'hsl(var(--primary))'],
  ['hsl(var(--accent))', 'hsl(var(--chart-5))'],
];

export function RecipePattern({ id }: { id: number }) {
  const patternIndex = id % PATTERNS.length;
  const colorIndex = id % COLORS.length;
  
  const [color1, color2] = COLORS[colorIndex];
  
  const PatternComponent = PATTERNS[patternIndex];

  return <PatternComponent id={id} color1={color1} color2={color2} />;
}