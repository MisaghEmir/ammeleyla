import type { Metadata } from "next";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "تماس با ما",
  description:
    "راه‌های ارتباط با فروشگاه اینترنتی عمه لیلا.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}

      <section className="border-b bg-[#fff8fa]">
        <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8 lg:py-20">

          <span className="text-sm font-semibold text-[#f72568]">
            ارتباط با ما
          </span>

          <h1 className="mt-4 text-4xl font-black text-gray-900 sm:text-5xl">
            چطور می‌توانیم کمکتان کنیم؟
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-gray-600">
            اگر سوالی درباره محصولات، سفارش، ارسال یا هر موضوع دیگری
            دارید، از طریق راه‌های ارتباطی زیر با ما در تماس باشید.
          </p>

        </div>
      </section>

      {/* Contact */}

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Phone */}

          <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0f4]">
              <Phone
                className="h-6 w-6 text-[#f72568]"
                strokeWidth={1.8}
              />
            </div>

            <h2 className="mt-6 text-lg font-bold text-gray-900">
              تلفن تماس
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              برای سوالات و پیگیری سفارش
            </p>

            <a
              href="tel:+982100000000"
              dir="ltr"
              className="mt-5 block font-semibold text-gray-900 transition hover:text-[#f72568]"
            >
              021-00000000
            </a>
          </div>

          {/* Email */}

          <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0f4]">
              <Mail
                className="h-6 w-6 text-[#f72568]"
                strokeWidth={1.8}
              />
            </div>

            <h2 className="mt-6 text-lg font-bold text-gray-900">
              ایمیل
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              برای ارتباط و پشتیبانی
            </p>

            <a
              href="mailto:info@ameleila.com"
              dir="ltr"
              className="mt-5 block font-semibold text-gray-900 transition hover:text-[#f72568]"
            >
              info@ameleila.com
            </a>
          </div>

          {/* Hours */}

          <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0f4]">
              <Clock
                className="h-6 w-6 text-[#f72568]"
                strokeWidth={1.8}
              />
            </div>

            <h2 className="mt-6 text-lg font-bold text-gray-900">
              ساعات پاسخگویی
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              شنبه تا پنجشنبه
            </p>

            <p className="mt-5 font-semibold text-gray-900">
              ۹ صبح تا ۸ شب
            </p>
          </div>

        </div>

        {/* Bottom */}

        <div className="mt-8 grid overflow-hidden rounded-3xl bg-[#19171a] text-white lg:grid-cols-2">

          <div className="p-8 sm:p-12">
            <MapPin className="h-8 w-8 text-[#f72568]" />

            <h2 className="mt-6 text-2xl font-black">
              آدرس ما
            </h2>

            <p className="mt-4 max-w-md text-sm leading-8 text-white/65">
              آدرس فروشگاه یا دفتر عمه لیلا در این قسمت قرار می‌گیرد.
              بعداً می‌توانیم نقشه Google Maps یا نقشه نشان را نیز
              به این بخش اضافه کنیم.
            </p>
          </div>

          <div className="flex min-h-[280px] items-center justify-center bg-[#242125] p-8">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-[#f72568]" />

              <p className="mt-4 text-sm text-white/60">
                محل قرارگیری نقشه
              </p>
            </div>
          </div>

        </div>

      </section>

    </main>
  );
}