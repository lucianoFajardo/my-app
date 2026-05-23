"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye, Pencil, Search, Trash, Users, Signal, Calendar, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import readClientDataAction from "../actions/read-client-data-action";
import { ClienteModel } from "../models/client-model";
import { CardEditCliente } from "./dialog-edit";
import { DialogDeleteCliente } from "../delete/dialog-delete";
import ShowDataPageClient from "../show-data/show-data-page";
import { Input } from "@/components/ui/input";

export default function EditDateClientPage() {
    const [dataClient, setDataClient] = useState<ClienteModel[]>([]);
    const [isOpenDialogEdit, setIsOpenDialogEdit] = useState(false);
    const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);
    const [clientSelectedDelete, setClientSelectedDelete] = useState<ClienteModel>();

    const [clientSelectedShowData, setClientSelectedShowData] = useState<ClienteModel>();
    const [isOpenDialogShowData, setIsOpenDialogShowData] = useState(false);

    const [_, setSelectDataID] = useState('');
    const [clientSelectedDate, setClientSelectedDate] = useState<ClienteModel>();

    // Parametros para la busqueda y filtrado de los datos
    const [searchParam, setSearchParam] = useState<string | undefined>("");

    // Paginación de la tabla de clientes
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true); // Cambiado a true inicial
    const limit = 15;


    useEffect(() => {
        const fetchData = async () => {
            const from = page * limit
            const to = from + limit - 1;
            const data = await readClientDataAction({ from, to, searchParam });
            setDataClient(data);
            setLoading(false);
        };
        const timeOutId = setTimeout(() => {
            fetchData();
        }, 300);
        return () => clearTimeout(timeOutId);
    }, [page, searchParam]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParam(e.target.value);
        setPage(0); // Reiniciar a la primera página al buscar
    }

    const handelEditClick = (idClient: string) => {
        setSelectDataID(idClient);
        setIsOpenDialogEdit(true);
        if (dataClient) {
            const cliente = dataClient.find((client) => client.id_client === idClient);
            setClientSelectedDate(cliente);
        } else {
            setClientSelectedDate(undefined);
            setIsOpenDialogEdit(false);
        }
    }

    const handeleDeleteClick = (idClient: string) => {
        setSelectDataID(idClient);
        setIsOpenDialogDelete(true);
        if (dataClient) {
            const cliente = dataClient.find((client) => client.id_client === idClient);
            setClientSelectedDelete(cliente);
        } else {
            setClientSelectedDelete(undefined);
            setIsOpenDialogDelete(false);
        }
    }

    const handleEditSubmit = (updatedClient: ClienteModel) => {
        setDataClient((prev) =>
            prev.map((client) =>
                client.id_client === updatedClient.id_client ? updatedClient : client
            )
        );
        setIsOpenDialogEdit(false);
    };

    const handleDeleteSubmit = (deletedClient: ClienteModel) => {
        setDataClient((prev) =>
            prev.filter((client) => client.id_client !== deletedClient.id_client)
        );
        setIsOpenDialogDelete(false);
    };

    const handleNextPage = () => {
        setPage(prevPage => prevPage + 1);
    }

    const handelePreviousPage = () => {
        setPage(page > 0 ? page - 1 : 0)
    }

    if (loading) {
        return (
            <div className="flex w-full h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></span>
                    <span className="text-muted-foreground font-medium text-sm animate-pulse">Cargando datos...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 px-4 md:px-0">
            <Card className="w-full mx-auto border-border bg-card shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="bg-muted/30 pb-6 pt-5 border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold tracking-tight">Directorio de Clientes</CardTitle>
                                <CardDescription className="text-muted-foreground mt-0.5 text-sm">
                                    Busca, edita o elimina la información de tus clientes registrados.
                                </CardDescription>
                            </div>
                        </div>
                        <div className="relative w-full sm:w-64 md:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar cliente..."
                                value={searchParam}
                                onChange={handleSearch}
                                className="pl-9 bg-background h-9 text-sm border-border/60 focus-visible:ring-primary/20 shadow-sm"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="max-h-[60vh] overflow-y-auto">
                        <Table className="w-full">
                            <TableHeader className="bg-muted/40 sticky top-0 z-10 hidden sm:table-header-group">
                                <TableRow className="border-b border-border/60 hover:bg-transparent">
                                    <TableHead className="font-semibold text-foreground h-11">
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-3.5 h-3.5 text-muted-foreground" />
                                            Nombre
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold text-foreground h-11">
                                        <div className="flex items-center gap-1.5">
                                            <Signal className="w-3.5 h-3.5 text-muted-foreground" />
                                            Antena
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold text-foreground h-11">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                            Plan
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold text-foreground h-11">Ciclo Pago</TableHead>
                                    <TableHead className="font-semibold text-foreground h-11">
                                        <div className="flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                            Contactos
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold text-foreground h-11 text-center">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dataClient.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            No hay datos de clientes registrados para mostrar.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {dataClient.map((usuario) => (
                                    <TableRow
                                        key={usuario.id_client}
                                        className="hover:bg-muted/30 border-b border-border/60 transition-colors"
                                    >
                                        <TableCell className="font-medium text-sm text-foreground">
                                            {usuario.name} {usuario.lastname}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{usuario.antenna_name}</TableCell>
                                        <TableCell>
                                            <span className="px-2 py-0.5 rounded-md border border-primary/20 bg-primary/5 text-primary text-xs font-semibold">
                                                $ {usuario.plan}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="px-2 py-0.5 rounded-md border bg-muted/40 text-foreground text-xs font-medium">
                                                {usuario.range_payment}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1.5">
                                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-blue-200 bg-blue-50 text-blue-700">
                                                    {usuario.phone1}
                                                </span>
                                                {usuario.phone2 && (
                                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-purple-200 bg-purple-50 text-purple-700">
                                                        {usuario.phone2}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    onClick={() => handelEditClick(usuario.id_client)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 text-xs bg-background shadow-sm hover:bg-muted"
                                                >
                                                    <Pencil className="w-3.5 h-3.5 mr-1" /> Editar
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        setClientSelectedShowData(usuario);
                                                        setIsOpenDialogShowData(true);
                                                    }}
                                                    variant="secondary"
                                                    size="sm"
                                                    className="h-8 text-xs bg-primary/10 text-primary hover:bg-primary/20 shadow-sm"
                                                >
                                                    <Eye className="w-3.5 h-3.5 mr-1" /> Detalles
                                                </Button>
                                                <Button
                                                    onClick={() => handeleDeleteClick(usuario.id_client)}
                                                    variant="destructive"
                                                    size="sm"
                                                    className="h-8 text-xs shadow-sm bg-destructive/10 text-destructive border-transparent hover:bg-destructive hover:text-white"
                                                >
                                                    <Trash className="w-3.5 h-3.5 mr-1" /> Borrar
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>

                {/* Footer Paginación */}
                <CardFooter className="py-4 px-6 bg-muted/20 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground font-medium">
                        Página Actual {page + 1}
                    </span>
                    <div className="flex items-center gap-1 bg-background rounded-md border shadow-sm">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handelePreviousPage}
                            disabled={page === 0}
                            className="h-8 w-8 rounded-r-none hover:bg-muted"
                        >
                            <ChevronLeft className="w-4 h-4 text-foreground" />
                        </Button>
                        <div className="w-[1px] h-4 bg-border"></div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNextPage}
                            disabled={dataClient.length < (limit * (page + 1))}
                            className="h-8 w-8 rounded-l-none hover:bg-muted"
                        >
                            <ChevronRight className="w-4 h-4 text-foreground" />
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            {isOpenDialogEdit && clientSelectedDate && (
                <CardEditCliente
                    cliente={clientSelectedDate}
                    isOpen={isOpenDialogEdit}
                    onCancel={() => setIsOpenDialogEdit(false)}
                    onSubmit={handleEditSubmit}
                />
            )}
            {isOpenDialogDelete && clientSelectedDelete && (
                <DialogDeleteCliente
                    cliente={clientSelectedDelete}
                    isOpen={isOpenDialogDelete}
                    onCancel={() => setIsOpenDialogDelete(false)}
                    onSubmit={handleDeleteSubmit}
                />
            )}
            {isOpenDialogShowData && clientSelectedShowData && (
                <ShowDataPageClient
                    props={clientSelectedShowData}
                    isOpen={isOpenDialogShowData}
                    onClose={() => setIsOpenDialogShowData(false)}
                />
            )}

        </div>
    );
}