"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsApi, categoriesApi } from "@/lib/api";
import type {
  Product as ApiProduct,
  Category as ApiCategory,
} from "@/lib/api";

type CategorySlug =
  | "all"
  | "women"
  | "men"
  | "kids"
  | "bags"
  | "shoes"
  | "scarves"
  | "accessories";

type Gender = "زنانه" | "مردانه" | "بچگانه" | "یونیسکس";

type Product = {
  id: string;
  slug: string;
  title: string;
  category: CategorySlug;
  categoryName: string;
  gender: Gender;
  brand: string;
  image: string;
  price: number;
  oldPrice: number | null;
  discount: number;
  inStock: boolean;
};

const fallbackCategories: {
  name: string;
  slug: CategorySlug;
}[] = [
  { name: "همه محصولات", slug: "all" },
  { name: "زنانه", slug: "women" },
  { name: "مردانه", slug: "men" },
  { name: "بچگانه", slug: "kids" },
  { name: "کیف", slug: "bags" },
  { name: "کفش", slug: "shoes" },
  { name: "شال و روسری", slug: "scarves" },
  { name: "اکسسوری", slug: "accessories" },
];

const MIN_PRICE = 0;
const MAX_PRICE = 3000000;

const genders: {
  label: string;
  value: "all" | Gender;
}[] = [
  { label: "همه", value: "all" },
  { label: "زنانه", value: "زنانه" },
  { label: "مردانه", value: "مردانه" },
  { label: "بچگانه", value: "بچگانه" },
  { label: "یونیسکس", value: "یونیسکس" },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price);
}

function getCategorySlug(
  category: ApiProduct["category"] | string,
): CategorySlug {
  const slug =
    typeof category === "string" ? category : category?.slug;

  const normalized = (slug || "").toLowerCase();

  const aliases: Record<string, CategorySlug> = {
    women: "women",
    woman: "women",
    female: "women",
    زنانه: "women",
    men: "men",
    man: "men",
    male: "men",
    مردانه: "men",
    kids: "kids",
    children: "kids",
    child: "kids",
    بچگانه: "kids",
    bags: "bags",
    bag: "bags",
    کیف: "bags",
    shoes: "shoes",
    shoe: "shoes",
    کفش: "shoes",
    scarves: "scarves",
    scarf: "scarves",
    "شال و روسری": "scarves",
    accessories: "accessories",
    accessory: "accessories",
    اکسسوری: "accessories",
  };

  return aliases[normalized] || "women";
}

function getCategoryName(category: ApiProduct["category"]) {
  if (typeof category !== "string") {
    return category?.name || "بدون دسته‌بندی";
  }

  const found = fallbackCategories.find(
    (item) => item.slug === category,
  );

  return found?.name || category || "بدون دسته‌بندی";
}

function getProductPrice(product: ApiProduct) {
  if (typeof product.price === "number") {
    return product.price;
  }

  const variantPrices = product.variants
    ?.map((variant) => variant.price)
    .filter((price) => Number.isFinite(price));

  return variantPrices?.length ? Math.min(...variantPrices) : 0;
}

function getProductStock(product: ApiProduct) {
  if (typeof product.stock === "number") {
    return product.stock > 0;
  }

  if (!product.variants?.length) {
    return true;
  }

  return product.variants.some((variant) => variant.stock > 0);
}

function getProductOldPrice(product: ApiProduct, price: number) {
  if (
    typeof product.oldPrice === "number" &&
    product.oldPrice > price
  ) {
    return product.oldPrice;
  }

  const compareAtPrice = product.variants
    ?.map((variant) => variant.price)
    .find((variantPrice) => variantPrice > price);

  return compareAtPrice ?? null;
}

function mapApiProduct(product: ApiProduct): Product {
  const price = getProductPrice(product);
  const oldPrice = getProductOldPrice(product, price);

  const discount =
    typeof product.discount === "number" && product.discount > 0
      ? product.discount
      : oldPrice && oldPrice > price
        ? Math.round(((oldPrice - price) / oldPrice) * 100)
        : 0;

  const categorySlug = getCategorySlug(product.category);
  const image = product.images?.find((item) => item.url)?.url || "";

  return {
    id: product._id,
    slug: product.slug,
    title: product.name,
    category: categorySlug,
    categoryName: getCategoryName(product.category),
    gender:
      categorySlug === "men"
        ? "مردانه"
        : categorySlug === "kids"
          ? "بچگانه"
          : "زنانه",
    brand: "عمه لیلا",
    image,
    price,
    oldPrice,
    discount,
    inStock: getProductStock(product),
  };
}

function FilterSection({
  title,
  children,
  isOpen,
  onToggle,
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <section className="border-b border-neutral-200 py-4 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 text-right"
      >
        <span className="text-sm font-bold text-neutral-800">
          {title}
        </span>

        <svg
          className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path
            d="m6 9 6 6 6-6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && <div className="pt-4">{children}</div>}
    </section>
  );
}

export default function ProductsClient() {
  // دریافت محصولات با React Query
  const productsQuery = useQuery({
    queryKey: ["products", { limit: 100, sort: "newest" }],
    queryFn: () =>
      productsApi.getAll({
        limit: 100,
        sort: "newest",
      }),
    staleTime: 60 * 1000,
  });

  // دریافت دسته‌بندی‌ها با React Query
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  // تبدیل محصولات API به ساختار موردنیاز رابط کاربری
  const apiProducts = useMemo(
    () =>
      (productsQuery.data?.products ?? [])
        .filter((product) => product.isActive !== false)
        .map(mapApiProduct),
    [productsQuery.data],
  );

  const apiCategories: ApiCategory[] =
    categoriesQuery.data?.categories ?? [];

  const loading =
    productsQuery.isLoading || categoriesQuery.isLoading;

  const loadError =
    productsQuery.isError || categoriesQuery.isError;

  // وضعیت فیلترها و جستجو
  const [category, setCategory] = useState<CategorySlug>("all");
  const [selectedGender, setSelectedGender] =
    useState<"all" | Gender>("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState(MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [inStock, setInStock] = useState(false);
  const [discounted, setDiscounted] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const categories = useMemo(() => {
    const activeCategories = apiCategories
      .filter((item) => item.isActive)
      .map((item) => ({
        name: item.name,
        slug: getCategorySlug(item.slug),
      }))
      .filter(
        (item, index, items) =>
          items.findIndex(
            (candidate) => candidate.slug === item.slug,
          ) === index,
      );

    return [
      { name: "همه محصولات", slug: "all" as CategorySlug },
      ...activeCategories,
    ];
  }, [apiCategories]);

  const brands = useMemo(
    () =>
      Array.from(
        new Set(apiProducts.map((product) => product.brand)),
      )
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, "fa")),
    [apiProducts],
  );

  // جستجو، فیلتر و مرتب‌سازی محصولات
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fa");

    const result = apiProducts.filter((product) => {
      const matchesCategory =
        category === "all" || product.category === category;

      const matchesGender =
        selectedGender === "all" ||
        product.gender === selectedGender;

      const matchesBrand =
        selectedBrand === "all" ||
        product.brand === selectedBrand;

      const matchesSearch =
        !query ||
        product.title.toLocaleLowerCase("fa").includes(query) ||
        product.categoryName.toLocaleLowerCase("fa").includes(query) ||
        product.brand.toLocaleLowerCase("fa").includes(query);

      const matchesPrice =
        product.price >= minPrice && product.price <= maxPrice;

      const matchesStock = !inStock || product.inStock;
      const matchesDiscount = !discounted || product.discount > 0;

      return (
        matchesCategory &&
        matchesGender &&
        matchesBrand &&
        matchesSearch &&
        matchesPrice &&
        matchesStock &&
        matchesDiscount
      );
    });

    switch (sort) {
      case "price-asc":
        return result.sort((a, b) => a.price - b.price);

      case "price-desc":
        return result.sort((a, b) => b.price - a.price);

      case "discount":
        return result.sort((a, b) => b.discount - a.discount);

      case "oldest":
        return result.reverse();

      default:
        return result;
    }
  }, [
    apiProducts,
    category,
    selectedGender,
    selectedBrand,
    search,
    sort,
    minPrice,
    maxPrice,
    inStock,
    discounted,
  ]);

  const hasActiveFilters =
    category !== "all" ||
    selectedGender !== "all" ||
    selectedBrand !== "all" ||
    search.trim() !== "" ||
    minPrice !== MIN_PRICE ||
    maxPrice !== MAX_PRICE ||
    inStock ||
    discounted ||
    sort !== "newest";

  function resetFilters() {
    setCategory("all");
    setSelectedGender("all");
    setSelectedBrand("all");
    setSearch("");
    setSort("newest");
    setMinPrice(MIN_PRICE);
    setMaxPrice(MAX_PRICE);
    setInStock(false);
    setDiscounted(false);
    setOpenFilter(null);
  }

  function toggleFilter(name: string) {
    setOpenFilter((current) =>
      current === name ? null : name,
    );
  }

  async function retryLoading() {
    await Promise.all([
      productsQuery.refetch(),
      categoriesQuery.refetch(),
    ]);
  }

  const filterPanel = (
    <div>
      <div className="border-b border-neutral-200 py-4">
        <label
          htmlFor="product-category"
          className="mb-3 block text-sm font-bold text-neutral-800"
        >
          دسته‌بندی
        </label>

        <select
          id="product-category"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as CategorySlug)
          }
          className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none focus:border-[#e60a54]"
        >
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <section className="border-b border-neutral-200 py-4">
        <h3 className="mb-4 text-sm font-bold text-neutral-800">
          جنسیت
        </h3>

        <div className="space-y-3">
          {genders.map((item) => (
            <label
              key={item.value}
              className="flex cursor-pointer items-center gap-3 text-sm text-neutral-700"
            >
              <input
                type="radio"
                name="product-gender"
                value={item.value}
                checked={selectedGender === item.value}
                onChange={() => setSelectedGender(item.value)}
                className="h-4 w-4 accent-[#e60a54]"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </section>

      <FilterSection
        title="برند"
        isOpen={openFilter === "brand"}
        onToggle={() => toggleFilter("brand")}
      >
        <select
          value={selectedBrand}
          onChange={(event) => setSelectedBrand(event.target.value)}
          className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none focus:border-[#e60a54]"
        >
          <option value="all">همه برندها</option>

          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </FilterSection>

      <FilterSection
        title="محدوده قیمت"
        isOpen={openFilter === "price"}
        onToggle={() => toggleFilter("price")}
      >
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-neutral-500">
            از (تومان)
            <input
              type="number"
              min={MIN_PRICE}
              max={maxPrice}
              value={minPrice}
              onChange={(event) => {
                const value = Math.max(
                  MIN_PRICE,
                  Number(event.target.value) || 0,
                );

                setMinPrice(Math.min(value, maxPrice));
              }}
              className="mt-2 h-11 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-900 outline-none focus:border-[#e60a54]"
            />
          </label>

          <label className="text-xs text-neutral-500">
            تا (تومان)
            <input
              type="number"
              min={minPrice}
              max={MAX_PRICE}
              value={maxPrice}
              onChange={(event) => {
                const value = Math.max(
                  0,
                  Math.min(
                    MAX_PRICE,
                    Number(event.target.value) || 0,
                  ),
                );

                setMaxPrice(Math.max(value, minPrice));
              }}
              className="mt-2 h-11 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-900 outline-none focus:border-[#e60a54]"
            />
          </label>
        </div>

        <div className="mt-3 flex justify-between text-xs text-neutral-500">
          <span>{formatPrice(minPrice)} تومان</span>
          <span>{formatPrice(maxPrice)} تومان</span>
        </div>

        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={50000}
          value={maxPrice}
          onChange={(event) =>
            setMaxPrice(
              Math.max(minPrice, Number(event.target.value)),
            )
          }
          aria-label="حداکثر قیمت"
          className="mt-3 w-full cursor-pointer accent-[#e60a54]"
        />

        <div className="flex justify-between text-xs text-neutral-400">
          <span>۰ تومان</span>
          <span>۳ میلیون تومان</span>
        </div>
      </FilterSection>

      <FilterSection
        title="وضعیت کالا"
        isOpen={openFilter === "stock"}
        onToggle={() => toggleFilter("stock")}
      >
        <div className="space-y-4">
          <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-neutral-700">
            <span>فقط کالاهای موجود</span>
            <input
              type="checkbox"
              checked={inStock}
              onChange={(event) => setInStock(event.target.checked)}
              className="h-4 w-4 accent-[#e60a54]"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-neutral-700">
            <span>فقط کالاهای تخفیف‌دار</span>
            <input
              type="checkbox"
              checked={discounted}
              onChange={(event) =>
                setDiscounted(event.target.checked)
              }
              className="h-4 w-4 accent-[#e60a54]"
            />
          </label>
        </div>
      </FilterSection>

      <button
        type="button"
        onClick={resetFilters}
        className="mt-4 w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm font-bold text-neutral-700 transition hover:border-[#e60a54] hover:text-[#e60a54]"
      >
        پاک کردن فیلترها
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-white" dir="rtl">
      <section className="border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold text-[#e60a54]">
                انتخابی برای استایل شما
              </p>

              <h1 className="text-3xl font-black text-neutral-950 sm:text-4xl">
                فروشگاه عمه لیلا
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                محصولات را جستجو کن، جنسیت و برند دلخواهت را انتخاب
                کن و نتیجه را همین‌جا ببین.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white px-5 py-3">
              <p className="text-xs text-neutral-500">
                نتایج مطابق انتخاب شما
              </p>

              <p className="mt-1 text-xl font-black text-neutral-900">
                {(loading ? 0 : filteredProducts.length).toLocaleString(
                  "fa-IR",
                )}{" "}
                <span className="text-sm font-medium text-neutral-500">
                  محصول
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
              <h2 className="mb-2 text-lg font-black text-neutral-950">
                فیلتر محصولات
              </h2>

              {filterPanel}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="نام محصول، دسته‌بندی یا برند..."
                  aria-label="جستجوی محصول"
                  className="h-12 min-w-0 flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-[#e60a54] focus:bg-white"
                />

                <div className="flex gap-2">
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    aria-label="مرتب‌سازی محصولات"
                    className="h-12 min-w-0 flex-1 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none focus:border-[#e60a54] sm:w-44 sm:flex-none"
                  >
                    <option value="newest">جدیدترین</option>
                    <option value="oldest">قدیمی‌ترین</option>
                    <option value="price-asc">ارزان‌ترین</option>
                    <option value="price-desc">گران‌ترین</option>
                    <option value="discount">بیشترین تخفیف</option>
                  </select>

                  <button
                    type="button"
                    onClick={() =>
                      setMobileFiltersOpen((value) => !value)
                    }
                    aria-expanded={mobileFiltersOpen}
                    className="flex h-12 items-center gap-2 rounded-lg border border-neutral-200 px-4 text-sm font-bold text-neutral-700 hover:border-[#e60a54] hover:text-[#e60a54] lg:hidden"
                  >
                    ☷ فیلتر
                  </button>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-4">
                  <span className="text-xs text-neutral-500">
                    فیلترهای فعال:
                  </span>

                  {category !== "all" && (
                    <span className="rounded-full bg-[#fff0f5] px-3 py-2 text-xs font-semibold text-[#c00849]">
                      {
                        categories.find(
                          (item) => item.slug === category,
                        )?.name
                      }
                    </span>
                  )}

                  {selectedGender !== "all" && (
                    <span className="rounded-full bg-[#fff0f5] px-3 py-2 text-xs font-semibold text-[#c00849]">
                      {selectedGender}
                    </span>
                  )}

                  {selectedBrand !== "all" && (
                    <span className="rounded-full bg-[#fff0f5] px-3 py-2 text-xs font-semibold text-[#c00849]">
                      برند: {selectedBrand}
                    </span>
                  )}

                  {(minPrice > MIN_PRICE ||
                    maxPrice < MAX_PRICE) && (
                    <span className="rounded-full bg-[#fff0f5] px-3 py-2 text-xs font-semibold text-[#c00849]">
                      {formatPrice(minPrice)} تا{" "}
                      {formatPrice(maxPrice)} تومان
                    </span>
                  )}

                  {inStock && (
                    <span className="rounded-full bg-[#fff0f5] px-3 py-2 text-xs font-semibold text-[#c00849]">
                      فقط موجود
                    </span>
                  )}

                  {discounted && (
                    <span className="rounded-full bg-[#fff0f5] px-3 py-2 text-xs font-semibold text-[#c00849]">
                      تخفیف‌دار
                    </span>
                  )}

                  {search.trim() && (
                    <span className="max-w-full truncate rounded-full bg-[#fff0f5] px-3 py-2 text-xs font-semibold text-[#c00849]">
                      جستجو: {search.trim()}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mr-auto text-xs font-bold text-neutral-500 underline underline-offset-4 hover:text-[#e60a54]"
                  >
                    حذف همه
                  </button>
                </div>
              )}
            </div>

            {mobileFiltersOpen && (
              <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm lg:hidden">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-black text-neutral-950">
                    فیلتر محصولات
                  </h2>

                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-100"
                  >
                    بستن ×
                  </button>
                </div>

                {filterPanel}

                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="mt-5 w-full rounded-lg bg-[#e60a54] px-4 py-3 text-sm font-bold text-white hover:bg-[#c90849]"
                >
                  نمایش{" "}
                  {filteredProducts.length.toLocaleString("fa-IR")}{" "}
                  محصول
                </button>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse overflow-hidden rounded-xl border border-neutral-200"
                  >
                    <div className="aspect-[4/5] bg-neutral-100" />

                    <div className="space-y-3 p-4">
                      <div className="h-3 w-1/3 rounded bg-neutral-100" />
                      <div className="h-4 w-3/4 rounded bg-neutral-100" />
                      <div className="h-4 w-1/2 rounded bg-neutral-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : loadError ? (
              <div className="rounded-xl border border-dashed border-neutral-300 px-5 py-16 text-center">
                <h2 className="text-lg font-black text-neutral-900">
                  دریافت محصولات ناموفق بود
                </h2>

                <p className="mt-2 text-sm leading-7 text-neutral-500">
                  اتصال سرور را بررسی کن و دوباره تلاش کن.
                </p>

                <button
                  type="button"
                  onClick={() => void retryLoading()}
                  disabled={
                    productsQuery.isFetching ||
                    categoriesQuery.isFetching
                  }
                  className="mt-5 rounded-lg bg-[#e60a54] px-5 py-3 text-sm font-bold text-white hover:bg-[#c90849] disabled:opacity-60"
                >
                  {productsQuery.isFetching ||
                  categoriesQuery.isFetching
                    ? "در حال دریافت..."
                    : "تلاش مجدد"}
                </button>
              </div>
            ) : (
              <>
                <p className="mb-5 text-sm text-neutral-500">
                  نمایش{" "}
                  <span className="font-bold text-neutral-900">
                    {filteredProducts.length.toLocaleString("fa-IR")}
                  </span>{" "}
                  محصول
                </p>

                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
                    {filteredProducts.map((product) => (
                      <article
                        key={product.id}
                        className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                      >
                        <Link
                          href={`/products/${product.slug}`}
                          className="block"
                        >
                          <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={`${product.title} | عمه لیلا`}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 280px"
                                className="object-cover transition duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                                تصویر موجود نیست
                              </div>
                            )}

                            {product.discount > 0 && (
                              <span className="absolute right-3 top-3 rounded-full bg-[#e60a54] px-3 py-2 text-xs font-bold text-white">
                                {product.discount.toLocaleString("fa-IR")}
                                ٪ تخفیف
                              </span>
                            )}

                            {!product.inStock && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-neutral-900">
                                  ناموجود
                                </span>
                              </div>
                            )}
                          </div>
                        </Link>

                        <div className="p-4">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs text-neutral-400">
                              {product.categoryName}
                            </p>

                            <p className="truncate text-xs text-neutral-400">
                              {product.brand}
                            </p>
                          </div>

                          <Link href={`/products/${product.slug}`}>
                            <h2 className="mt-3 line-clamp-2 min-h-12 text-sm font-bold leading-6 text-neutral-900 transition hover:text-[#e60a54]">
                              {product.title}
                            </h2>
                          </Link>

                          <div className="mt-4 flex items-baseline justify-between gap-1">
                            <span className="text-base font-black text-neutral-950">
                              {formatPrice(product.price)}
                            </span>

                            <span className="text-xs text-neutral-500">
                              تومان
                            </span>
                          </div>

                          {product.oldPrice !== null && (
                            <div className="mt-2 text-sm text-neutral-400 line-through">
                              {formatPrice(product.oldPrice)} تومان
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-neutral-300 px-5 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-2xl text-neutral-500">
                      ⌕
                    </div>

                    <h2 className="mt-4 text-lg font-black text-neutral-900">
                      محصولی پیدا نشد
                    </h2>

                    <p className="mt-2 text-sm leading-7 text-neutral-500">
                      فیلترها را تغییر بده یا محدوده قیمت را بیشتر کن.
                    </p>

                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-5 rounded-lg bg-[#e60a54] px-5 py-3 text-sm font-bold text-white hover:bg-[#c90849]"
                    >
                      نمایش همه محصولات
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}