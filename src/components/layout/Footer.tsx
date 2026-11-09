import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  { title: "صفحه اصلی", href: "/" },
  { title: "فروشگاه", href: "/products" },
  { title: "دسته‌بندی‌ها", href: "/categories/women" },
  { title: "وبلاگ", href: "/blog" },
];

const customerLinks = [
  { title: "حساب کاربری", href: "/account" },
  { title: "سفارش‌های من", href: "/account/orders" },
  { title: "علاقه‌مندی‌ها", href: "/account/wishlist" },
  { title: "سبد خرید", href: "/cart" },
];

const supportLinks = [
  { title: "تماس با ما", href: "/contact" },
  { title: "درباره ما", href: "/about" },
  { title: "روش‌های ارسال", href: "/shipping" },
  { title: "شرایط بازگشت کالا", href: "/returns" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-neutral-100 bg-neutral-950 text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" aria-label="عمه لیلا" className="inline-flex">
              <Image
                src="/images/logo.png"
                alt="عمه لیلا"
                width={180}
                height={60}
                className="h-[55px] w-auto object-contain"
              />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-neutral-400">
              عمه لیلا؛ فروشگاه اینترنتی لباس و پوشاک با تمرکز بر ارائه محصولات
              باکیفیت و تجربه خرید آسان و مطمئن.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              <SocialLink href="#" label="Instagram">
                <InstagramIcon />
              </SocialLink>

              <SocialLink href="#" label="Telegram">
                <TelegramIcon />
              </SocialLink>

              <SocialLink href="#" label="WhatsApp">
                <WhatsAppIcon />
              </SocialLink>
            </div>
          </div>

          {/* Quick Links */}
          <FooterColumn title="دسترسی سریع" links={quickLinks} />

          {/* Customer */}
          <FooterColumn title="خدمات مشتریان" links={customerLinks} />

          {/* Support */}
          <FooterColumn title="راهنمای مشتری" links={supportLinks} />
        </div>

        {/* Newsletter */}
        <div className="mt-14 rounded-3xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold">
                از جدیدترین محصولات باخبر شوید
              </h2>

              <p className="mt-2 text-sm text-neutral-400">
                ایمیل خود را وارد کنید تا اخبار و پیشنهادهای جدید عمه لیلا را
                دریافت کنید.
              </p>
            </div>

            <form className="flex w-full max-w-md gap-2">
              <input
                type="email"
                placeholder="ایمیل شما"
                aria-label="ایمیل شما"
                className="min-w-0 flex-1 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-pink-500"
              />

              <button
                type="submit"
                className="shrink-0 rounded-xl bg-pink-600 px-5 py-3 text-sm font-medium transition hover:bg-pink-700"
              >
                عضویت
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-neutral-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-center text-xs text-neutral-500 sm:px-6 md:flex-row md:items-center md:justify-between md:text-right lg:px-8">
          <p>© {new Date().getFullYear()} عمه لیلا. تمامی حقوق محفوظ است.</p>

          <div className="flex justify-center gap-5 md:justify-start">
            <Link href="/privacy" className="transition hover:text-white">
              حریم خصوصی
            </Link>

            <Link href="/terms" className="transition hover:text-white">
              قوانین و مقررات
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterColumnProps {
  title: string;
  links: {
    title: string;
    href: string;
  }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="text-sm font-bold text-white">{title}</h3>

      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-neutral-400 transition hover:text-pink-500"
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface SocialLinkProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

function SocialLink({ href, label, children }: SocialLinkProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-neutral-400 transition hover:bg-pink-600 hover:text-white"
    >
      {children}
    </Link>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21 3-8.5 18-3.5-7-7-3.5L21 3Z" />
      <path d="m9 14 4-4" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" />
      <path d="M9 9c.3 1.4 1.6 2.8 3 3.2" />
    </svg>
  );
}
