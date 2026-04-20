"use client"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Inspect } from "lucide-react"
import { ClienteModel } from "../models/client-model"
import { createClientNetworkAction } from "../actions/create-client-action"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { formatDateRangeAction } from "../actions/format-date-range-action"
import { paymentMethods, plans, rangePaymentDates, sectors } from "../models/select-drops-data-model"


export default function ClienteFormPage() {
    const { register, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm<ClienteModel>()
    const [loadingLocation, setLoadingLocation] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpenCreated, setIsOpenCreated] = useState(false);
    const [isErrorCreated, setIsErrorCreated] = useState(false);
    const pago = watch("initialPayment"); 
    const onSubmit = (data: ClienteModel) => {
        setIsSubmitting(true);
        const paymentDateRange = data.initialPayment;
        if (data.initialPayment) {
            data.initialPayment = formatDateRangeAction(data.initialPayment);
        }
        createClientNetworkAction({ ...data, range_payment: paymentDateRange }).then(() => {
            console.log(pago);
            setIsOpenCreated(true);
            reset();
            setIsSubmitting(false);
            setTimeout(() => setIsOpenCreated(false), 3000);
        }).catch((error) => {
            setIsErrorCreated(true);
            setTimeout(() => setIsErrorCreated(false), 3000);
            throw error;
        });
    }

    const getLocation = () => {
        setLoadingLocation(true)
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setValue("latitude", position.coords.latitude.toString())
                    setValue("longitude", position.coords.longitude.toString())
                    setLoadingLocation(false)
                },
                (error) => {
                    alert("No se pudo obtener la ubicación: " + error.message)
                    setLoadingLocation(false)
                }
            )
        } else {
            alert("La geolocalización no está disponible en este navegador.")
            setLoadingLocation(false)
        }
    }

    return (
        <Card className="z-1 flex flex-col gap-4 p-6 w-full max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow">
            <CardHeader className="">
                <CardTitle>Datos de instalación</CardTitle>
                <CardDescription>Solicita todos los datos necesarios para registrar la instalacion y verifica que sean correctos</CardDescription>
                <CardAction>
                    <Inspect className="h-6 w-6 text-gray-600" />
                </CardAction>
            </CardHeader>
            <CardContent>
                {/* ALERTA DE ÉXITO QUE SE DESPLIEGA SI ESTA TODO CORRECTO AL CREAR*/}
                {isOpenCreated && (
                    <Alert className="mb-4 bg-green-100 border-green-400 text-green-800">
                        <AlertTitle>¡Creado con éxito!</AlertTitle>
                        <AlertDescription>El cliente ha sido registrado correctamente.</AlertDescription>
                    </Alert>
                )}
                {/* ALERTA DE ERROR QUE SE DESPLIEGA SI HAY UN PROBLEMA AL CREAR*/}
                {isErrorCreated && (
                    <Alert className="mb-4 bg-red-100 border-red-400 text-red-800">
                        <AlertTitle>¡Error al crear!</AlertTitle>
                        <AlertDescription>Hubo un problema al registrar el cliente.</AlertDescription>
                    </Alert>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-xl shadow">
                    <div className="grid grid-cols-5 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Nombre</Label>
                            <Input id="name" {...register("name", { required: true, pattern: /^[A-Za-z0-9 ]+$/ })} />
                            {errors.name && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                        </div>
                        <div>
                            <Label htmlFor="lastname">Apellido</Label>
                            <Input id="lastname" {...register("lastname", { required: true, pattern: /^[A-Za-z0-9 ]+$/ })} />
                            {errors.lastname && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                        </div>
                        <div>
                            <Label htmlFor="antennaName">Nombre Antena</Label>
                            <Input id="antennaName" {...register("antennaName", { required: true, pattern: /^[A-Za-z0-9 ]+$/ })} />
                            {errors.antennaName && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                        </div>
                        <div>
                            <Label htmlFor="sector">Sector</Label>
                            <Select onValueChange={(value) => setValue("sector", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un sector" />
                                </SelectTrigger>
                                <SelectContent className="bg-purple-50">
                                    {sectors.map(sect => (
                                        <SelectItem key={sect.value} value={sect.value}>{sect.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.plan && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                        </div>
                        <div>
                            <Label htmlFor="initialPayment">Rango de Fecha de Pago</Label>
                            <Select onValueChange={(value) => setValue("initialPayment", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un rango de fecha" />
                                </SelectTrigger>
                                <SelectContent className="bg-purple-50">
                                    {rangePaymentDates.map(range => (
                                        <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.initialPayment && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                        </div>
                        <div>
                            <Label htmlFor="plan">Plan</Label>
                            <Select onValueChange={(value) => setValue("plan", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un plan" />
                                </SelectTrigger>
                                <SelectContent className="bg-purple-50">
                                    {plans.map(plan => (
                                        <SelectItem key={plan.value} value={plan.value}>{plan.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.plan && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                        </div>
                        <div>
                            <Label htmlFor="nombreTecnico">Nombre Técnico</Label>
                            <Input id="nombreTecnico" {...register("technicalName", { required: true, pattern: /^[A-Za-z0-9 ]+$/ })} />
                            {errors.technicalName && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                        </div>
                        <div>
                            <Label htmlFor="phone1">Teléfono 1</Label>
                            <Input id="phone1" inputMode="numeric"  {...register("phone1", { required: true, pattern: /^[0-9]+$/, maxLength: 9 })} />
                            {errors.phone1 && <span className="text-red-500 text-xs">Este campo es requerido</span> && <span className="text-red-500 text-xs">{errors.phone1.type === "pattern" ? "Formato inválido porfavor ingresar numeros" : ""}</span>}
                        </div>
                        <div>
                            <Label htmlFor="phone2">Teléfono 2</Label>
                            <Input id="phone2" inputMode="numeric" {...register("phone2", { pattern: /^[0-9]+$/, maxLength: 9 })} />
                            {errors.phone2 && <span className="text-red-500 text-xs">Este campo es requerido</span> && <span className="text-red-500 text-xs">{errors.phone2.type === "pattern" ? "Formato inválido porfavor ingresar numeros" : ""}</span>}
                        </div>
                        <div>
                            <Label htmlFor="paymentMethod">Método de Pago</Label>
                            <Select onValueChange={(value) => setValue("paymentMethod", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona método de pago" />
                                </SelectTrigger>
                                <SelectContent className="bg-purple-50">
                                    {paymentMethods.map(method => (
                                        <SelectItem key={method.value} value={method.value}>{method.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Campos de ubicación GPS */}
                        <div>
                            <Label htmlFor="latitude">Latitud</Label>
                            <Input id="latitude" disabled {...register("latitude", { required: true, pattern: /^-?\d+(\.\d+)?$/ })} />
                            {errors.latitude && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                        </div>
                        <div>
                            <Label htmlFor="longitude">Longitud</Label>
                            <Input id="longitude" disabled {...register("longitude", { required: true, pattern: /^-?\d+(\.\d+)?$/ })} />
                            {errors.longitude && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                        </div>
                        <div className="flex items-end">
                            <Button
                                type="button"
                                onClick={getLocation}
                                disabled={loadingLocation}
                                className="w-full"
                            >
                                {loadingLocation ? "Obteniendo..." : "Obtener ubicación actual"}
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="observations">Observaciones</Label>
                        <Textarea id="observations" {...register("observations")} />
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Registrando..." : "Registrar Cliente"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter>
                <p>Al momento de registrar los datos se almacenaran en la base de datos y podran ser editados.</p>
            </CardFooter>
        </Card>
    )
}