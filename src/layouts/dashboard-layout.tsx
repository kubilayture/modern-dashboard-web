import { Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  MobileSidebar,
  Header,
  ContentWrapper,
} from "@/components/layout";
import { useSidebarStore } from "@/store";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  titleKey: string;
}

export function DashboardLayout({ titleKey }: DashboardLayoutProps) {
  const { isCollapsed } = useSidebarStore();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileSidebar />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:pl-18" : "lg:pl-64"
        )}
      >
        <Header title={t(titleKey)} />
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </div>
    </div>
  );
}
