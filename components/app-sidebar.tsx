"use client"

import {
    Home,
    BarChart3,
    Users,
    Activity,
    Calendar,
    Settings,
    CreditCard,
    FileText,
    Mail,
    Bell,
    User,
    LogOut,
    ChevronUp,
    Plus,
    Search,
    NotebookPen
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { SidebarDropdownMenu } from "./ui/sidebar-dropdown-menu";


const navigationItems = [
    {
        title: "Dashboard",
        url: "/pages/dashboard",
        icon: Home,
        isActive: true,
    },
    {
        title: "Agendas",
        url: "/agendas",
        icon: NotebookPen,
        badge: "",
    },
    {
        title: "Usuarios",
        url: "/pages/clientes/forms",
        icon: Users,
    },
    {
        title: "Actividad",
        url: "/activity",
        icon: Activity,
        count: 12,
    },
    {
        title: "Calendario",
        url: "/calendar",
        icon: Calendar,
    },
    {
        title: "Facturas",
        url: "/billing",
        icon: CreditCard,
    },
]

const secondaryItems = [
    {
        title: "Reportes",
        url: "/reports",
        icon: FileText,
    },
    {
        title: "Mensajes",
        url: "/messages",
        icon: Mail,
        count: 3,
    },
    {
        title: "Notificaciones",
        url: "/notifications",
        icon: Bell,
        count: 5,
    },
    {
        title: "Configuración",
        url: "/settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    return (
        <Sidebar className="border-r bg-purple-400 ">
            {/* Header del Sidebar */}
            <SidebarHeader className="border-b bg-background p-4 shadow-sm sha">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br shadow-lg from-primary-500 to-primary-700 text-white">
                        <span className="text-lg font-bold">ID</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-white">InternetDash</span>
                        <span className="text-xs text-white">Panel de Control</span>
                    </div>
                </div>
                {/* Botón de búsqueda
                <Button 
                    variant="outline" 
                    className="mt-3 w-full justify-start text-left font-normal border-primary-200 hover:bg-primary-50"
                >
                    <Search className="mr-2 h-4 w-4 text-primary-400" />
                    <span className="text-primary-600">Buscar...</span>
                </Button> */}
            </SidebarHeader>

            {/* Contenido Principal */}
            <SidebarContent className="px-2 bg-grey-50">
                {/* Navegación Principal */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-primary-700 font-semibold">
                        Navegación Principal
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="bg-purple-50 rounded-2xl">
                            {navigationItems.map((item) => (
                                item.title === "Usuarios"
                                    ? (
                                        <SidebarDropdownMenu
                                            
                                            key={item.title}
                                            icon={item.icon}
                                            label={item.title}
                                            isActive={item.isActive}
                                            options={[
                                                { label: "Crear clientes", href: "/pages/clientes/forms" },
                                                { label: "Editar clientes", href: "/pages/clientes/edit" },
                                                { label: "Verificar pagos clientes", href: "/pages/clientes/verify" }
                                            ]}
                                        />
                                    )
                                    : (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={item.isActive}
                                                className={`w-full justify-start ${item.isActive
                                                    ? 'bg-linear-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'
                                                    : 'hover:bg-primary-50 hover:text-primary-700 text-primary-600'
                                                    }`}
                                            >
                                                <a href={item.url} className="flex items-center justify-between w-full">
                                                    <div className="flex items-center gap-3">
                                                        <item.icon className={`h-5 w-5 ${item.isActive ? 'text-white' : 'text-primary-500'}`} />
                                                        <span className="font-medium">{item.title}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {item.badge && (
                                                            <Badge variant="secondary" className="bg-primary-100 text-primary-700 text-xs">
                                                                {item.badge}
                                                            </Badge>
                                                        )}
                                                        {item.count && (
                                                            <Badge
                                                                variant={item.isActive ? "secondary" : "outline"}
                                                                className={`text-xs ${item.isActive
                                                                    ? 'bg-white/20 text-white border-white/30'
                                                                    : 'bg-primary-100 text-primary-700 border-primary-200'
                                                                    }`}
                                                            >
                                                                {item.count.toLocaleString()}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Navegación Secundaria */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-primary-700 font-semibold">
                        Herramientas
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondaryItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className="hover:bg-primary-50 hover:text-primary-700 text-primary-600"
                                    >
                                        <a href={item.url} className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-3">
                                                <item.icon className="h-4 w-4 text-primary-500" />
                                                <span>{item.title}</span>
                                            </div>
                                            {item.count && (
                                                <Badge variant="outline" className="bg-primary-100 text-primary-700 border-primary-200 text-xs">
                                                    {item.count}
                                                </Badge>
                                            )}
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Widget de Estadísticas Rápidas */}
                <SidebarGroup>
                    <div className="mx-2 mt-4 rounded-xl bg-linear-to-br from-primary-50 to-primary-100 p-4 border border-primary-200">
                        <h3 className="text-sm font-semibold text-primary-800 mb-3">Resumen Rápido</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-primary-600">Usuarios Online</span>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-bold text-primary-800">127</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-primary-600">Ventas Hoy</span>
                                <span className="text-sm font-bold text-green-600">$2,450</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-primary-600">Tareas</span>
                                <span className="text-sm font-bold text-orange-600">8 pendientes</span>
                            </div>
                        </div>
                    </div>
                </SidebarGroup>

                {/* Botón de Acción Rápida */}
                <SidebarGroup>
                    <div className="mx-2 mt-4">
                        <Button className="w-full bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-md">
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Proyecto
                        </Button>
                    </div>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer del Sidebar */}
            <SidebarFooter className="border-t border-primary-200/50 p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="w-full justify-start hover:bg-primary-50 data-[state=open]:bg-primary-100">
                                    <div className="flex items-center gap-3 w-full">
                                        <Avatar className="h-8 w-8 ring-2 ring-primary-200">
                                            <AvatarImage src="/placeholder-avatar.jpg" alt="Usuario" />
                                            <AvatarFallback className="bg-linear-to-br from-primary-500 to-primary-600 text-white text-sm font-semibold">
                                                AU
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col flex-1 text-left">
                                            <span className="text-sm font-semibold text-primary-800 truncate">
                                                Admin Usuario
                                            </span>
                                            <span className="text-xs text-primary-600 truncate">
                                                admin@internetdash.com
                                            </span>
                                        </div>
                                        <ChevronUp className="h-4 w-4 text-primary-400" />
                                    </div>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-56 bg-white border-primary-200 shadow-lg"
                            >
                                <DropdownMenuItem className="hover:bg-primary-50 hover:text-primary-700">
                                    <User className="mr-2 h-4 w-4 text-primary-500" />
                                    Mi Perfil
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-primary-50 hover:text-primary-700">
                                    <Settings className="mr-2 h-4 w-4 text-primary-500" />
                                    Configuración
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-primary-200" />
                                <DropdownMenuItem className="text-red-600 hover:bg-red-50 hover:text-red-700">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Cerrar Sesión
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}