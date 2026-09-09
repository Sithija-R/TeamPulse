import { useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "../../store/authStore";

interface HeaderProps {
  onOpenMobile: () => void;
}

export const Header = ({ onOpenMobile }: HeaderProps) => {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.authUser);
  const logout = useAuthStore((state) => state.logout);

  const role = authUser?.role;


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = () => {
    if (!authUser?.name) return "TP";
    return authUser.name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#E5E7E5] bg-white/90 px-4 backdrop-blur-md md:px-8">
      {/* Mobile Toggle & Workspace */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onOpenMobile}
          className="h-9 w-9 text-[#6B726D] hover:bg-[#F7F8F7] hover:text-[#171A18] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <span className="hidden text-xs text-[#6B726D] sm:inline-block">
          TeamPulse Workspace &bull;{" "}
          {role === "TEAM_MEMBER" ? "Member Portal" : "Management Console"}
        </span>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-3">
        {/* User */}
        <div className="flex items-center gap-2 border-l border-[#E5E7E5] pl-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#171A18] text-xs font-bold text-white">
            {getInitials()}
          </div>

          <div className="hidden flex-col sm:flex">
            <span className="text-xs font-semibold text-[#171A18]">
              {authUser?.name ?? "User"}
            </span>
            <span className="text-[10px] text-[#6B726D]">
              {authUser?.role === "TEAM_MEMBER"
                ? "Team Member"
                : authUser?.role === "MANAGER"
                ? "Manager"
                : "Admin"}
            </span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Log out"
            className="h-8 w-8 text-[#6B726D] hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
