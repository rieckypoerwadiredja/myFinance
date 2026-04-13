type Props = {
  eyebrow: string;
  title: string;
};

export default function DashboardHeader({ eyebrow, title }: Props) {
  return (
    <header className="mb-12">
      <p className="text-on-surface-variant font-medium tracking-wide mb-1 uppercase text-xs">
        {eyebrow}
      </p>
      <h1 className="text-4xl font-extrabold text-on-surface tracking-tight">
        {title}
      </h1>
    </header>
  );
}
