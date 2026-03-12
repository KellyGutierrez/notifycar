"use client"

import { useState } from "react"
import { MobileHeader } from "@/components/MobileHeader"
import { MobileBottomNav, type BottomNavItem } from "@/components/MobileBottomNav"
import { CorporateSidebar } from "@/components/CorporateSidebar"
import { LayoutDashboard, Car, Bell, MessageSquare, MoreHorizontal } from "lucide-react"

const bottomItems: BottomNavItem[] = [
    { name: "Resumen", href: "/corporate", icon: LayoutDashboard, exact: true },
    { name: "Mi Flota", href: "/corporate/vehicles", icon: Car },
    { name: "Mensajes", href: "/corporate/templates", icon: MessageSquare },
    { name: "Avisos", href: "/corporate/notifications", icon: Bell },
]

export function CorporateMobileNav() {
    const [drawerOpen, setDrawerOpen] = useState(false)

    return (
        <>
            <MobileHeader
                themeColor="indigo"
                title="NotifyCar Corporate"
                logo="/brand/horizontal-white.png"
                notificationsLink="/corporate/notifications"
                isOpen={drawerOpen}
                onOpenChange={setDrawerOpen}
            >
                <CorporateSidebar isMobile />
            </MobileHeader>

            <MobileBottomNav
                items={bottomItems}
                themeColor="indigo"
                moreIcon={MoreHorizontal}
                onMoreClick={() => setDrawerOpen(true)}
            />
        </>
    )
}
