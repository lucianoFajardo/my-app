"use client"
import { useForm } from "react-hook-form"
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MapPin, CheckCircle2, AlertCircle, UserPlus, Calendar as CalendarIcon, User, Signal, Map, StickyNote } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { ClienteModel } from "../models/client-model"
import { createClientNetworkAction } from "../actions/create-client-action"
import { formatDateRangeAction } from "../actions/format-date-range-action"
import { paymentMethods, plans, rangePaymentDates, sectors } from "../models/select-drops-data-model"
import { Separator } from "@/components/ui/separator"

export default function ClienteFormPage() {
    const { register, handleSubmit, setValue, formState: { errors }, reset, } = useForm<ClienteModel>()
    const [loadingLocation, setLoadingLocation] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isOpenCreated, setIsOpenCreated] = useState(false)
    const [isErrorCreated, setIsErrorCreated] = useState(false)
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 5),
    })

    const onSubmit = (data: ClienteModel) => {
        setIsSubmitting(true)
        const startDate = dateRange?.from || new Date()
        const initialPaymentStr = format(startDate, 'yyyy-MM-dd')
        const nextMonth = new Date(startDate)
        nextMonth.setMonth(startDate.getMonth() + 1)
        const nextMonthStr = format(nextMonth, 'yyyy-MM-dd')
        const paymentDateRange = data.initial_payment
        if (data.initial_payment) {
            data.initial_payment = formatDateRangeAction(data.initial_payment)
        }
        createClientNetworkAction({
            ...data,
            range_payment: paymentDateRange,
            initial_payment: initialPaymentStr, //--> Fecha del primer pago (dia de la instalación)
            paid_until_date: nextMonthStr //--> Fecha del siguiente pago(1 mes despues de la instalación)
        }).then(() => {
            setIsOpenCreated(true)
            reset()
            setIsSubmitting(false)
            setTimeout(() => setIsOpenCreated(false), 3000)
        }).catch((error) => {
            setIsErrorCreated(true)
            setIsSubmitting(false)
            setTimeout(() => setIsErrorCreated(false), 3000)
            console.error(error)
        })
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
        <div className="container mx-auto py-3 px-2 md:px-0">
            <Card className="w-full max-w-4xl mx-auto border-border bg-card shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="bg-muted/30 pb-6 pt-5 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <UserPlus className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight">Registro de Instalación</CardTitle>
                            <CardDescription className="text-muted-foreground mt-0.5 text-sm">
                                Ingresa la información del cliente para programar la nueva red.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-6 px-6 sm:px-8 pb-8">
                    {/* Alertas dinámicas */}
                    <div className="space-y-4 mb-6">
                        {isOpenCreated && (
                            <Alert className="bg-emerald-50 text-emerald-900 border-emerald-200 shadow-sm animate-in fade-in slide-in-from-top-4 py-3">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                <AlertTitle className="font-semibold text-emerald-800 text-sm">¡Creado con éxito!</AlertTitle>
                                <AlertDescription className="text-emerald-700 text-xs mt-1">El cliente ha sido registrado correctamente.</AlertDescription>
                            </Alert>
                        )}
                        {isErrorCreated && (
                            <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-4 py-3">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle className="text-sm">¡Error al crear!</AlertTitle>
                                <AlertDescription className="text-xs mt-1">Hubo un problema al registrar el cliente. Inténtalo de nuevo.</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* 1. Datos Personales */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-foreground">
                                <User className="h-4 w-4 text-primary" />
                                <h3 className="font-semibold text-sm">Datos Personales</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">Nombre</Label>
                                    <Input id="name" placeholder="Ej. Juan" className="bg-background h-9 text-sm" {...register("name", { required: true, pattern: /^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]+$/ })} />
                                    {errors.name && <span className="text-destructive text-[10px] font-medium">Requerido</span>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="lastname" className="text-xs font-medium text-muted-foreground">Apellido</Label>
                                    <Input id="lastname" placeholder="Ej. Pérez" className="bg-background h-9 text-sm" {...register("lastname", { required: true, pattern: /^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]+$/ })} />
                                    {errors.lastname && <span className="text-destructive text-[10px] font-medium">Requerido</span>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone1" className="text-xs font-medium text-muted-foreground">Teléfono Principal</Label>
                                    <Input id="phone1" placeholder="Ej. 987654321" inputMode="numeric" className="bg-background h-9 text-sm" {...register("phone1", { required: true, pattern: /^[0-9]+$/, maxLength: 9 })} />
                                    {errors.phone1 && <span className="text-destructive text-[10px] font-medium">{errors.phone1.type === "pattern" ? "Solo números" : "Requerido"}</span>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone2" className="text-xs font-medium text-muted-foreground">Teléfono Secundario (Opcional)</Label>
                                    <Input id="phone2" placeholder="Ej. 11111111" inputMode="numeric" className="bg-background h-9 text-sm" {...register("phone2", { pattern: /^[0-9]+$/, maxLength: 9 })} />
                                    {errors.phone2 && <span className="text-destructive text-[10px] font-medium">{errors.phone2.type === "pattern" ? "Solo números" : ""}</span>}
                                </div>
                            </div>
                        </div>
                        <Separator className="bg-border/60" />
                        {/* 2. Datos del Servicio */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-foreground">
                                <Signal className="h-4 w-4 text-primary" />
                                <h3 className="font-semibold text-sm">Datos del Servicio</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="antenna_name" className="text-xs font-medium text-muted-foreground">Nombre Antena</Label>
                                    <Input id="antenna_name" placeholder="Identificador" className="bg-background h-9 text-sm" {...register("antenna_name", { required: true })} />
                                    {errors.antenna_name && <span className="text-destructive text-[10px] font-medium">Requerido</span>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="sector" className="text-xs font-medium text-muted-foreground">Sector</Label>
                                    <Select onValueChange={(value) => setValue("sector", value)}>
                                        <SelectTrigger className="w-full bg-background h-9 text-sm">
                                            <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sectors.map(sect => (
                                                <SelectItem key={sect.value} value={sect.value} className="text-sm">{sect.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="plan" className="text-xs font-medium text-muted-foreground">Costo Plan</Label>
                                    <Select onValueChange={(value) => setValue("plan", value)}>
                                        <SelectTrigger className="w-full bg-background h-9 text-sm">
                                            <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {plans.map(plan => (
                                                <SelectItem key={plan.value} value={plan.value} className="text-sm">{plan.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="payment_method" className="text-xs font-medium text-muted-foreground">Método de Pago</Label>
                                    <Select onValueChange={(value) => setValue("payment_method", value)}>
                                        <SelectTrigger className="w-full bg-background h-9 text-sm">
                                            <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {paymentMethods.map(method => (
                                                <SelectItem key={method.value} value={method.value} className="text-sm">{method.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="initial_payment" className="text-xs font-medium text-muted-foreground">Rango Días de Pago</Label>
                                    <Select onValueChange={(value) => setValue("initial_payment", value)}>
                                        <SelectTrigger className="w-full bg-background h-9 text-sm">
                                            <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rangePaymentDates.map(range => (
                                                <SelectItem key={range.value} value={range.value} className="text-sm">{range.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.initial_payment && <span className="text-destructive text-[10px] font-medium">Requerido</span>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="technical_name" className="text-xs font-medium text-muted-foreground">Técnico Asignado</Label>
                                    <Input id="technical_name" placeholder="Nombre completo" className="w-full bg-background h-9 text-sm" {...register("technical_name", { required: true, pattern: /^[A-Za-z0-9 ]+$/ })} />
                                    {errors.technical_name && <span className="text-destructive text-[10px] font-medium">Requerido</span>}
                                </div>

                                {/* Rango de Instalación Programado */}
                                <div className="space-y-1.5 sm:col-span-2 mt-1">
                                    <Label className="text-xs font-medium text-muted-foreground">Rango de Instalación Programado (5 días)</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="date"
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal bg-background h-9 text-sm",
                                                    !dateRange && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                                                {dateRange?.from ? (
                                                    dateRange.to ? (
                                                        <>
                                                            {format(dateRange.from, "MMM dd, y", { locale: es })} -{" "}
                                                            {format(dateRange.to, "MMM dd, y", { locale: es })}
                                                        </>
                                                    ) : (
                                                        format(dateRange.from, "MMM dd, y", { locale: es })
                                                    )
                                                ) : (
                                                    <span>Selecciona fechas de instalación</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                initialFocus
                                                mode="range"
                                                defaultMonth={dateRange?.from}
                                                selected={dateRange}
                                                onSelect={setDateRange}
                                                numberOfMonths={2}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                        <Separator className="bg-border/60" />
                        {/* 3. Sección de Ubicación */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-foreground">
                                <Map className="h-4 w-4 text-primary" />
                                <h3 className="font-semibold text-sm">Coordenadas</h3>
                            </div>
                            <div className="p-4 border border-border/60 rounded-lg bg-muted/10">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="latitude" className="text-[11px] uppercase tracking-wider text-muted-foreground">Latitud</Label>
                                        <Input id="latitude" className="bg-background/50 h-8 text-xs font-mono" {...register("latitude", { required: true, pattern: /^-?\d+(\.\d+)?$/ })} />
                                        {errors.latitude && <span className="text-red-500 text-[10px]">Requerido</span>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="longitude" className="text-[11px] uppercase tracking-wider text-muted-foreground">Longitud</Label>
                                        <Input id="longitude" className="bg-background/50 h-8 text-xs font-mono" {...register("longitude", { required: true, pattern: /^-?\d+(\.\d+)?$/ })} />
                                        {errors.longitude && <span className="text-red-500 text-[10px]">Requerido</span>}
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={getLocation}
                                    disabled={loadingLocation}
                                    className="w-full sm:w-auto h-8 text-xs"
                                >
                                    <MapPin className="mr-2 h-3.5 w-3.5" />
                                    {loadingLocation ? "Obteniendo..." : "Obtener ubicación actual"}
                                </Button>
                            </div>
                        </div>
                        {/* 4. Observaciones */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-foreground mb-1">
                                <StickyNote className="h-4 w-4 text-primary" />
                                <Label htmlFor="observations" className="text-sm font-semibold">Observaciones</Label>
                            </div>
                            <Textarea
                                id="observations"
                                className="min-h-80px text-sm resize-none bg-background border-border/60 focus-visible:ring-primary/20"
                                placeholder="Añade notas o detalles importantes aquí..."
                                {...register("observations")}
                            />
                        </div>
                        {/* Submit Button */}
                        <div className="pt-4 flex justify-end">
                            <Button
                                type="submit"
                                className="w-full sm:w-auto sm:min-w-[180px] h-10 shadow-sm"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Registrando..." : "Registrar Cliente"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}