
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { productsApi, cartApi, type Product } from "@/lib/api";

function getImageUrl(url?: string): string {
  if (!url) return "/images/product-placeholder.png";
  if (/^https?:\/\//i.test(url)) return url;

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const serverUrl = apiUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");

  return `${serverUrl}/${url.replace(/^\/+/, "")}`;
}

function formatPrice(price: number): string {
  return `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const response = (
      error as { response?: { data?: { message?: string } } }
    ).response;

    if (response?.data?.message) return response.data.message;
  }

  return error instanceof Error
    ? error.message
    : "خطایی رخ داده است. دوباره تلاش کنید.";
}

type Review = {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
};

type ProductResponse = {
  success: boolean;
  product: Product;
};

function isProductResponse(value: unknown): value is ProductResponse {
  if (!value || typeof value !== "object") return false;
  const response = value as Record<string, unknown>;
  return typeof response.success === "boolean" && "product" in response;
}

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;

  const product = value as Record<string, unknown>;

  return (
    typeof product._id === "string" &&
    typeof product.name === "string" &&
    typeof product.slug === "string"
  );
}

export default function ProductDetailsClient() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [selectedImage, setSelectedImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "reviews"
  >("description");

  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState<Review[]>([]);

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response: unknown = await productsApi.getBySlug(slug);

      if (isProductResponse(response)) {
        if (!response.success || !isProduct(response.product)) {
          throw new Error("محصول پیدا نشد.");
        }
        return response.product;
      }

      if (isProduct(response)) return response;

      throw new Error("ساختار پاسخ سرور معتبر نیست.");
    },
    enabled: Boolean(slug),
  });

  const images = useMemo(
    () =>
      (product?.images ?? [])
        .filter((image) => Boolean(image.url))
        .map((image) => ({
          url: getImageUrl(image.url),
          alt: image.alt || product?.name || "تصویر محصول",
        })),
    [product],
  );

  useEffect(() => {
    setSelectedImage((current) =>
      images.length ? Math.min(current, images.length - 1) : 0,
    );
  }, [images.length]);

  useEffect(() => {
    if (!isGalleryOpen) return;

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsGalleryOpen(false);

      if (event.key === "ArrowRight") {
        setSelectedImage((current) =>
          images.length ? (current + 1) % images.length : 0,
        );
      }

      if (event.key === "ArrowLeft") {
        setSelectedImage((current) =>
          images.length ? (current - 1 + images.length) % images.length : 0,
        );
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGalleryOpen, images.length]);

  const variants = useMemo(
    () =>
      (product?.variants ?? []).filter(
        (variant) => variant.isActive !== false,
      ),
    [product],
  );

  const colors = useMemo(
    () =>
      Array.from(
        new Set(
          variants
            .map((variant) => variant.color)
            .filter((value): value is string => Boolean(value)),
        ),
      ),
    [variants],
  );

  const sizes = useMemo(
    () =>
      Array.from(
        new Set(
          variants
            .filter(
              (variant) =>
                !selectedColor || variant.color === selectedColor,
            )
            .map((variant) => variant.size)
            .filter((value): value is string => Boolean(value)),
        ),
      ),
    [variants, selectedColor],
  );

  const matchingVariant = useMemo(() => {
    if (!variants.length) return undefined;
    if (colors.length && !selectedColor) return undefined;
    if (sizes.length && !selectedSize) return undefined;

    return variants.find(
      (variant) =>
        (!colors.length || variant.color === selectedColor) &&
        (!sizes.length || variant.size === selectedSize),
    );
  }, [variants, colors.length, sizes.length, selectedColor, selectedSize]);

  const currentPrice = Number(
    matchingVariant?.price ?? product?.price ?? 0,
  );
  const currentStock = Number(
    matchingVariant?.stock ?? product?.stock ?? 0,
  );
  const oldPrice = Number(product?.oldPrice ?? 0);

  const discount =
    oldPrice > currentPrice && currentPrice > 0
      ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
      : 0;

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!product) throw new Error("محصول پیدا نشد.");

      if (colors.length && !selectedColor) {
        throw new Error("لطفاً رنگ محصول را انتخاب کنید.");
      }

      if (sizes.length && !selectedSize) {
        throw new Error("لطفاً سایز محصول را انتخاب کنید.");
      }

      if (!matchingVariant?._id) {
        throw new Error(
          "شناسه واریانت معتبر نیست. اطلاعات واریانت این محصول باید در دیتابیس اصلاح شود.",
        );
      }

      if (matchingVariant.isActive === false) {
        throw new Error("این مدل از محصول فعال نیست.");
      }

      if (currentStock <= 0) {
        throw new Error("این مدل از محصول ناموجود است.");
      }

      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error("تعداد انتخاب‌شده معتبر نیست.");
      }

      if (quantity > currentStock) {
        throw new Error(`فقط ${currentStock} عدد از این مدل موجود است.`);
      }

      return cartApi.add({
        productId: product._id,
        variantId: matchingVariant._id,
        quantity,
      });
    },
  });

  function submitReview() {
    const name = reviewName.trim();
    const text = reviewText.trim();

    if (!name || !text) {
      window.alert("لطفاً نام و متن نظر را وارد کنید.");
      return;
    }

    setReviews((current) => [
      {
        id: `${Date.now()}`,
        name,
        text,
        rating: reviewRating,
        date: new Date().toLocaleDateString("fa-IR"),
      },
      ...current,
    ]);

    setReviewName("");
    setReviewText("");
    setReviewRating(5);
    window.alert("نظر به فهرست موقت نظرات اضافه شد.");
  }

  if (isLoading) {
    return (
      <main dir="rtl" className="mx-auto max-w-7xl px-4 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-5 w-48 rounded bg-gray-200" />
          <div className="grid gap-8 md:grid-cols-2">
            <div className="aspect-[4/5] rounded-2xl bg-gray-200" />
            <div className="space-y-5">
              <div className="h-8 w-3/4 rounded bg-gray-200" />
              <div className="h-5 w-1/2 rounded bg-gray-200" />
              <div className="h-28 rounded bg-gray-200" />
              <div className="h-12 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main dir="rtl" className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="rounded-2xl border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900">
            دریافت اطلاعات محصول ناموفق بود
          </h1>
          <p className="mt-3 text-gray-500">{getErrorMessage(error)}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-6 rounded-xl bg-[#E60A54] px-6 py-3 font-medium text-white"
          >
            تلاش مجدد
          </button>
          <div className="mt-4">
            <Link href="/products" className="text-[#E60A54]">
              بازگشت به محصولات
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const available = currentStock > 0;

  return (
    <main
      dir="rtl"
      className="mx-auto max-w-7xl px-4 py-8 text-gray-900 sm:px-6 lg:px-8"
    >
      <nav
        aria-label="مسیر صفحه"
        className="mb-7 flex flex-wrap items-center gap-2 text-sm text-gray-500"
      >
        <Link href="/" className="hover:text-[#E60A54]">خانه</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#E60A54]">محصولات</Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* گالری تصاویر */}
        <section aria-label="تصاویر محصول" className="min-w-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-50">
            {images.length > 0 ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsGalleryOpen(true)}
                  aria-label="بزرگ‌نمایی تصاویر محصول"
                  className="group absolute inset-0 z-10 flex w-full cursor-zoom-in items-center justify-center"
                >
                  <Image
                    src={images[selectedImage]?.url || images[0].url}
                    alt={images[selectedImage]?.alt || product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain transition duration-300 group-hover:scale-[1.02]"
                  />
                  <span className="absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-medium text-gray-800 shadow-md">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <circle cx="10.5" cy="10.5" r="6.5" />
                      <path d="m16 16 5 5M10.5 7.5v6M7.5 10.5h6" />
                    </svg>
                    بزرگ‌نمایی تصویر
                  </span>
                </button>

                <span className="pointer-events-none absolute bottom-4 right-4 z-20 rounded-full bg-black/65 px-3 py-1.5 text-xs text-white">
                  تصویر {(selectedImage + 1).toLocaleString("fa-IR")} از{" "}
                  {images.length.toLocaleString("fa-IR")}
                </span>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                تصویری برای این محصول ثبت نشده است.
              </div>
            )}

            {discount > 0 && (
              <span className="pointer-events-none absolute right-4 top-4 z-20 rounded-full bg-[#E60A54] px-3 py-1.5 text-sm font-bold text-white">
                {discount.toLocaleString("fa-IR")}٪ تخفیف
              </span>
            )}

            <button
              type="button"
              aria-label={favorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
              aria-pressed={favorite}
              onClick={() => setFavorite((value) => !value)}
              className="absolute left-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl shadow-sm transition hover:scale-105"
            >
              <span className={favorite ? "text-[#E60A54]" : "text-gray-500"}>
                {favorite ? "♥" : "♡"}
              </span>
            </button>
          </div>

          {images.length > 0 && (
            <div className="mt-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold">تصاویر محصول</h2>
                <span className="text-xs text-gray-500">
                  {images.length.toLocaleString("fa-IR")} تصویر
                </span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-3">
                {images.map((image, index) => (
                  <button
                    key={`${image.url}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    aria-label={`نمایش تصویر ${index + 1}`}
                    aria-pressed={selectedImage === index}
                    className={`relative aspect-square shrink-0 overflow-hidden rounded-xl border-2 bg-gray-50 ${
                      selectedImage === index
                        ? "border-[#E60A54] ring-2 ring-pink-100"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      width={112}
                      height={112}
                      unoptimized
                      className="h-24 w-24 object-contain sm:h-28 sm:w-28"
                    />
                    <span className="absolute bottom-1 left-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                      {(index + 1).toLocaleString("fa-IR")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* اطلاعات محصول */}
        <section className="flex flex-col">
          <p className="mb-3 text-sm text-gray-500">فروشگاه پوشاک عمه لیلا</p>
          <h1 className="text-2xl font-bold leading-relaxed sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            {product.isFeatured && (
              <span className="rounded-full bg-pink-50 px-3 py-1 text-[#E60A54]">
                محصول ویژه
              </span>
            )}
            <span className={available ? "text-green-700" : "text-red-600"}>
              {available ? "موجود در انبار" : "ناموجود"}
            </span>
          </div>

          <div className="mt-7 rounded-2xl bg-gray-50 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xl font-bold text-[#E60A54]">
                {formatPrice(currentPrice)}
              </span>
              {discount > 0 && (
                <span className="text-base text-gray-400 line-through">
                  {formatPrice(oldPrice)}
                </span>
              )}
            </div>
            {discount > 0 && (
              <p className="mt-2 text-sm text-green-700">
                شما {formatPrice(oldPrice - currentPrice)} کمتر پرداخت می‌کنید.
              </p>
            )}
          </div>

          {product.shortDescription && (
            <p className="mt-6 leading-8 text-gray-600">
              {product.shortDescription}
            </p>
          )}

          {colors.length > 0 && (
            <div className="mt-7">
              <h2 className="mb-3 font-semibold">
                رنگ: {selectedColor || "انتخاب کنید"}
              </h2>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const colorAvailable = variants.some(
                    (variant) =>
                      variant.color === color &&
                      (!selectedSize || variant.size === selectedSize) &&
                      Number(variant.stock) > 0,
                  );
                  return (
                    <button
                      key={color}
                      type="button"
                      disabled={!colorAvailable}
                      onClick={() => {
                        setSelectedColor(color);
                        setSelectedSize("");
                        setQuantity(1);
                      }}
                      aria-pressed={selectedColor === color}
                      className={`rounded-xl border px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        selectedColor === color
                          ? "border-[#E60A54] bg-pink-50 text-[#E60A54]"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 font-semibold">
                سایز: {selectedSize || "انتخاب کنید"}
              </h2>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const sizeAvailable = variants.some(
                    (variant) =>
                      variant.size === size &&
                      (!selectedColor || variant.color === selectedColor) &&
                      Number(variant.stock) > 0,
                  );
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!sizeAvailable}
                      onClick={() => {
                        setSelectedSize(size);
                        setQuantity(1);
                      }}
                      aria-pressed={selectedSize === size}
                      className={`min-w-12 rounded-xl border px-4 py-2 transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        selectedSize === size
                          ? "border-[#E60A54] bg-pink-50 text-[#E60A54]"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-7">
            <h2 className="mb-3 font-semibold">تعداد</h2>
            <div className="flex w-fit items-center overflow-hidden rounded-xl border border-gray-200">
              <button
                type="button"
                aria-label="افزایش تعداد"
                disabled={!available || quantity >= currentStock}
                onClick={() =>
                  setQuantity((value) => Math.min(value + 1, currentStock))
                }
                className="h-11 w-11 text-lg disabled:opacity-40"
              >
                +
              </button>
              <span aria-live="polite" className="min-w-12 text-center font-semibold">
                {quantity.toLocaleString("fa-IR")}
              </span>
              <button
                type="button"
                aria-label="کاهش تعداد"
                disabled={quantity <= 1}
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="h-11 w-11 text-lg disabled:opacity-40"
              >
                −
              </button>
            </div>
          </div>

          <button
            type="button"
            disabled={
              !available ||
              addToCartMutation.isPending ||
              (variants.length > 0 && !matchingVariant?._id)
            }
            onClick={() => addToCartMutation.mutate()}
            className="mt-7 w-full rounded-xl bg-[#E60A54] px-6 py-4 font-bold text-white transition hover:bg-[#c90848] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {addToCartMutation.isPending
              ? "در حال افزودن..."
              : !available
                ? "ناموجود"
                : variants.length > 0 && !matchingVariant?._id
                  ? "شناسه مدل نامعتبر است"
                  : "افزودن به سبد خرید"}
          </button>

          {addToCartMutation.isSuccess && (
            <p role="status" className="mt-3 text-sm text-green-700">
              محصول با موفقیت به سبد خرید اضافه شد.
            </p>
          )}
          {addToCartMutation.isError && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {getErrorMessage(addToCartMutation.error)}
            </p>
          )}

          <div className="mt-7 grid grid-cols-1 gap-3 border-t border-gray-100 pt-6 text-sm text-gray-600 sm:grid-cols-2">
            <p>✓ خرید آسان و آنلاین</p>
            <p>✓ مشاهده مشخصات محصول</p>
            <p>✓ انتخاب رنگ و سایز</p>
            <p>✓ پشتیبانی فروشگاه عمه لیلا</p>
          </div>
        </section>
      </div>

      {/* گالری تمام‌صفحه */}
      {isGalleryOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label="گالری تصاویر محصول"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsGalleryOpen(false);
          }}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-4 text-white sm:px-8">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium sm:text-base">
                {product.name}
              </p>
              <p className="mt-1 text-xs text-white/65">
                تصویر {(selectedImage + 1).toLocaleString("fa-IR")} از{" "}
                {images.length.toLocaleString("fa-IR")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsGalleryOpen(false)}
              aria-label="بستن گالری"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-3xl text-white hover:bg-white/20"
            >
              ×
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 py-4 sm:px-24">
            <Image
              src={images[selectedImage].url}
              alt={images[selectedImage].alt}
              fill
              unoptimized
              sizes="100vw"
              className="object-contain p-3 sm:p-6"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="تصویر بعدی"
                  onClick={() =>
                    setSelectedImage((current) => (current + 1) % images.length)
                  }
                  className="absolute right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-3xl text-white hover:bg-white/25 sm:right-6"
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="تصویر قبلی"
                  onClick={() =>
                    setSelectedImage(
                      (current) => (current - 1 + images.length) % images.length,
                    )
                  }
                  className="absolute left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-3xl text-white hover:bg-white/25 sm:left-6"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex shrink-0 gap-3 overflow-x-auto px-4 pb-5 pt-2 sm:justify-center sm:px-8">
              {images.map((image, index) => (
                <button
                  key={`${image.url}-lightbox-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  aria-label={`نمایش تصویر ${index + 1}`}
                  aria-pressed={selectedImage === index}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 sm:h-20 sm:w-20 ${
                    selectedImage === index
                      ? "border-[#E60A54]"
                      : "border-white/20"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* توضیحات، مشخصات و نظرات */}
      <section className="mt-16 border-t border-gray-100 pt-8">
        <div
          role="tablist"
          aria-label="اطلاعات تکمیلی محصول"
          className="flex flex-wrap gap-2 border-b border-gray-200"
        >
          {([
            ["description", "توضیحات محصول"],
            ["specifications", "مشخصات"],
            ["reviews", `نظرات (${reviews.length})`],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`border-b-2 px-4 py-3 font-medium ${
                activeTab === id
                  ? "border-[#E60A54] text-[#E60A54]"
                  : "border-transparent text-gray-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <div className="max-w-4xl py-7">
            <h2 className="mb-4 text-xl font-bold">
              توضیحات {product.name}
            </h2>
            <p className="whitespace-pre-line leading-9 text-gray-600">
              {product.description ||
                product.shortDescription ||
                "توضیحات بیشتری برای این محصول ثبت نشده است."}
            </p>
            {product.tags && product.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="max-w-3xl py-7">
            <h2 className="mb-5 text-xl font-bold">مشخصات محصول</h2>
            <dl className="divide-y divide-gray-100">
              <div className="flex justify-between gap-4 py-4">
                <dt className="text-gray-500">نام محصول</dt>
                <dd className="text-left font-medium">{product.name}</dd>
              </div>
              <div className="flex justify-between gap-4 py-4">
                <dt className="text-gray-500">شناسه محصول</dt>
                <dd dir="ltr" className="break-all text-left text-sm">
                  {product._id}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-4">
                <dt className="text-gray-500">وضعیت موجودی</dt>
                <dd>{available ? "موجود" : "ناموجود"}</dd>
              </div>
              <div className="flex justify-between gap-4 py-4">
                <dt className="text-gray-500">رنگ‌ها</dt>
                <dd>{colors.length ? colors.join("، ") : "ثبت نشده"}</dd>
              </div>
              <div className="flex justify-between gap-4 py-4">
                <dt className="text-gray-500">سایزها</dt>
                <dd>{sizes.length ? sizes.join("، ") : "ثبت نشده"}</dd>
              </div>
            </dl>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="grid gap-8 py-7 lg:grid-cols-2">
            <div>
              <h2 className="mb-5 text-xl font-bold">ثبت نظر درباره محصول</h2>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  submitReview();
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="review-name" className="mb-2 block text-sm font-medium">
                    نام شما
                  </label>
                  <input
                    id="review-name"
                    value={reviewName}
                    onChange={(event) => setReviewName(event.target.value)}
                    required
                    maxLength={80}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E60A54]"
                    placeholder="نام خود را وارد کنید"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    امتیاز شما
                  </label>
                  <div className="flex gap-2" dir="ltr">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        aria-label={`امتیاز ${star} از ۵`}
                        aria-pressed={reviewRating === star}
                        onClick={() => setReviewRating(star)}
                        className={`text-3xl ${
                          star <= reviewRating ? "text-amber-400" : "text-gray-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="review-text" className="mb-2 block text-sm font-medium">
                    متن نظر
                  </label>
                  <textarea
                    id="review-text"
                    value={reviewText}
                    onChange={(event) => setReviewText(event.target.value)}
                    required
                    minLength={3}
                    maxLength={1500}
                    rows={5}
                    className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E60A54]"
                    placeholder="تجربه خود از این محصول را بنویسید..."
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-[#E60A54] px-6 py-3 font-semibold text-white hover:bg-[#c90848]"
                >
                  ثبت نظر
                </button>
                <p className="text-xs leading-6 text-gray-500">
                  نظرات این نسخه موقت هستند و با تازه‌سازی صفحه حذف می‌شوند.
                </p>
              </form>
            </div>

            <div>
              <h2 className="mb-5 text-xl font-bold">نظرات کاربران</h2>
              {reviews.length === 0 ? (
                <div className="rounded-2xl bg-gray-50 p-6 text-gray-500">
                  هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهد.
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-2xl border border-gray-100 p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-semibold">{review.name}</h3>
                        <time className="text-xs text-gray-500">{review.date}</time>
                      </div>
                      <p className="mt-2 text-amber-400" aria-label={`امتیاز ${review.rating} از ۵`}>
                        {"★".repeat(review.rating)}
                        <span className="text-gray-200">
                          {"★".repeat(5 - review.rating)}
                        </span>
                      </p>
                      <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">
                        {review.text}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
