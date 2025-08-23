"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, User, Pencil, Trash2 } from "lucide-react";
import AccionistaModal from "./modal";
import { Accionista } from "@/app/page";

interface AccionistasProps {
  accionistas: Accionista[];
  onSave: (accionista: Accionista) => void;
  onDelete: (id: string) => void;
}


export default function Accionistas({ accionistas, onSave, onDelete }: AccionistasProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accionistaToEdit, setAccionistaToEdit] = useState<Accionista | null>(null);

  const handleOpenModalForEdit = (accionista: Accionista) => {
    setAccionistaToEdit(accionista);
    setIsModalOpen(true);
  };

  const handleOpenModalForCreate = () => {
    setAccionistaToEdit(null);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setAccionistaToEdit(null);
    setIsModalOpen(false);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Accionistas/Socios
        </h3>
        <Button variant="outline" size="icon" onClick={handleOpenModalForCreate}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-3">
        {accionistas.map((accionista) => (
          <div key={accionista.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <User className="mr-3 h-4 w-4" />
              <div className="text-sm">
                <span>{accionista.nombre} {accionista.apellido}</span> - <span>{accionista.cuitCuilAccionista}</span> - <span>{accionista.participacion}%</span>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => handleOpenModalForEdit(accionista)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-red-500" onClick={() => onDelete(accionista.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <AccionistaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={onSave}
        accionistaToEdit={accionistaToEdit}
      />
  </div>
  )
}