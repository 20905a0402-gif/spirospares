"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, Package, MapPin, Clock, ArrowRight, Home, ShoppingBag } from "lucide-react";
import { useShopStore } from "@/lib/store";
import { formatKES } from "@/lib/data";

interface OrderInfo {
  orderId: string;
  verificationCode: string;
  total: number;
  totalQuantity: number;
  timestamp: number;
}

export default function OrderSuccessPage() {
  const router = useRouter();
  const clearCart = useShopStore((state) => state.clearCart);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [showContent, setShowContent] = useState(false);
  const [confetti, setConfetti] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Check for order info in session storage
    const storedOrder = sessionStorage.getItem("spiro_order_completed");
    
    if (storedOrder) {
      try {
        const parsedOrder: OrderInfo = JSON.parse(storedOrder);
        // Check if order is recent (within last 30 minutes)
        const isRecent = Date.now() - parsedOrder.timestamp < 30 * 60 * 1000;
        
        if (isRecent) {
          setOrderInfo(parsedOrder);
          // Clear the cart
          clearCart();
          // Clear the session storage
          sessionStorage.removeItem("spiro_order_completed");
        }
      } catch {
        // Invalid stored data
      }
    }

    // Generate confetti
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
    }));
    setConfetti(newConfetti);

    // Show content with animation delay
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [clearCart]);

  // If no order info, show generic success message
  const displayOrderId = orderInfo?.orderId ?? "Unknown";
  const displayVerification = orderInfo?.verificationCode ?? "Unknown";
  const displayTotal = orderInfo?.total ?? 0;
  const displayQuantity = orderInfo?.totalQuantity ?? 0;

  return (
    <section className="container-shell py-10 min-h-[80vh] flex items-center justify-center">
      {/* Confetti Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
        {confetti.map((c) => (
          <div
            key={c.id}
            className="absolute top-0 w-3 h-3 rounded-sm animate-confetti-fall"
            style={{
              left: `${c.left}%`,
              backgroundColor: ['#00BFFF', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'][c.id % 5],
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
              animationTimingFunction: 'linear',
              animationFillMode: 'forwards',
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-2xl">
        {/* Success Card */}
        <div 
          className={`panel p-8 md:p-12 text-center transition-all duration-700 ${
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Success Icon with Pulse Animation */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-full bg-[#00BFFF]/20 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-[#00BFFF]/30 animate-pulse" />
            <div className="relative rounded-full bg-[#00BFFF] p-4">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 animate-fade-in">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-400 mb-8">
            Thank you for your order. We have sent the details to our team via WhatsApp.
          </p>

          {/* Order Details Card */}
          <div className="rounded-xl border border-[#00BFFF]/30 bg-[#00BFFF]/5 p-6 mb-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="text-left">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Order ID</p>
                <p className="text-lg font-bold text-white">{displayOrderId}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Verification Code</p>
                <p className="text-lg font-bold text-[#00BFFF]">{displayVerification}</p>
              </div>
              <div className="text-left">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Total Items</p>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <p className="text-lg font-bold text-white">{displayQuantity} items</p>
                </div>
              </div>
              <div className="text-left md:text-right">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Total Amount</p>
                <p className="text-lg font-bold text-[#00BFFF]">{formatKES(displayTotal)}</p>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="text-left mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">What happens next?</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg border border-white/10 bg-white/5">
                <div className="rounded-full bg-[#00BFFF]/20 p-2">
                  <Clock className="h-4 w-4 text-[#00BFFF]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Order Confirmation</p>
                  <p className="text-xs text-gray-400">Our team will review your order and confirm within 2 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border border-white/10 bg-white/5">
                <div className="rounded-full bg-[#00BFFF]/20 p-2">
                  <MapPin className="h-4 w-4 text-[#00BFFF]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Pickup Ready</p>
                  <p className="text-xs text-gray-400">You will receive a WhatsApp notification when your order is ready for pickup</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border border-white/10 bg-white/5">
                <div className="rounded-full bg-[#00BFFF]/20 p-2">
                  <Package className="h-4 w-4 text-[#00BFFF]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Collect Your Order</p>
                  <p className="text-xs text-gray-400">Visit your selected pickup location with your order ID and verification code</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:border-[#00BFFF]/60 hover:text-[#00BFFF]"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <Link
              href="/bikes"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00BFFF] px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_15px_rgba(0, 191, 255,0.4)]"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Support Info */}
          <p className="mt-6 text-xs text-gray-500">
            Need help? Contact us at{" "}
            <a href="mailto:support@spirospares.com" className="text-[#00BFFF] hover:underline">
              support@spirospares.com
            </a>{" "}
            or{" "}
            <a href="https://wa.me/254733959383" className="text-[#00BFFF] hover:underline">
              WhatsApp
            </a>
          </p>
        </div>
      </div>

    </section>
  );
}
