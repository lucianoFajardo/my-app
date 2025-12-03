"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, CardAction } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import readClientDataAction from "../actions/read-client-data-action";
import { ClienteModel } from "../models/client-model";
import { CardEditCliente } from "./dialog-edit";
import { DialogDeleteCliente } from "../delete/dialog-delete";
import ShowDataPageClient from "../show-data/show-data-page";

export default function EditDateClientPage() {
    const [dataClient, setDataClient] = useState<ClienteModel[]>([]);
    const [isOpenDialogEdit, setIsOpenDialogEdit] = useState(false);
    const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);
    const [clientSelectedDelete, setClientSelectedDelete] = useState<ClienteModel>();

    const [clientSelectedShowData, setClientSelectedShowData] = useState<ClienteModel>();
    const [isOpenDialogShowData, setIsOpenDialogShowData] = useState(false);

    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [_, setSelectDataID] = useState('');
    const [clientSelectedDate, setClientSelectedDate] = useState<ClienteModel>();
    const limit = 15;

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const from = page * limit
            const to = from + limit - 1;
            const data = await readClientDataAction({ from, to });
            setDataClient((prevData) => [...prevData, ...data]);
            setLoading(false);
        };
        fetchData();
    }, [page]);

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></span>
                <span className="ml-4 text-primary-700 font-semibold">Cargando...</span>
            </div>
        );
    }

    return (
        <div className="mt-8 w-full p-2 mx-auto">
            <Card className="shadow-xl border border-primary-100">
                <CardHeader className="bg-primary-50 rounded-t-xl shadow-sm">
                    <CardTitle className="text-2xl text-primary-700">Editar Cliente</CardTitle>
                    <CardDescription className="text-primary-500">
                        Aquí podrás editar la información de los clientes registrados.
                    </CardDescription>
                    <CardAction>
                        <Button variant="ghost" className="text-primary-700 hover:bg-primary-100">
                            Total Clientes Instalados: {dataClient.length}
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent className="overflow-x-auto p-0">
                    <div className="max-h-[60vh] overflow-y-auto">
                        <Table className="rounded-xl bg-white">
                            <TableHeader className="bg-primary-100 sticky top-0 z-10">
                                <TableRow>
                                    <TableHead className="text-primary-700">
                                        <span>
                                            👤
                                        </span>
                                        Nombre
                                    </TableHead>
                                    <TableHead className="text-primary-700">
                                        <span>
                                            📡
                                        </span>
                                        Antena
                                    </TableHead>
                                    <TableHead className="text-primary-700">
                                        <span>
                                            🗓️
                                        </span>
                                        Plan
                                    </TableHead>
                                    <TableHead className="text-primary-700">Fechas de pago</TableHead>
                                    <TableHead className="text-primary-700">
                                        <span className="mr-2">
                                            📞
                                        </span>
                                        Contactos
                                    </TableHead>
                                    <TableHead className="text-primary-700 text-center">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dataClient.map((usuario, idx) => (
                                    <TableRow
                                        key={usuario.id_client}
                                        className={`transition ${idx % 2 === 0 ? "bg-white" : "bg-primary-50"} hover:bg-primary-100`}
                                    >
                                        <TableCell>{usuario.name}</TableCell>
                                        <TableCell>{usuario.antennaName}</TableCell>
                                        <TableCell>
                                            <span className="px-2 py-1 rounded bg-primary-50 text-primary-700 text-xs">$ {usuario.plan}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="px-2 py-1 rounded bg-primary-50 text-primary-700 text-xs font-bold">{usuario.range_payment}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="m-2 px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                                                {usuario.phone1}
                                            </span>
                                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                                                {usuario.phone2}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center flex items-center justify-center gap-2">
                                            <Button
                                                onClick={() => handelEditClick(usuario.id_client)}
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-2 border-primary-300 text-white hover:bg-primary-50"
                                            >
                                                <Pencil className="w-4 h-4" />
                                                Editar
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setClientSelectedShowData(usuario);
                                                    setIsOpenDialogShowData(true);
                                                }}
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-2 border-primary-300 text-white hover:bg-primary-50"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Ver Detalles
                                            </Button>
                                            <Button
                                                onClick={() => handeleDeleteClick(usuario.id_client)}
                                                variant="destructive"
                                                size="sm"
                                                className="flex items-center gap-2 ml-2"
                                            >
                                                <Trash className="w-4 h-4" />
                                                Eliminar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {/* <Button
                        onClick={() => setPage((prevPage) => prevPage + 1)}
                        disabled={loading}
                        className="mt-4 w-full"
                        variant="secondary"
                    >
                        {loading ? 'Cargando...' : 'Cargar más'}
                    </Button> */}
                </CardContent>
                <CardFooter className="bg-primary-50 rounded-b-xl max-w-sm mx-auto">
                    
                    <Button
                        onClick={() => setPage((prevPage) => prevPage + 1)}
                        disabled={loading}
                        className="mt-4 w-full"
                        variant="secondary"
                    >
                        {loading ? 'Cargando...' : 'Cargar más'}
                    </Button>
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