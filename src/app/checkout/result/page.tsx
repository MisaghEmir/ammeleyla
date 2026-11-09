"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

function PaymentResultContent() {
  const searchParams = useSearchParams();

  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");

  const isSuccess = status === "success";
  const isFailed = status === "failed";
  const isError = status === "error";

  const config = isSuccess
    ? {
        title: "پرداخت با موفقیت انجام شد",
        description: "سفارش شما ثبت شد و به‌زودی پردازش خواهد شد.",
        icon: CheckCircle2,
        color: "text-green-500",
        bg: "bg-green-500/10",
      }
    : isFailed
      ? {
          title: "پرداخت ناموفق بود",
          description: "پرداخت تکمیل نشد. می‌توانید دوباره برای پرداخت اقدام کنید.",
          icon: XCircle,
          color: "text-red-500",
          bg: "bg-red-500/10",
        }
      : {
          title: "خطا در بررسی پرداخت",
          description:
            "در بررسی وضعیت پرداخت مشکلی پیش آمده است. لطفاً وضعیت سفارش خود را پیگیری کنید.",
          icon: AlertCircle,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
        };

  const Icon = config.icon;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm border border-gray-100">
        <div
          className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${config.bg}`}
        >
          <Icon className={`h-10 w-10 ${config.color}`} />
        </div>

        <h1 className="mb-3 text-xl font-bold text-gray-900">
          {config.title}
        </h1>

        <p className="mb-6 text-sm leading-7 text-gray-500">
          {config.description}
        </p>

        {orderId && (
          <div className="mb-6 rounded-xl bg-gray-50 p-4">
            <p className="mb-2 text-xs text-gray-500">شماره سفارش</p>
            <p className="break-all text-sm font-semibold text-gray-800">
              {orderId}
            </p>
          </div>
        )}

        {isSuccess ? (
          <Link
            href="/profile/orders"
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E60A54] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c90849]"
          >
            مشاهده سفارش‌ها
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link
            href="/checkout"
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E60A54] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c90849]"
          >
            تلاش مجدد برای پرداخت
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}

        <Link
          href="/"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <ShoppingBag className="h-4 w-4" />
          بازگشت به فروشگاه
        </Link>
      </div>
    </main>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          در حال بررسی...
        </div>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}