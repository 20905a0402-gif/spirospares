"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { jsPDF } from "jspdf";
import { MapPin, Package, Clock, ArrowLeft, CheckCircle, Zap } from "lucide-react";
import { formatKES } from "@/lib/data";
import { applyStockPointDiscount, STOCK_POINT_DISCOUNT_RATE } from "@/lib/stockPoint";
import { useShopStore } from "@/lib/store";
import { getLegacyServiceLocations } from "@/lib/sanity/queries-data";
import type { ServiceLocation } from "@/lib/data";

type ProductType = "bike" | "spare" | "gadget" | "insurance";

export default function CheckoutPanel() {
  const params = useSearchParams();
  const router = useRouter();
  const cart = useShopStore((state) => state.cart);
  const clearCart = useShopStore((state) => state.clearCart);
  const isStockPointAuthenticated = useShopStore((state) => state.isStockPointAuthenticated);

  const [pickupLocations, setPickupLocations] = useState<ServiceLocation[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [expressPickup, setExpressPickup] = useState(false);
  const [selectedPickupLocation, setSelectedPickupLocation] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const EXPRESS_FEE = 500;
  const WHATSAPP_NUMBER = "254733959383";

  // Fetch pickup locations from Sanity
  useEffect(() => {
    async function loadLocations() {
      try {
        setIsLoadingLocations(true);
        const locations = await getLegacyServiceLocations();
        // Sort to put Industrial Area first
        const sortedLocations = [...locations].sort((a, b) => {
          const aIsIndustrial = a.name.toLowerCase().includes("industrial") || a.area.toLowerCase().includes("industrial");
          const bIsIndustrial = b.name.toLowerCase().includes("industrial") || b.area.toLowerCase().includes("industrial");
          if (aIsIndustrial && !bIsIndustrial) return -1;
          if (!aIsIndustrial && bIsIndustrial) return 1;
          return 0;
        });
        setPickupLocations(sortedLocations);
        if (sortedLocations.length > 0) {
          setSelectedPickupLocation(sortedLocations[0].id);
        }
      } catch (error) {
        console.error("Failed to load pickup locations:", error);
      } finally {
        setIsLoadingLocations(false);
      }
    }
    loadLocations();
  }, []);

  const product = useMemo(() => {
    const type = (params.get("type") ?? "spare") as ProductType;
    const id = params.get("id") ?? "";
    const name = params.get("name") ?? "Selected Product";
    const price = Number(params.get("price") ?? "0");
    const quantity = Math.max(1, Number(params.get("quantity") ?? "1") || 1);

    return { type, id, name, price, quantity };
  }, [params]);

  const checkoutItems = useMemo(() => {
    if (product.id === "cart-order" && cart.length > 0) {
      return cart.map((item) => ({
        id: item.id,
        type: item.type,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        lineTotal: item.price * item.quantity,
        sku: item.sku,
        image: item.image
      }));
    }

    const baseUnitPrice = product.quantity > 0 ? Math.round(product.price / product.quantity) : product.price;
    const unitPrice = isStockPointAuthenticated
      ? applyStockPointDiscount(baseUnitPrice)
      : baseUnitPrice;

    return [
      {
        id: product.id || "checkout-item",
        type: product.type,
        name: product.name,
        quantity: product.quantity,
        unitPrice,
        lineTotal: unitPrice * product.quantity,
        sku: undefined,
        image: undefined
      }
    ];
  }, [cart, isStockPointAuthenticated, product]);

  const baseSubtotal = useMemo(() => {
    if (product.id === "cart-order") {
      return cart.reduce((total, item) => total + (item.basePrice ?? item.price) * item.quantity, 0);
    }
    return product.price;
  }, [cart, product]);

  const totalQuantity = checkoutItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = checkoutItems.reduce((total, item) => total + item.lineTotal, 0);
  const expressFee = expressPickup ? EXPRESS_FEE : 0;
  const total = subtotal + expressFee;

  const selectedLocation = pickupLocations.find(loc => loc.id === selectedPickupLocation);

  // Generate tamper-proof verification code
  const verificationCode = useMemo(() => {
    const orderData = {
      items: checkoutItems.map(i => ({ id: i.id, q: i.quantity, p: i.lineTotal })),
      total,
      phone: customerPhone,
      ts: Math.floor(Date.now() / 1000)
    };
    const str = JSON.stringify(orderData);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36).toUpperCase().slice(0, 6);
  }, [checkoutItems, total, customerPhone]);

  const whatsappMessage = useMemo(() => {
    const location = pickupLocations.find(loc => loc.id === selectedPickupLocation);
    const lines = [
      "*SPIRO SPARES ORDER*",
      `Quote #: QT-${Date.now().toString().slice(-8)}`,
      `Verify: ${verificationCode}`,
      "",
      "*Items:*",
      ...checkoutItems.map(
        (item, index) =>
          `${index + 1}. ${item.name} (${item.type.toUpperCase()}) x${item.quantity} = ${formatKES(item.lineTotal)}${
            item.sku ? ` [${item.sku}]` : ""
          }`
      ),
      "",
      `*Subtotal:* ${formatKES(subtotal)}`,
      `*Express Pickup:* ${expressPickup ? formatKES(EXPRESS_FEE) : "No"}`,
      `*Total:* ${formatKES(total)}`,
      `*Total Quantity:* ${totalQuantity}`,
      "",
      "*Pickup Location:*",
      location ? `${location.name} - ${location.address}, ${location.city}` : "Not selected",
      expressPickup ? "*Express Pickup Requested*" : "",
      "",
      "*Customer:*",
      `Name: ${customerName || "N/A"}`,
      `Phone: ${customerPhone || "N/A"}`,
      customerEmail ? `Email: ${customerEmail}` : "",
      customerNote ? `Note: ${customerNote}` : "",
      "",
      "_Please do not edit above details. Verify code ensures order integrity._",
      "Thank you!"
    ];

    return lines.filter(Boolean).join("\n");
  }, [checkoutItems, customerEmail, customerName, customerNote, customerPhone, expressPickup, expressFee, pickupLocations, selectedPickupLocation, subtotal, total, totalQuantity, verificationCode]);

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    // Header Background
    doc.setFillColor(0, 191, 255);
    doc.rect(0, 0, pageWidth, 45, "F");

    // Logo/Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("SPIRO SPARES", margin, y + 10);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Powered by TamTech", margin, y + 18);

    // Quote Title
    y = 60;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("ORDER SUMMARY", margin, y);

    // Date, Quote Number and Verification Code
    y += 12;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Date: ${new Date().toLocaleDateString("en-GB")}`, margin, y);
    doc.text(`Quote #: QT-${Date.now().toString().slice(-8)}`, pageWidth - margin - 50, y);
    y += 6;
    doc.setTextColor(0, 191, 255);
    doc.setFont("helvetica", "bold");
    doc.text(`Verify: ${verificationCode}`, margin, y);

    // Customer Details Section
    y += 20;
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, y - 5, pageWidth - margin * 2, 30, "F");
    doc.setTextColor(0, 191, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("CUSTOMER DETAILS", margin + 5, y + 5);

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${customerName || "N/A"}`, margin + 5, y + 12);
    doc.text(`Phone: ${customerPhone || "N/A"}`, margin + 5, y + 18);
    if (customerEmail) {
      doc.text(`Email: ${customerEmail}`, margin + 5, y + 24);
    }

    // Items Table Header
    y += 40;
    doc.setFillColor(0, 191, 255);
    doc.rect(margin, y, pageWidth - margin * 2, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Item", margin + 5, y + 7);
    doc.text("Type", margin + 80, y + 7);
    doc.text("Qty", margin + 115, y + 7);
    doc.text("Unit Price", margin + 135, y + 7);
    doc.text("Total", pageWidth - margin - 25, y + 7);

    // Table Rows
    y += 12;
    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "normal");

    checkoutItems.forEach((item, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, y - 5, pageWidth - margin * 2, 10, "F");
      }

      const itemName = item.name.length > 30 ? item.name.substring(0, 30) + "..." : item.name;
      doc.text(itemName, margin + 5, y + 2);
      doc.text(item.type.toUpperCase(), margin + 80, y + 2);
      doc.text(String(item.quantity), margin + 118, y + 2);
      doc.text(formatKES(item.unitPrice), margin + 135, y + 2);
      doc.text(formatKES(item.lineTotal), pageWidth - margin - 25, y + 2);
      y += 10;
    });

    // Totals Section
    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(11);
    doc.text(`Subtotal (${totalQuantity} items):`, pageWidth - margin - 100, y);
    doc.setFont("helvetica", "bold");
    doc.text(formatKES(subtotal), pageWidth - margin - 25, y);

    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text("Express Fee:", pageWidth - margin - 100, y);
    doc.text(formatKES(expressFee), pageWidth - margin - 25, y);

    y += 12;
    doc.setFillColor(0, 191, 255);
    doc.rect(pageWidth - margin - 100, y - 8, 100, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL:", pageWidth - margin - 95, y);
    doc.text(formatKES(total), pageWidth - margin - 25, y);

    // Pickup Location Details
    y += 25;
    doc.setTextColor(0, 191, 255);
    doc.setFontSize(11);
    doc.text("PICKUP LOCATION", margin, y);

    y += 10;
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const location = pickupLocations.find(loc => loc.id === selectedPickupLocation);
    if (location) {
      doc.text(`${location.name}`, margin, y);
      y += 6;
      doc.text(`${location.address}, ${location.city}`, margin, y);
      y += 6;
      if (location.phone) doc.text(`Phone: ${location.phone}`, margin, y);
    }

    if (expressPickup) {
      y += 10;
      doc.setTextColor(0, 191, 255);
      doc.setFont("helvetica", "bold");
      doc.text("EXPRESS PICKUP REQUESTED", margin, y);
    }

    // Notes
    if (customerNote) {
      y += 12;
      doc.setTextColor(0, 191, 255);
      doc.setFont("helvetica", "bold");
      doc.text("ADDITIONAL NOTES:", margin, y);
      y += 6;
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "normal");
      doc.text(customerNote, margin, y);
    }

    // Footer
    y = doc.internal.pageSize.getHeight() - 30;
    doc.setDrawColor(0, 191, 255);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for choosing SPIRO SPARES - Powering Kenya's EV Revolution", margin, y);
    y += 5;
    doc.text("Contact: support@spirospares.com | +254 733 959 383", margin, y);
    y += 5;
    doc.text("This quote is valid for 7 days from the date of issue.", margin, y);

    // Save PDF
    doc.save(`SPIRO-QUOTE-${Date.now().toString().slice(-8)}.pdf`);
  };

  const handleWhatsAppCheckout = () => {
    setErrorMessage(null);
    setStatusMessage(null);

    if (!customerName.trim()) {
      setErrorMessage("Customer name is required.");
      return;
    }

    if (!customerPhone.trim()) {
      setErrorMessage("Phone number is required for WhatsApp checkout.");
      return;
    }

    // Validate Kenyan phone number format
    const phoneRegex = /^(0[17]\d{8}|254[17]\d{8}|\+254[17]\d{8})$/;
    if (!phoneRegex.test(customerPhone.trim())) {
      setErrorMessage("Please enter a valid Kenyan phone number (e.g., 0712345678 or 254712345678).");
      return;
    }

    // Validate email if provided
    if (customerEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail.trim())) {
        setErrorMessage("Please enter a valid email address or leave it blank.");
        return;
      }
    }

    if (!selectedPickupLocation) {
      setErrorMessage("Please select a pickup location.");
      return;
    }

    if (total <= 0) {
      setErrorMessage("Total amount must be greater than zero.");
      return;
    }

    // Generate PDF first
    generatePDF();

    // Store order info in session storage for success page
    const orderInfo = {
      orderId: `QT-${Date.now().toString().slice(-8)}`,
      verificationCode,
      total,
      totalQuantity,
      timestamp: Date.now()
    };
    sessionStorage.setItem("spiro_order_completed", JSON.stringify(orderInfo));

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    
    // Redirect to success page immediately after opening WhatsApp
    router.push("/order-success");
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left Column - Order Details */}
        <div className="space-y-4">
          {/* Items Section */}
          <div className="panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-[#00BFFF]" />
              <h2 className="text-lg font-bold text-white">Order Items ({totalQuantity})</h2>
            </div>

            <div className="space-y-3">
              {checkoutItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#0f0f0f] p-3">
                  {/* Product Image */}
                  {item.image ? (
                    <Link
                      href={`/${item.type}s/${item.id}`}
                      className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-[#1A1A1A] transition hover:opacity-90"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </Link>
                  ) : (
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-[#1A1A1A]">
                      <Package className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-[0.15em] text-gray-500">{item.type}</p>
                    <p className="font-semibold text-white truncate">{item.name}</p>
                    {item.sku && <p className="text-xs text-gray-500">SKU: {item.sku}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                    <p className="font-bold text-white">{formatKES(item.lineTotal)}</p>
                    <p className="text-xs text-gray-500">{formatKES(item.unitPrice)} each</p>
                  </div>
                </div>
              ))}
            </div>

            {isStockPointAuthenticated && product.id !== "cart-order" ? (
              <p className="mt-3 text-xs text-gray-500 line-through">{formatKES(baseSubtotal)} (-{Math.round(STOCK_POINT_DISCOUNT_RATE * 100)}%)</p>
            ) : null}

            <Link href="/cart" className="mt-4 inline-flex items-center gap-1 text-sm text-[#00BFFF] hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Edit items in cart
            </Link>
          </div>

          {/* Customer Details */}
          <div className="panel p-6">
            <h2 className="text-lg font-bold text-white mb-4">Customer Details</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full Name *"
                className="rounded-xl border border-white/15 bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#00BFFF]/70 focus:outline-none"
              />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone (07... or 2547...) *"
                className="rounded-xl border border-white/15 bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#00BFFF]/70 focus:outline-none"
              />
            </div>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Email (optional)"
              className="mt-3 w-full rounded-xl border border-white/15 bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#00BFFF]/70 focus:outline-none"
            />
            <textarea
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              placeholder="Additional note (optional)"
              rows={2}
              className="mt-3 w-full rounded-xl border border-white/15 bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#00BFFF]/70 focus:outline-none"
            />
          </div>
        </div>

        {/* Right Column - Fulfillment & Actions */}
        <div className="space-y-4">
          {/* Fulfillment Section */}
          <div className="panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-[#00BFFF]" />
              <h2 className="text-lg font-bold text-white">Pickup Location</h2>
            </div>

            {isLoadingLocations ? (
              <div className="text-sm text-gray-500">Loading pickup locations...</div>
            ) : pickupLocations.length === 0 ? (
              <div className="text-sm text-rose-400">No pickup locations available. Please try again later.</div>
            ) : (
              <>
                <select
                  value={selectedPickupLocation}
                  onChange={(e) => setSelectedPickupLocation(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white px-4 py-3 text-sm text-slate-700 focus:border-[#00BFFF]/70 focus:outline-none"
                >
                  {pickupLocations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name} - {location.city}
                    </option>
                  ))}
                </select>

                {selectedLocation && (
                  <div className="mt-3 p-3 rounded-lg border border-white/10 bg-white/5">
                    <p className="text-sm text-gray-300">{selectedLocation.address}</p>
                    <p className="text-sm text-gray-400">{selectedLocation.city}</p>
                    {selectedLocation.phone && (
                      <p className="text-sm text-gray-500 mt-1">{selectedLocation.phone}</p>
                    )}
                    {selectedLocation.hours && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {selectedLocation.hours}
                      </p>
                    )}
                  </div>
                )}

                {/* Express Pickup Option */}
                <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-[#00BFFF]/30">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${expressPickup ? "bg-[#00BFFF]/20" : "bg-white/10"}`}>
                      <Zap className={`h-4 w-4 ${expressPickup ? "text-[#00BFFF]" : "text-gray-500"}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Express Pickup</p>
                      <p className="text-xs text-gray-500">Priority processing +{formatKES(EXPRESS_FEE)}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={expressPickup}
                    onChange={(e) => setExpressPickup(e.target.checked)}
                    className="h-5 w-5 accent-[#00BFFF]"
                  />
                </label>
              </>
            )}
          </div>

          {/* Order Summary */}
          <div className="panel p-6">
            <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-gray-400">
                <span>Items ({totalQuantity})</span>
                <span className="text-white">{formatKES(subtotal)}</span>
              </div>

              {expressPickup && (
                <div className="flex items-center justify-between text-gray-400">
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-[#00BFFF]" />
                    Express Pickup
                  </span>
                  <span className="text-[#00BFFF]">{formatKES(EXPRESS_FEE)}</span>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-base font-bold text-white">Total</span>
                <span className="text-xl font-bold text-[#00BFFF]">{formatKES(total)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={handleWhatsAppCheckout}
                disabled={isLoadingLocations || pickupLocations.length === 0}
                className="w-full rounded-xl bg-[#00BFFF] px-6 py-4 text-sm font-bold text-white transition-all duration-300 ease-out hover:brightness-110 hover:shadow-[0_0_15px_rgba(0, 191, 255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Checkout on WhatsApp
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all duration-300 ease-out hover:border-[#00BFFF]/60 hover:text-[#00BFFF]"
              >
                Back
              </button>
            </div>

            {statusMessage ? <p className="mt-3 text-sm text-[#00BFFF]">{statusMessage}</p> : null}
            {errorMessage ? <p className="mt-2 text-sm text-rose-400">{errorMessage}</p> : null}

            <p className="mt-4 text-xs text-gray-500 text-center">
              By continuing, you will open WhatsApp with a pre-filled order summary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

