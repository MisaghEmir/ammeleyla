import Link from "next/link";

const wishlistProducts = [
  {
    id: 1,
    slug: "classic-womens-coat",
    name: "پالتو زنانه کلاسیک",
    price: 1890000,
    oldPrice: 2290000,
    image: "/images/products/im1.jpg",
  },
  {
    id: 2,
    slug: "cotton-womens-shirt",
    name: "شومیز نخی زنانه",
    price: 790000,
    oldPrice: 950000,
    image: "/images/products/im5.jpg",
  },
  {
    id: 3,
    slug: "womens-scarf",
    name: "شال پاییزه زنانه",
    price: 390000,
    oldPrice: 490000,
    image: "/images/products/im3.jpg",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price);
}

export const metadata = {
  title: "علاقه‌مندی‌ها",
  description: "محصولات مورد علاقه شما در فروشگاه اینترنتی عمه لیلا.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WishlistPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-neutral-900 sm:text-3xl">
            علاقه‌مندی‌ها
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            محصولاتی که ذخیره کرده‌اید
          </p>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pink-50 text-4xl">
              ♡
            </div>

            <h2 className="mt-6 text-xl font-bold text-neutral-900">
              هنوز محصولی به علاقه‌مندی‌ها اضافه نکرده‌اید
            </h2>

            <p className="mt-3 max-w-md text-sm leading-7 text-neutral-500">
              محصولاتی که دوست دارید را با زدن روی قلب ذخیره کنید تا بعداً
              راحت‌تر به آن‌ها دسترسی داشته باشید.
            </p>

            <Link
              href="/products"
              className="mt-6 rounded-xl bg-[#e60a54] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#d5094d]"
            >
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {wishlistProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    aria-label="حذف از علاقه‌مندی‌ها"
                    className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl text-[#e60a54] shadow-sm transition hover:scale-105"
                  >
                    ♥
                  </button>
                </div>

                <div className="p-4">
                  <Link
                    href={`/products/${product.slug}`}
                    className="block text-base font-bold text-neutral-900 transition hover:text-[#e60a54]"
                  >
                    {product.name}
                  </Link>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <div className="text-base font-black text-neutral-900">
                        {formatPrice(product.price)} تومان
                      </div>

                      <div className="mt-1 text-xs text-neutral-400 line-through">
                        {formatPrice(product.oldPrice)} تومان
                      </div>
                    </div>

                    <button
                      type="button"
                      className="rounded-xl bg-[#e60a54] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#d5094d]"
                    >
                      افزودن به سبد
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}