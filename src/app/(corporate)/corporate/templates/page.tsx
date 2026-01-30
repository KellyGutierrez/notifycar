"use client"

import { Plus, MessageSquare, Trash2, Edit2, Zap } from "lucide-react"

export default function CorporateTemplatesPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-2">
                        Mis Mensajes
                    </h1>
                    <p className="text-gray-400">
                        Crea y edita mensajes personalizados para tu organización.
                    </p>
                </div>
                <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-xl shadow-indigo-500/20 active:scale-95">
                    <Plus className="h-5 w-5" /> Nueva Plantilla
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {[
                    { id: 1, name: "Pago pendiente - Zona Azul", content: "Hola, notamos que te retiraste sin registrar el pago...", type: "TODOS", cat: "URGENTE", usage: 145 },
                    { id: 2, name: "Tiempo expirado", content: "Hola, tu tiempo de parqueo en la Zona Azul ha expirado...", type: "TODOS", cat: "COMÚN", usage: 230 },
                    { id: 3, name: "Carga Completada", content: "Tu vehículo eléctrico ha terminado su ciclo de carga.", type: "ELÉCTRICO", cat: "COMÚN", usage: 45 },
                ].map((t) => (
                    <div key={t.id} className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl hover:bg-white/[0.05] transition-all group">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{t.name}</h3>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${t.cat === 'URGENTE' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'
                                        }`}>
                                        {t.cat}
                                    </span>
                                    {t.type === 'ELÉCTRICO' && (
                                        <span className="bg-green-500/20 text-green-400 border border-green-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-widest">
                                            <Zap className="h-3 w-3 fill-current" /> ELÉCTRICO
                                        </span>
                                    )}
                                </div>
                                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 italic text-gray-400 text-sm">
                                    "{t.content}"
                                </div>
                            </div>

                            <div className="flex md:flex-col justify-end gap-2 shrink-0">
                                <div className="text-right px-4 mb-2 hidden md:block">
                                    <p className="text-2xl font-black text-white">{t.usage}</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">USOS</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white" title="Editar">
                                        <Edit2 className="h-5 w-5" />
                                    </button>
                                    <button className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors text-red-400" title="Eliminar">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
