"use client"

import { Dock } from "@/components/dock"
import { NavUser } from "@/components/nav-user"
import Image from "next/image"

const user = {
  name: "vini",
  email: "96@thunder.com",
  avatar: "/avatars/shadcn.jpg",
}


export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
        {/* Left Section - Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 flex-shrink-0 rounded-lg overflow-hidden">
            <Image 
              src="/logo.png" 
              alt="Thunder" 
              width={32} 
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-sm text-white hidden sm:inline-block">
            Thunder
          </span>
        </div>

        {/* Center - Dock (Desktop) */}
        <div className="hidden lg:flex flex-1 justify-center max-w-3xl">
          <Dock />
        </div>

        {/* Right Section - Nav Header */}
        <div className="flex items-center">
          <NavUser user={user} />
        </div>
      </div>

      {/* Mobile/Tablet Dock - Below header */}
      <div className="flex lg:hidden border-t border-border/40 bg-background/80 backdrop-blur-md">
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="px-4 py-3 min-w-max">
            <Dock />
          </div>
        </div>
      </div>
    </header>
  )
}

