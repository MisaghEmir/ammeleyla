import type { Metadata } from "next";
import Link from "next/link";
import {
  Heart,
  ShieldCheck,
  Truck,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "درباره ما",
  description:
    "درباره فروشگاه اینترنتی عمه لیلا و داستان شکل‌گیری آن.",
};

const features = [
  {
    icon: Sparkles,
    title: "انتخاب با دقت",
    description:
      "محصولات عمه لیلا با توجه به کیفیت، طراحی و کاربرد انتخاب می‌شوند.",
  },
  {
    icon: ShieldCheck,
    title: "خرید مطمئن",
    description:
      "امنیت و رضایت مشتری برای ما یکی از مهم‌ترین اولویت‌هاست.",
  },
  {
    icon: Truck,
    title: "ارسال سریع",
    description:
      "سفارش شما با دقت بسته‌بندی و در سریع‌ترین زمان ممکن ارسال می‌شود.",
  },
  {
    icon: Heart,
    title: "برای سلیقه شما",
    description:
      "هدف ما این است که برای هر سبک و سلیقه، انتخاب مناسبی داشته باشیم.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}

      <section className="border-b bg-[#fff8fa]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="max-w-3xl">
            <span className="text-sm font-medium text-[#f72568]">
              درباره عمه لیلا
            </span>

            <h1 className="mt-4 text-4xl font-black leading-[1.5] text-gray-900 sm:text-5xl">
              فقط یک فروشگاه لباس نیستیم؛
              <br />
              <span className="text-[#f72568]">
                برای انتخاب بهتر کنار شما هستیم.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-600">
              عمه لیلا با هدف ایجاد یک تجربه ساده، راحت و مطمئن برای
              خرید آنلاین لباس شکل گرفته است. تلاش می‌کنیم محصولاتی
              با کیفیت و طراحی مناسب را در اختیار شما قرار دهیم تا
              انتخاب و خرید لباس لذت‌بخش‌تر شود.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">

          <div>
            <span className="text-sm font-semibold text-[#f72568]">
              داستان ما
            </span>

            <h2 className="mt-3 text-3xl font-black text-gray-900">
              عمه لیلا از یک ایده ساده شروع شد
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-8 text-gray-600">
              <p>
                ما باور داریم خرید لباس نباید پیچیده باشد. به همین
                دلیل عمه لیلا را با تمرکز روی تجربه کاربری ساده،
                محصولات متنوع و خدمات قابل اعتماد طراحی کرده‌ایم.
              </p>

              <p>
                از لباس‌های زنانه و مردانه گرفته تا محصولات
                بچگانه، کیف، کفش، شال و روسری و اکسسوری؛ تلاش
                می‌کنیم مجموعه‌ای متنوع برای سلیقه‌های مختلف
                فراهم کنیم.
              </p>

              <p>
                رضایت شما برای ما مهم است و هر روز تلاش می‌کنیم
                تجربه بهتری برای مشتریان عمه لیلا ایجاد کنیم.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-[#fff1f5] p-10">
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
                  <Heart
                    className="h-11 w-11 text-[#f72568]"
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="mt-7 text-3xl font-black text-gray-900">
                  عمه لیلا
                </h3>

                <p className="mt-3 text-sm text-gray-500">
                  لباس خوب، حال خوب
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features */}

      <section className="bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">

          <div className="text-center">
            <span className="text-sm font-semibold text-[#f72568]">
              چرا عمه لیلا؟
            </span>

            <h2 className="mt-3 text-3xl font-black text-gray-900">
              چیزهایی که برای ما مهم هستند
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-100 bg-white p-7 text-center"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0f4]">
                    <Icon
                      className="h-6 w-6 text-[#f72568]"
                      strokeWidth={1.8}
                    />
                  </div>

                  <h3 className="mt-5 font-bold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CTA */}

      <section className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8 lg:py-20">
        <h2 className="text-3xl font-black text-gray-900">
          آماده‌ای انتخابت رو شروع کنی؟
        </h2>

        <p className="mt-4 text-sm text-gray-500">
          محصولات جدید عمه لیلا را ببین و استایل مورد علاقه‌ات را پیدا کن.
        </p>

        <Link
          href="/products"
          className="mt-7 inline-flex rounded-full bg-[#f72568] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#df1556]"
        >
          مشاهده محصولات
        </Link>
      </section>

    </main>
  );
}