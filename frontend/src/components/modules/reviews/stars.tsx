// components/modules/reviews/stars.tsx
export function Stars({ value }: { value: number }) {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rounded ? "text-yellow-500" : "text-muted-foreground"}>
          ★
        </span>
      ))}
      <span className="ml-2 text-sm text-muted-foreground">{value.toFixed(1)}</span>
    </div>
  );
}
