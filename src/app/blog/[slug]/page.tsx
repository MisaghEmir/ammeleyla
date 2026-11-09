import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const posts = {
  "how-to-choose-womens-coat": {
    title: "چطور یک مانتوی مناسب برای خودمان انتخاب کنیم؟",
    description:
      "راهنمای کامل انتخاب مانتو بر اساس فرم بدن، رنگ، فصل و سبک شخصی.",
    image: "/images/blog/blog-1.jpg",
    category: "راهنمای خرید",
    date: "۱۴۰۵/۰۷/۱۰",
    content: [
      "انتخاب لباس مناسب فقط به ظاهر آن محدود نمی‌شود. فرم بدن، رنگ پوست، فصل و سبک شخصی همگی در انتخاب یک لباس مناسب نقش دارند.",
      "برای انتخاب مانتو ابتدا بهتر است به کاربرد آن توجه کنید. مانتویی که برای استفاده روزمره انتخاب می‌شود می‌تواند با مدل مناسب محیط کاری یا یک مهمانی متفاوت باشد.",
      "رنگ نیز یکی از مهم‌ترین عوامل در ایجاد یک استایل هماهنگ است. رنگ‌های خنثی معمولاً قابلیت ست شدن بیشتری دارند و می‌توانند پایه خوبی برای کمد لباس باشند.",
    ],
  },

  "how-to-match-clothes-colors": {
    title: "راهنمای ست کردن رنگ لباس؛ از کجا شروع کنیم؟",
    description:
      "چند قانون ساده برای ست کردن حرفه‌ای رنگ لباس‌ها.",
    image: "/images/blog/blog-2.jpg",
    category: "استایل",
    date: "۱۴۰۵/۰۷/۰۵",
    content: [
      "برای شروع بهتر است یک رنگ اصلی برای استایل خود انتخاب کنید و سپس رنگ‌های مکمل را به آن اضافه کنید.",
      "رنگ‌های خنثی مانند سفید، مشکی، طوسی و کرم معمولاً به‌راحتی با رنگ‌های دیگر ترکیب می‌شوند.",
      "استفاده از رنگ‌های زیاد در یک استایل ممکن است ظاهر را شلوغ کند؛ بنابراین بهتر است تعادل را حفظ کنید.",
    ],
  },

  "summer-fashion-guide": {
    title: "راهنمای انتخاب لباس مناسب برای فصل تابستان",
    description:
      "لباس‌های مناسب روزهای گرم تابستان را بهتر بشناسید.",
    image: "/images/blog/blog-3.jpg",
    category: "مد و فشن",
    date: "۱۴۰۵/۰۶/۲۸",
    content: [
      "در فصل تابستان انتخاب پارچه مناسب اهمیت زیادی دارد. پارچه‌های سبک و قابل تنفس معمولاً انتخاب مناسب‌تری برای هوای گرم هستند.",
      "رنگ‌های روشن نیز می‌توانند انتخاب خوبی برای استایل تابستانی باشند.",
      "در کنار راحتی، می‌توانید با انتخاب اکسسوری مناسب استایل تابستانی خود را کامل کنید.",
    ],
  },
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const post = posts[slug as keyof typeof posts];

  if (!post) {
    return {
      title: "مقاله پیدا نشد",
    };
  }

  return {
    title: post.title,
    description: post.description,

    alternates: {
      canonical: `/blog/${slug}`,
    },

    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${slug}`,
      siteName: "عمه لیلا",
      locale: "fa_IR",
      type: "article",
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: Props) {
  const { slug } = await params;

  const post = posts[slug as keyof typeof posts];

  if (!post) {
    notFound();
  }

  const articleUrl = `https://ameleila.com/blog/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: [`https://ameleila.com${post.image}`],
    datePublished: "2026-10-01",
    dateModified: "2026-10-01",
    author: {
      "@type": "Organization",
      name: "عمه لیلا",
    },
    publisher: {
      "@type": "Organization",
      name: "عمه لیلا",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };

  return (
    <main className="min-h-screen bg-white">

      <article>

        {/* Header */}

        <header className="mx-auto max-w-4xl px-5 pb-10 pt-14 text-center sm:px-8">

          <div className="text-sm font-semibold text-[#f72568]">
            {post.category}
          </div>

          <h1 className="mt-5 text-3xl font-black leading-[1.6] text-gray-900 sm:text-5xl">
            {post.title}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-gray-500 sm:text-base">
            {post.description}
          </p>

          <time className="mt-5 block text-xs text-gray-400">
            {post.date}
          </time>

        </header>

        {/* Image */}

        <div className="relative mx-auto aspect-[16/7] max-w-6xl overflow-hidden rounded-2xl bg-gray-100">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
        </div>

        {/* Content */}

        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">

          <div className="space-y-7 text-base leading-9 text-gray-700">

            {post.content.map((paragraph, index) => (
              <p key={index}>
                {paragraph}
              </p>
            ))}

          </div>

          <div className="mt-12 border-t pt-8">
            <Link
              href="/blog"
              className="text-sm font-bold text-[#f72568]"
            >
              ← بازگشت به مجله
            </Link>
          </div>

        </div>

      </article>

      {/* Article Schema */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

    </main>
  );
}