
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import SearchBox from "./SearchBox";

const navItems = [
  { title: "فروشگاه", href: "/products" },
  { title: "زنانه", href: "/categories/women" },
  { title: "مردانه", href: "/categories/men" },
  { title: "بچگانه", href: "/categories/kids" },
  { title: "وبلاگ", href: "/blog" },
];

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("accessToken")));
    };

    checkLogin();

    window.addEventListener("storage", checkLogin);
    window.addEventListener("auth-changed", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("auth-changed", checkLogin);
    };
  }, []);

  return (
    <header className="relative z-50 bg-white">
      {/* Main Header */}
      <div className="border-b border-[#F2E8E5]">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12">
          <div className="flex min-h-[76px] items-center justify-between gap-3 sm:min-h-[88px] sm:gap-6">

            {/* Logo */}
            <div className="flex h-16 flex-1 items-center sm:h-20">
              <Logo />
            </div>

            {/* Search */}
            <div className="hidden flex-1 justify-center md:flex">
              <SearchBox />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Account */}
              <Link
                href={isLoggedIn ? "/profile" : "/login"}
                className="hidden items-center gap-2 rounded-full bg-[#FFF8F3] px-4 py-2.5 text-sm font-bold text-[#292524] transition hover:bg-[#E85D83] hover:text-white sm:flex"
              >
                <UserIcon />
                <span>{isLoggedIn ? "داشبورد" : "ورود / ثبت‌نام"}</span>
              </Link>

              {/* Favorites */}
              <Link
              href="/account/wishlist"
                aria-label="علاقه‌مندی‌ها"
                className="flex h-10 w-10 items-center justify-center rounded-full text-[#292524] transition hover:bg-[#FFF0F4] hover:text-[#E85D83]"
              >
                <HeartIcon />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                aria-label="سبد خرید"
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#292524] transition hover:bg-[#FFF0F4] hover:text-[#E85D83]"
              >
                <CartIcon />

                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E85D83] px-1 text-[10px] font-bold text-white">
                  0
                </span>
              </Link>

              {/* Mobile Menu */}
              <button
                type="button"
                aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-[#292524] transition hover:bg-[#FFF0F4] hover:text-[#E85D83] md:hidden"
              >
                {menuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="pb-4 md:hidden">
            <SearchBox />
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden border-b border-[#F2E8E5] bg-[#FFF8F3] md:block">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="flex items-center justify-center gap-12">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative py-4 text-sm font-bold text-[#292524] transition hover:text-[#E85D83]"
              >
                {item.title}

                <span className="absolute bottom-0 right-0 h-[2px] w-0 rounded-full bg-[#E85D83] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`absolute left-0 right-0 top-full overflow-hidden border-b border-[#F2E8E5] bg-white shadow-xl shadow-[#292524]/5 transition-all duration-300 md:hidden ${
          menuOpen
            ? "visible max-h-[450px] opacity-100"
            : "invisible max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 py-5">
          <div className="mb-4 rounded-2xl bg-[#FFF8F3] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E85D83] text-white">
                <UserIcon />
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-[#292524]">
                  به عمه لیلا خوش آمدید
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  همراه شما در انتخاب استایل
                </p>
              </div>
            </div>

            <Link
              href={isLoggedIn ? "/profile" : "/login"}
              onClick={() => setMenuOpen(false)}
              className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#E85D83] py-3 text-sm font-bold text-white transition hover:bg-[#292524]"
            >
              {isLoggedIn ? "ورود به داشبورد" : "ورود / ثبت‌نام"}
            </Link>
          </div>

          <div className="space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium text-[#292524] transition hover:bg-[#FFF0F4] hover:text-[#E85D83]"
              >
                {item.title}

                <span className="text-[#E85D83]">
                  ←
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#F2E8E5] pt-4">
            <Link
             href="/account/wishlist"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#FFF8F3] py-3 text-xs font-bold text-[#292524]"
            >
              <HeartIcon />
              علاقه‌مندی‌ها
            </Link>

            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#FFF8F3] py-3 text-xs font-bold text-[#292524]"
            >
              <CartIcon />
              سبد خرید
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 8.8c0 5.5-8.8 10.2-8.8 10.2S3.2 14.3 3.2 8.8A4.6 4.6 0 0 1 12 6.1a4.6 4.6 0 0 1 8.8 2.7Z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" />
      <circle cx="10" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m18 6-12 12" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
