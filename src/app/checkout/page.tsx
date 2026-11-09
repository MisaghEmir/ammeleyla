"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, cartApi, type Cart } from "@/lib/api";

type AddressForm = {
  name: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
};

const initialAddress: AddressForm = {
  name: "",
  phone: "",
  province: "",
  city: "",
  address: "",
  postalCode: "",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price);
}

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<Cart | null>(null);
  const [form, setForm] = useState<AddressForm>(initialAddress);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCart() {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          router.replace("/login?redirect=/checkout");
          return;
        }

        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        const response = await cartApi.get();
        setCart(response.cart);
      } catch {
        setError("دریافت سبد خرید امکان‌پذیر نیست. لطفاً دوباره تلاش کنید.");
      } finally {
        setLoading(false);
      }
    }

    loadCart();

    return () => {
      delete api.defaults.headers.common.Authorization;
    };
  }, [router]);

  const subtotal =
    cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;

  const shipping = 120_000;
  const total = subtotal + shipping;

  function updateField(field: keyof AddressForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.push("/login?redirect=/checkout");
      return;
    }

    if (!cart || cart.items.length === 0) {
      setError("سبد خرید شما خالی است.");
      return;
    }

    setSubmitting(true);

    try {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      /*
       * این endpoint باید در بک‌اند پیاده‌سازی شود.
       * سرور باید محصولات، قیمت‌ها و موجودی را از MongoDB
       * بررسی کند و سپس درخواست پرداخت زرین‌پال بسازد.
       */
      const { data } = await api.post<{
        success: boolean;
        paymentUrl?: string;
        message?: string;
      }>("/payments/request", {
        shippingAddress: form,
      });

      if (!data.success || !data.paymentUrl) {
        throw new Error(data.message || "ساخت درخواست پرداخت موفق نبود.");
      }

      window.location.assign(data.paymentUrl);
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "response" in err
          ? (
              err as {
                response?: {
                  data?: { message?: string };
                };
              }
            ).response?.data?.message
          : undefined;

      setError(
        message ||
          (err instanceof Error
            ? err.message
            : "خطا در اتصال به درگاه پرداخت."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center bg-neutral-50"
      >
        <p className="text-sm text-neutral-500">
          در حال دریافت اطلاعات سبد خرید...
        </p>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-neutral-50 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <Link
            href="/cart"
            className="text-sm font-medium text-[#e60a54] hover:underline"
          >
            ← بازگشت به سبد خرید
          </Link>

          <h1 className="mt-4 text-2xl font-black text-neutral-900 sm:text-3xl">
            تکمیل سفارش
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            اطلاعات تحویل سفارش را وارد کنید.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-7 text-red-700"
          >
            {error}
          </div>
        )}

        {!cart || cart.items.length === 0 ? (
          <section className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
            <p className="font-bold text-neutral-800">سبد خرید شما خالی است.</p>

            <Link
              href="/products"
              className="mt-5 inline-flex rounded-xl bg-[#e60a54] px-6 py-3 text-sm font-bold text-white hover:bg-[#d5094d]"
            >
              مشاهده محصولات
            </Link>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7">
                <h2 className="text-lg font-black text-neutral-900">
                  اطلاعات گیرنده
                </h2>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field
                    label="نام و نام خانوادگی"
                    value={form.name}
                    onChange={(value) => updateField("name", value)}
                    placeholder="نام گیرنده"
                    required
                  />

                  <Field
                    label="شماره موبایل"
                    value={form.phone}
                    onChange={(value) => updateField("phone", value)}
                    placeholder="09123456789"
                    inputMode="tel"
                    pattern="09[0-9]{9}"
                    required
                  />

                  <Field
                    label="استان"
                    value={form.province}
                    onChange={(value) => updateField("province", value)}
                    placeholder="استان محل تحویل"
                    required
                  />

                  <Field
                    label="شهر"
                    value={form.city}
                    onChange={(value) => updateField("city", value)}
                    placeholder="شهر محل تحویل"
                    required
                  />

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-bold text-neutral-700">
                      آدرس کامل
                    </label>

                    <textarea
                      value={form.address}
                      onChange={(event) =>
                        updateField("address", event.target.value)
                      }
                      placeholder="خیابان، کوچه، پلاک، واحد و سایر جزئیات"
                      required
                      minLength={10}
                      rows={4}
                      className="w-full resize-y rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-[#e60a54] focus:ring-2 focus:ring-pink-100"
                    />
                  </div>

                  <Field
                    label="کد پستی"
                    value={form.postalCode}
                    onChange={(value) => updateField("postalCode", value)}
                    placeholder="۱۰ رقم کد پستی"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7">
                <h2 className="text-lg font-black text-neutral-900">
                  روش پرداخت
                </h2>

                <div className="mt-5 flex items-start gap-3 rounded-xl border border-pink-200 bg-pink-50 p-4">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#e60a54]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#e60a54]" />
                  </span>

                  <div>
                    <p className="text-sm font-bold text-neutral-900">
                      پرداخت اینترنتی
                    </p>
                    <p className="mt-1 text-xs leading-6 text-neutral-600">
                      انتقال به درگاه پرداخت پس از ثبت اطلاعات سفارش.
                    </p>
                  </div>
                </div>
              </section>

              <button
                type="submit"
                disabled={submitting || cart.items.length === 0}
                className="flex h-13 w-full items-center justify-center rounded-xl bg-[#e60a54] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#d5094d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "در حال اتصال به درگاه..." : "ثبت سفارش و پرداخت"}
              </button>
            </form>

            <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-5 lg:sticky lg:top-24">
              <h2 className="text-lg font-black text-neutral-900">
                خلاصه سفارش
              </h2>

              <div className="mt-5 space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold leading-6 text-neutral-800">
                        {item.product.name}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        تعداد: {formatPrice(item.quantity)}
                      </p>
                    </div>

                    <span className="shrink-0 text-sm font-bold text-neutral-800">
                      {formatPrice(item.price * item.quantity)} تومان
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4 border-t border-neutral-100 pt-5">
                <SummaryRow
                  label="جمع محصولات"
                  value={`${formatPrice(subtotal)} تومان`}
                />

                <SummaryRow
                  label="هزینه ارسال"
                  value={`${formatPrice(shipping)} تومان`}
                />

                <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                  <span className="text-sm font-bold text-neutral-900">
                    مبلغ قابل پرداخت
                  </span>

                  <span className="text-lg font-black text-[#e60a54]">
                    {formatPrice(total)} تومان
                  </span>
                </div>
              </div>

              <p className="mt-5 text-xs leading-6 text-neutral-500">
                مبلغ نهایی باید در سمت سرور و بر اساس قیمت فعلی محصولات محاسبه و
                پیش از انتقال به درگاه اعتبارسنجی شود.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  inputMode,
  pattern,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  inputMode?: "text" | "tel" | "numeric";
  pattern?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-neutral-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        inputMode={inputMode}
        pattern={pattern}
        className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-[#e60a54] focus:ring-2 focus:ring-pink-100"
      />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="font-bold text-neutral-900">{value}</span>
    </div>
  );
}
