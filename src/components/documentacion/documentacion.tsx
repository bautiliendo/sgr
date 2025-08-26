"use client";

import {
  Upload,
  Check,
  Trash2,
  CircleQuestionMark,
  DownloadIcon,
  EyeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Accionistas from "@/components/accionistas/accionistas";
import { Accionista } from "@/app/page";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const docsJuridica = [
  "Certificado PYME vigente",
  "DDJJ de bienes personales o manifestacion de bienes de c/ accionista",
  "Ventas post cierre balance",
  "Formulario alta",
  "Detalle de deudas",
  "Últimos dos balances certificados",
];

export const docsFisica = [
  "Certificado PYME Vigente",
  "Última DDJJ ganancias",
  "DDJJ de bienes personales o manifestacion de bienes",
  "Formulario alta",
  "Reseña",
  "DNI propio y de su cónyuge",
];

export const docsAgricola = ["Plan de siembra", "IP1", "IP2"];

const docsPlantilla = [
  "Ventas post cierre balance",
  "Detalle de deudas",
  "Formulario alta",
  "Reseña",
  "Plan de siembra",
];

const docsSinVisualizacion = [
  "Últimos dos balances certificados",
  "DNI propio y de su cónyuge",
];

// TODO: Mover a un archivo de tipos dedicado
type PersoneriaType = "juridica" | "fisica" | null;
type TipoEmpresaType = "agricola" | "no-agricola" | null;

interface DocumentacionProps {
  personeria: PersoneriaType;
  tipoEmpresa: TipoEmpresaType;
  accionistas: Accionista[];
  uploadedFiles: Record<string, File>;
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    docName: string
  ) => void;
  onSaveAccionista: (accionista: Accionista) => void;
  onDeleteAccionista: (id: string) => void;
  accionistasError: string | null;
  onDeleteFile: (doc: string) => void;
  onDownloadFile: (doc: string) => void;
}

export default function Documentacion({
  personeria,
  tipoEmpresa,
  accionistas,
  uploadedFiles,
  handleFileChange,
  onSaveAccionista,
  onDeleteAccionista,
  accionistasError,
  onDeleteFile,
  onDownloadFile,
}: DocumentacionProps) {
  let documentosAMostrar: string[] = [];
  if (personeria === "juridica") {
    documentosAMostrar = [...docsJuridica];
  } else if (personeria === "fisica") {
    documentosAMostrar = [...docsFisica];
  }

  if (tipoEmpresa === "agricola") {
    documentosAMostrar.push(...docsAgricola);
  }

  return (
    <div>
      {personeria === "juridica" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Documentación requerida */}
          <div>
            <div className="flex items-center mb-4 h-9">
              <h3 className="text-lg font-semibold">
                Documentación requerida
              </h3>
            </div>
            <div className="space-y-3">
              {documentosAMostrar.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <span className="text-sm">{doc}</span>
                  {uploadedFiles[doc] ? (
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-700"
                            >
                              <Check className="w-5 h-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{uploadedFiles[doc].name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-red-500"
                        onClick={() => onDeleteFile(doc)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {docsPlantilla.includes(doc) ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDownloadFile(doc)}
                              >
                                <DownloadIcon className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Descargar plantilla</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : !docsSinVisualizacion.includes(doc) ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDownloadFile(doc)}
                              >
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ver ejemplo</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : null}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CircleQuestionMark className="w-4 h-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{documentosAMostrar[index]}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 bg-transparent cursor-pointer"
                      >
                        <label htmlFor={`file-upload-${doc}-${index}`}>
                          <Upload className="w-4 h-4" />
                          Subir
                        </label>
                      </Button>
                      <input
                        id={`file-upload-${doc}-${index}`}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, doc)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Accionistas/socios */}
          <div>
            <Accionistas
              accionistas={accionistas}
              onSave={onSaveAccionista}
              onDelete={onDeleteAccionista}
            />
            {accionistasError && (
              <p className="text-sm text-red-600 mt-2">{accionistasError}</p>
            )}
          </div>
        </div>
      ) : personeria === "fisica" ? (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Documentación requerida
          </h3>
          <div className="space-y-3">
            {documentosAMostrar.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <span className="text-sm">{doc}</span>
                {uploadedFiles[doc] ? (
                  <div className="flex gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-700"
                          >
                            <Check className="w-5 h-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{uploadedFiles[doc].name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-red-500"
                      onClick={() => onDeleteFile(doc)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {docsPlantilla.includes(doc) ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDownloadFile(doc)}
                            >
                              <DownloadIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Descargar plantilla</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : !docsSinVisualizacion.includes(doc) ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDownloadFile(doc)}
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver ejemplo</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : null}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <CircleQuestionMark className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{documentosAMostrar[index]}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent cursor-pointer"
                    >
                      <label htmlFor={`file-upload-${doc}-${index}`}>
                        <Upload className="w-4 h-4" />
                        Subir
                      </label>
                    </Button>
                    <input
                      id={`file-upload-${doc}-${index}`}
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, doc)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">
            Por favor, complete el paso 1 para ver la documentación requerida.
          </p>
        </div>
      )}
    </div>
  );
}
