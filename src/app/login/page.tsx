
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const normalizedPhone = phone.replace(/\D/g, "");

    if (!/^09\d{9}$/.test(normalizedPhone)) {
      setError("لطفاً شماره موبایل ۱۱ رقمی معتبر وارد کنید.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/send-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: normalizedPhone,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "ارسال کد تأیید ناموفق بود."
        );
      }

      // ذخیره شماره برای صفحه تأیید کد
      sessionStorage.setItem("login_phone", normalizedPhone);

      // فقط در صورت موفقیت درخواست به صفحه تأیید برو
      router.push("/login/verify");
    } catch (err) {
      console.error("Send OTP error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "ارتباط با سرور برقرار نشد."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <Link
              href="/"
              className="inline-block text-2xl font-black text-[#e60a54]"
            >
              عمه لیلا
            </Link>

            <h1 className="mt-8 text-2xl font-black text-neutral-900">
              ورود یا ساخت حساب
            </h1>

            <p className="mt-3 text-sm leading-7 text-neutral-500">
              شماره موبایل خود را وارد کنید تا کد تأیید ساخته شود.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={sendCode} className="mt-8">
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-neutral-700"
            >
              شماره موبایل
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              dir="ltr"
              autoComplete="tel"
              value={phone}
              onChange={(event) => {
                setPhone(
                  event.target.value.replace(/\D/g, "").slice(0, 11)
                );
              }}
              placeholder="09123456789"
              maxLength={11}
              autoFocus
              disabled={loading}
              className="h-13 w-full rounded-xl border border-neutral-200 bg-white px-4 text-left text-base outline-none transition placeholder:text-neutral-400 focus:border-[#e60a54] focus:ring-2 focus:ring-[#e60a54]/10"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-5 h-13 w-full rounded-xl bg-[#e60a54] text-sm font-bold text-white transition hover:bg-[#d5094d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "در حال ارسال..." : "دریافت کد تأیید"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs leading-6 text-neutral-400">
            با ورود یا ساخت حساب، با{" "}
            <Link
              href="/terms"
              className="text-neutral-600 underline underline-offset-2 hover:text-[#e60a54]"
            >
              قوانین و شرایط استفاده
            </Link>{" "}
            از عمه لیلا موافقت می‌کنید.
          </p>
        </div>
      </div>
    </main>
  );
}
