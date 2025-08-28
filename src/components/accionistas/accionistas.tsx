"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, User, Pencil, Trash2, Upload, Check } from "lucide-react";
import AccionistaModal from "./modal";
import { Accionista } from "@/app/page";

interface AccionistasProps {
  accionistas: Accionista[];
  onSave: (accionista: Accionista) => void;
  onDelete: (id: string) => void;
  accionistaFiles: Record<string, File>;
  onAccionistaFileChange: (event: React.ChangeEvent<HTMLInputElement>, accionistaId: string) => void;
  onDeleteAccionistaFile: (accionistaId: string) => void;
}


export default function Accionistas({ accionistas, onSave, onDelete, accionistaFiles, onAccionistaFileChange, onDeleteAccionistaFile }: AccionistasProps) {
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
          <div key={accionista.id} className="space-y-2">
            {/* Información del accionista */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <User className="mr-3 h-4 w-4 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-bold">{accionista.nombre} {accionista.apellido}</span> - <span className="text-gray-500">{accionista.cuitCuilAccionista} - {accionista.email}</span> - <span className="text-gray-500">{accionista.participacion}%</span>
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
            
            {/* DNI del accionista */}
            <div className="ml-7 flex items-center justify-between p-2 border border-gray-100 rounded-md bg-gray-50">
              <span className="text-sm text-gray-600">DNI Accionista</span>
              {accionistaFiles[accionista.id] ? (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-green-700"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:text-red-500"
                    onClick={() => onDeleteAccionistaFile(accionista.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent cursor-pointer"
                >
                  <label htmlFor={`dni-upload-${accionista.id}`}>
                    <Upload className="w-3 h-3" />
                    Subir
                  </label>
                </Button>
              )}
              <input
                id={`dni-upload-${accionista.id}`}
                type="file"
                className="hidden"
                onChange={(e) => onAccionistaFileChange(e, accionista.id)}
              />
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