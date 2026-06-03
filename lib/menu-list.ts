/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Users,
  LayoutGrid,
  LucideIcon,
  User,
  PencilRulerIcon,
  ToolCase,
  Trash
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Administración",
      menus: [
        {
          href: "",
          label: "Users",
          icon: User,
          submenus: [
            {
              href: "/pages/clientes/forms",
              label: "Crear Cliente"
            },
            {
              href: "/pages/clientes/edit",
              label: "Gestionar Clientes"
            },
            {
              href: "/pages/clientes/payment",
              label: "Gestionar Pagos"
            }
          ]
        },
        {
          href: "/categories",
          label: "Instalaciones",
          icon: PencilRulerIcon,
          submenus: [
            {
              href: "/pages/scheduler/instalation/form",
              label: "Nueva Instalación"
            },
            {
              href: "/pages/scheduler/instalation/edit",
              label: "Gestionar Instalaciones"
            }
          ]
        },
        {
          href: "/repairs",
          label: "Arreglos",
          icon: ToolCase,
          submenus: [
            {
              href: "/pages/scheduler/repairs/form",
              label: "Nuevo Arreglo"
            },
            {
              href: "/pages/scheduler/repairs/edit",
              label: "Gestionar Arreglos"
            }
          ]
        },
        {
          href: "/withdrawals",
          label: "Retiros",
          icon: Trash,
          submenus: [
            {
              href: "/pages/scheduler/withdrawals/form",
              label: "Nuevo Retiro"
            },
            {
              href: "/pages/scheduler/withdrawals/edit",
              label: "Gestionar Retiros"
            }
          ]
        }
      ]
    },
    {
      groupLabel: "Configuración",
      menus: [
        {
          href: "/Usuarios",
          label: "Usuarios",
          icon: Users
        },
        // {
        //   href: "/account/edit",
        //   label: "Ajustes de Cuenta",
        //   icon: Settings
        // }
      ]
    }
  ];
}
