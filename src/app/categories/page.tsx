import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "دسته‌بندی محصولات",
  description:
    "دسته‌بندی‌های فروشگاه اینترنتی عمه لیلا؛ لباس زنانه، مردانه، بچگانه، کفش، کیف، شال و روسری و اکسسوری.",
  alternates: {
    canonical: "/categories",
  },
  openGraph: {
    title: "دسته‌بندی محصولات | عمه لیلا",
    description:
      "محصولات عمه لیلا را بر اساس دسته‌بندی مورد نظر خود پیدا کنید.",
    url: "/categories",
    type: "website",
  },
};

const categories = [
  {
    title: "زنانه",
    slug: "women",
    description: "لباس و پوشاک زنانه",
    image: "/images/categories/women.jpg",
  },
  {
    title: "مردانه",
    slug: "men",
    description: "لباس و پوشاک مردانه",
    image: "/images/categories/men.jpg",
  },
  {
    title: "بچگانه",
    slug: "kids",
    description: "پوشاک کودک و نوجوان",
    image: "/images/categories/kids.jpg",
  },
  {
    title: "کفش",
    slug: "shoes",
    description: "انواع کفش برای استایل‌های مختلف",
    image: "/images/categories/shoes.jpg",
  },
  {
    title: "کیف",
    slug: "bags",
    description: "کیف‌های روزمره و مجلسی",
    image: "/images/categories/bags.jpg",
  },
  {
    title: "شال و روسری",
    slug: "scarves",
    description: "شال و روسری زنانه",
    image: "/images/categories/scarves.jpg",
  },
  {
    title: "اکسسوری",
    slug: "accessories",
    description: "اکسسوری‌های جذاب و کاربردی",
    image: "/images/categories/accessories.jpg",
  },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-sm font-bold text-[#e60a54]">
              عمه لیلا
            </span>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl">
              دسته‌بندی محصولات
            </h1>

            <p className="mt-4 text-sm leading-8 text-neutral-500 sm:text-base">
              دسته‌بندی مورد نظر خود را انتخاب کنید و محصولات مرتبط را مشاهده
              کنید.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                  <img
                    src={category.image}
                    alt={`دسته‌بندی ${category.title} در عمه لیلا`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  <div className="absolute bottom-4 right-4 left-4">
                    <h2 className="text-xl font-black text-white sm:text-2xl">
                      {category.title}
                    </h2>

                    <p className="mt-1 text-xs text-white/80 sm:text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Bottom */}
                <div className="flex items-center justify-between px-4 py-4">
                  <span className="text-sm font-bold text-neutral-900">
                    مشاهده محصولات
                  </span>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition group-hover:bg-[#e60a54] group-hover:text-white">
                    ←
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="border-t border-neutral-100 bg-neutral-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-black text-neutral-900">
            دسته‌بندی‌های فروشگاه عمه لیلا
          </h2>

          <p className="mt-4 text-sm leading-8 text-neutral-600">
            در فروشگاه اینترنتی عمه لیلا می‌توانید محصولات مورد نظر خود را
            بر اساس دسته‌بندی پیدا کنید. مجموعه‌ای از پوشاک زنانه، مردانه و
            بچگانه در کنار کیف، کفش، شال و روسری و اکسسوری در اختیار شما
            قرار می‌گیرد.
          </p>

          <p className="mt-4 text-sm leading-8 text-neutral-600">
            با انتخاب هر دسته‌بندی، به صفحه اختصاصی آن منتقل می‌شوید و
            می‌توانید محصولات مرتبط را مشاهده و بر اساس نیاز خود انتخاب
            کنید.
          </p>
        </div>
      </section>
    </main>
  );
}