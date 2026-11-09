"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type VerifyResponse = {
  success?: boolean;
  isNewUser?: boolean;
  token?: string | null;
  accessToken?: string | null;
  verificationToken?: string | null;
  user?: Record<string, unknown> | null;
  message?: string;
};

function getRedirectPath(): "/cart" | "/profile" {
  return sessionStorage.getItem("login_redirect") === "/cart"
    ? "/cart"
    : "/profile";
}

export default function VerifyPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(60);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const savedPhone = sessionStorage.getItem("login_phone");

    if (!savedPhone) {
      router.replace("/login");
      return;
    }

    setPhone(savedPhone);
    inputsRef.current[0]?.focus();
  }, [router]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = window.setInterval(() => {
      setTimer((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    const digits = value.replace(/\D/g, "");
    const newCode = [...code];

    if (!digits) {
      newCode[index] = "";
      setCode(newCode);
      return;
    }

    // پشتیبانی از وارد کردن چند رقم به‌صورت هم‌زمان
    const availableDigits = digits.slice(0, 6 - index);

    availableDigits.split("").forEach((digit, offset) => {
      newCode[index + offset] = digit;
    });

    setCode(newCode);

    const nextIndex = Math.min(index + availableDigits.length, 5);
    inputsRef.current[nextIndex]?.focus();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (event.key === "ArrowRight" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const newCode = ["", "", "", "", "", ""];

    pasted.split("").forEach((digit, index) => {
      newCode[index] = digit;
    });

    setCode(newCode);

    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  };

  const verifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const verificationCode = code.join("");

    if (!phone) {
      setError("شماره موبایل پیدا نشد. دوباره وارد شوید.");
      return;
    }

    if (!/^\d{6}$/.test(verificationCode)) {
      setError("لطفاً کد ۶ رقمی را کامل وارد کنید.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          code: verificationCode,
        }),
        cache: "no-store",
      });

      const data: VerifyResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "کد واردشده صحیح نیست.");
      }

      // کاربر قبلاً حساب داشته است
      if (data.isNewUser === false) {
        const token = data.token ?? data.accessToken;

        if (!token) {
          throw new Error(
            "ورود تأیید شد، اما توکن در پاسخ سرور وجود ندارد. پاسخ کنترلر ورود را بررسی کنید.",
          );
        }

        // ذخیره توکن برای استفاده در صفحه پروفایل و درخواست‌های بعدی
        localStorage.setItem("accessToken", token);

        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        // اطلاع به Header که کاربر وارد شده است
        window.dispatchEvent(new Event("auth-changed"));

        sessionStorage.removeItem("login_phone");
        sessionStorage.removeItem("verified_phone");
        sessionStorage.removeItem("verification_token");

        const redirectTo = getRedirectPath();
        sessionStorage.removeItem("login_redirect");

        router.replace(redirectTo);
        return;
      }

      // کاربر جدید: ادامه فرایند ثبت‌نام
      sessionStorage.setItem("verified_phone", phone);

      if (data.verificationToken) {
        sessionStorage.setItem("verification_token", data.verificationToken);
      }

      router.push("/login/register");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "تأیید کد با خطا مواجه شد.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (timer > 0 || resending || !phone) return;

    setError("");
    setMessage("");

    try {
      setResending(true);

      const response = await fetch(`${API_URL}/auth/send-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "ارسال مجدد کد انجام نشد.");
      }

      setCode(["", "", "", "", "", ""]);
      setTimer(60);
      setMessage("کد جدید ساخته شد. ترمینال سرور را بررسی کنید.");

      inputsRef.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ارسال مجدد کد انجام نشد.");
    } finally {
      setResending(false);
    }
  };

  const changePhone = () => {
    sessionStorage.removeItem("login_phone");
    sessionStorage.removeItem("login_redirect");
    router.replace("/login");
  };
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <Link href="/" className="text-2xl font-black text-[#e60a54]">
              عمه لیلا
            </Link>

            <h1 className="mt-8 text-2xl font-black text-neutral-900">
              کد تأیید را وارد کنید
            </h1>

            <p className="mt-3 text-sm leading-7 text-neutral-500">
              کد تأیید برای شماره زیر ساخته شده است.
            </p>

            <div
              dir="ltr"
              className="mt-2 text-base font-bold text-neutral-900"
            >
              {phone || "در حال دریافت شماره..."}
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm leading-6 text-red-700"
            >
              {error}
            </div>
          )}

          {message && (
            <div
              role="status"
              className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm leading-6 text-green-700"
            >
              {message}
            </div>
          )}

          <form onSubmit={verifyCode} className="mt-8">
            <div dir="ltr" className="flex justify-center gap-2 sm:gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputsRef.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={6}
                  value={digit}
                  disabled={loading}
                  onChange={(event) => handleChange(event.target.value, index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  onPaste={handlePaste}
                  aria-label={`رقم ${index + 1} کد تأیید`}
                  className="h-12 w-11 rounded-xl border border-neutral-200 bg-white text-center text-xl font-bold outline-none transition focus:border-[#e60a54] focus:ring-2 focus:ring-[#e60a54]/10 disabled:opacity-60 sm:h-14 sm:w-12"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !phone}
              className="mt-7 h-13 w-full rounded-xl bg-[#e60a54] text-sm font-bold text-white transition hover:bg-[#d5094d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "در حال بررسی..." : "تأیید و ادامه"}
            </button>
          </form>

          <div className="mt-6 text-center">
            {timer > 0 ? (
              <p className="text-sm text-neutral-500">
                ارسال مجدد کد تا{" "}
                <span className="font-bold text-neutral-900">{timer}</span>{" "}
                ثانیه
              </p>
            ) : (
              <button
                type="button"
                onClick={resendCode}
                disabled={resending || !phone}
                className="text-sm font-bold text-[#e60a54] hover:underline disabled:opacity-50"
              >
                {resending ? "در حال ارسال..." : "ارسال مجدد کد"}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={changePhone}
            className="mt-5 w-full text-sm text-neutral-500 transition hover:text-[#e60a54]"
          >
            تغییر شماره موبایل
          </button>

          <p className="mt-8 text-center text-xs leading-6 text-neutral-400">
            کد تأیید را در اختیار دیگران قرار ندهید.
          </p>
        </div>
      </div>
    </main>
  );
}
