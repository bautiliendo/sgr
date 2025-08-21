"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AccionistaModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AccionistaModal({
    isOpen,
    onClose,
}: AccionistaModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Agregar Accionista</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
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
                        <Label htmlFor="personeria">Personería</Label>
                        <Select>
                            <SelectTrigger id="personeria">
                                <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="humana">Humana</SelectItem>
                                <SelectItem value="juridica">Jurídica</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input id="nombre" />
                    </div>
                    <div>
                        <Label htmlFor="apellido">Apellido</Label>
                        <Input id="apellido" />
                    </div>
                    <div>
                        <Label htmlFor="cuit">CUIT/CUIL</Label>
                        <Input id="cuit" type="number" />
                    </div>
                    <div>
                        <Label htmlFor="participacion">% de participación</Label>
                        <Input id="participacion" type="number" min="1" max="100" />
                    </div>
                    <div>
                        <Label htmlFor="relacion">Relación</Label>
                        <Select>
                            <SelectTrigger id="relacion">
                                <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ascendente">Ascendente</SelectItem>
                                <SelectItem value="descendente">Descendente</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button>Cargar accionista</Button>
                </div>
            </div>
        </div>
    );
}
