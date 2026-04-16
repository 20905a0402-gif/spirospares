"use client";

import {FormEvent, useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {BellPlus} from "lucide-react";

type RestockRequestButtonProps = {
  productId: string;
  productName: string;
  productType: "spare" | "bike" | "gadget";
  sku?: string;
  compact?: boolean;
  iconOnly?: boolean;
};

export default function RestockRequestButton({
  productId,
  productName,
  productType,
  sku,
  compact = false,
  iconOnly = false
}: RestockRequestButtonProps) {
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const submitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!customerName.trim() || !phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/restock-request", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          productId,
          productName,
          productType,
          sku,
          customerName,
          phone,
          email,
          note
        })
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setCustomerName("");
      setPhone("");
      setEmail("");
      setNote("");
      setOpen(false);
      window.alert("Request sent. We will notify you when this product is restocked.");
    } catch {
      setError("Could not send request right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setError(null);
        }}
        className={`inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400/70 bg-amber-100 text-amber-800 transition-all duration-300 ease-out hover:bg-amber-200 ${
          iconOnly
            ? compact
              ? "min-h-[36px] min-w-[36px] px-2"
              : "min-h-[44px] min-w-[44px] px-3"
            : compact
              ? "min-h-[36px] px-3 text-xs font-semibold"
              : "min-h-[44px] px-3 text-sm font-bold"
        }`}
        aria-label={`Raise restock request for ${productName}`}
      >
        <BellPlus className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
        {iconOnly ? null : "Notify Me"}
      </button>

      {open && mounted
        ? createPortal(
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/55 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/20 bg-white p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3">
              <h3 className="text-lg font-bold text-slate-900">Restock Request</h3>
              <p className="text-xs text-slate-500">{productName}</p>
            </div>

            <form onSubmit={submitRequest} className="grid gap-2">
              <input
                type="text"
                placeholder="Your name"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#00BFFF]"
                required
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#00BFFF]"
                required
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#00BFFF]"
              />
              <textarea
                placeholder="Any note (optional)"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={2}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#00BFFF]"
              />

              {error ? <p className="text-xs text-red-700">{error}</p> : null}

              <div className="mt-1 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-[#00BFFF] px-3 py-2 text-sm font-bold text-white transition-all duration-300 ease-out hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Sending..." : "Send Request"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      ) : null}
    </div>
  );
}
