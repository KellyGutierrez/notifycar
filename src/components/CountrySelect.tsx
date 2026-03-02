"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search, Check } from "lucide-react"
import { countries } from "@/lib/countries"

import { cn } from "@/lib/utils"

interface CountrySelectProps {
    value: string
    onChange: (value: string) => void
    variant?: 'light' | 'dark'
    className?: string
}

export function CountrySelect({ value, onChange, variant = 'dark', className }: CountrySelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState("")
    const wrapperRef = useRef<HTMLDivElement>(null)

    const selectedCountry = countries.find(c => c.code === value) || countries[0]

    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dial_code.includes(search)
    )

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className={cn("relative shrink-0", className)} ref={wrapperRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between pl-3 pr-2 py-3 rounded-xl transition-all text-left",
                    variant === 'dark'
                        ? "bg-white/5 border border-white/10 text-white focus:border-green-500/50 focus:bg-green-500/5"
                        : "bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-brand focus:border-transparent"
                )}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <img
                        src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w80/${selectedCountry.code.toLowerCase()}.png 2x`}
                        width="24"
                        alt={selectedCountry.name}
                        className="rounded-sm object-cover shrink-0"
                    />
                    <span className="truncate text-sm font-bold tracking-tight">{selectedCountry.code}</span>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform shrink-0", isOpen ? 'rotate-180' : '')} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className={cn(
                    "absolute top-full left-0 mt-2 w-72 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200",
                    variant === 'dark'
                        ? "bg-[#1a1a1a] border border-white/10"
                        : "bg-white border border-gray-200"
                )}>
                    <div className={cn(
                        "p-2 border-b sticky top-0 z-10",
                        variant === 'dark'
                            ? "bg-[#1a1a1a] border-white/5"
                            : "bg-white border-gray-100"
                    )}>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Buscar país..."
                                className={cn(
                                    "w-full rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none transition-all placeholder:text-gray-500",
                                    variant === 'dark'
                                        ? "bg-white/5 border border-white/10 text-white focus:border-green-500/50"
                                        : "bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-brand focus:border-transparent"
                                )}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto scrollbar-thin">
                        {filteredCountries.map((country) => (
                            <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                    onChange(country.code)
                                    setIsOpen(false)
                                    setSearch("")
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 transition-colors text-left",
                                    variant === 'dark'
                                        ? "hover:bg-white/5 text-gray-200"
                                        : "hover:bg-gray-50 text-gray-900",
                                    value === country.code && (variant === 'dark' ? 'bg-green-500/10' : 'bg-brand/5')
                                )}
                            >
                                <img
                                    src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                                    srcSet={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png 2x`}
                                    width="20"
                                    alt={country.name}
                                    className="rounded-sm flex-shrink-0"
                                />
                                <div className="flex-1 truncate">
                                    <span className={cn(
                                        "block text-sm transition-colors",
                                        value === country.code
                                            ? (variant === 'dark' ? 'text-green-400 font-bold' : 'text-brand font-bold')
                                            : (variant === 'dark' ? 'text-gray-200' : 'text-gray-900')
                                    )}>
                                        {country.name}
                                    </span>
                                    <span className="text-[10px] font-medium text-gray-500 opacity-80">{country.dial_code}</span>
                                </div>
                                {value === country.code && <Check className={cn("h-4 w-4", variant === 'dark' ? 'text-green-400' : 'text-brand')} />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
