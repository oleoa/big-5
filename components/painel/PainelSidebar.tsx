'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, Settings, User } from 'lucide-react';
import { UserButton } from '@neondatabase/auth/react/ui';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const navItems = [
  { label: 'Dashboard', href: '/painel', icon: LayoutDashboard },
  { label: 'Mentorados', href: '/painel/mentorados', icon: Users },
  { label: 'Formulário', href: '/painel/formulario', icon: FileText },
  { label: 'Configurações', href: '/painel/config', icon: Settings },
  { label: 'Conta', href: '/painel/conta', icon: User },
];

export function PainelSidebar({ mentoraNome }: { mentoraNome: string }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/painel') return pathname === '/painel';
    return pathname.startsWith(href);
  }

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4">
        <Link href="/painel" className="text-base font-semibold tracking-tight">
          {mentoraNome}
        </Link>
        <span className="text-xs text-muted-foreground">Painel da mentora</span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton isActive={isActive(item.href)} render={<Link href={item.href} />}>
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4">
        <UserButton />
      </SidebarFooter>
    </Sidebar>
  );
}
