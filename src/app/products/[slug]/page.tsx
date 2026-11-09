"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { cartApi, productsApi } from "@/lib/api";
import type { Product } from "@/lib/api";

type ProductVariant = NonNullable<Product["variants"]>[number];

type Review = {
  id: string;
  name: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
};

type ReviewForm = {
  name: string;
  rating: number;
  title: string;
  comment: string;
};

type AddToCartVariables = {
  quantity: number;
  variantId: string;
};

const formatPrice = (price: number) =>
  `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;

function getCartErrorMessage(error: unknown) {
  const err = error as {
    response?: {
      status?: number;
      data?: { message?: string };
    };
    message?: string;
  };

  if (err.response?.status === 401) {
    return "نشست شما منقضی شده است. دوباره وارد حساب کاربری شوید.";
  }

  return (
    err.response?.data?.message || err.message || "ارتباط با سرور برقرار نشد."
  );
}

function getImageUrl(url?: string) {
  if (!url) return "";

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const origin = apiUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");

  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

function Stars({
  value,
  interactive = false,
  onChange,
}: {
  value: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}) {
  return (
    <div
      className="flex items-center gap-1"
      dir="ltr"
      aria-label={`امتیاز ${value} از ۵`}
    >
      {[1, 2, 3, 4, 5].map((star) =>
        interactive ? (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            className={`text-2xl transition ${
              star <= value ? "text-amber-400" : "text-gray-300"
            }`}
            aria-label={`${star} ستاره`}
          >
            ★
          </button>
        ) : (
          <span
            key={star}
            className={`text-lg ${
              star <= value ? "text-amber-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ),
      )}
    </div>
  );
}

export default function ProductDetailsClient() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "reviews"
  >("description");

  const [reviews, setReviews] = useState<Review[]>([]);

  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    name: "",
    rating: 5,
    title: "",
    comment: "",
  });

  const [reviewMessage, setReviewMessage] = useState("");

  const productQuery = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response: unknown = await productsApi.getBySlug(slug);

      console.log("PRODUCT SLUG:", slug);
      console.log("PRODUCT API RESPONSE:", response);

      if (response && typeof response === "object" && "product" in response) {
        const result = response as {
          success?: boolean;
          product?: Product;
          message?: string;
        };

        if (
          result.success === false ||
          !result.product ||
          typeof result.product !== "object" ||
          !result.product._id ||
          !result.product.name
        ) {
          throw new Error(
            result.message || "اطلاعات محصول در پاسخ سرور معتبر نیست.",
          );
        }

        return result.product;
      }

      if (
        response &&
        typeof response === "object" &&
        "_id" in response &&
        "name" in response
      ) {
        return response as Product;
      }

      throw new Error("ساختار پاسخ سرور برای محصول معتبر نیست.");
    },
    enabled: Boolean(slug),
    staleTime: 60 * 1000,
    retry: 1,
  });

  const product: Product | undefined = productQuery.data;

  const images = useMemo(() => {
    return (product?.images ?? [])
      .filter((image) => Boolean(image.url))
      .map((image) => ({
        url: getImageUrl(image.url),
        alt: image.alt || product?.name || "تصویر محصول",
      }));
  }, [product]);

  const variants = useMemo(() => {
    return (product?.variants ?? []).filter(
      (variant) => variant.isActive !== false,
    );
  }, [product]);

  const sizes = useMemo(
    () =>
      Array.from(
        new Set(
          variants
            .map((variant) => variant.size)
            .filter((size): size is string => Boolean(size)),
        ),
      ),
    [variants],
  );

  const colors = useMemo(
    () =>
      Array.from(
        new Set(
          variants
            .map((variant) => variant.color)
            .filter((color): color is string => Boolean(color)),
        ),
      ),
    [variants],
  );

  const matchingVariants = useMemo(() => {
    return variants.filter(
      (variant) =>
        (!selectedSize || variant.size === selectedSize) &&
        (!selectedColor || variant.color === selectedColor),
    );
  }, [variants, selectedSize, selectedColor]);

  const selectionComplete =
    (!sizes.length || Boolean(selectedSize)) &&
    (!colors.length || Boolean(selectedColor));

  const selectedVariant = useMemo(() => {
    if (!selectionComplete) return undefined;

    return variants.find(
      (variant) =>
        (!sizes.length || variant.size === selectedSize) &&
        (!colors.length || variant.color === selectedColor),
    );
  }, [variants, sizes, colors, selectedSize, selectedColor, selectionComplete]);

  const price = selectedVariant
    ? Number(selectedVariant.price)
    : variants.length
      ? Math.min(
          ...variants
            .filter((variant) => {
              const matchesSize =
                !selectedSize || variant.size === selectedSize;
              const matchesColor =
                !selectedColor || variant.color === selectedColor;
              return matchesSize && matchesColor;
            })
            .map((variant) => Number(variant.price))
            .filter((value) => Number.isFinite(value) && value > 0),
          Number(product?.price ?? 0),
        )
      : Number(product?.price ?? 0);

  const stock =
    variants.length > 0
      ? selectionComplete
        ? Number(selectedVariant?.stock ?? 0)
        : undefined
      : Number(product?.stock ?? 0);

  const outOfStock =
    (variants.length > 0 && selectionComplete && !selectedVariant) ||
    (typeof stock === "number" && stock <= 0);

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const addToCartMutation = useMutation({
    mutationFn: async (variables: AddToCartVariables) => {
      if (!product) {
        throw new Error("محصول پیدا نشد.");
      }

      return cartApi.add({
        productId: product._id,
        quantity: variables.quantity,
        variantId: variables.variantId,
      });
    },
  });

  function handleAddToCart() {
    if (!product) return;

    if ((sizes.length > 0 || colors.length > 0) && !selectionComplete) {
      window.alert("لطفاً رنگ و سایز محصول را انتخاب کن.");
      return;
    }

    if (!selectedVariant?._id) {
      window.alert(
        "واریانت معتبر محصول پیدا نشد. رنگ و سایز محصول را بررسی کن.",
      );
      return;
    }

    if (outOfStock) {
      window.alert("این محصول در حال حاضر موجود نیست.");
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      window.alert("تعداد محصول معتبر نیست.");
      return;
    }

    if (typeof stock === "number" && quantity > stock) {
      window.alert(`فقط ${stock} عدد از این محصول موجود است.`);
      return;
    }

    const variantId = selectedVariant._id;
    const token = localStorage.getItem("accessToken");

    if (!token) {
      sessionStorage.setItem(
        "pendingCartItem",
        JSON.stringify({
          productId: product._id,
          variantId,
          quantity,
        }),
      );

      window.location.href = "/login?redirect=%2Fcart";
      return;
    }

    addToCartMutation.mutate({ quantity, variantId });
  }

  function handleReviewSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReviewMessage("");

    if (
      !reviewForm.name.trim() ||
      !reviewForm.title.trim() ||
      !reviewForm.comment.trim()
    ) {
      setReviewMessage("لطفاً همه فیلدهای فرم نظر را تکمیل کن.");
      return;
    }

    const newReview: Review = {
      id: `${Date.now()}`,
      name: reviewForm.name.trim(),
      rating: reviewForm.rating,
      title: reviewForm.title.trim(),
      comment: reviewForm.comment.trim(),
      date: new Date().toLocaleDateString("fa-IR"),
    };

    setReviews((current) => [newReview, ...current]);

    setReviewForm({
      name: "",
      rating: 5,
      title: "",
      comment: "",
    });

    setReviewMessage(
      "نظر فقط در همین صفحه ثبت شد. برای ذخیره دائمی، API نظرات لازم است.",
    );
  }

  if (productQuery.isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20" dir="rtl">
        <div className="animate-pulse space-y-5">
          <div className="h-5 w-40 rounded bg-gray-200" />
          <div className="grid gap-8 md:grid-cols-2">
            <div className="aspect-[4/5] rounded-2xl bg-gray-200" />
            <div className="space-y-5">
              <div className="h-8 w-3/4 rounded bg-gray-200" />
              <div className="h-5 w-1/2 rounded bg-gray-200" />
              <div className="h-24 rounded bg-gray-200" />
              <div className="h-12 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (productQuery.isError || !product) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-24 text-center" dir="rtl">
        <div className="rounded-2xl border border-gray-200 p-8">
          <div className="mb-4 text-5xl">!</div>

          <h1 className="mb-3 text-xl font-bold">
            دریافت اطلاعات محصول ناموفق بود
          </h1>

          <p className="mb-4 text-sm leading-7 text-gray-500">
            {productQuery.error instanceof Error
              ? productQuery.error.message
              : "اتصال سرور را بررسی کن یا دوباره تلاش کن."}
          </p>

          <button
            type="button"
            onClick={() => productQuery.refetch()}
            className="rounded-xl bg-[#e60a54] px-6 py-3 font-medium text-white"
          >
            تلاش دوباره
          </button>

          <div className="mt-5">
            <Link href="/products" className="text-sm text-gray-600 underline">
              بازگشت به فروشگاه
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="mb-7 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="transition hover:text-[#e60a54]">
            خانه
          </Link>
          <span>/</span>
          <Link href="/products" className="transition hover:text-[#e60a54]">
            فروشگاه
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Product gallery */}
          <section className="min-w-0">
            <div className="relative overflow-hidden rounded-2xl bg-gray-50">
              {images.length > 0 ? (
                <Image
                  src={images[selectedImage]?.url || images[0].url}
                  alt={images[selectedImage]?.alt || product.name}
                  width={800}
                  height={1000}
                  unoptimized
                  priority
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center text-gray-400">
                  تصویری برای این محصول ثبت نشده است
                </div>
              )}

              {product.isFeatured && (
                <span className="absolute right-4 top-4 rounded-full bg-[#e60a54] px-3 py-1.5 text-xs font-medium text-white">
                  پیشنهاد ویژه
                </span>
              )}

              <button
                type="button"
                onClick={() => setFavorite((current) => !current)}
                aria-label={
                  favorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
                }
                className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl shadow-sm transition hover:scale-105"
              >
                <span className={favorite ? "text-[#e60a54]" : "text-gray-500"}>
                  {favorite ? "♥" : "♡"}
                </span>
              </button>
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={`${image.url}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    aria-label={`نمایش تصویر ${index + 1}`}
                    className={`shrink-0 overflow-hidden rounded-xl border-2 transition ${
                      selectedImage === index
                        ? "border-[#e60a54]"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      width={100}
                      height={120}
                      unoptimized
                      className="h-24 w-20 object-cover sm:h-28 sm:w-24"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Product information */}
          <section className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              {product.isFeatured && (
                <span className="rounded-lg bg-pink-50 px-3 py-1 text-xs text-[#e60a54]">
                  منتخب عمه لیلا
                </span>
              )}

              {typeof stock === "number" && stock > 0 && (
                <span className="text-xs text-green-700">موجود در انبار</span>
              )}
            </div>

            <h1 className="text-2xl font-bold leading-relaxed sm:text-3xl">
              {product.name}
            </h1>

            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500"
            >
              <Stars value={Math.round(averageRating)} />
              <span>
                {reviews.length
                  ? `${reviews.length.toLocaleString("fa-IR")} نظر`
                  : "هنوز نظری ثبت نشده"}
              </span>
            </button>

            {product.description && (
              <p className="mt-5 whitespace-pre-line text-sm leading-8 text-gray-600">
                {product.description}
              </p>
            )}

            <div className="my-6 rounded-2xl bg-gray-50 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-2xl font-bold text-[#e60a54]">
                  {formatPrice(price)}
                </span>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                قیمت نهایی با توجه به رنگ و سایز انتخابی نمایش داده می‌شود.
              </p>
            </div>

            {/* Color selection */}
            {colors.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-3 text-sm font-bold">
                  رنگ:{" "}
                  <span className="font-normal text-gray-500">
                    {selectedColor || "انتخاب نشده"}
                  </span>
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
                          setQuantity(1);
                        }}
                        className={`rounded-xl border px-4 py-2.5 text-sm transition ${
                          selectedColor === color
                            ? "border-[#e60a54] bg-pink-50 text-[#e60a54]"
                            : "border-gray-200 hover:border-gray-400"
                        } disabled:cursor-not-allowed disabled:opacity-35`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size selection */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-3 text-sm font-bold">
                  سایز:{" "}
                  <span className="font-normal text-gray-500">
                    {selectedSize || "انتخاب نشده"}
                  </span>
                </h2>

                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const available = variants.some(
                      (variant) =>
                        variant.size === size &&
                        (!selectedColor || variant.color === selectedColor) &&
                        Number(variant.stock) > 0,
                    );

                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={!available}
                        onClick={() => {
                          setSelectedSize(size);
                          setQuantity(1);
                        }}
                        className={`rounded-lg border px-4 py-2 text-sm transition ${
                          selectedSize === size
                            ? "border-[#E60A54] bg-pink-50 text-[#E60A54]"
                            : "border-gray-200"
                        } disabled:cursor-not-allowed disabled:opacity-40`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="mb-1 text-sm font-bold">تعداد</p>

                <div className="flex items-center rounded-xl border border-gray-200">
                  <button
                    type="button"
                    aria-label="افزایش تعداد"
                    disabled={
                      outOfStock ||
                      (typeof stock === "number" && quantity >= stock)
                    }
                    onClick={() =>
                      setQuantity((current) =>
                        typeof stock === "number"
                          ? Math.min(current + 1, stock)
                          : current + 1,
                      )
                    }
                    className="h-11 w-11 text-lg disabled:opacity-30"
                  >
                    +
                  </button>

                  <span className="min-w-10 text-center">
                    {quantity.toLocaleString("fa-IR")}
                  </span>

                  <button
                    type="button"
                    aria-label="کاهش تعداد"
                    disabled={quantity <= 1}
                    onClick={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
                    className="h-11 w-11 text-lg disabled:opacity-30"
                  >
                    −
                  </button>
                </div>
              </div>

              {typeof stock === "number" && (
                <p className="text-xs text-gray-500">
                  {stock > 0
                    ? `${stock.toLocaleString("fa-IR")} عدد موجود`
                    : "ناموجود"}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={
                !product ||
                productQuery.isLoading ||
                addToCartMutation.isPending ||
                outOfStock
              }
              className="w-full rounded-xl bg-[#E60A54] px-5 py-3 font-bold text-white transition hover:bg-[#c90849] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addToCartMutation.isPending
                ? "در حال افزودن..."
                : outOfStock
                  ? "ناموجود"
                  : "افزودن به سبد خرید"}
            </button>

            {addToCartMutation.isSuccess && (
              <p className="mt-3 rounded-xl bg-green-50 p-3 text-sm text-green-700">
                {addToCartMutation.data?.message ||
                  "درخواست افزودن محصول به سبد خرید موفق بود."}
              </p>
            )}

            {addToCartMutation.isError && (
              <p
                role="alert"
                className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-600"
              >
                {getCartErrorMessage(addToCartMutation.error)}
              </p>
            )}

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-100 p-4 text-center">
                <span className="mb-2 block text-xl">🚚</span>
                <p className="text-xs font-medium">ارسال سفارش</p>
              </div>

              <div className="rounded-xl border border-gray-100 p-4 text-center">
                <span className="mb-2 block text-xl">↩</span>
                <p className="text-xs font-medium">قوانین مرجوعی</p>
              </div>

              <div className="rounded-xl border border-gray-100 p-4 text-center">
                <span className="mb-2 block text-xl">✓</span>
                <p className="text-xs font-medium">خرید مطمئن</p>
              </div>
            </div>
          </section>
        </div>

        {/* Product details, specifications and reviews */}
        <section className="mt-14 border-t border-gray-100 pt-8">
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {[
              { id: "description", label: "توضیحات محصول" },
              { id: "specifications", label: "مشخصات محصول" },
              { id: "reviews", label: `نظرات (${reviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveTab(
                    tab.id as "description" | "specifications" | "reviews",
                  )
                }
                className={`border-b-2 px-4 py-3 text-sm transition ${
                  activeTab === tab.id
                    ? "border-[#e60a54] font-bold text-[#e60a54]"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Description */}
          {activeTab === "description" && (
            <div className="max-w-4xl py-7">
              <h2 className="mb-4 text-lg font-bold">درباره محصول</h2>

              <p className="whitespace-pre-line text-sm leading-8 text-gray-600">
                {product.description ||
                  "توضیحات بیشتری برای این محصول ثبت نشده است."}
              </p>

              {product.tags && product.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Product specifications */}
          {activeTab === "specifications" && (
            <div className="max-w-3xl py-7">
              <h2 className="mb-5 text-lg font-bold">مشخصات محصول</h2>

              <dl className="overflow-hidden rounded-2xl border border-gray-100">
                <div className="grid grid-cols-2 gap-4 bg-gray-50 px-5 py-4 text-sm">
                  <dt className="text-gray-500">نام محصول</dt>
                  <dd className="font-medium">{product.name}</dd>
                </div>

                <div className="grid grid-cols-2 gap-4 px-5 py-4 text-sm">
                  <dt className="text-gray-500">دسته‌بندی</dt>
                  <dd className="font-medium">
                    {typeof product.category === "object" &&
                    product.category !== null
                      ? product.category.name
                      : typeof product.category === "string"
                        ? product.category
                        : "ثبت نشده"}
                  </dd>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 px-5 py-4 text-sm">
                  <dt className="text-gray-500">شناسه محصول</dt>
                  <dd className="break-all font-medium" dir="ltr">
                    {product._id}
                  </dd>
                </div>

                <div className="grid grid-cols-2 gap-4 px-5 py-4 text-sm">
                  <dt className="text-gray-500">تعداد تصاویر</dt>
                  <dd className="font-medium">
                    {images.length.toLocaleString("fa-IR")}
                  </dd>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 px-5 py-4 text-sm">
                  <dt className="text-gray-500">رنگ‌ها</dt>
                  <dd className="font-medium">
                    {colors.length ? colors.join("، ") : "ثبت نشده"}
                  </dd>
                </div>

                <div className="grid grid-cols-2 gap-4 px-5 py-4 text-sm">
                  <dt className="text-gray-500">سایزها</dt>
                  <dd className="font-medium">
                    {sizes.length ? sizes.join("، ") : "ثبت نشده"}
                  </dd>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 px-5 py-4 text-sm">
                  <dt className="text-gray-500">قیمت فعلی</dt>
                  <dd className="font-bold text-[#e60a54]">
                    {formatPrice(price)}
                  </dd>
                </div>

                <div className="grid grid-cols-2 gap-4 px-5 py-4 text-sm">
                  <dt className="text-gray-500">وضعیت موجودی</dt>
                  <dd
                    className={outOfStock ? "text-red-600" : "text-green-700"}
                  >
                    {outOfStock
                      ? "ناموجود"
                      : typeof stock === "number"
                        ? `${stock.toLocaleString("fa-IR")} عدد موجود`
                        : "برای بررسی موجودی، رنگ و سایز را انتخاب کنید"}
                  </dd>
                </div>

                {product.tags && product.tags.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 px-5 py-4 text-sm">
                    <dt className="text-gray-500">برچسب‌ها</dt>
                    <dd className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-white px-2 py-1 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>

              {product.description && (
                <div className="mt-8">
                  <h3 className="mb-3 font-bold">توضیحات تکمیلی</h3>
                  <p className="whitespace-pre-line text-sm leading-8 text-gray-600">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Reviews */}
          {activeTab === "reviews" && (
            <div className="grid items-start gap-10 py-7 lg:grid-cols-2">
              <div>
                <h2 className="mb-3 text-xl font-bold">نظرات مشتریان</h2>

                <div className="mb-6 rounded-2xl bg-gray-50 p-5">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold">
                      {reviews.length
                        ? averageRating.toLocaleString("fa-IR", {
                            maximumFractionDigits: 1,
                          })
                        : "—"}
                    </span>

                    <div>
                      <Stars value={Math.round(averageRating)} />
                      <p className="mt-1 text-xs text-gray-500">
                        {reviews.length
                          ? `${reviews.length.toLocaleString("fa-IR")} نظر ثبت‌شده در همین صفحه`
                          : "هنوز نظری ثبت نشده است"}
                      </p>
                    </div>
                  </div>
                </div>

                {reviews.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center">
                    <div className="mb-3 text-3xl">✎</div>
                    <p className="font-medium">اولین نفری باش که نظر می‌دهد</p>
                    <p className="mt-2 text-sm leading-7 text-gray-500">
                      تجربه‌ات از این محصول را بنویس تا به دیگر خریداران کمک
                      کنی.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <article
                        key={review.id}
                        className="rounded-2xl border border-gray-100 p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h3 className="font-bold">{review.title}</h3>
                            <p className="mt-1 text-xs text-gray-500">
                              {review.name} · {review.date}
                            </p>
                          </div>
                          <Stars value={review.rating} />
                        </div>

                        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
                          {review.comment}
                        </p>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-gray-100 p-5 sm:p-7">
                <h2 className="mb-2 text-lg font-bold">ثبت نظر درباره محصول</h2>

                <p className="mb-6 text-sm leading-7 text-gray-500">
                  امتیاز و تجربه خودت را درباره این محصول وارد کن.
                </p>

                <form onSubmit={handleReviewSubmit} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      امتیاز شما
                    </label>

                    <Stars
                      value={reviewForm.rating}
                      interactive
                      onChange={(rating) =>
                        setReviewForm((current) => ({
                          ...current,
                          rating,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="review-name"
                      className="mb-2 block text-sm font-medium"
                    >
                      نام شما
                    </label>

                    <input
                      id="review-name"
                      value={reviewForm.name}
                      onChange={(event) =>
                        setReviewForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      maxLength={80}
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#e60a54]"
                      placeholder="نام خود را وارد کن"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="review-title"
                      className="mb-2 block text-sm font-medium"
                    >
                      عنوان نظر
                    </label>

                    <input
                      id="review-title"
                      value={reviewForm.title}
                      onChange={(event) =>
                        setReviewForm((current) => ({
                          ...current,
                          title: event.target.value,
                        }))
                      }
                      maxLength={120}
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#e60a54]"
                      placeholder="مثلاً کیفیت دوخت عالی بود"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="review-comment"
                      className="mb-2 block text-sm font-medium"
                    >
                      متن نظر
                    </label>

                    <textarea
                      id="review-comment"
                      value={reviewForm.comment}
                      onChange={(event) =>
                        setReviewForm((current) => ({
                          ...current,
                          comment: event.target.value,
                        }))
                      }
                      maxLength={2000}
                      rows={5}
                      required
                      className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm leading-7 outline-none transition focus:border-[#e60a54]"
                      placeholder="تجربه خودت از خرید این محصول را بنویس..."
                    />
                  </div>

                  {reviewMessage && (
                    <p className="rounded-xl bg-pink-50 p-3 text-sm leading-6 text-[#c90849]">
                      {reviewMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#e60a54] px-5 py-3.5 font-bold text-white transition hover:bg-[#c90849]"
                  >
                    ثبت نظر
                  </button>
                </form>
              </div>
            </div>
          )}
        </section>

        <div className="mt-6 border-t border-gray-100 pt-6">
          <Link
            href="/products"
            className="text-sm text-gray-600 transition hover:text-[#e60a54]"
          >
            ← بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    </main>
  );
}
