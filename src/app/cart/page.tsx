
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  LoaderCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ShieldCheck,
  Truck,
  RefreshCw,
} from "lucide-react";
import { cartApi, type Cart } from "@/lib/api";

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;
}

function getErrorMessage(error: unknown) {
  const err = error as {
    response?: {
      status?: number;
      data?: { message?: string };
    };
    message?: string;
  };

  return (
    err.response?.data?.message ||
    err.message ||
    "ارتباط با سرور برقرار نشد. دوباره تلاش کنید."
  );
}

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyItem, setBusyItem] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await cartApi.get();
      setCart(response.cart);
    } catch (err) {
      const errorObject = err as {
        response?: { status?: number };
      };

      if (errorObject.response?.status === 401) {
        sessionStorage.setItem("login_redirect", "/cart");
        router.replace("/login?redirect=%2Fcart");
        return;
      }

      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadCart();
  }, [loadCart]);

  const updateQuantity = async (
    itemId: string,
    quantity: number,
  ) => {
    if (quantity < 1 || busyItem) return;

    setBusyItem(itemId);
    setError("");

    try {
      const response = await cartApi.updateQuantity(itemId, quantity);
      setCart(response.cart);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyItem(null);
    }
  };

  const removeItem = async (itemId: string) => {
    if (busyItem) return;

    setBusyItem(itemId);
    setError("");

    try {
      const response = await cartApi.remove(itemId);
      setCart(response.cart);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyItem(null);
    }
  };

  const clearCart = async () => {
    if (clearing || busyItem || !cart?.items.length) return;

    const confirmed = window.confirm(
      "تمام محصولات از سبد خرید حذف شوند؟",
    );

    if (!confirmed) return;

    setClearing(true);
    setError("");

    try {
      const response = await cartApi.clear();
      setCart(response.cart);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setClearing(false);
    }
  };

  const items = cart?.items ?? [];
  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#faf8f9] pb-16 text-[#29242a]"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm text-[#9b8d96]">
              فروشگاه آنلاین Amé Leila
            </p>

            <h1 className="text-2xl font-black sm:text-3xl">
              سبد خرید
            </h1>

            <p className="mt-2 text-sm text-[#81747d]">
              محصولات انتخاب‌شده خود را بررسی کنید.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl border border-[#e8e0e5] bg-white px-4 py-3 text-sm font-bold transition hover:border-[#e60a54] hover:text-[#e60a54]"
          >
            ادامه خرید
            <ArrowLeft size={17} />
          </Link>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={() => void loadCart()}
              className="inline-flex items-center gap-2 font-bold"
            >
              <RefreshCw size={15} />
              تلاش مجدد
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-3xl border border-[#eee7eb] bg-white">
            <LoaderCircle
              className="animate-spin text-[#e60a54]"
              size={36}
            />
            <p className="text-sm text-[#81747d]">
              در حال دریافت سبد خرید از سرور...
            </p>
          </div>
        ) : !cart ? (
          <div className="rounded-3xl border border-[#eee7eb] bg-white px-5 py-16 text-center">
            <ShoppingBag
              className="mx-auto mb-4 text-[#c8bbc3]"
              size={48}
            />
            <h2 className="text-lg font-bold">
              سبد خرید دریافت نشد
            </h2>
            <p className="mt-2 text-sm text-[#81747d]">
              اتصال بک‌اند و ورود به حساب کاربری را بررسی کنید.
            </p>
            <button
              type="button"
              onClick={() => void loadCart()}
              className="mt-6 rounded-xl bg-[#e60a54] px-6 py-3 text-sm font-bold text-white"
            >
              تلاش مجدد
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-[#eee7eb] bg-white px-5 py-16 text-center">
            <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-[#fff0f5] text-[#e60a54]">
              <ShoppingBag size={36} />
            </div>

            <h2 className="text-xl font-black">
              سبد خرید شما خالی است
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#81747d]">
              هنوز محصولی به سبد خرید اضافه نکرده‌اید.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#e60a54] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#c90849]"
            >
              مشاهده محصولات
              <ArrowLeft size={17} />
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#81747d]">
                {new Intl.NumberFormat("fa-IR").format(itemCount)} عدد
                محصول در سبد شما
              </p>

              <button
                type="button"
                onClick={() => void clearCart()}
                disabled={clearing || Boolean(busyItem)}
                className="inline-flex items-center gap-2 text-sm text-[#a33b5e] transition hover:text-[#e60a54] disabled:opacity-50"
              >
                {clearing ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                خالی کردن سبد
              </button>
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
              <section className="min-w-0 space-y-4">
                {items.map((item) => {
                  const product = item.product;
                  const imageUrl = product?.images?.[0]?.url;
                  const itemBusy = busyItem === item._id;

                  return (
                    <article
                      key={item._id}
                      className="rounded-2xl border border-[#eee7eb] bg-white p-4 sm:p-5"
                    >
                      <div className="flex gap-4">
                        <Link
                          href={
                            product?.slug
                              ? `/products/${product.slug}`
                              : "/products"
                          }
                          className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f5f0f3] sm:h-36 sm:w-32"
                        >
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={
                                product?.name || "تصویر محصول"
                              }
                              fill
                              sizes="(max-width: 640px) 96px, 128px"
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[#b9aab4]">
                              <ShoppingBag size={30} />
                            </div>
                          )}
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                          <div>
                            <Link
                              href={
                                product?.slug
                                  ? `/products/${product.slug}`
                                  : "/products"
                              }
                              className="line-clamp-2 font-bold leading-7 transition hover:text-[#e60a54]"
                            >
                              {product?.name || "محصول حذف‌شده"}
                            </Link>

                            {item.variant?.color && (
                              <p className="mt-1 text-xs text-[#81747d]">
                                رنگ: {item.variant.color}
                              </p>
                            )}

                            {item.variant?.size && (
                              <p className="mt-1 text-xs text-[#81747d]">
                                سایز: {item.variant.size}
                              </p>
                            )}

                            <p className="mt-2 text-xs text-[#81747d]">
                              قیمت هر عدد: {formatPrice(item.price)}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="inline-flex h-10 items-center rounded-xl border border-[#e8e0e5]">
                              <button
                                type="button"
                                aria-label="افزایش تعداد"
                                disabled={
                                  itemBusy ||
                                  Boolean(busyItem) ||
                                  clearing
                                }
                                onClick={() =>
                                  void updateQuantity(
                                    item._id,
                                    item.quantity + 1,
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center text-[#62545e] hover:text-[#e60a54] disabled:opacity-40"
                              >
                                <Plus size={16} />
                              </button>

                              <span className="min-w-8 text-center text-sm font-bold">
                                {new Intl.NumberFormat("fa-IR").format(
                                  item.quantity,
                                )}
                              </span>

                              <button
                                type="button"
                                aria-label="کاهش تعداد"
                                disabled={
                                  itemBusy ||
                                  Boolean(busyItem) ||
                                  clearing ||
                                  item.quantity <= 1
                                }
                                onClick={() =>
                                  void updateQuantity(
                                    item._id,
                                    item.quantity - 1,
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center text-[#62545e] hover:text-[#e60a54] disabled:opacity-40"
                              >
                                <Minus size={16} />
                              </button>
                            </div>

                            <div className="text-left">
                              <p className="text-sm font-black">
                                {formatPrice(item.price * item.quantity)}
                              </p>

                              <button
                                type="button"
                                disabled={
                                  itemBusy ||
                                  Boolean(busyItem) ||
                                  clearing
                                }
                                onClick={() =>
                                  void removeItem(item._id)
                                }
                                className="mt-2 inline-flex items-center gap-1 text-xs text-[#a33b5e] hover:text-[#e60a54] disabled:opacity-40"
                              >
                                {itemBusy ? (
                                  <LoaderCircle
                                    size={13}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2 size={13} />
                                )}
                                حذف
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </section>

              <aside className="space-y-4 lg:sticky lg:top-6">
                <div className="rounded-2xl border border-[#eee7eb] bg-white p-5 sm:p-6">
                  <h2 className="text-lg font-black">
                    خلاصه سفارش
                  </h2>

                  <div className="mt-6 space-y-4 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[#81747d]">
                        تعداد کالا
                      </span>
                      <span className="font-bold">
                        {new Intl.NumberFormat("fa-IR").format(
                          itemCount,
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[#81747d]">
                        مبلغ کالاها
                      </span>
                      <span className="font-bold">
                        {formatPrice(cart.subtotal)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[#81747d]">
                        تخفیف
                      </span>
                      <span className="font-bold text-emerald-600">
                        {cart.discount > 0
                          ? `− ${formatPrice(cart.discount)}`
                          : formatPrice(0)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[#81747d]">
                        هزینه ارسال
                      </span>
                      <span className="font-bold">
                        {cart.shipping > 0
                          ? formatPrice(cart.shipping)
                          : "رایگان"}
                      </span>
                    </div>
                  </div>

                  <div className="my-5 border-t border-dashed border-[#e8e0e5]" />

                  <div className="flex items-start justify-between gap-3">
                    <span className="font-bold">مبلغ قابل پرداخت</span>
                    <span className="text-left text-lg font-black text-[#e60a54]">
                      {formatPrice(cart.total)}
                    </span>
                  </div>

                  <Link
                    href="/checkout"
                    className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#e60a54] px-4 text-sm font-bold text-white transition hover:bg-[#cc094b]"
                  >
                    ادامه و ثبت سفارش
                    <ArrowLeft size={17} />
                  </Link>

                  <p className="mt-3 text-center text-xs leading-6 text-[#968893]">
                    هزینه نهایی باید هنگام ثبت سفارش در سرور دوباره
                    بررسی شود.
                  </p>
                </div>

                <div className="space-y-4 rounded-2xl border border-[#eee7eb] bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f8f0f4] text-[#e60a54]">
                      <ShieldCheck size={21} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">
                        خرید امن
                      </p>
                      <p className="mt-1 text-xs text-[#81747d]">
                        اطلاعات سفارش از سرور دریافت می‌شود.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f8f0f4] text-[#e60a54]">
                      <Truck size={21} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">
                        ارسال سفارش
                      </p>
                      <p className="mt-1 text-xs text-[#81747d]">
                        هزینه ارسال طبق محاسبه فروشگاه
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
