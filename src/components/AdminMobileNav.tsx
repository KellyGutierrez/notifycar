"use client"

import { useState } from "react"
import { MobileHeader } from "@/components/MobileHeader"
import { MobileBottomNav, type BottomNavItem } from "@/components/MobileBottomNav"
import { AdminSidebar } from "@/components/AdminSidebar"
import { LayoutDashboard, Users, Bell, Settings, MoreHorizontal } from "lucide-react"

const bottomItems: BottomNavItem[] = [
    { name: "Resumen", href: "/admin", icon: LayoutDashboard, exact: true },
    { name: "Usuarios", href: "/admin/users", icon: Users },
    { name: "Avisos", href: "/admin/notifications", icon: Bell },
    { name: "Config", href: "/admin/settings", icon: Settings },
]

export function AdminMobileNav() {
    const [drawerOpen, setDrawerOpen] = useState(false)

    return (
        <>
            <MobileHeader
                themeColor="cyan"
                title="Admin"
                notificationsLink="/admin/notifications"
                isOpen={drawerOpen}
                onOpenChange={setDrawerOpen}
            >
                <AdminSidebar isMobile />
            </MobileHeader>

            <MobileBottomNav
                items={bottomItems}
                themeColor="cyan"
                moreIcon={MoreHorizontal}
                onMoreClick={() => setDrawerOpen(true)}
            />
        </>
    )
}
