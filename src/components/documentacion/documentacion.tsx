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

export interface Documento {
  nombre: string;
  descripcion: string;
  plantilla?: string;
  tipo?: "plantilla" | "ejemplo";
}

export const docsFisica: Documento[] = [
  {
    nombre: "Certificado PYME Vigente",
    descripcion: "Constancia oficial que acredita que la persona física está inscrita y reconocida como micro, pequeña o mediana empresa",
    plantilla: "certificado-pyme-vigente.pdf",
    tipo: "ejemplo"
  },
  {
    nombre: "DDJJ de bienes personales o manifestacion de bienes",
    descripcion: "Declaración jurada con detalle de patrimonio (inmuebles, vehículos, inversiones, etc.), utilizada para evaluar solvencia.",
    plantilla: "ddjj-bienes.pdf",
    tipo: "ejemplo"
  },
  { nombre: "Formulario alta", descripcion: "Documento inicial de registro para solicitar el crédito o ingresar al programa de beneficios.", plantilla: "solicitud-admision.xlsx", tipo: "plantilla" },
  { nombre: "Reseña", descripcion: "Documento que resume la situación de la actividad económica de la persona, antecedentes, destino de fondos y expectativas de crecimiento.", plantilla: "reseña.doc", tipo: "plantilla" },
  { nombre: "Detalle de deudas", descripcion: "Listado de obligaciones financieras vigentes (bancarias, impositivas o comerciales), útil para evaluar capacidad de pago", plantilla: "detalle-deudas.xlsx", tipo: "plantilla" },
  { nombre: "Última DDJJ ganancias", descripcion: "Declaración jurada del impuesto a las ganancias, para verificar ingresos y situación fiscal", plantilla: "ganancias.pdf", tipo: "ejemplo" },
  { nombre: "DNI propio y de su cónyuge", descripcion: "Documentación personal requerida para identificación y validación del solicitante y su cónyuge." },
];

export const docsJuridica: Documento[] = [
  {
    nombre: "Certificado PYME vigente",
    descripcion: "Constancia oficial que acredita que la persona física está inscrita y reconocida como micro, pequeña o mediana empresa",
    plantilla: "certificado-pyme-vigente.pdf",
    tipo: "ejemplo"
  },
  {
    nombre: "DDJJ de bienes personales o manifestacion de bienes de c/ accionista",
    descripcion: "Declaración jurada con detalle de patrimonio (inmuebles, vehículos, inversiones, etc.), utilizada para evaluar solvencia.",
    plantilla: "ddjj-bienes.pdf",
    tipo: "ejemplo"
  },
  { nombre: "Formulario alta", descripcion: "Documento inicial de registro para solicitar el crédito o ingresar al programa de beneficios.", plantilla: "solicitud-admision.xlsx", tipo: "plantilla" },
  { nombre: "Reseña", descripcion: "Documento que detalla la constitución, actividad productiva y comercial, estructura administrativa y destino de los fondos solicitados.", plantilla: "reseña.doc", tipo: "plantilla" },
  { nombre: "Detalle de deudas", descripcion: "Listado de pasivos de la empresa (bancarios, fiscales, comerciales).", plantilla: "detalle-deudas.xlsx", tipo: "plantilla" },
  {
    nombre: "Ventas post cierre balance",
    descripcion: "Informe actualizado de ventas generadas después del último balance presentado, para reflejar actividad reciente",
    plantilla: "ventas-post-cierre-balance.xlsx",
    tipo: "plantilla"
  },
  { nombre: "Últimos dos balances certificados", descripcion: "Estados contables auditados, fundamentales para evaluar la solvencia, evolución y capacidad de repago" },
];


export const docsAgricola: Documento[] = [
  { nombre: "Plan de siembra", descripcion: "Plan de siembra", plantilla: "PlanDeSiembra.xlsx", tipo: "plantilla" },
  { nombre: "IP1", descripcion: "IP1", plantilla: "ip1.pdf", tipo: "ejemplo" },
  { nombre: "IP2", descripcion: "IP2", plantilla: "ip2.pdf", tipo: "ejemplo" }
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
  accionistaFiles: Record<string, File>;
  onAccionistaFileChange: (event: React.ChangeEvent<HTMLInputElement>, accionistaId: string) => void;
  onDeleteAccionistaFile: (accionistaId: string) => void;
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
  accionistaFiles,
  onAccionistaFileChange,
  onDeleteAccionistaFile,
}: DocumentacionProps) {
  let documentosAMostrar: Documento[] = [];
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
                  <span className="text-sm">{doc.nombre}</span>
                  {uploadedFiles[doc.nombre] ? (
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
                            <p>{uploadedFiles[doc.nombre].name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-red-500"
                        onClick={() => onDeleteFile(doc.nombre)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {doc.tipo === "plantilla" ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDownloadFile(doc.nombre)}
                              >
                                <DownloadIcon className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Descargar plantilla</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : doc.tipo === "ejemplo" ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDownloadFile(doc.nombre)}
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
                            <p>{doc.descripcion}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 bg-transparent cursor-pointer"
                      >
                        <label htmlFor={`file-upload-${doc.nombre}-${index}`}>
                          <Upload className="w-4 h-4" />
                          Subir
                        </label>
                      </Button>
                      <input
                        id={`file-upload-${doc.nombre}-${index}`}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, doc.nombre)}
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
              accionistaFiles={accionistaFiles}
              onAccionistaFileChange={onAccionistaFileChange}
              onDeleteAccionistaFile={onDeleteAccionistaFile}
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
                <span className="text-sm">{doc.nombre}</span>
                {uploadedFiles[doc.nombre] ? (
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
                          <p>{uploadedFiles[doc.nombre].name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-red-500"
                      onClick={() => onDeleteFile(doc.nombre)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {doc.tipo === "plantilla" ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDownloadFile(doc.nombre)}
                            >
                              <DownloadIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Descargar plantilla</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : doc.tipo === 'ejemplo' ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDownloadFile(doc.nombre)}
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
                          <p>{doc.descripcion}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent cursor-pointer"
                    >
                      <label htmlFor={`file-upload-${doc.nombre}-${index}`}>
                        <Upload className="w-4 h-4" />
                        Subir
                      </label>
                    </Button>
                    <input
                      id={`file-upload-${doc.nombre}-${index}`}
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, doc.nombre)}
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
