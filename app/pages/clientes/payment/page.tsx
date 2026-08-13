"use client";
import { useDeferredValue, useEffect, useState } from "react";
import { ViewStateClientPaymentInfoInterface } from "../models/payment-model";
import { ClientPaymentInfo } from "../models/client-model";
import {
  DataClientPaymentInfo,
  formatClientPaymentInfo,
  getClientById,
  getClientPaymentSnapshotById,
} from "../actions/read-client-data-action";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Search,
  ShieldCheck,
  ShieldAlert,
  Clock3,
  ChevronRight,
  CalendarDays,
  ChevronLeft,
  Book,
} from "lucide-react";
import { DialogPayment } from "./dialog-payment";
import LoadingTableData from "./loading-table-data";
import LoadingPayment from "./loading-payment";

const PAGE_SIZE = 30;

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("es-CL", { timeZone: "UTC" });
};

const getInitials = (name?: string) => {
  if (!name || name.trim().length === 0) return "SN";
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const getStatusClasses = (
  status: ViewStateClientPaymentInfoInterface["status_pay_client"],
) => {
  switch (status) {
    case "AL DÍA":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "MOROSO":
      return "border-red-200 bg-red-50 text-red-700";
    case "PERIODO DE GRACIA":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-border bg-muted text-foreground";
  }
};

export default function DashboardClientes() {
  const [clients, setClients] = useState<ViewStateClientPaymentInfoInterface[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedClient, setSelectedClient] = useState<
    ClientPaymentInfo | undefined
  >(undefined);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  const loadData = async (
    page = currentPage,
    search = deferredQuery,
    status = statusFilter,
  ) => {
    setLoading(true);

    try {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const result = await DataClientPaymentInfo({
        from,
        to,
        searchParam: search.trim() || undefined,
        statusParam: status,
      });
      setClients(result.data);
      setTotalCount(result.count);
    } catch (error) {
      console.error("Error cargando clients", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [deferredQuery, statusFilter]);

  useEffect(() => {
    loadData(currentPage, deferredQuery, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, deferredQuery, statusFilter]);

  const handleOpenPayment = async (clientId: string) => {
    setIsLoadingPayment(true); //*--> Abrir loading de pago de los clientes mientras esta cargando la informacion
    try {
      const [fullClientInfo, paymentSnapshot] = await Promise.all([
        getClientById(clientId),
        getClientPaymentSnapshotById(clientId),
      ]);
      if (fullClientInfo) {
        const clientDataToPay = await formatClientPaymentInfo(fullClientInfo);
        setSelectedClient({
          ...clientDataToPay,
          paid_until_date:
            paymentSnapshot?.covered_up_to ?? clientDataToPay.paid_until_date,
        });
        setIsPaymentDialogOpen(true);
        setIsLoadingPayment(false);
      }
    } catch (error) {
      console.error("Error al obtener info del cliente:", error);
    } finally {
      setIsLoadingPayment(false); //*--> Cerrar loading de pago de los clientes en caso de error
    }
  };

  const handlePaySuccess = async (client: ClientPaymentInfo) => {
    setSelectedClient(client);
    try {
      await loadData(currentPage, deferredQuery);
    } catch (error) {
      console.error("Error al refrescar la lista de pagos:", error);
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const upToDateCount = clients.filter(
    (client) => client.status_pay_client === "AL DÍA",
  ).length;
  const graceCount = clients.filter(
    (client) => client.status_pay_client === "PERIODO DE GRACIA",
  ).length;
  const overdueCount = clients.filter(
    (client) => client.status_pay_client === "MOROSO",
  ).length;
  //* --> Paginacion de la vista, se calcula el rango de items que se están mostrando en base a la página actual y el total de items..
  const fromItem = totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const toItem = Math.min(currentPage * PAGE_SIZE, totalCount);

  return (
    <Card className="max-w-7xl mx-auto top-0 w-full space-y-6 border-border/60 bg-card/90 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
        <Card className="overflow-hidden border-border/60 bg-card/85 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur">
          <CardContent className="flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <DollarSign className="h-3.5 w-3.5" />
                Control de facturación
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Gestión de Pagos de Clientes
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Visualiza rápidamente el estado de cada cliente, su fecha de
                  corte y abre el flujo de cobro desde una sola vista.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:min-w-[460px]">
              <Card className="border-emerald-200/70 bg-emerald-50/70 shadow-none">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-emerald-700/80">
                      Al día
                    </p>
                    <p className="text-xl font-semibold text-emerald-800">
                      {upToDateCount}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-200/70 bg-amber-50/70 shadow-none">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
                    <Clock3 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-amber-700/80">
                      Gracia
                    </p>
                    <p className="text-xl font-semibold text-amber-800">
                      {graceCount}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200/70 bg-red-50/70 shadow-none">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="rounded-xl bg-red-100 p-2 text-red-700">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-red-700/80">
                      Morosos
                    </p>
                    <p className="text-xl font-semibold text-red-800">
                      {overdueCount}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/90 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <CardHeader className="flex flex-col gap-4 border-b border-border/60 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <CardTitle className="text-xl">Resumen operativo</CardTitle>
              <CardDescription className="mt-1">
                Mostrando {fromItem} - {toItem} de {totalCount} cliente(s).
              </CardDescription>
            </div>

            <div className="flex w-full flex-col gap-3 md:max-w-lg md:flex-row md:items-center">
              <div className="relative w-full md:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar cliente o estado..."
                  className="h-10 rounded-xl border-border/70 bg-background pl-9"
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-10 rounded-xl border-border/70 bg-background">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">Todos los estados</SelectItem>
                    <SelectItem value="AL DÍA">Al día</SelectItem>
                    <SelectItem value="MOROSO">Morosos</SelectItem>
                    <SelectItem value="PERIODO DE GRACIA">
                      Periodo de Gracia
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table className="min-w-full">
              <TableHeader className="">
                <TableRow className="">
                  <TableHead className="px-6 py-4">Cliente</TableHead>
                  <TableHead className="py-4">Día de Pago</TableHead>
                  <TableHead className="py-4">Pagado Hasta</TableHead>
                  <TableHead className="py-4">Rango de Pago</TableHead>
                  <TableHead className="py-4">Estado</TableHead>
                  <TableHead className="py-4 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  Array.from({ length: PAGE_SIZE }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-28 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-28 rounded-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="ml-auto h-9 w-32 rounded-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : clients.length === 0 ? (
                  <LoadingTableData />
                ) : (
                  clients.map((cliente) => {
                    const clientName = cliente.client || "Sin nombre";
                    return (
                      <TableRow
                        key={cliente.id_client}
                        className="border-border/80 hover:bg-muted/50"
                      >
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-border/80">
                              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                                {getInitials(clientName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-foreground">
                                {clientName}
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                ID: {cliente.id_client.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarDays className="h-4 w-4 text-primary" />
                            <span className="font-medium text-foreground">
                              {formatDate(cliente.day_static_pay)}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="font-medium text-blue-700 border bg-blue-200 border-blue-500 px-2 rounded-full text-sm">
                            {formatDate(cliente.covered_up_to)}
                          </span>
                        </TableCell>

                        <TableCell>
                          <span className="font-medium text-foreground border border-border/70 bg-muted/50 px-2 py-1 rounded-full text-sm">
                            {cliente.payment_range}
                          </span>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${getStatusClasses(cliente.status_pay_client)}`}
                          >
                            {cliente.status_pay_client}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <div>
                            <Button
                              disabled
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs bg-background shadow-sm hover:bg-muted"
                            >
                              <Book className="ml-1 h-4 w-4" />
                              Historial
                            </Button>
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            className="shadow-sm"
                            onClick={() => handleOpenPayment(cliente.id_client)}
                          >
                            Gestionar pago
                            <ChevronRight className="ml-1 h-2 w-2" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            <div className="flex flex-col gap-3 border-t border-border/60 px-6 py-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1 || loading}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Anterior
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || loading}
                >
                  Siguiente
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {isLoadingPayment && <LoadingPayment />}
      
      <DialogPayment
        isOpen={isPaymentDialogOpen}
        onClose={() => {
          setIsPaymentDialogOpen(false);
          setSelectedClient(undefined);
        }}
        data={selectedClient}
        onPaySuccess={handlePaySuccess}
      />
    </Card>
  );
}
