import type { Metadata } from "next";
import ProductsClient from "@/components/products/ProductsClient";

export const metadata: Metadata = {
title: "فروشگاه | خرید آنلاین لباس",
description:
"خرید آنلاین انواع لباس زنانه، مردانه، بچگانه، کیف، کفش، شال و اکسسوری از فروشگاه عمه لیلا.",
alternates: {
canonical: "/products",
},
openGraph: {
title: "فروشگاه عمه لیلا | خرید آنلاین لباس",
description:
"جدیدترین محصولات و لباس‌های عمه لیلا را آنلاین مشاهده و خریداری کنید.",
url: "/products",
type: "website",
},
};

export default function ProductsPage() {
return <ProductsClient />;
}
