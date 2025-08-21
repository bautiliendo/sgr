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
import { Upload, Check, FileQuestionMarkIcon, Pencil, Trash2 } from "lucide-react";
import { step1Schema, step2Schema } from "@/lib/schemas";
import { toast } from "react-toastify";
import Accionistas from "@/components/accionistas/accionistas";

type PersoneriaType = "juridica" | "fisica" | null;

interface FormData {
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
};

export default function FormularioEmpresa() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>(
    {}
  );
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
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

  const docsJuridica = [
    "Certificado PYME vigente",
    "DDJJ de bienes personales o manifestacion de bienes de c/ accionista",
    "Ventas post cierre balance",
    "Detalle de deudas",
    "Últimos dos balances certificados",
  ];

  const docsFisica = [
    "Certificado PYME Vigente",
    "Constancia de CUIT",
    "Última DDJJ ganancias",
    "DNI propio y de su cónyuge",
    "Formulario alta",
    "Reseña",
    "DDJJ de bienes personales o manifestacion de bienes",
  ];

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
              <div>
                {formData.personeria === "juridica" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Documentación requerida */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Documentación requerida
                      </h3>
                      <div className="space-y-3">
                        {docsJuridica.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                          >
                            <span className="text-sm">{doc}</span>
                            {uploadedFiles[doc] ? (
                                <div className="flex gap-1">
                                <div className="flex items-center gap-2 text-sm font-medium text-green-700" title={uploadedFiles[doc].name}>
                                  <Check className="w-5 h-5" />
                                  <span className="hidden group-hover:inline">{uploadedFiles[doc].name}</span>
                                </div>
                                  <Button variant="ghost" size="icon">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <FileQuestionMarkIcon className="w-4 h-4" />
                                <Button
                                  asChild
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2 bg-transparent cursor-pointer"
                                >
                                  <label
                                    htmlFor={`file-upload-${doc}-${index}`}
                                  >
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
                    <Accionistas />
                  </div>
                ) : formData.personeria === "fisica" ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Documentación requerida
                    </h3>
                    <div className="space-y-3">
                      {docsFisica.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <span className="text-sm">{doc}</span>
                          {uploadedFiles[doc] ? (
                              <div className="flex gap-1">
                              <div className="flex items-center gap-2 text-sm font-medium text-green-700" title={uploadedFiles[doc].name}>
                                <Check className="w-5 h-5" />
                                <span className="hidden group-hover:inline">{uploadedFiles[doc].name}</span>
                              </div>
                                <Button variant="ghost" size="icon">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <FileQuestionMarkIcon className="w-4 h-4" />
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
                      Por favor, complete el paso 1 para ver la documentación
                      requerida.
                    </p>
                  </div>
                )}
              </div>
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
