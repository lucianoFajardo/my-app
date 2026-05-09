'use client';
import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Input } from "@/components/ui/input"; // Ajusta la ruta si es necesario
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { hours_array } from "../../instalation/models/form-instal-model";
import { readClientDataActionRepair } from "../actions/read-repair.action";
import { ClientResultRepairModel, RepairFormModel } from "../model/form-repair-model";
import createRepairAction from "../actions/create-form-repair-action";
import { Controller, useForm } from "react-hook-form";

// import FormRepairPage from "./form-repair";

export default function ScheduleRepairPage() {
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm<RepairFormModel>();
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<ClientResultRepairModel[]>([]);
    const [selectedClient, setSelectedClient] = useState<ClientResultRepairModel | null>(null);

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
        try {
            const { data, error } = await createRepairAction({
                client_Key: selectedClient!.id_client,
                date_repair: props.date_repair,
                hour_repair: props.hour_repair,
                notes: props.notes
            });
            if (error) {
                console.error('Error al guardar la reparación:', error);
                return;
            }
            console.log('Reparación guardada con éxito:', data);
            reset()
            setSelectedClient(null);
            return data
        } catch (error) {
            console.error('Error al guardar la reparación:', error);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <Card className="mx-auto p-6 md:p-10 m-8 space-y-max bg-white min-h-screen">
            <CardHeader className="p-0 space-y-2 pb-6 border-b border-gray-100">
                <h1 className="text-3xl font-extrabold tracking-tight text-[#0f172a]">
                    Agendar Reparación
                </h1>
                <p className="text-gray-500">
                    Busca un cliente existente para asignarle un servicio técnico.
                </p>
            </CardHeader>
            <CardContent className="">
                <div className="flex items-center space-x-3">
                    <h2 className="text-base font-bold text-blue-600">
                        Buscar Cliente Instalado
                    </h2>
                </div>
                <div className="relative ">
                    <div className="p-2 space-x-0 rounded-md border flex items-center">
                        <Input
                            type="search"
                            placeholder="Escribe el nombre o dirección del cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el string al escribir
                            className="..."
                        />
                    </div>
                </div>
                {isSearching && <p className="mt-4 text-gray-500">Buscando...</p>}
                {searchResults.length > 0 && (
                    <div className="mt-4 border rounded-md p-2 " >
                        {searchResults.map((result, index) => (
                            <div key={index} className="p-2 border-b last:border-0 hover:bg-gray-100 cursor-pointer" onClick={() => {
                                handlerSelectedClient(result)
                            }} >
                                <h3 className="font-bold text-gray-900">{result.name} {result.lastname}</h3>
                                <p className="text-sm text-gray-500">{result.antennaName}</p>
                            </div>
                        ))}
                    </div>
                )}

                {
                    // -> Aquí puedes agregar la lógica para mostrar los resultados de búsqueda o el formulario de reparación después de la búsqueda */
                    selectedClient && (
                        <div className="space-y-8 mt-6">
                            {/* Tarjeta del cliente seleccionado */}
                            <div className="flex items-center justify-between p-4 border rounded-xl bg-blue-50/50 border-blue-100">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center justify-center w-12 h-12 font-bold text-white bg-blue-600 rounded-xl">
                                        {selectedClient.name.charAt(0)}{selectedClient.lastname.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{selectedClient.name} {selectedClient.lastname}</h3>
                                        <p className="text-sm text-gray-500">{selectedClient.antennaName}</p>
                                    </div>
                                </div>
                                {/* //-> boton para poder cambiar el cliente seleccionado en caso de no ser el que se necesita */}
                                <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-100" onClick={() => { /* Aquí puedes agregar la lógica para cambiar el cliente seleccionado */ }}>
                                    Cambiar
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-3">
                                    <h2 className="text-base font-bold text-blue-600">
                                        Detalles del Servicio {selectedClient ? `para ${selectedClient.name} ${selectedClient.lastname}` : ''}
                                    </h2>
                                </div>

                                {/* Formulario */}
                                <form onSubmit={handleSubmit(handleSubmitForm)}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="date_repair" className="text-sm font-semibold text-gray-700">Fecha de Visita</Label>
                                            <Input id="date_repair" type="date" className="w-full text-gray-600" {...register("date_repair", { required: true, pattern: /^\d{4}-\d{2}-\d{2}$/ })} />
                                            {errors.date_repair && <p className="text-sm text-red-500">Por favor, ingresa una fecha válida.</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="hour_repair" className="text-sm font-semibold text-gray-700">Hora</Label>
                                            <Controller
                                                name="hour_repair"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select value={field.value}
                                                        defaultValue="hora"
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Selecciona hora" />
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
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">Descripción del Problema</Label>
                                            <Textarea
                                                id="notes"
                                                placeholder="Ej: Angular la antena y ajustar la configuración..."
                                                className="min-h-[120px] resize-none border-gray-200 bg-white"
                                                {...register("notes", { required: true })}
                                            />
                                            {errors.notes && <p className="text-sm text-red-500">Por favor, ingresa una descripción del problema.</p>}
                                        </div>
                                        <div className="flex items-center justify-end space-x-4 pt-6 md:col-span-2">
                                            {/* Es importante agregar type="button" al cancelar para que no mande el form */}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="text-gray-700 font-semibold hover:bg-gray-100"
                                                onClick={() => setSelectedClient(null)}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={isLoading}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                                            >
                                                <Save className="w-4 h-4 mr-2" />
                                                {isLoading ? "Asignando..." : "Confirmar Agenda"}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }
            </CardContent>
        </Card>
    );
}