
import HeroSlider from "@/components/home/HeroSlider";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    title: "شومیز",
    href: "/categories/women",
    image: "/images/categories/shomiz.png",
  },
  {
    title: "شلوار",
    href: "/categories/men",
    image: "/images/categories/shalvar.png",
  },
  {
    title: "تی شرت",
    href: "/categories/kids",
    image: "/images/categories/tiShert.png",
  },
  {
    title: "پیراهن",
    href: "/categories/bag-shoes",
    image: "/images/categories/shomiz.png",
  },
];

const products = [
  {
    name: "مانتو کتان زنانه",
    slug: "manto-katan-zananeh",
    price: "۱,۲۸۰,۰۰۰",
    image: "/images/products/im1.jpg",
  },
  {
    name: "شومیز زنانه ساده",
    slug: "shomiz-zananeh",
    price: "۸۹۰,۰۰۰",
    image: "/images/products/im2.jpg",
  },
  {
    name: "شلوار پارچه‌ای زنانه",
    slug: "shalvar-parchehei-zananeh",
    price: "۷۵۰,۰۰۰",
    image: "/images/products/im3.jpg",
  },
  {
    name: "پیراهن زنانه",
    slug: "pirahan-zananeh",
    price: "۱,۱۵۰,۰۰۰",
    image: "/images/products/im4.jpg",
  },
  {
    name: "پیراهن زنانه",
    slug: "pirahan-",
    price: "۱,۱۵۰,۰۰۰",
    image: "/images/products/im5.jpg",
  },
];

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-white text-[#292524]">
      {/* Hero */}
      <section>
        <HeroSlider />
      </section>

      {/* Categories */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionTitle
          title="دنیای استایل عمه لیلا"
          description="استایل مورد علاقه‌ات رو از بین کالکشن‌های ما پیدا کن"
          href="/categories/women"
        />

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.href}
              href={category.href}
              className="group relative flex flex-col items-center overflow-hidden rounded-[28px] bg-[#FFF8F3] p-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#E85D83]/10 sm:p-6"
            >
              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-white">
                <Image
                  src={category.image}
                  alt={category.title}
                  width={300}
                  height={300}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium text-[#E85D83] backdrop-blur">
                  کالکشن {index + 1}
                </span>
              </div>

              <div className="mt-5 flex w-full items-center justify-between">
                <h3 className="text-sm font-bold text-[#292524] sm:text-base">
                  {category.title}
                </h3>

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E85D83] text-white transition group-hover:bg-[#292524]">
                  ←
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-[#FFF8F3] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="پرفروش‌ترین‌ها"
            description="انتخاب‌هایی که مشتریان عمه لیلا بیشتر دوست دارند"
            href="/products"
          />

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            {products.map((product, index) => (
              <ProductCard
                key={product.slug}
                product={product}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-5 md:grid-cols-2">
          <PromoBanner
            title="استایل زنانه"
            description="ترکیبی از زیبایی، سادگی و ظرافت"
            href="/categories/women"
            image="/images/hero/Modern_Womens.png"
            label="WOMEN COLLECTION"
          />

          <PromoBanner
            title="کالکشن جدید"
            description="جدیدترین انتخاب‌های عمه لیلا"
            href="/products"
            image="/images/hero/New_Collection.png"
            label="NEW ARRIVALS"
          />
        </div>
      </section>

      {/* New Products */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <SectionTitle
          title="تازه رسیده‌ها"
          description="جدیدترین محصولاتی که به فروشگاه اضافه شده‌اند"
          href="/products"
        />

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {products.map((product, index) => (
            <ProductCard
              key={`new-${product.slug}`}
              product={product}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Brand Message */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#292524] px-6 py-12 text-center text-white sm:py-16">
          <span className="text-xs font-medium tracking-[0.3em] text-[#E85D83]">
            AME LEILA
          </span>

          <h2 className="mt-5 text-2xl font-bold sm:text-4xl">
            زیبایی در سادگی است
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-white/60">
            با انتخاب‌هایی خاص، استایل شخصی خودت رو بساز.
            عمه لیلا همراه تو برای تجربه‌ای متفاوت از خرید لباس.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#E85D83] px-7 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[#292524]"
          >
            مشاهده محصولات
            <span>←</span>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-[#F4E8E5] bg-[#FFF8F3]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
          <Feature
            title="ارسال سریع"
            description="ارسال سفارش در کوتاه‌ترین زمان"
            icon="🚚"
          />

          <Feature
            title="ضمانت کیفیت"
            description="ارائه محصولات باکیفیت"
            icon="✦"
          />

          <Feature
            title="پرداخت امن"
            description="پرداخت مطمئن و امن"
            icon="🔒"
          />

          <Feature
            title="پشتیبانی"
            description="همراه شما در تمام مراحل خرید"
            icon="♡"
          />
        </div>
      </section>
    </main>
  );
}

function SectionTitle({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="h-[2px] w-7 rounded-full bg-[#E85D83]" />
          <span className="text-[10px] font-bold tracking-widest text-[#E85D83]">
            AME LEILA COLLECTION
          </span>
        </div>

        <h2 className="text-xl font-black text-[#292524] sm:text-3xl">
          {title}
        </h2>

        <p className="mt-3 text-xs leading-6 text-neutral-500 sm:text-sm">
          {description}
        </p>
      </div>

      <Link
        href={href}
        className="shrink-0 rounded-full border border-[#E85D83]/30 px-4 py-2 text-xs font-bold text-[#E85D83] transition hover:bg-[#E85D83] hover:text-white sm:px-5 sm:py-3 sm:text-sm"
      >
        مشاهده همه
        <span className="mr-2">←</span>
      </Link>
    </div>
  );
}

function ProductCard({
  product,
  index,
}: {
  product: {
    name: string;
    slug: string;
    price: string;
    image: string;
  };
  index: number;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-[#F2E8E5] bg-white transition-all duration-500 hover:-translate-y-2 hover:border-[#E85D83]/30 hover:shadow-xl hover:shadow-[#E85D83]/10"
    >
      <div className="relative overflow-hidden bg-[#FFF8F3]">
        <Image
          src={product.image}
          alt={product.name}
          width={600}
          height={700}
          className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-110"
        />

        {index === 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-[#E85D83] px-3 py-1.5 text-[10px] font-bold text-white shadow-lg">
            محبوب
          </span>
        )}

        <div className="absolute bottom-3 left-3 flex h-9 w-9 translate-y-3 items-center justify-center rounded-full bg-white text-[#E85D83] opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          ←
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="line-clamp-1 text-xs font-bold text-[#292524] sm:text-sm">
          {product.name}
        </h3>

        <div className="mt-5 flex items-center justify-between gap-2">
          <p className="text-xs font-black text-[#292524] sm:text-sm">
            {product.price}
          </p>

          <span className="text-[10px] text-[#E85D83]">تومان</span>
        </div>

        <div className="mt-3 h-[2px] w-0 rounded-full bg-[#E85D83] transition-all duration-500 group-hover:w-full" />
      </div>
    </Link>
  );
}

function PromoBanner({
  title,
  description,
  href,
  image,
  label,
}: {
  title: string;
  description: string;
  href: string;
  image: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-[28px] bg-[#292524]"
    >
      <Image
        src={image}
        alt={title}
        width={900}
        height={500}
        className="h-64 w-full object-cover opacity-80 transition duration-700 group-hover:scale-105 sm:h-80"
      />

      <div className="absolute inset-0 bg-gradient-to-l from-[#292524]/80 via-[#292524]/30 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-center p-7 text-white sm:p-10">
        <span className="text-[10px] font-bold tracking-[0.25em] text-[#F4A5B9]">
          {label}
        </span>

        <h2 className="mt-4 text-2xl font-black sm:text-3xl">
          {title}
        </h2>

        <p className="mt-3 text-xs text-white/80 sm:text-sm">
          {description}
        </p>

        <span className="mt-7 flex w-fit items-center gap-3 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-[#292524] transition group-hover:bg-[#E85D83] group-hover:text-white">
          مشاهده محصولات
          <span>←</span>
        </span>
      </div>
    </Link>
  );
}

function Feature({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="group text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl text-[#E85D83] shadow-sm transition duration-300 group-hover:-translate-y-2 group-hover:bg-[#E85D83] group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-bold text-[#292524]">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-6 text-neutral-500">
        {description}
      </p>
    </div>
  );
}
