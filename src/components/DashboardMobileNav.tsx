"use client"

import { useState } from "react"
import { MobileHeader } from "@/components/MobileHeader"
import { MobileBottomNav, type BottomNavItem } from "@/components/MobileBottomNav"
import { Sidebar } from "@/components/Sidebar"
import { LayoutDashboard, Car, Bell, Settings, MoreHorizontal } from "lucide-react"

const bottomItems: BottomNavItem[] = [
    { name: "Inicio", href: "/dashboard", icon: LayoutDashboard, exact: true },
    { name: "Vehículos", href: "/vehicles", icon: Car },
    { name: "Avisos", href: "/notifications", icon: Bell },
    { name: "Ajustes", href: "/settings", icon: Settings },
]

export function DashboardMobileNav() {
    const [drawerOpen, setDrawerOpen] = useState(false)

    return (
        <>
            <MobileHeader
                themeColor="green"
                isOpen={drawerOpen}
                onOpenChange={setDrawerOpen}
            >
                <Sidebar isMobile />
            </MobileHeader>

            <MobileBottomNav
                items={bottomItems}
                themeColor="green"
                moreIcon={MoreHorizontal}
                onMoreClick={() => setDrawerOpen(true)}
            />
        </>
    )
}
