"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserRound,
  ShoppingBag,
  MapPin,
  Heart,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Mail,
  Phone,
  ArrowLeft,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

type ProfileUser = {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  phone?: string;
  email?: string;
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          router.replace("/login?redirect=%2Fprofile");
          return;
        }

        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          router.replace("/login?redirect=%2Fprofile");
          return;
        }

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.message ||
              (response.status === 404
                ? "مسیر دریافت پروفایل در سرور پیدا نشد. مسیر GET /api/auth/me را بررسی کنید."
                : "دریافت اطلاعات پروفایل ناموفق بود."),
          );
        }

        const profile: ProfileUser =
          data?.user ?? data?.data?.user ?? data?.data ?? data;

        if (
          !profile ||
          typeof profile !== "object" ||
          !(profile._id || profile.id || profile.phone || profile.email)
        ) {
          throw new Error("اطلاعات کاربر در پاسخ سرور معتبر نیست.");
        }

        setUser(profile);
        localStorage.setItem("user", JSON.stringify(profile));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "ارتباط با سرور برقرار نشد. اتصال سرور را بررسی کنید.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [router],
  );

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("login_phone");
    sessionStorage.removeItem("login_redirect");
    router.replace("/login");
  };

  const displayName =
    user?.name?.trim() || user?.fullName?.trim() || "کاربر آمه لیلا";

  const initial = displayName.charAt(0);

  const menuItems = [
    { label: "اطلاعات حساب", icon: UserRound, active: true, href: "/profile" },
    {
      label: "سفارش‌های من",
      icon: ShoppingBag,
      active: false,
      href: "/cart",
    },
    {
      label: "آدرس‌های من",
      icon: MapPin,
      active: false,
      href: "/profile/addresses",
    },
    { label: "علاقه‌مندی‌ها", icon: Heart, active: false, href: "/account/wishlist" },
  ];

  if (loading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-[70vh] items-center justify-center bg-[#faf9f6] px-4"
      >
        <div className="flex flex-col items-center gap-4 text-[#252525]">
          <LoaderCircle className="h-9 w-9 animate-spin" />
          <p className="text-sm text-gray-500">
            در حال دریافت اطلاعات حساب شما...
          </p>
        </div>
      </main>
    );
  }

  if (error && !user) {
    return (
      <main
        dir="rtl"
        className="flex min-h-[70vh] items-center justify-center bg-[#faf9f6] px-4"
      >
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-500" />
          <h1 className="mb-3 text-xl font-semibold">
            دریافت پروفایل ناموفق بود
          </h1>
          <p className="mb-6 text-sm leading-7 text-gray-500">{error}</p>
          <button
            onClick={() => void fetchProfile(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#252525] px-6 py-3 text-sm text-white transition hover:bg-black disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            تلاش مجدد
          </button>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#faf9f6] text-[#252525]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs tracking-[0.2em] text-gray-400">
              AMÉ LEILA / MY ACCOUNT
            </p>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              حساب کاربری من
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              اطلاعات حساب خود را در این بخش مشاهده کنید.
            </p>
          </div>

          <button
            onClick={() => void fetchProfile(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition hover:border-gray-400 disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            بروزرسانی
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-fit overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="bg-[#242424] px-6 py-7 text-white">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl">
                {initial}
              </div>
              <p className="text-lg font-medium">{displayName}</p>
              <p className="mt-2 text-xs text-white/60">عضو خانواده آمه لیلا</p>
            </div>

            <nav className="p-3">
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    onClick={() => router.push(item.href)}
                    className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-right text-sm transition ${
                      item.active
                        ? "bg-[#f5f1eb] font-medium text-[#252525]"
                        : "text-gray-500 hover:bg-gray-50 hover:text-[#252525]"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    <span>{item.label}</span>
                    <ArrowLeft className="mr-auto h-4 w-4 opacity-50" />
                  </button>
                );
              })}

              <div className="my-3 border-t border-gray-100" />

              <button
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm text-red-600 transition hover:bg-red-50"
              >
                <LogOut className="h-[18px] w-[18px]" />
                خروج از حساب
              </button>
            </nav>
          </aside>

          <section className="min-w-0 space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-8">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">اطلاعات شخصی</h2>
                  <p className="mt-2 text-sm text-gray-500">
                    اطلاعات زیر مستقیماً از سرور دریافت شده‌اند.
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f5f1eb]">
                  <UserRound className="h-5 w-5" />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-[#fdfcfb] p-5">
                  <div className="mb-4 flex items-center gap-2 text-gray-400">
                    <UserRound className="h-4 w-4" />
                    <span className="text-xs">نام و نام خانوادگی</span>
                  </div>
                  <p className="break-words text-sm font-medium">
                    {user?.name || user?.fullName || "ثبت نشده"}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-[#fdfcfb] p-5">
                  <div className="mb-4 flex items-center gap-2 text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span className="text-xs">شماره موبایل</span>
                  </div>
                  <p dir="ltr" className="text-right text-sm font-medium">
                    {user?.phone || "ثبت نشده"}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-[#fdfcfb] p-5 sm:col-span-2">
                  <div className="mb-4 flex items-center gap-2 text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span className="text-xs">آدرس ایمیل</span>
                  </div>
                  <p className="break-all text-sm font-medium">
                    {user?.email || "ایمیلی ثبت نشده است"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#f5f8f4] p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    حساب شما با شماره موبایل تأیید شده است
                  </p>
                  <p className="mt-1 text-xs leading-6 text-green-800/70">
                    دریافت اطلاعات حساب با توکن ورود ذخیره‌شده انجام می‌شود.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
              <h2 className="text-lg font-semibold">دسترسی سریع</h2>
              <p className="mt-2 text-sm text-gray-500">
                برای مدیریت بخش‌های دیگر حساب خود از لینک‌های زیر استفاده کنید.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <button
                  onClick={() => router.push("/profile/orders")}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-right transition hover:border-gray-400"
                >
                  <ShoppingBag className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">سفارش‌ها</span>
                </button>

                <button
                  onClick={() => router.push("/profile/addresses")}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-right transition hover:border-gray-400"
                >
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">آدرس‌ها</span>
                </button>

                <button
                  onClick={() => router.push("/favorites")}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-right transition hover:border-gray-400"
                >
                  <Heart className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">علاقه‌مندی‌ها</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
