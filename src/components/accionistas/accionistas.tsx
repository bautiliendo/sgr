"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, User, Pencil, Trash2 } from "lucide-react";
import AccionistaModal from "./modal";

const accionistasData = [
  {
    id: 1,
    nombre: "Accionista 1",
    cuit: "12345678",
    participacion: "50.00%",
  },
  {
    id: 2,
    nombre: "Accionista 2",
    cuit: "87654321",
    participacion: "50.00%",
  },
];

export default function Accionistas() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Accionistas/Socios
        </h3>
        <Button variant="outline" size="icon" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-3">
        {accionistasData.map((accionista) => (
          <div key={accionista.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <User className="mr-3 h-4 w-4" />
              <div className="text-sm">
                <span>{accionista.nombre}</span> - <span>{accionista.cuit}</span> - <span>{accionista.participacion}</span>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <AccionistaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
  </div>
  )
}