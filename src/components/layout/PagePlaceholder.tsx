interface PagePlaceholderProps {
  title: string;
  description: string;
}

export default function PagePlaceholder({
  title,
  description,
}: PagePlaceholderProps) {
  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-neutral-50 px-6"
    >
      <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-neutral-900">
          {title}
        </h1>

        <p className="mt-4 text-neutral-500">
          {description}
        </p>
      </div>
    </main>
  );
}