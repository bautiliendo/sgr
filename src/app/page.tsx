"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Check } from "lucide-react"

type PersoneriaType = "juridica" | "fisica" | null

interface FormData {
  // Paso 1
  personeria: PersoneriaType
  nombreRazonSocial: string
  cuitCuil: string

  // Paso 2
  nombre: string
  apellido: string
  cuitCuilContacto: string
  email: string
  relacionCuenta: string
  telefono: string
}

export default function FormularioEmpresa() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    personeria: null,
    nombreRazonSocial: "",
    cuitCuil: "",
    nombre: "",
    apellido: "",
    cuitCuilContacto: "",
    email: "",
    relacionCuenta: "",
    telefono: "",
  })

  const steps = [
    { number: 1, title: "Datos de la Cuenta" },
    { number: 2, title: "Datos del Contacto" },
    { number: 3, title: "Documentación" },
  ]

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSubmit = () => {
    console.log("Formulario enviado:", formData)
    alert("Formulario enviado correctamente!")
  }

  const updateFormData = (field: keyof FormData, value: string | PersoneriaType) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleStepClick = (step: number) => {
    setCurrentStep(step)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Wizard de progreso */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                {/* Círculo del paso */}
                <div
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => handleStepClick(step.number)}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                      step.number === currentStep
                        ? "bg-green-500"
                        : step.number < currentStep
                          ? "bg-green-500"
                          : "bg-gray-300"
                    }`}
                  >
                    {step.number < currentStep ? <Check className="w-6 h-6" /> : step.number}
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-600">{step.title}</span>
                </div>

                {/* Línea conectora */}
                {index < steps.length - 1 && (
                  <div className={`w-24 h-1 mx-4 ${step.number < currentStep ? "bg-green-500" : "bg-gray-300"}`} />
                )}
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
                  <Label htmlFor="relacionCuenta" className="text-base font-medium">
                    Personería
                  </Label>
                  <Select
                    value={formData.personeria || ""}
                    onValueChange={(value) => updateFormData("personeria", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccione personería" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fisica">Física</SelectItem>
                      <SelectItem value="juridica">Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="nombreRazonSocial" className="text-base font-medium">
                    Nombre o Razón Social
                  </Label>
                  <Input
                    id="nombreRazonSocial"
                    value={formData.nombreRazonSocial}
                    onChange={(e) => updateFormData("nombreRazonSocial", e.target.value)}
                    placeholder="Ingrese nombre o razón social"
                    className="mt-1"
                  />
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
                </div>

                <div>
                  <Label htmlFor="cuitCuilContacto" className="text-base font-medium">
                    CUIT / CUIL
                  </Label>
                  <Input
                    id="cuitCuilContacto"
                    value={formData.cuitCuilContacto}
                    onChange={(e) => updateFormData("cuitCuilContacto", e.target.value)}
                    placeholder="XX-XXXXXXXX-X"
                    className="mt-1"
                  />
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
                </div>

                <div>
                  <Label htmlFor="relacionCuenta" className="text-base font-medium">
                    Relación con cuenta
                  </Label>
                  <Select
                    value={formData.relacionCuenta}
                    onValueChange={(value) => updateFormData("relacionCuenta", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccione relación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="titular">Titular</SelectItem>
                      <SelectItem value="administrativo">Administrativo</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <h3 className="text-lg font-semibold mb-4">Documentación requerida</h3>
                      <div className="space-y-3">
                        {[
                          "Manifestación de bienes de accionistas",
                          "Ventas post cierre balance",
                          "Detalle de deudas",
                          "Certificado PYME vigente",
                          "Últimos dos balances",
                        ].map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                          >
                            <span className="text-sm">{doc}</span>
                            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                              <Upload className="w-4 h-4" />
                              Subir
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Accionistas/socios */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Accionistas/Socios</h3>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-600 text-center mb-4">
                          Funcionalidad para agregar, editar y eliminar accionistas/socios
                        </p>
                        <div className="flex justify-center gap-2">
                          <Button variant="outline" size="sm">
                            Agregar
                          </Button>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="outline" size="sm">
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : formData.personeria === "fisica" ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Documentación requerida</h3>
                    <div className="space-y-3">
                      {[
                        "Certificado PYME Vigente",
                        "Constancia de CUIT",
                        "Última DDJJ ganancias",
                        "DNI propio y de su cónyuge",
                        "Formulario alta",
                        "Reseña",
                        "DDJJ de bienes personales",
                      ].map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <span className="text-sm">{doc}</span>
                          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                            <Upload className="w-4 h-4" />
                            Subir
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Por favor, complete el paso 1 para ver la documentación requerida.</p>
                  </div>
                )}
              </div>
            )}

            {/* Botones de navegación */}
            <div className="flex justify-end pt-6 border-t">
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
  )
}

