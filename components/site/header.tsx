"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Wordmark } from "@/components/brand/logo";
import { BorderStrip, Ornament } from "@/components/brand/ornament";
import { nav, site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * The header sits over the hero, which is dark, so it starts in the night
 * direction with bone ink. Once the hero is behind us it settles onto a bone
 * surface with sienna ink.
 *
 * Pages without a dark hero pass `solid` and skip the transparent state.
 */
export function Header({ solid }: { solid?: boolean }) {
  const pathname = usePathname();
  // Only the homepage opens on a dark, full-bleed hero.
  const isSolid = solid ?? pathname !== "/";
  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isSolid) return;
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight - 96);
    // A frame later rather than inline, so a refresh part-way down the page
    // still resolves correctly without a synchronous set during render.
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isSolid]);

  // Escape to close, and hold the page still while the overlay is up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const inverted = !isSolid && !pastHero && !open;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-slow ease-exhale",
          inverted
            ? "night border-b border-transparent bg-transparent"
            : "bg-surface/92 border-b border-rule/40 shadow-rest backdrop-blur-md",
        )}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 md:h-24 md:px-10">
          {/* Left — nav on desktop, menu toggle on mobile */}
          <nav className="hidden flex-1 items-center gap-8 md:flex">
            {nav.slice(0, 2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "label-caps duration-quick ease-exhale underline-offset-8 transition-colors hover:underline",
                  pathname === item.href ? "text-ink" : "text-ink-muted hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="label-caps text-ink flex flex-1 items-center gap-3 md:hidden"
          >
            <span className="flex flex-col gap-[5px]" aria-hidden="true">
              <span className="block h-px w-6 bg-current" />
              <span className="block h-px w-6 bg-current" />
            </span>
            <span className="sr-only">Open menu</span>
          </button>

          {/* Center — wordmark */}
          <Link
            href="/"
            className="text-ink duration-quick ease-exhale shrink-0 transition-opacity hover:opacity-70"
            aria-label={`${site.name} — home`}
          >
            <Wordmark className="text-[1.375rem] md:text-[1.625rem]" />
          </Link>

          {/* Right — booking */}
          <div className="flex flex-1 items-center justify-end">
            <Link
              href="/book"
              className={cn(
                "label-caps rounded-pill duration-quick ease-exhale border px-5 py-3 transition-all hover:-translate-y-0.5 md:px-7",
                inverted
                  ? "border-rule text-ink hover:bg-surface-raised"
                  : "bg-primary text-primary-foreground shadow-rest hover:shadow-lift border-transparent",
              )}
            >
              <span className="hidden sm:inline">Book a session</span>
              <span className="sm:hidden">Book</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile overlay --------------------------------------------------- */}
      <div
        id="site-menu"
        hidden={!open}
        className="night bg-surface text-ink fixed inset-0 z-[60] flex flex-col md:hidden"
      >
        <div className="flex h-20 items-center justify-between px-5">
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            className="label-caps text-ink"
          >
            Close
          </button>
          <Wordmark className="text-[1.375rem]" />
          <span className="w-12" aria-hidden="true" />
        </div>

        <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-ink flex items-center gap-5 border-b border-rule/30 py-6"
            >
              <span className="text-accent-honey">
                <Ornament
                  name={
                    item.href === "/practice"
                      ? "marigold"
                      : item.href === "/letter"
                        ? "branch"
                        : "double-moon"
                  }
                  size={26}
                />
              </span>
              <span className="font-display text-3xl font-[350]">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="px-8 pb-12">
          <div className="text-ink-soft/50 mb-8">
            <BorderStrip name="floral" height={14} />
          </div>
          <p className="label-caps text-ink-soft">
            {site.location} · {site.availability}
          </p>
        </div>
      </div>
    </>
  );
}
