"use client";

import { useEffect } from "react";
import { siteConfig } from "@/config/site";

interface AdSlotProps {
  slotKey: keyof typeof siteConfig.slots;
  minHeight?: string;
}

export default function AdSlot({ slotKey, minHeight = "100px" }: AdSlotProps) {
  useEffect(() => {
    if (!siteConfig.adsenseEnabled) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {}
  }, []);

  if (!siteConfig.adsenseEnabled) return null;

  return (
    <div
      style={{ minHeight }}
      className="w-full my-4 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900/50 rounded-xl"
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={siteConfig.publisherId}
        data-ad-slot={siteConfig.slots[slotKey]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
