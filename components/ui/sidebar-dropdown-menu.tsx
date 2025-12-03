import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface SidebarDropdownMenuOption {
    label: string;
    href: string;
}

interface SidebarDropdownMenuProps {
    icon: React.ElementType;
    label: string;
    options: SidebarDropdownMenuOption[];
    isActive?: boolean;
}

export function SidebarDropdownMenu({ icon: Icon, label, options, isActive }: SidebarDropdownMenuProps) {
    return (
        <SidebarMenuItem >
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton isActive={isActive}>
                        <div className="flex items-center gap-3">
                            <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-primary-500'}`} />
                            <span className="font-medium">{label}</span>
                        </div>
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="w-48 bg-purple-100 border-primary-200 shadow-lg">
                    {options.map(opt => (
                        <DropdownMenuItem asChild key={opt.label} className="hover:bg-primary-50 hover:text-primary-700">
                            <a href={opt.href}>{opt.label}</a>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    );
}
