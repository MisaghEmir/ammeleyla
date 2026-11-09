import Link from "next/link";

export default function NotFound() {
  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-white px-6"
    >
      <div className="text-center">
        <p className="text-7xl font-bold text-pink-500">
          404
        </p>

        <h1 className="mt-6 text-2xl font-bold text-neutral-900">
          صفحه پیدا نشد
        </h1>

        <p className="mt-3 text-neutral-500">
          صفحه‌ای که دنبال آن هستید وجود ندارد.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl bg-pink-500 px-6 py-3 font-medium text-white transition hover:bg-pink-600"
        >
          بازگشت به فروشگاه
        </Link>
      </div>
    </main>
  );
}