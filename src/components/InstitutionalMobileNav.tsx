"use client"

import { useState } from "react"
import { MobileHeader } from "@/components/MobileHeader"
import { MobileBottomNav, type BottomNavItem } from "@/components/MobileBottomNav"
import { InstitutionalSidebar } from "@/components/InstitutionalSidebar"
import { LayoutDashboard, Car, Bell, Users, MoreHorizontal } from "lucide-react"

const bottomItems: BottomNavItem[] = [
    { name: "Resumen", href: "/institutional", icon: LayoutDashboard, exact: true },
    { name: "Mi Equipo", href: "/institutional/operators", icon: Users },
    { name: "Vehículos", href: "/institutional/vehicles", icon: Car },
    { name: "Avisos", href: "/institutional/notifications", icon: Bell },
]

export function InstitutionalMobileNav() {
    const [drawerOpen, setDrawerOpen] = useState(false)

    return (
        <>
            <MobileHeader
                themeColor="emerald"
                title="NotifyCar Institucional"
                logo="/logo_white.png"
                notificationsLink="/institutional/notifications"
                isOpen={drawerOpen}
                onOpenChange={setDrawerOpen}
            >
                <InstitutionalSidebar isMobile />
            </MobileHeader>

            <MobileBottomNav
                items={bottomItems}
                themeColor="emerald"
                moreIcon={MoreHorizontal}
                onMoreClick={() => setDrawerOpen(true)}
            />
        </>
    )
}
