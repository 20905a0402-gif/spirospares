import Link from "next/link";

type WhatsAppButtonProps = {
  productName: string;
  label?: string;
  className?: string;
};

export default function WhatsAppButton({
  productName,
  label = "WhatsApp Order",
  className = ""
}: WhatsAppButtonProps) {
  const href = `https://wa.me/254733959383?text=I%20am%20interested%20in%20${encodeURIComponent(productName)}.`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`rounded-full bg-[#00BFFF] px-4 py-2 text-sm font-bold text-white transition-all duration-300 ease-out hover:brightness-110 hover:shadow-[0_0_15px_rgba(0, 191, 255,0.4)] ${className}`}
    >
      {label}
    </Link>
  );
}
