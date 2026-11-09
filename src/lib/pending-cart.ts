
import { cartApi } from "@/lib/api";

export async function completePendingCartAdd(): Promise<boolean> {
  const saved = sessionStorage.getItem("pendingCartItem");

  if (!saved) return false;

  const item = JSON.parse(saved) as {
    productId: string;
    quantity: number;
    variant?: {
      color?: string;
      size?: string;
      sku?: string;
    };
  };

  if (!item.productId || !Number.isInteger(item.quantity) || item.quantity < 1) {
    sessionStorage.removeItem("pendingCartItem");
    throw new Error("اطلاعات خرید ذخیره‌شده معتبر نیست.");
  }

  await cartApi.add({
    productId: item.productId,
    quantity: item.quantity,
    ...(item.variant ? { variant: item.variant } : {}),
  });

  sessionStorage.removeItem("pendingCartItem");

  return true;
}
