'use client';

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
        <a href="/admin" className="text-base font-semibold tracking-tight">
          Strutura AI
        </a>
        <span className="text-xs text-muted-foreground">Painel de administração</span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestão</SidebarGroupLabel>
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
