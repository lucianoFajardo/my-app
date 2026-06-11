'use client'

import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Box, ChevronLeft, ChevronRight, Eye, MapPin, Search, UserMinus } from 'lucide-react';
import { DrawalsClientModel, DrawalsModel } from '../model/drawals-model';
import DialogWithdrawls from './dialog-withdrawls';
import createDataDrawalsAction from '../actions/create-data-drawals';
import showWithdrawalsDataAction from '../actions/show-withdrawals-data';

export default function CreateWithdrawalsPage() {
    const [client, setClient] = useState<DrawalsClientModel[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<DrawalsClientModel | null>(null);
    const [isWithdrawals, setIsWithdrawals] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);

    const limit = 15;

    useEffect(() => {
        const fetchData = async () => {
            const from = page * limit;
            const to = from + limit - 1;
            setLoading(true);
            try {
                const data = await showWithdrawalsDataAction({ from, to, search: searchTerm });
                setClient(data);
            } catch (error) {
                throw new Error(`Error al cargar los clientes para los retiros programados: ${error}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, searchTerm]);

    const handleOpenDialog = (cliente: DrawalsClientModel) => {
        setSelectedClient(cliente);
        setIsDialogOpen(true);
    };

    const onSubmitData = async (data: DrawalsModel) => {
        const result = await createDataDrawalsAction({
            ...data,
            id_client: selectedClient?.id_client || '',
        });

        if (selectedClient?.id_client) {
            setIsWithdrawals((prev) => [...prev, result.id_client]);
        }

        setIsDialogOpen(false);
        setSelectedClient(null);

        return result;
    };

    const filteredClient = client.filter((currentClient) =>
        currentClient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNextPage = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setPage((prevPage) => (prevPage > 0 ? prevPage - 1 : 0));
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
                    <span className="animate-pulse text-sm font-medium text-muted-foreground">Cargando datos...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full max-w-7xl mx-auto space-y-6 bg-slate-50/50 p-4 md:p-8">
            <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
                <CardHeader className="flex flex-col justify-between border-b border-slate-100 px-6 pb-6 md:flex-row md:items-center md:px-8">
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl border border-blue-100/50 bg-blue-50/80 p-2.5">
                            <UserMinus className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-slate-800">Directorio para Retiros</CardTitle>
                            <CardDescription className="mt-1 text-slate-500">
                                Busca un cliente y agenda una orden de retiro de equipos.
                            </CardDescription>
                        </div>
                    </div>
                    <div className="relative mt-4 w-full md:mt-0 md:w-80">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Buscar cliente..."
                            className="h-10 border-slate-200 pl-9 focus-visible:ring-blue-500/20"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="w-full overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-100 bg-slate-50/50 hover:bg-slate-50/50">
                                    <TableHead className="px-6 py-4 font-semibold text-slate-600">Cliente y Ubicacion</TableHead>
                                    <TableHead className="px-6 py-4 font-semibold text-slate-600">Ubicacion</TableHead>
                                    <TableHead className="px-6 py-4 font-semibold text-slate-600">Contactos</TableHead>
                                    <TableHead className="px-6 py-4 text-right font-semibold text-slate-600">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClient.length > 0 ? (
                                    filteredClient.map((currentClient) => {
                                        const isWithdrawal = currentClient.status || isWithdrawals.includes(currentClient.id_client);

                                        return (
                                            <TableRow
                                                key={currentClient.id_client}
                                                className={`border-slate-100 transition-colors ${
                                                    isWithdrawal ? 'border border-red-200 bg-red-100' : 'hover:bg-slate-50/50'
                                                }`}
                                            >
                                                <TableCell className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-slate-800">{currentClient.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <span className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                                        <MapPin className="h-3 w-3" /> {currentClient.antenna_name}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <span className="inline-flex items-center rounded-full border border-indigo-100/50 bg-indigo-50/80 px-2.5 py-1 text-[13px] font-medium text-indigo-600">
                                                        {currentClient.phone2
                                                            ? `${currentClient.phone1} / ${currentClient.phone2}`
                                                            : currentClient.phone1}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            disabled={isWithdrawal}
                                                            className={`h-9 gap-2 rounded-md px-3 ${
                                                                isWithdrawal
                                                                    ? 'cursor-not-allowed bg-slate-200 text-slate-400'
                                                                    : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'
                                                            }`}
                                                            onClick={() => handleOpenDialog(currentClient)}
                                                        >
                                                            <Box className="h-4 w-4" />
                                                            {isWithdrawal ? 'Retiro Agendado' : 'Agendar Retiro'}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-slate-400">
                                            No se encontraron clientes que coincidan con la busqueda.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 p-4 px-6">
                        <span className="text-sm font-medium text-slate-600">Pagina Actual {page + 1}</span>
                        <div className="flex gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-slate-200 text-slate-400"
                                disabled={page === 0}
                                onClick={handlePreviousPage}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-slate-200 text-slate-600"
                                disabled={client.length < limit}
                                onClick={handleNextPage}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col items-center justify-between gap-4 border-t bg-muted/20 px-6 py-4 sm:flex-row">
                    <span className="text-sm font-medium text-muted-foreground">Pagina Actual {page + 1}</span>
                    <div className="flex items-center gap-1 rounded-md border bg-background shadow-sm">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handlePreviousPage}
                            disabled={page === 0}
                            className="h-8 w-8 rounded-r-none hover:bg-muted"
                        >
                            <ChevronLeft className="h-4 w-4 text-foreground" />
                        </Button>
                        <div className="h-4 w-px bg-border" />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNextPage}
                            disabled={client.length < limit}
                            className="h-8 w-8 rounded-l-none hover:bg-muted"
                        >
                            <ChevronRight className="h-4 w-4 text-foreground" />
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            {selectedClient && (
                <DialogWithdrawls
                    isOpen={() => isDialogOpen}
                    isClose={() => setIsDialogOpen(false)}
                    onSubmit={onSubmitData}
                    props={selectedClient}
                />
            )}
        </div>
    );
}