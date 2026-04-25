"use client";

import {FormEvent, useState} from "react";
import { createPortal } from "react-dom";
import {BadgePercent, CircleUserRound, LogOut, ShieldCheck} from "lucide-react";
import {useShopStore} from "@/lib/store";

type StockPointLoginProps = {
  compact?: boolean;
};

export default function StockPointLogin({compact = false}: StockPointLoginProps) {
  const isStockPointAuthenticated = useShopStore((state) => state.isStockPointAuthenticated);
  const authenticateStockPoint = useShopStore((state) => state.authenticateStockPoint);
  const logoutStockPoint = useShopStore((state) => state.logoutStockPoint);

  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const ok = authenticateStockPoint(username, password);
    if (!ok) {
      setError("Invalid credentials. Use the stock point dummy credentials.");
      return;
    }

    setError(null);
    setUsername("");
    setPassword("");
    setOpen(false);
  };

  if (isStockPointAuthenticated) {
    return (
      <>
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setError(null);
          }}
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-500/15 text-emerald-700 transition-all duration-300 ease-out hover:border-[#00BFFF]/60 hover:text-[#00BFFF]"
          aria-label="Member login active"
          title="Member login active"
        >
          <ShieldCheck className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 inline-flex min-w-[17px] items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
            <BadgePercent className="h-2.5 w-2.5" />
          </span>
        </button>

        {open ? createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/80 p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-white p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-slate-900">Member Access Active</h3>
              <p className="mt-1 text-xs text-slate-500">10% discount is currently enabled for this session.</p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logoutStockPoint();
                    setOpen(false);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00BFFF] px-3 py-2 text-sm font-bold text-white transition-all duration-300 ease-out hover:brightness-110"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>,
          document.body
        ) : null}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setError(null);
        }}
        className={`inline-flex items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/5 text-slate-700 transition-all duration-300 ease-out hover:border-[#00BFFF]/60 hover:text-[#00BFFF] ${compact ? "h-10 px-2.5" : "h-10 px-3"}`}
        aria-label="Open login"
        title="Open login"
      >
        <CircleUserRound className="h-4 w-4" />
        <span className={`font-semibold ${compact ? "text-[11px]" : "text-xs"}`}>Login</span>
      </button>

      {open ? createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/80 p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Member Login</h3>
            <p className="mt-1 text-xs text-slate-500">Dummy credentials for demo access and 10% member discount.</p>

            <form className="mt-4 grid gap-2" onSubmit={onSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#00BFFF]"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#00BFFF]"
                required
              />

              {error ? <p className="text-xs text-red-600">{error}</p> : null}

              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#00BFFF] px-3 py-2 text-sm font-bold text-white transition-all duration-300 ease-out hover:brightness-110"
                >
                  Login
                </button>
              </div>
            </form>

            <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-2 text-[11px] text-slate-500">
              Demo: username <strong>stockpoint</strong> and password <strong>stock@123</strong>
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </>
  );
}
