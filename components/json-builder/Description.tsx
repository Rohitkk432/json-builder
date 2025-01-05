interface DescriptionProps {
  text: string;
}

export function Description({ text }: DescriptionProps) {
  return (
    <span className="block text-xs text-muted-foreground/80 mt-0.5">
      {text}
    </span>
  );
} 