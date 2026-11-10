
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productsApi } from "@/lib/api";

interface Category {
  slug: string;
  title: string;
  description: string;
  image: string;
  subcategories: {
    title: string;
    slug: string;
  }[];
}

const categories: Category[] = [
  {
    slug: "women",
    title: "زنانه",
    description: "جدیدترین لباس‌ها و پوشاک زنانه را در فروشگاه عمه لیلا مشاهده کنید.",
    image: "/images/hero/Modern_Womens.png",
    subcategories: [
      { title: "مانتو", slug: "womens-manteau" },
      { title: "شومیز", slug: "womens-shirts" },
      { title: "تیشرت", slug: "womens-tshirts" },
      { title: "شلوار", slug: "womens-pants" },
      { title: "پیراهن", slug: "womens-dresses" },
      { title: "هودی و سویشرت", slug: "womens-hoodies" },
    ],
  },
  {
    slug: "men",
    title: "مردانه",
    description: "انواع پوشاک مردانه شامل تیشرت، پیراهن، شلوار، هودی و کاپشن.",
    image: "/images/hero/New_Collection.png",
    subcategories: [
      { title: "تیشرت مردانه", slug: "mens-tshirts" },
      { title: "پیراهن مردانه", slug: "mens-shirts" },
      { title: "شلوار مردانه", slug: "mens-pants" },
      { title: "هودی و سویشرت", slug: "mens-hoodies" },
      { title: "کاپشن و پالتو", slug: "mens-jackets" },
      { title: "اکسسوری مردانه", slug: "mens-accessories" },
    ],
  },
  {
    slug: "kids",
    title: "بچگانه",
    description: "پوشاک کودک و نوجوان برای دخترها و پسرها با مدل‌های متنوع.",
    image: "/images/hero/kids.png",
    subcategories: [
      { title: "دخترانه", slug: "girls" },
      { title: "پسرانه", slug: "boys" },
      { title: "لباس نوزاد", slug: "baby-clothes" },
      { title: "لباس کودک", slug: "kids-clothes" },
    ],
  },
  {
    slug: "shoes",
    title: "کفش",
    description: "انواع کفش زنانه، مردانه و بچگانه برای استایل‌های مختلف.",
    image: "/images/categories/shoes.jpg",
    subcategories: [
      { title: "کفش زنانه", slug: "womens-shoes" },
      { title: "کفش مردانه", slug: "mens-shoes" },
      { title: "کفش بچگانه", slug: "kids-shoes" },
      { title: "کتانی", slug: "sneakers" },
    ],
  },
  {
    slug: "bags",
    title: "کیف",
    description: "کیف‌های زنانه، مردانه و روزمره برای استایل‌های مختلف.",
    image: "/images/categories/bags.jpg",
    subcategories: [
      { title: "کیف زنانه", slug: "womens-bags" },
      { title: "کیف مردانه", slug: "mens-bags" },
      { title: "کوله پشتی", slug: "backpacks" },
      { title: "کیف دستی", slug: "handbags" },
    ],
  },
  {
    slug: "scarves",
    title: "شال و روسری",
    description: "انواع شال و روسری با مدل‌ها و طرح‌های متنوع.",
    image: "/images/categories/scarves.jpg",
    subcategories: [
      { title: "شال", slug: "shawls" },
      { title: "روسری", slug: "scarves" },
      { title: "شال مجلسی", slug: "formal-shawls" },
    ],
  },
  {
    slug: "accessories",
    title: "اکسسوری",
    description: "اکسسوری‌های جذاب برای کامل کردن استایل شما.",
    image: "/images/categories/accessories.jpg",
    subcategories: [
      { title: "ساعت", slug: "watches" },
      { title: "عینک", slug: "glasses" },
      { title: "کمربند", slug: "belts" },
      { title: "زیورآلات", slug: "jewelry" },
    ],
  },
];

function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price);
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) {
    return {
      title: "دسته‌بندی پیدا نشد | عمه لیلا",
    };
  }

  return {
    title: category.title,
    description: category.description,
    alternates: {
      canonical: `/categories/${category.slug}`,
    },
    openGraph: {
      title: `${category.title} | عمه لیلا`,
      description: category.description,
      url: `/categories/${category.slug}`,
      type: "website",
      images: [
        {
          url: category.image,
          alt: category.title,
        },
      ],
    },
  };
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) {
    notFound();
  }

  // دریافت محصولات این دسته از سرور
  let products: Awaited<ReturnType<typeof productsApi.getByCategory>>["products"] = [];

  try {
    const response = await productsApi.getByCategory(slug, {
      page: 1,
      limit: 8,
    });

    products = response.products ?? [];
  } catch (error) {
    console.error("Category products error:", error);
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav
            aria-label="مسیر صفحه"
            className="flex items-center gap-2 text-xs text-neutral-500"
          >
            <Link href="/" className="transition hover:text-[#e60a54]">
              خانه
            </Link>

            <span>/</span>

            <Link
              href="/categories"
              className="transition hover:text-[#e60a54]"
            >
              دسته‌بندی‌ها
            </Link>

            <span>/</span>

            <span className="font-bold text-neutral-800">
              {category.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section>
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="aspect-[16/7] min-h-[260px] sm:min-h-[330px]">
              <img
                src={category.image}
                alt={category.title}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/45" />

              <div className="absolute inset-0 flex items-center">
                <div className="max-w-2xl px-6 text-white sm:px-10">
                  <h1 className="text-3xl font-black sm:text-5xl">
                    {category.title}
                  </h1>

                  <p className="mt-4 max-w-xl text-sm leading-8 text-white/85 sm:text-base">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subcategories */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-neutral-900">
              دسته‌بندی‌های {category.title}
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              دسته مورد نظر خود را انتخاب کنید
            </p>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {category.subcategories.map((subcategory) => (
              <Link
                key={subcategory.slug}
                href={`/categories/${subcategory.slug}`}
                className="shrink-0 rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-bold text-neutral-700 transition hover:border-[#e60a54] hover:text-[#e60a54]"
              >
                {subcategory.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products from backend */}
      <section className="border-t border-neutral-100 bg-neutral-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-black text-neutral-900">
                محصولات {category.title}
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                جدیدترین محصولات این دسته
              </p>
            </div>

            <Link
              href={`/products?category=${category.slug}`}
              className="hidden text-sm font-bold text-[#e60a54] sm:block"
            >
              مشاهده همه
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {products.map((product) => {
                const image = product.images?.[0]?.url || category.image;

                const hasDiscount =
                  product.oldPrice != null &&
                  product.oldPrice > product.price;

                const discount = hasDiscount
                  ? Math.round(
                      ((product.oldPrice! - product.price) /
                        product.oldPrice!) *
                        100
                    )
                  : 0;

                return (
                  <article
                    key={product._id}
                    className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                      <Link href={`/products/${product.slug}`}>
                        <img
                          src={image}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </Link>

                      {hasDiscount && (
                        <span className="absolute right-3 top-3 rounded-lg bg-[#e60a54] px-2.5 py-1.5 text-xs font-bold text-white">
                          {discount}٪
                        </span>
                      )}

                      <button
                        type="button"
                        aria-label={`افزودن ${product.name} به علاقه‌مندی‌ها`}
                        className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg text-neutral-700 shadow-sm transition hover:text-[#e60a54]"
                      >
                        ♡
                      </button>
                    </div>

                    <div className="p-4">
                      <Link
                        href={`/products/${product.slug}`}
                        className="line-clamp-2 min-h-11 text-sm font-bold leading-6 text-neutral-900 transition hover:text-[#e60a54]"
                      >
                        {product.name}
                      </Link>

                      <div className="mt-4">
                        <div className="text-sm font-black text-neutral-900">
                          {formatPrice(product.price)} تومان
                        </div>

                        {hasDiscount && (
                          <div className="mt-1 text-xs text-neutral-400 line-through">
                            {formatPrice(product.oldPrice!)} تومان
                          </div>
                        )}
                      </div>

                      <Link
                        href={`/products/${product.slug}`}
                        className="mt-4 flex h-10 w-full items-center justify-center rounded-xl border border-neutral-200 text-xs font-bold text-neutral-800 transition hover:border-[#e60a54] hover:bg-[#e60a54] hover:text-white"
                      >
                        مشاهده محصول
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-4 py-16 text-center">
              <div className="text-4xl">🛍️</div>

              <h3 className="mt-4 text-lg font-black text-neutral-800">
                محصولی در این دسته‌بندی وجود ندارد
              </h3>

              <p className="mt-2 text-sm text-neutral-500">
                به‌زودی محصولات جدید به این دسته اضافه می‌شوند.
              </p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href={`/products?category=${category.slug}`}
              className="inline-flex h-11 items-center rounded-xl border border-neutral-200 bg-white px-6 text-sm font-bold text-neutral-800"
            >
              مشاهده همه محصولات
            </Link>
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-black text-neutral-900">
            خرید {category.title} از عمه لیلا
          </h2>

          <p className="mt-4 text-sm leading-8 text-neutral-600">
            در این بخش از فروشگاه اینترنتی عمه لیلا می‌توانید مجموعه‌ای از
            محصولات {category.title} را مشاهده کنید. محصولات این دسته با
            تنوع مختلف در اختیار شما قرار گرفته‌اند تا بتوانید متناسب با
            نیاز و سلیقه خود انتخاب کنید.
          </p>

          <p className="mt-4 text-sm leading-8 text-neutral-600">
            برای پیدا کردن محصول مورد نظر، می‌توانید از دسته‌بندی‌های
            بالای صفحه استفاده کنید یا وارد صفحه محصولات شوید و محصولات را
            بر اساس ویژگی‌های مختلف بررسی کنید.
          </p>
        </div>
      </section>
    </main>
  );
}
