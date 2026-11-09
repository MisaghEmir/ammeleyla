import { cartApi } from "@/lib/api";

export async function completePendingCartAdd(): Promise<boolean> {
  const saved = sessionStorage.getItem("pendingCartItem");

  if (!saved) return false;

  const item = JSON.parse(saved) as {
    productId: string;
    variantId?: string;
    quantity: number;
    variant?: {
      _id?: string;
      color?: string;
      size?: string;
      sku?: string;
    };
  };

  if (
    !item.productId ||
    !Number.isInteger(item.quantity) ||
    item.quantity < 1
  ) {
    sessionStorage.removeItem("pendingCartItem");
    throw new Error("اطلاعات خرید ذخیره‌شده معتبر نیست.");
  }

  const variantId = item.variantId || item.variant?._id;

  if (!variantId) {
    throw new Error("شناسه تنوع محصول مشخص نیست. لطفاً محصول را دوباره انتخاب کنید.");
  }

  await cartApi.add({
    productId: item.productId,
    variantId,
    quantity: item.quantity,
  });

  sessionStorage.removeItem("pendingCartItem");

  return true;
}