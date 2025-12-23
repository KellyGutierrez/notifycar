"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search, Check } from "lucide-react"
import { countries } from "@/lib/countries"

interface CountrySelectProps {
    value: string
    onChange: (value: string) => void
}

export function CountrySelect({ value, onChange }: CountrySelectProps) {
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
        <div className="relative w-1/3 min-w-[140px]" ref={wrapperRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between pl-3 pr-2 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500/50 focus:bg-green-500/5 transition-all text-left"
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <img
                        src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w80/${selectedCountry.code.toLowerCase()}.png 2x`}
                        width="24"
                        alt={selectedCountry.name}
                        className="rounded-sm object-cover"
                    />
                    <span className="truncate text-sm font-medium">{selectedCountry.code}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="p-2 border-b border-white/5 sticky top-0 bg-[#1a1a1a]">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Buscar país..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50 placeholder:text-gray-600"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {filteredCountries.map((country) => (
                            <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                    onChange(country.code)
                                    setIsOpen(false)
                                    setSearch("")
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left ${value === country.code ? 'bg-green-500/10' : ''}`}
                            >
                                <img
                                    src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                                    srcSet={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png 2x`}
                                    width="20"
                                    alt={country.name}
                                    className="rounded-sm flex-shrink-0"
                                />
                                <div className="flex-1 truncate">
                                    <span className={`block text-sm ${value === country.code ? 'text-green-400 font-medium' : 'text-gray-200'}`}>
                                        {country.name}
                                    </span>
                                    <span className="text-xs text-gray-500">{country.dial_code}</span>
                                </div>
                                {value === country.code && <Check className="h-4 w-4 text-green-400" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
