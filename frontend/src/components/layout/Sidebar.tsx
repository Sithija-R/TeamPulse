import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  User as UserIcon,
  Users,
  Briefcase,
  UserCheck,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useAuthStore } from "../../store/authStore";

interface SidebarProps {
  onCloseMobile?: () => void;
}

function getCurrentWeekLabel(): string {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);

  return monday.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const location = useLocation();
  const authUser = useAuthStore((state) => state.authUser);

  const role = authUser?.role;
  const userName = authUser?.name ?? "User";

  const isManagerOrAdmin = role === "MANAGER" || role === "ADMIN";

  const memberNav = [
    {
      label: "Dashboard",
      href: "/user/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Reports",
      href: "/user/reports",
      icon: FileText,
    },
    {
      label: "Create Report",
      href: "/user/reports/create",
      icon: PlusCircle,
    },
    {
      label: "Profile",
      href: "/user/profile",
      icon: UserIcon,
    },
  ];

  const managerNav = [
    {
      label: "Dashboard",
      href: "/management/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "All Reports",
      href: "/management/reports",
      icon: FileText,
    },
    {
      label: "Team Members",
      href: "/management/team",
      icon: Users,
    },
    {
      label: "Projects",
      href: "/management/projects",
      icon: Briefcase,
    },
    {
      label: "Users",
      href: "/management/users",
      icon: UserCheck,
    },
  ];

  const roleLabels: Record<"TEAM_MEMBER" | "MANAGER" | "ADMIN", string> = {
    TEAM_MEMBER: "Team Member",
    MANAGER: "Manager",
    ADMIN: "Administrator",
  };

  const navItems = isManagerOrAdmin ? managerNav : memberNav;
  
  const dashboardPath = isManagerOrAdmin
    ? "/management/dashboard"
    : "/user/dashboard";

  return (
    <aside className="flex h-full w-64 flex-col bg-white shadow-[4px_0_12px_rgba(0,0,0,0.08)]">
      {/* Brand */}
      <div className="flex h-16 items-center px-6">
        <Link
          to={dashboardPath}
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 text-lg font-bold text-[#171A18]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8DF688] text-sm font-black text-[#171A18]">
            <Zap className="h-4 w-4 fill-current stroke-none" />
          </div>
          <span className="tracking-tight">TeamPulse</span>
        </Link>
      </div>

      <Separator />

      {/* Current Workspace */}
      <div className="px-4 py-3">
        <div className="rounded-lg p-3 shadow-md">
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-[#171A18]">{userName}</p>
            <Badge
              variant="secondary"
              className="bg-[#8DF688]/30 px-2 py-0.5 text-[10px] font-semibold text-[#171A18] hover:bg-[#8DF688]/30"
            >
              {role ? roleLabels[role] : "User"}
            </Badge>
          </div>
          <div className="mt-2 flex  flex-col">
            <p className="text-[10px] text-[#9AA19C]">Current Week</p>
            <p className="mt-0.5 text-xs font-medium text-[#171A18]">
              Week of {getCurrentWeekLabel()}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#9AA19C]">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            location.pathname === item.href ||
            (item.href !== "/user/reports" &&
              item.href !== "/management/reports" &&
              location.pathname.startsWith(item.href));

          return (
            <Button
              key={item.href}
              variant="ghost"
              render={<Link to={item.href} onClick={onCloseMobile} />}
              className={`h-9 w-full justify-start gap-3 rounded-lg px-3 text-sm ${
                isActive
                  ? "bg-[#8DF688]/20 font-semibold text-[#171A18] hover:bg-[#8DF688]/20"
                  : "font-medium text-[#6B726D] hover:bg-[#F7F8F7] hover:text-[#171A18]"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${
                  isActive ? "text-[#171A18]" : "text-[#6B726D]"
                }`}
              />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* Quick Action */}
      {!isManagerOrAdmin && (
        <>
          <Separator />

          <div className="p-4">
            <Button
              render={
                <Link to="/user/reports/create" onClick={onCloseMobile} />
              }
              className="h-10 w-full rounded-lg bg-[#8DF688] text-xs font-bold text-[#171A18] shadow-xs hover:bg-[#7ae875]"
            >
              <PlusCircle className="h-4 w-4" />
              New Weekly Report
            </Button>
          </div>
        </>
      )}
    </aside>
  );
}
