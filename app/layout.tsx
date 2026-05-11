import "./globals.css";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { createClient } from "@/utils/supabase/server";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return children;
  }

  return (
    <html lang="es">
      <body>
        <AdminPanelLayout>{children}</AdminPanelLayout>
      </body>
    </html>
  )
    ;
}