import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "مجله عمه لیلا | راهنمای استایل و مد",
  description:
    "مجله عمه لیلا؛ راهنمای انتخاب لباس، استایل زنانه و مردانه، ترندهای مد، ست کردن لباس و نکات خرید لباس.",
  keywords: [
    "مجله عمه لیلا",
    "مد و استایل",
    "راهنمای خرید لباس",
    "استایل زنانه",
    "استایل مردانه",
    "ترند لباس",
    "ست لباس",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "مجله عمه لیلا | راهنمای استایل و مد",
    description:
      "راهنمای انتخاب لباس، استایل و جدیدترین ترندهای مد در مجله عمه لیلا.",
    url: "/blog",
    siteName: "عمه لیلا",
    locale: "fa_IR",
    type: "website",
  },
};

const posts = [
  {
    slug: "how-to-choose-womens-coat",
    title: "چطور یک مانتوی مناسب برای خودمان انتخاب کنیم؟",
    description:
      "راهنمای انتخاب مانتو بر اساس فرم بدن، فصل، رنگ و سبک شخصی.",
    image: "/images/blog/blog-1.jpg",
    category: "راهنمای خرید",
    date: "۱۴۰۵/۰۷/۱۰",
  },
  {
    slug: "how-to-match-clothes-colors",
    title: "راهنمای ست کردن رنگ لباس؛ از کجا شروع کنیم؟",
    description:
      "با چند قانون ساده می‌توانید رنگ لباس‌ها را حرفه‌ای‌تر با هم ست کنید.",
    image: "/images/blog/blog-2.jpg",
    category: "استایل",
    date: "۱۴۰۵/۰۷/۰۵",
  },
  {
    slug: "summer-fashion-guide",
    title: "راهنمای انتخاب لباس مناسب برای فصل تابستان",
    description:
      "چه لباس‌هایی برای روزهای گرم تابستان انتخاب بهتری هستند؟",
    image: "/images/blog/blog-3.jpg",
    category: "مد و فشن",
    date: "۱۴۰۵/۰۶/۲۸",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}

      <section className="border-b bg-[#fff8fa]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">

          <span className="text-sm font-semibold text-[#f72568]">
            مجله عمه لیلا
          </span>

          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.5] text-gray-900 sm:text-5xl">
            دنیای مد، استایل و
            <span className="text-[#f72568]"> انتخاب بهتر</span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-8 text-gray-600">
            در مجله عمه لیلا درباره انتخاب لباس، ست کردن رنگ‌ها،
            ترندهای روز، استایل و نکات خرید لباس می‌خوانید.
          </p>

        </div>
      </section>

      {/* Articles */}

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

          {posts.map((post) => (
            <article
              key={post.slug}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              <Link href={`/blog/${post.slug}`}>

                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-6">

                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-medium text-[#f72568]">
                      {post.category}
                    </span>

                    <time className="text-gray-400">
                      {post.date}
                    </time>
                  </div>

                  <h2 className="mt-4 text-lg font-bold leading-8 text-gray-900">
                    {post.title}
                  </h2>

                  <p className="mt-3 line-clamp-2 text-sm leading-7 text-gray-500">
                    {post.description}
                  </p>

                  <div className="mt-5 text-sm font-bold text-gray-900">
                    مطالعه مقاله ←
                  </div>

                </div>

              </Link>
            </article>
          ))}

        </div>

      </section>
    </main>
  );
}