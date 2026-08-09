"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  DollarSign,
  Clock,
  Calendar,
  ArrowUpRight,
  X,
  ArrowDownRight,
  LucideFileSpreadsheet,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isToday } from "date-fns";
import totalInstallationsAction from "@/app/dashboard/actions/total-installations";
import totalAmountMonthsAction from "@/app/dashboard/actions/total-amount";
import totalClientsAction from "@/app/dashboard/actions/total-clients";
import { getPendingPaymentsAction } from "@/app/dashboard/actions/pending-payments-action";
import { pendingPaymentModel } from "@/app/dashboard/model/pending-payment-model";
import { showOutstandingPayments } from "./table-payment-data-component";
import Link from "next/link";
import { getTotalWithdrawalsAction } from "@/app/dashboard/actions/total-withdrawals-action";
import exportDataToExcel from "@/app/dashboard/actions/excel-data-export";
import getDataClientSheet from "@/app/dashboard/actions/get-data-clients";
import { ClienteModel } from "@/app/pages/clientes/models/client-model";

export default function DataShowComponent() {
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [datasheet, setDatasheet] = useState<ClienteModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersTotal, setUserTotal] = useState(0);
  const [installationsToday, setInstallationsToday] = useState(0);
  const [amountTotal, setAmountTotal] = useState(0);
  const [pendingPaymentsData, setPendingPaymentsData] = useState<
    pendingPaymentModel[]
  >([]);
  const [withdrawals, setWithdrawals] = useState([]); // Estado para almacenar los datos de retiros

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [
          resUsers,
          resAmount,
          resInstall,
          paymentPending,
          resWithdrawals,
          sheetUsers,
        ] = await Promise.all([
          totalClientsAction(),
          totalAmountMonthsAction(),
          totalInstallationsAction(),
          getPendingPaymentsAction(),
          getTotalWithdrawalsAction(),
          getDataClientSheet()
        ]);
        setUserTotal(Number(resUsers?.data ?? resUsers));
        setAmountTotal(Number(resAmount ?? 0));
        setInstallationsToday(Number(resInstall));
        setPendingPaymentsData(paymentPending ?? []);
        setWithdrawals(resWithdrawals ?? []); // Almacenar los datos de retiros en el estado
        setLoading(false);
        setDatasheet(sheetUsers ?? []); // Almacenar los datos de clientes en el estado
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExcelDateReport = async () => {
    const res = await exportDataToExcel({
      payments: pendingPaymentsData,
      clients: datasheet, //*--> agregar la lista de los clientes para poder descargar su data tambien
      state: loadingSheet,
    });
    console.log(res.message);
  };

  if (loading) {
    return (
      <div className="flex w-full h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></span>
          <span className="text-muted-foreground font-medium text-sm animate-pulse">
            Cargando datos...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      <Card className="bg-white rounded-xl shadow-sm border-border overflow-hidden">
        <div className="bg-slate-50/50 border-b px-6 py-6 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Dashboard General
            </h1>
            <p className="text-slate-500 mt-1">
              Control de instalaciones y rendimiento operativo.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Botón para generar reporte excel segui desde aqui */}
            <Button
              className="bg-green-700 text-white hover:bg-green-800 hover:text-white"
              onClick={handleExcelDateReport}
              variant="outline"
            >
              <LucideFileSpreadsheet className="mr-2 h-4 w-4" />
              Generar Reporte
            </Button>
            <Button disabled variant="outline" className="bg-white">
              <Calendar className="mr-2 h-4 w-4" />
              {isToday(new Date())
                ? new Date().toLocaleDateString()
                : "--/--/----"}
            </Button>
            <Link
              href="/pages/scheduler/instalation/form"
              className="bg-primary hover:bg-primary/90 text-white px-3 py-1 rounded-md text-sm font-medium"
            >
              Registrar Instalación
            </Link>
          </div>
        </div>

        <CardContent className="p-6 md:p-8 space-y-8 bg-slate-50/30">
          {/* KPI CARDS (4 Columnas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <Card className="shadow-sm border-blue-100 bg-blue-50/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">
                  Clientes Instalados
                </CardTitle>
                <div className="p-2 bg-blue-100 rounded-md">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {usersTotal}
                </div>
                <p className="text-xs text-blue-600 flex items-center mt-1 font-medium">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  {/* +2 este mes */}
                </p>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="shadow-sm border-emerald-100 bg-emerald-50/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">
                  Ganancias del Mes
                </CardTitle>
                <div className="p-2 bg-emerald-100 rounded-md">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  ${amountTotal.toLocaleString()}
                </div>
                <p className="text-xs text-emerald-600 flex items-center mt-1 font-medium">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  {/* +15.3% respecto al pasado */}
                </p>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="shadow-sm border-indigo-100 bg-indigo-50/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">
                  Instalaciones Hoy
                </CardTitle>
                <div className="p-2 bg-indigo-100 rounded-md">
                  <Clock className="h-4 w-4 text-indigo-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {installationsToday}
                </div>
                <p className="text-xs text-indigo-600 flex items-center mt-1 font-medium">
                  {/* Programadas para hoy */}
                </p>
              </CardContent>
            </Card>

            {/* Card 4 */}
            <Card className="shadow-sm border-red-100 bg-red-50/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">
                  Retiros Pendientes
                </CardTitle>
                <div className="p-2 bg-red-100 rounded-md">
                  <X className="h-4 w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {withdrawals.length}
                </div>
                <p className="text-xs text-red-600 flex items-center mt-1 font-medium">
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CHARTS SECTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {showOutstandingPayments({ props: pendingPaymentsData })}
            {/* Lista de Retiros Pendientes (Ocupa 1/3 del espacio) */}
            <Card className="shadow-sm flex flex-col h-full relative border-amber-100 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b bg-amber-50/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-md shadow-sm">
                    <X className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-amber-900">
                      Retiros Pendientes
                    </CardTitle>
                    <CardDescription className="text-amber-700/80">
                      Equipos listos para desinstalar
                    </CardDescription>
                  </div>
                </div>
                <div className="bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm border border-amber-200">
                  {withdrawals.length}
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 bg-white">
                <div className="flex p-4 border-b items-center ">
                  <div className="text-sm text-amber-700 font-medium">
                    <Link
                      href="/pages/scheduler/withdrawals/edit"
                      className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                    >
                      Ver Retiros{" "}
                      {withdrawals.length > 0 &&
                        `,${withdrawals.length} pendientes`}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
