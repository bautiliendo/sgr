"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accionista } from "@/app/page";
import { useEffect, useState } from "react";
import { accionistaSchema } from "@/lib/schemas";


interface AccionistaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (accionista: Accionista) => void;
    accionistaToEdit?: Accionista | null;
}

const initialAccionistaState: Omit<Accionista, 'id'> = {
    nombre: "",
    apellido: "",
    email: "",
    cuitCuilAccionista: "",
    participacion: 0,
};

export default function AccionistaModal({
    isOpen,
    onClose,
    onSave,
    accionistaToEdit,
}: AccionistaModalProps) {
    const [accionistaData, setAccionistaData] = useState(initialAccionistaState);
    const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

    useEffect(() => {
        if (accionistaToEdit) {
            setAccionistaData(accionistaToEdit);
        } else {
            setAccionistaData(initialAccionistaState);
        }
    }, [accionistaToEdit, isOpen]);


    const handleClose = () => {
        setAccionistaData(initialAccionistaState);
        setErrors({});
        onClose();
    };

    const handleSave = () => {
        const validationResult = accionistaSchema.safeParse(accionistaData);
        if (!validationResult.success) {
            setErrors(validationResult.error.flatten().fieldErrors);
            return;
        }

        onSave({
            ...validationResult.data,
            id: accionistaToEdit?.id || crypto.randomUUID(),
        });
        handleClose();
    };


    const handleChange = (field: keyof typeof initialAccionistaState, value: string) => {
        setAccionistaData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };


    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">{accionistaToEdit ? "Editar" : "Agregar"} Accionista</h2>
                    <Button variant="ghost" size="icon" onClick={handleClose}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                        >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </Button>
                </div>

                <div className="grid gap-4">
                    <div>
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input id="nombre" value={accionistaData.nombre} onChange={e => handleChange('nombre', e.target.value)} />
                        {errors.nombre && <p className="text-sm text-red-600 mt-1">{errors.nombre[0]}</p>}
                    </div>
                    <div>
                        <Label htmlFor="apellido">Apellido</Label>
                        <Input id="apellido" value={accionistaData.apellido} onChange={e => handleChange('apellido', e.target.value)} />
                        {errors.apellido && <p className="text-sm text-red-600 mt-1">{errors.apellido[0]}</p>}
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={accionistaData.email} onChange={e => handleChange('email', e.target.value)} />
                        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email[0]}</p>}
                    </div>
                    <div>
                        <Label htmlFor="cuit">CUIT/CUIL</Label>
                        <Input id="cuit" value={accionistaData.cuitCuilAccionista} onChange={e => handleChange('cuitCuilAccionista', e.target.value)} />
                        {errors.cuitCuilAccionista && <p className="text-sm text-red-600 mt-1">{errors.cuitCuilAccionista[0]}</p>}
                    </div>
                    <div>
                        <Label htmlFor="participacion">% de participación</Label>
                        <Input id="participacion" type="number" min="1" max="100" value={accionistaData.participacion} onChange={e => handleChange('participacion', e.target.value)} />
                        {errors.participacion && <p className="text-sm text-red-600 mt-1">{errors.participacion[0]}</p>}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="outline" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave}>{accionistaToEdit ? "Guardar Cambios" : "Cargar Accionista"}</Button>
                </div>
            </div>
        </div>
    );
}
