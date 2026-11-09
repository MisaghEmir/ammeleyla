import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" aria-label="عمه لیلا" className="shrink-0 flex items-center">
      <Image
        src="/images/logo.png"
        alt="عمه لیلا"
        width={220}
        height={80}
        priority
        className="block h-auto w-[260px] object-contain mr-[-35px] lg:mr-[-55px]"
      />
    </Link>
  );
}
