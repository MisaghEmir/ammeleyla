import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "شرایط بازگشت و تعویض کالا",
  description:
    "شرایط بازگشت، تعویض و بررسی کالا در فروشگاه اینترنتی عمه لیلا؛ قوانین مربوط به کالای معیوب، اشتباه در ارسال و انصراف از خرید.",
  alternates: {
    canonical: "/returns",
  },
  openGraph: {
    title: "شرایط بازگشت و تعویض کالا | عمه لیلا",
    description:
      "قوانین و شرایط بازگشت و تعویض کالا در فروشگاه عمه لیلا.",
    url: "/returns",
    type: "website",
  },
};

const conditions = [
  {
    title: "کالای معیوب",
    text: "اگر کالا دارای ایراد یا نقصی باشد که هنگام دریافت قابل مشاهده یا بررسی باشد، موضوع را در اولین فرصت به پشتیبانی اطلاع دهید.",
  },
  {
    title: "ارسال کالای اشتباه",
    text: "اگر محصول، رنگ، سایز یا مدل اشتباهی برای شما ارسال شده باشد، قبل از استفاده با پشتیبانی عمه لیلا تماس بگیرید.",
  },
  {
    title: "عدم تطابق با سفارش",
    text: "در صورتی که کالای دریافت‌شده با اطلاعات ثبت‌شده در سفارش مطابقت نداشته باشد، درخواست شما بررسی و نتیجه اعلام خواهد شد.",
  },
  {
    title: "انصراف از خرید",
    text: "درخواست انصراف از خرید، در صورت امکان، باید مطابق شرایط اعلام‌شده توسط فروشگاه و قبل از استفاده از کالا ثبت شود.",
  },
];

const notAccepted = [
  "کالایی که استفاده، شست‌وشو یا تعمیر شده باشد.",
  "کالایی که بر اثر استفاده مشتری دچار آسیب شده باشد.",
  "کالایی که بدون بسته‌بندی و متعلقات لازم بازگردانده شود.",
  "کالایی که آثار قابل توجه استفاده، لک، بو یا آسیب داشته باشد.",
  "درخواست‌هایی که خارج از مهلت اعلام‌شده توسط فروشگاه ثبت شوند.",
];

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium text-[#e60a54]">
              خدمات پس از خرید
            </p>

            <h1 className="text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl">
              شرایط بازگشت و تعویض کالا
            </h1>

            <p className="mt-5 text-base leading-8 text-neutral-600">
              رضایت شما برای عمه لیلا اهمیت زیادی دارد. اگر کالای دریافت‌شده
              دارای ایراد، مغایرت یا مشکل مرتبط با سفارش باشد، می‌توانید
              درخواست خود را برای بررسی به پشتیبانی اعلام کنید.
            </p>
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-neutral-900">
          موارد قابل بررسی برای بازگشت
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {conditions.map((condition) => (
            <article
              key={condition.title}
              className="rounded-2xl border border-neutral-200 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-50 text-[#e60a54]">
                  ✓
                </div>

                <div>
                  <h3 className="text-lg font-bold text-neutral-900">
                    {condition.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-neutral-600">
                    {condition.text}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Return process */}
      <section className="bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900">
            مراحل ثبت درخواست بازگشت
          </h2>

          <div className="mt-8 space-y-4">
            {[
              "با پشتیبانی عمه لیلا تماس بگیرید و شماره سفارش را اعلام کنید.",
              "دلیل بازگشت و در صورت نیاز تصاویر کالا را برای بررسی ارسال کنید.",
              "درخواست توسط تیم پشتیبانی بررسی می‌شود.",
              "در صورت تأیید، نحوه ارسال کالا به شما اعلام خواهد شد.",
              "پس از دریافت و بررسی کالا، نتیجه نهایی و نحوه تعویض یا استرداد وجه اعلام می‌شود.",
            ].map((item, index) => (
              <div
                key={item}
                className="flex gap-4 rounded-2xl bg-white p-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e60a54] text-sm font-bold text-white">
                  {index + 1}
                </span>

                <p className="text-sm leading-7 text-neutral-700">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Not accepted */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-bold text-neutral-900">
            مواردی که معمولاً قابل بازگشت نیستند
          </h2>

          <ul className="mt-5 space-y-3 text-sm leading-7 text-neutral-700">
            {notAccepted.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Important */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-lg font-bold text-neutral-900">
            نکته مهم
          </h2>

          <p className="mt-3 text-sm leading-8 text-neutral-600">
            شرایط نهایی بازگشت، مهلت ثبت درخواست، هزینه ارسال کالای مرجوعی و
            نحوه استرداد وجه باید مطابق سیاست رسمی فروشگاه و قوانین قابل
            اجرا در زمان خرید باشد. بنابراین پیش از انتشار نهایی این صفحه،
            این موارد را با شرایط واقعی فروشگاه عمه لیلا تکمیل می‌کنیم.
          </p>
        </div>
      </section>
    </main>
  );
}