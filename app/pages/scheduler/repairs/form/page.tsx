'use client';
import { useEffect, useState } from "react";
import { Wrench, CalendarDays, User, Search, MapPin, FileText, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input"; // Ajusta la ruta si es necesario
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { hours_array } from "../../instalation/models/form-instal-model";
import { readClientDataActionRepair } from "../actions/read-repair.action";
import { ClientResultRepairModel, RepairFormModel } from "../model/form-repair-model";
import createRepairAction from "../actions/create-form-repair-action";
import { Controller, useForm } from "react-hook-form";

export default function ScheduleRepairPage() {
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm<RepairFormModel>();
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<ClientResultRepairModel[]>([]);
    const [selectedClient, setSelectedClient] = useState<ClientResultRepairModel | null>(null);
    const [alertInfo, setAlertInfo] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        const delayResults = setTimeout(async () => {
            try {
                const { data, error } = await readClientDataActionRepair(searchTerm);
                if (!error && data) {
                    const valuesArray = Array.from(data.values());
                    setSearchResults(valuesArray);
                    setIsSearching(false);
                }
            } catch (error) {
                throw new Error(`Error al buscar clientes: ${error}`);
            }
        }, 500);
        return () => clearTimeout(delayResults);
    }, [searchTerm]);

    const handlerResetSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
        setIsSearching(false);
    }

    const handlerSelectedClient = (client: ClientResultRepairModel) => {
        setSelectedClient(client);
        handlerResetSearch();
    }

    const handleSubmitForm = async (props: RepairFormModel) => {
        setIsLoading(true);
        setAlertInfo(null);
        //* --> Formateo de la data antes de pasarsela a la fn de crear la reparacion.
        const formatDataProp = {
            client_key: selectedClient?.id_client || '', //* --> Asignar un string vacio si no se tiene el id del cliente
            date_repair: props.date_repair,
            hour_repair: props.hour_repair,
            notes: props.notes
        }

        try {
            const { data, error } = await createRepairAction(formatDataProp);
            if (error) {
                setAlertInfo({ type: 'error', message: 'Hubo un problema al crear la reparación. Inténtalo de nuevo.' });
                return;
            }
            reset()
            setSelectedClient(null);
            setAlertInfo({ type: 'success', message: 'La reparación se agendó correctamente.' });
            setTimeout(() => setAlertInfo(null), 5000); // Ocultar después de 5 segundos
            return data
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setAlertInfo({ type: 'error', message: 'Ocurrió un error inesperado.' });
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="p-4 md:p-8 w-full max-w-5xl mx-auto">
            <Card className="bg-white rounded-xl shadow-sm border-border">
                <CardHeader className="border-b pb-6 px-6 md:px-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Wrench className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold">Agendar Reparación</CardTitle>
                            <CardDescription className="text-muted-foreground mt-1">
                                Busca un cliente existente para asignarle un servicio técnico.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                    {alertInfo && (
                        <Alert 
                            variant={alertInfo.type === 'error' ? 'destructive' : 'default'} 
                            className={`mb-6 ${alertInfo.type === 'success' ? 'border-green-500 bg-green-50/50 text-green-700' : ''}`}
                        >
                            {alertInfo.type === 'success' ? (
                                <CheckCircle2 className="h-4 w-4 stroke-green-600" />
                            ) : (
                                <AlertCircle className="h-4 w-4" />
                            )}
                            <AlertTitle>{alertInfo.type === 'success' ? '¡Éxito!' : 'Error'}</AlertTitle>
                            <AlertDescription>
                                {alertInfo.message}
                            </AlertDescription>
                        </Alert>
                    )}
                    {!selectedClient ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                                <Search className="h-5 w-5 text-gray-500" />
                                <h3>Buscar Cliente Instalado</h3>
                            </div>
                            <div className="relative">
                                <div className="p-2 space-x-0 rounded-md border flex items-center">
                                    <Input
                                        type="search"
                                        placeholder="Escribe el nombre o dirección del cliente..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
                                    />
                                </div>
                            </div>
                            {isSearching && (
                                <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                                    <Spinner className="h-4 w-4" />
                                    <span>Buscando...</span>
                                </div>
                            )}
                            {searchResults.length > 0 && (
                                <div className="mt-4 border rounded-md p-2 max-h-60 overflow-y-auto" >
                                    {searchResults.map((result, index) => (
                                        <div key={index} className="p-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer rounded-sm" onClick={() => {
                                            handlerSelectedClient(result)
                                        }} >
                                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-500" />
                                                {result.name} {result.lastname}
                                            </h3>
                                            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                <MapPin className="w-3 h-3 text-gray-400" />
                                                {result.antenna_name}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-8 mt-2">
                            {/* Tarjeta del cliente seleccionado */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                                    <User className="h-5 w-5 text-gray-500" />
                                    <h3>Cliente Seleccionado</h3>
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/30">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center justify-center w-12 h-12 font-bold text-primary-foreground bg-primary rounded-xl">
                                            {selectedClient.name.charAt(0)}{selectedClient.lastname.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{selectedClient.name} {selectedClient.lastname}</h3>
                                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                                <MapPin className="w-3 h-3" />
                                                {selectedClient.antenna_name}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => setSelectedClient(null)}>
                                        Cambiar
                                    </Button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                                        <CalendarDays className="h-5 w-5 text-gray-500" />
                                        <h3>Programación del Servicio</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="date_repair">Fecha de Visita</Label>
                                            <Input id="date_repair" type="date" className="w-full" {...register("date_repair", { required: true })} />
                                            {errors.date_repair && <p className="text-xs font-medium text-destructive">Por favor, ingresa una fecha válida.</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="hour_repair">Hora</Label>
                                            <Controller
                                                name="hour_repair"
                                                control={control}
                                                rules={{ required: "Debes seleccionar una hora" }}
                                                render={({ field }) => (
                                                    <Select value={field.value}
                                                        defaultValue={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Selecciona una hora" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {hours_array.map((hour) => {
                                                                const time = `${hour.toString().padStart(2, '0')}:00`;
                                                                return (
                                                                    <SelectItem key={time} value={time}>
                                                                        {time}
                                                                    </SelectItem>
                                                                );
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.hour_repair && <span className="text-destructive text-xs font-medium">{errors.hour_repair.message}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                                        <FileText className="h-5 w-5 text-gray-500" />
                                        <h3>Detalles del Problema</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Descripción</Label>
                                        <Textarea
                                            id="notes"
                                            placeholder="Ej: Angular la antena y ajustar la configuración..."
                                            className="min-h-[120px] resize-none"
                                            {...register("notes", { required: true })}
                                        />
                                        {errors.notes && <p className="text-xs font-medium text-destructive">Por favor, ingresa una descripción del problema.</p>}
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setSelectedClient(null)}
                                        disabled={isLoading}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full md:w-auto"
                                    >
                                        {isLoading && <Spinner className="w-4 h-4 mr-2" />}
                                        {!isLoading && <Save className="w-4 h-4 mr-2" />}
                                        {isLoading ? "Asignando..." : "Confirmar Agenda"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}