import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "روش‌های ارسال سفارش",
  description:
    "اطلاعات کامل روش‌های ارسال سفارش در فروشگاه عمه لیلا، زمان آماده‌سازی، هزینه ارسال و پیگیری سفارش.",
  alternates: {
    canonical: "/shipping",
  },
  openGraph: {
    title: "روش‌های ارسال سفارش | عمه لیلا",
    description:
      "اطلاعات کامل ارسال سفارش‌های فروشگاه اینترنتی عمه لیلا.",
    url: "/shipping",
    type: "website",
  },
};

const shippingMethods = [
  {
    title: "ارسال با پست",
    description:
      "سفارش‌ها پس از آماده‌سازی از طریق پست ارسال می‌شوند و کد رهگیری برای مشتری ارسال خواهد شد.",
    time: "زمان تقریبی: ۲ تا ۵ روز کاری",
  },
  {
    title: "ارسال با پیک",
    description:
      "در صورت فعال بودن این روش در محدوده شما، امکان ارسال سفارش با پیک وجود خواهد داشت.",
    time: "زمان تقریبی: همان روز یا روز کاری بعد",
  },
  {
    title: "ارسال سریع",
    description:
      "برای برخی شهرها ممکن است روش ارسال سریع در دسترس باشد. روش‌های قابل انتخاب هنگام ثبت سفارش نمایش داده می‌شوند.",
    time: "زمان ارسال بسته به شهر مقصد متفاوت است.",
  },
];

const steps = [
  "ثبت و تأیید سفارش",
  "آماده‌سازی و بسته‌بندی کالا",
  "تحویل سفارش به شرکت حمل",
  "ارسال کد رهگیری برای مشتری",
  "تحویل سفارش به آدرس ثبت‌شده",
];

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium text-[#e60a54]">
              خدمات ارسال عمه لیلا
            </p>

            <h1 className="text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl">
              روش‌های ارسال سفارش
            </h1>

            <p className="mt-5 text-base leading-8 text-neutral-600">
              در عمه لیلا تلاش می‌کنیم سفارش شما پس از آماده‌سازی در کوتاه‌ترین
              زمان ممکن بسته‌بندی و ارسال شود. روش‌های ارسال موجود بر اساس
              شهر مقصد و شرایط سفارش هنگام ثبت سفارش نمایش داده می‌شوند.
            </p>
          </div>
        </div>
      </section>

      {/* Methods */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-neutral-900">
          روش‌های ارسال
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {shippingMethods.map((method) => (
            <article
              key={method.title}
              className="rounded-2xl border border-neutral-200 p-6"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-xl">
                🚚
              </div>

              <h3 className="text-lg font-bold text-neutral-900">
                {method.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-neutral-600">
                {method.description}
              </p>

              <p className="mt-4 text-sm font-medium text-neutral-900">
                {method.time}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900">
            مراحل ارسال سفارش
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {steps.map((step, index) => (
              <div
                key={step}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e60a54] text-sm font-bold text-white">
                  {index + 1}
                </span>

                <p className="mt-4 text-sm font-medium leading-7 text-neutral-800">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-bold text-neutral-900">
            نکات مهم درباره ارسال
          </h2>

          <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-700">
            <li>
              • زمان آماده‌سازی سفارش ممکن است با توجه به نوع محصول و تعداد
              کالاها متفاوت باشد.
            </li>
            <li>
              • مسئولیت صحت آدرس و شماره تماس ثبت‌شده بر عهده مشتری است.
            </li>
            <li>
              • در صورت اشتباه بودن آدرس، ممکن است هزینه ارسال مجدد بر عهده
              مشتری باشد.
            </li>
            <li>
              • زمان اعلام‌شده برای ارسال تقریبی است و ممکن است به دلیل شرایط
              شرکت حمل‌ونقل تغییر کند.
            </li>
            <li>
              • کد رهگیری، در صورت وجود، پس از تحویل سفارش به شرکت حمل برای
              مشتری ارسال خواهد شد.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}