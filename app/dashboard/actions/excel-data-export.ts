import { ClienteModel } from "@/app/pages/clientes/models/client-model";
import { pendingPaymentModel } from "../model/pending-payment-model";

interface ExportDataToExcelProps {
  payments: pendingPaymentModel[];
  clients: ClienteModel[];
  state: boolean;
}

export default async function exportDataToExcel({
  payments,
  clients,
  state,
}: ExportDataToExcelProps) {
  try {
    state = true;
    const XLSX = await import("xlsx");
    const workbook = XLSX.utils.book_new();

    const clientes = clients.map((c) => ({
      id_cliente: c.id_client,
      nombre_cliente: c.name + " " + c.lastname,
      telefono: c.phone1,
      telefono2: c.phone2,
      antena: c.antenna_name,
      fecha_registro: c.created_at,
      sector: c.sector,
      plan: c.plan,
      latitud: c.latitude,
      longitud: c.longitude,
    }));

    const pagos = payments.map((p) => ({
      id_cliente: p.id_client,
      cliente: p.client,
      antena: p.antenna_name,
      cubierto_hasta: p.covered_up_to,
      estado_pago: p.status_pay_client,
    }));

    const wsPagos = XLSX.utils.json_to_sheet(pagos);
    XLSX.utils.book_append_sheet(workbook, wsPagos, "PagosPendientes");

    const wsClientes = XLSX.utils.json_to_sheet(clientes);
    XLSX.utils.book_append_sheet(workbook, wsClientes, "Clientes");

    const fileName = `backup-dashboard-${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    return { success: true, message: `Reporte de excel generado: ${fileName}` };
  } catch (error) {
    state = false;
    console.error("Error generating Excel report:", error);
    return { success: false, message: "Error al generar el reporte de Excel." };
  }
}
