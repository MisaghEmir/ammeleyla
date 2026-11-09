
"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Sparkles, ArrowLeft, Loader2, PackageSearch } from "lucide-react";
import { productsApi, Product } from "@/lib/api";

export default function SearchBox() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // جستجوی لحظه‌ای با debounce
  useEffect(() => {
    const value = query.trim();

    if (value.length < 2) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let active = true;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await productsApi.getAll({
          search: value,
          page: 1,
          limit: 6,
        });

        if (active) {
          setProducts(response.products || []);
        }
      } catch (error) {
        if (active) {
          console.error("Search error:", error);
          setProducts([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  // بستن پیشنهادها با کلیک بیرون
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function goToSearch() {
    const value = query.trim();

    if (!value) return;

    setShowResults(false);
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    goToSearch();
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
  }

  const hasQuery = query.trim().length >= 2;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      {/* Search Input */}
      <form
        onSubmit={handleSubmit}
        role="search"
        className="group relative z-10"
      >
        <div
          className={`relative flex h-12 items-center overflow-hidden rounded-full border bg-[#FFFAFC] transition-all duration-300 ${
            showResults
              ? "border-[#E60A54] bg-white shadow-[0_0_0_4px_rgba(230,10,84,0.07)]"
              : "border-[#F0E3E8] hover:border-[#E8B6C7] hover:bg-white"
          }`}
        >
          <button
            type="submit"
            aria-label="جستجو"
            className="absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#E60A54] text-white shadow-md shadow-[#E60A54]/20 transition hover:scale-105 hover:bg-[#C90849] active:scale-95"
          >
            <Search size={17} strokeWidth={2.2} />
          </button>

          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            placeholder="دنبال چی می‌گردی؟"
            aria-label="جستجوی محصول"
            autoComplete="off"
            className="h-full w-full bg-transparent pr-14 pl-11 text-sm font-medium text-[#30232A] outline-none placeholder:text-[#B7A7AE]"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setProducts([]);
                setShowResults(false);
              }}
              aria-label="پاک کردن جستجو"
              className="absolute left-3 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-[#FCE7EF] hover:text-[#E60A54]"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {/* Search Suggestions */}
      {showResults && hasQuery && (
        <div className="absolute right-0 top-full z-50 mt-3 w-full overflow-hidden rounded-[22px] border border-[#F2E5EA] bg-white shadow-[0_20px_60px_rgba(50,20,35,0.14)] animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#F7EEF1] bg-gradient-to-l from-[#FFF5F8] to-white px-4 py-3.5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FCE7EF] text-[#E60A54]">
                <Sparkles size={16} />
              </div>

              <div>
                <p className="text-xs font-black text-[#30232A]">
                  پیشنهادهای Amé Leila
                </p>
                <p className="mt-0.5 text-[10px] text-gray-400">
                  محصولات مرتبط با جستجوی شما
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowResults(false)}
              className="rounded-full p-1.5 text-gray-400 transition hover:bg-[#FCE7EF] hover:text-[#E60A54]"
              aria-label="بستن پیشنهادها"
            >
              <X size={16} />
            </button>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 px-4 py-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0F5]">
                <Loader2 size={23} className="animate-spin text-[#E60A54]" />
              </div>

              <p className="text-sm font-medium text-gray-500">
                در حال جستجوی محصولات...
              </p>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs font-semibold text-gray-500">
                  محصولات پیشنهادی
                </span>

                <span className="rounded-full bg-[#FFF0F5] px-2.5 py-1 text-[10px] font-bold text-[#E60A54]">
                  {products.length} محصول
                </span>
              </div>

              <div className="max-h-[390px] overflow-y-auto px-2 pb-2">
                {products.map((product) => {
                  const hasDiscount =
                    product.oldPrice &&
                    product.oldPrice > product.price;

                  const discount = hasDiscount
                    ? Math.round(
                        ((product.oldPrice! - product.price) /
                          product.oldPrice!) *
                          100
                      )
                    : 0;

                  return (
                    <Link
                      key={product._id}
                      href={`/products/${product.slug}`}
                      onClick={() => setShowResults(false)}
                      className="group flex items-center gap-3 rounded-2xl border border-transparent p-3 transition duration-200 hover:border-[#F7E3EA] hover:bg-[#FFFAFC]"
                    >
                      {/* Product Image */}
                      <div className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl bg-[#F8F3F5]">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-300">
                            <PackageSearch size={25} />
                          </div>
                        )}

                        {discount > 0 && (
                          <span className="absolute right-1 top-1 rounded-md bg-[#E60A54] px-1.5 py-0.5 text-[9px] font-black text-white">
                            {new Intl.NumberFormat("fa-IR").format(discount)}٪
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#30232A] transition group-hover:text-[#E60A54]">
                          {product.name}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="text-sm font-black text-[#E60A54]">
                            {formatPrice(product.price)}
                          </span>

                          {hasDiscount && (
                            <span className="text-[11px] text-gray-400 line-through">
                              {formatPrice(product.oldPrice!)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF0F5] text-[#E60A54] opacity-0 transition group-hover:translate-x-[-3px] group-hover:opacity-100">
                        <ArrowLeft size={15} />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* View All */}
              <div className="border-t border-[#F5E9EE] bg-[#FFFAFC] p-3">
                <button
                  type="button"
                  onClick={goToSearch}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E60A54] py-3 text-xs font-bold text-white shadow-md shadow-[#E60A54]/15 transition hover:bg-[#C90849] active:scale-[0.99]"
                >
                  مشاهده همه نتایج جستجو
                  <ArrowLeft size={15} />
                </button>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#FFF0F5] text-[#E60A54]">
                <PackageSearch size={30} strokeWidth={1.5} />
              </div>

              <p className="text-sm font-bold text-[#30232A]">
                محصولی پیدا نکردیم!
              </p>

              <p className="mt-2 max-w-[230px] text-xs leading-6 text-gray-400">
                متأسفانه محصولی با عبارت «{query.trim()}» پیدا نشد.
                عبارت دیگری را امتحان کنید.
              </p>

              <button
                type="button"
                onClick={goToSearch}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#F2D8E2] px-4 py-2.5 text-xs font-bold text-[#E60A54] transition hover:bg-[#FFF0F5]"
              >
                جستجوی کامل
                <ArrowLeft size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hint */}
      {showResults && query.trim().length === 1 && (
        <div className="absolute right-0 top-full z-50 mt-3 w-full rounded-2xl border border-[#F2E5EA] bg-white px-4 py-4 text-center text-xs text-gray-400 shadow-xl">
          برای جستجو حداقل دو حرف وارد کنید.
        </div>
      )}
    </div>
  );
}
