import React from "react";
import Button from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function Navbar({ brand = "Cyber Dashboard", envLabel = "Stage", dark, setDark, userInitial = "U", onLogout }) {
  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <div className="h-6 w-[224px] pt-1">
          <span className="text-sm font-normal text-navy-700 dark:text-white">
            Pages <span className="mx-1 text-sm text-navy-700 dark:text-white">/</span>
          </span>
          <span className="text-sm font-normal capitalize text-navy-700 dark:text-white">{brand}</span>
        </div>
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white font-bold">{brand}</p>
      </div>
      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-end gap-3 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-2 xl:w-[365px] xl:gap-3">
        <button
          className="h-8 w-8 grid place-items-center rounded-full bg-white/10 border border-white/20 text-neutral-700 dark:text-white"
          onClick={() => setDark(!dark)}
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 grid place-items-center text-xs font-semibold text-white">
          {userInitial}
        </div>
        <Button variant="outline" className="bg-white/5 text-navy-700 dark:text-white border-white/20 hover:bg-white/10" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}
