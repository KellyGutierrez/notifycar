"use client"

import { signOut } from "next-auth/react"
import { LogOut, User as UserIcon, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface UserMenuProps {
    user: {
        name?: string | null
        role?: string | null
    }
    dashboardLink: string
}

export function UserMenu({ user, dashboardLink }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-brand/10 text-brand px-4 py-2 rounded-full font-bold transition-all hover:bg-brand/20 border border-brand/10"
            >
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Hola, {user.name?.split(' ')[0]}</span>
                <span className="sm:hidden">Cuenta</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-[100] animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Registrado como</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                    </div>

                    <Link
                        href={dashboardLink}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <LayoutDashboard className="h-4 w-4 text-gray-400" />
                        Mi Panel
                    </Link>

                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    )
}
