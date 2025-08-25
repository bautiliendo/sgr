"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Check } from "lucide-react";
import { step1Schema, step2Schema, step3JuridicaSchema } from "@/lib/schemas";
import { toast } from "react-toastify";
import Documentacion, {
  docsJuridica,
  docsFisica,
} from "@/components/documentacion/documentacion";

export type PersoneriaType = "juridica" | "fisica" | null;

export interface Accionista {
  id: string;
  nombre: string;
  apellido: string;
  cuitCuilAccionista: string;
  participacion: number;
}

export interface FormData {
  // Paso 1
  personeria: PersoneriaType;
  nombreRazonSocial: string;
  cuitCuil: string;

  // Paso 2
  nombre: string;
  apellido: string;
  cuitCuilContacto: string;
  email: string;
  relacionCuenta: string;
  telefono: string;

  // Paso 3
  accionistas: Accionista[];
}

const initialFormData: FormData = {
  personeria: null,
  nombreRazonSocial: "",
  cuitCuil: "",
  nombre: "",
  apellido: "",
  cuitCuilContacto: "",
  email: "",
  relacionCuenta: "",
  telefono: "",
  accionistas: [],
};

const exampleFiles: { [key: string]: string } = {
  // Jurídica
  "Certificado PYME vigente": "CERTIFICADO_PYME_2026_blur_effect.pdf",
  "DDJJ de bienes personales o manifestacion de bienes de c/ accionista":
    "manifestacion_bienes_zanel_blur_v2.pdf",
  "Ventas post cierre balance": "ventas post cierre balance.xlsx",
  "Detalle de deudas": "Deudas detalladas.xlsx",
  "Últimos dos balances certificados": "",

  // Física
  "Certificado PYME Vigente": "CERTIFICADO_PYME_2026_blur_effect.pdf",
  "Última DDJJ ganancias": "GANANCIAS 24 blurr.pdf",
  "DNI propio y de su cónyuge": "",
  "Formulario alta": "",
  "Reseña": "Breve Reseña de la Empresa.doc",
  "DDJJ de bienes personales o manifestacion de bienes":
    "DDJJ Bienes Personales 2024 blurr.pdf",
};


export default function FormularioEmpresa() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>(
    {}
  );
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const [fileError, setFileError] = useState<string | null>(null);
  const [accionistasError, setAccionistasError] = useState<string | null>(null);

  const handleSaveAccionista = (accionistaToSave: Accionista) => {
    setAccionistasError(null);
    setFormData(prev => {
      const existingAccionista = prev.accionistas.find(acc => acc.id === accionistaToSave.id);

      if (existingAccionista) {
        // Editar
        const updatedAccionistas = prev.accionistas.map(acc =>
          acc.id === accionistaToSave.id ? accionistaToSave : acc
        );
        return { ...prev, accionistas: updatedAccionistas };
      } else {
        // Crear
        return { ...prev, accionistas: [...prev.accionistas, accionistaToSave] };
      }
    });
  };

  const handleDeleteAccionista = (id: string) => {
    setAccionistasError(null);
    setFormData(prev => ({
      ...prev,
      accionistas: prev.accionistas.filter(acc => acc.id !== id)
    }));
  };

  const handleDeleteFile = (doc: string) => {
    setUploadedFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[doc];
      return newFiles;
    });
  };

  const handleDownloadFile = (docName: string): void => {
    const fileName = exampleFiles[docName];
    if (fileName) {
      const url = `/documentos-ejemplo/${fileName}`;
      window.open(url, "_blank");
    } else {
      toast.info("No hay un archivo de ejemplo disponible para este documento.");
    }
  };


  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(prevData => ({ ...prevData, ...parsedData }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const steps = [
    { number: 1, title: "Datos de la Cuenta" },
    { number: 2, title: "Datos del Contacto" },
    { number: 3, title: "Documentación" },
  ];

  const handleNext = () => {
    // 1. Determinar el esquema a usar según el paso actual
    const currentSchema = currentStep === 1 ? step1Schema : step2Schema;

    // 2. Validar los datos del formulario con el esquema
    const validationResult = currentSchema.safeParse(formData);

    // 3. Comprobar el resultado de la validación
    if (!validationResult.success) {
      // Si la validación falla, actualizamos el estado de errores
      const formattedErrors = validationResult.error.flatten().fieldErrors;
      setErrors(formattedErrors);
      return; // Detenemos la ejecución para no pasar al siguiente paso
    }

    // Si la validación es exitosa...
    setErrors({}); // Limpiamos cualquier error previo
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = () => {
    // Validación para el paso 3 (jurídica)
    if (formData.personeria === "juridica") {
      const validationResult = step3JuridicaSchema.safeParse(formData);
      if (!validationResult.success) {
        const formattedErrors = validationResult.error.flatten().fieldErrors;
        // Mostramos el error de accionistas en el estado de errores general
        setErrors(prev => ({...prev, ...formattedErrors}));
        setAccionistasError(
          formattedErrors.accionistas?.[0] || "Por favor, revise los datos de los accionistas."
        );
        return;
      }
    }


    const { personeria } = formData;
    let requiredDocs: string[] = [];

    if (personeria === "juridica") {
      requiredDocs = docsJuridica;
    } else if (personeria === "fisica") {
      requiredDocs = docsFisica;
    }

    const uploadedDocKeys = Object.keys(uploadedFiles);

    const allDocsUploaded = requiredDocs.every((doc) =>
      uploadedDocKeys.includes(doc)
    );
    if (!allDocsUploaded) {
      setFileError(
        "Por favor, suba todos los documentos requeridos antes de enviar."
      );
      return;
    }

    setFileError(null); // Limpiamos el error
    setAccionistasError(null);
    console.log("Formulario enviado:", { formData, uploadedFiles });
    toast.success("Formulario enviado correctamente!");
    localStorage.removeItem("formData");
    // Reiniciar el estado del formulario para un nuevo envío
    setFormData(initialFormData);
    setUploadedFiles({});
    setCurrentStep(1);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    docName: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFiles((prev) => ({
        ...prev,
        [docName]: file,
      }));
      if (fileError) {
        setFileError(null);
      }
    }
  };

  const updateFormData = (
    field: keyof FormData,
    value: string | PersoneriaType
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpia el error para el campo específico que se está actualizando
    if (errors[field]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Wizard de progreso */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-12">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center">
                {/* Círculo del paso */}
                <div
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => handleStepClick(step.number)}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                      step.number === currentStep
                        ? "bg-blue-500"
                        : step.number < currentStep
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {step.number < currentStep ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-600">
                    {step.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contenido del formulario */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Paso {currentStep}: {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Paso 1: Datos cuenta de empresa */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="relacionCuenta"
                    className="text-base font-medium"
                  >
                    Personería
                  </Label>
                  <Select
                    value={formData.personeria || ""}
                    onValueChange={(value) =>
                      updateFormData("personeria", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccione personería" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fisica">Física</SelectItem>
                      <SelectItem value="juridica">Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.personeria && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.personeria[0]}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="nombreRazonSocial"
                    className="text-base font-medium"
                  >
                    Nombre o Razón Social
                  </Label>
                  <Input
                    id="nombreRazonSocial"
                    value={formData.nombreRazonSocial}
                    onChange={(e) =>
                      updateFormData("nombreRazonSocial", e.target.value)
                    }
                    placeholder="Ingrese nombre o razón social"
                    className="mt-1"
                  />
                  {errors.nombreRazonSocial && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.nombreRazonSocial[0]}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cuitCuil" className="text-base font-medium">
                    CUIT / CUIL
                  </Label>
                  <Input
                    id="cuitCuil"
                    value={formData.cuitCuil}
                    onChange={(e) => updateFormData("cuitCuil", e.target.value)}
                    placeholder="XX-XXXXXXXX-X"
                    className="mt-1"
                  />
                  {errors.cuitCuil && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.cuitCuil[0]}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Paso 2: Datos de contacto */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre" className="text-base font-medium">
                    Nombre
                  </Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => updateFormData("nombre", e.target.value)}
                    placeholder="Ingrese nombre"
                    className="mt-1"
                  />
                  {errors.nombre && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.nombre[0]}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="apellido" className="text-base font-medium">
                    Apellido
                  </Label>
                  <Input
                    id="apellido"
                    value={formData.apellido}
                    onChange={(e) => updateFormData("apellido", e.target.value)}
                    placeholder="Ingrese apellido"
                    className="mt-1"
                  />
                  {errors.apellido && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.apellido[0]}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="cuitCuilContacto"
                    className="text-base font-medium"
                  >
                    CUIT / CUIL
                  </Label>
                  <Input
                    id="cuitCuilContacto"
                    value={formData.cuitCuilContacto}
                    onChange={(e) =>
                      updateFormData("cuitCuilContacto", e.target.value)
                    }
                    placeholder="XX-XXXXXXXX-X"
                    className="mt-1"
                  />
                  {errors.cuitCuilContacto && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.cuitCuilContacto[0]}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-base font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="mt-1"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.email[0]}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="relacionCuenta"
                    className="text-base font-medium"
                  >
                    Relación con cuenta
                  </Label>
                  <Select
                    value={formData.relacionCuenta}
                    onValueChange={(value) =>
                      updateFormData("relacionCuenta", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccione relación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="titular">Titular</SelectItem>
                      <SelectItem value="administrativo">
                        Administrativo
                      </SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.relacionCuenta && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.relacionCuenta[0]}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="telefono" className="text-base font-medium">
                    Teléfono
                  </Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => updateFormData("telefono", e.target.value)}
                    placeholder="+54 11 XXXX-XXXX"
                    className="mt-1"
                  />
                  {errors.telefono && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.telefono[0]}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Paso 3: Documentación */}
            {currentStep === 3 && (
              <Documentacion
                personeria={formData.personeria}
                accionistas={formData.accionistas}
                uploadedFiles={uploadedFiles}
                handleFileChange={handleFileChange}
                onSaveAccionista={handleSaveAccionista}
                onDeleteAccionista={handleDeleteAccionista}
                accionistasError={accionistasError}
                onDeleteFile={handleDeleteFile}
                onDownloadFile={handleDownloadFile}
              />
            )}

            {/* Párrafo de error para la subida de archivos */}
            {currentStep === 3 && fileError && (
              <div className="text-left">
                <p className="text-sm text-red-600">{fileError}</p>
              </div>
            )}

            {/* Botones de navegación */}
            <div className="flex justify-end pt-6 border-t">
              {currentStep !== 1 && (
                <Button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="mr-2"
                >
                  Anterior
                </Button>
              )}
              {currentStep < 3 ? (
                <Button onClick={handleNext} className="">
                  Siguiente
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="">
                  Enviar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
