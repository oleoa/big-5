'use client';

import Image from 'next/image';
import { Users, LogOut } from 'lucide-react';
import { logoutAction } from '@/app/admin/actions';
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
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4">
        <a href="/admin" className="flex items-center gap-3">
          <Image
            src="/strutura/mark.png"
            alt=""
            width={34}
            height={34}
            className="shrink-0"
          />
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-foreground">
              Strutura AI
            </span>
            <span className="text-xs text-muted-foreground">
              Painel de administração
            </span>
          </span>
        </a>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-[0.06em] text-faint">
            Gestão
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive render={<a href="/admin" />}>
                  <Users className="size-4" />
                  <span>Mentoras</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4">
        <form action={logoutAction}>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" type="submit">
            <LogOut className="size-4" />
            Sair
          </Button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
