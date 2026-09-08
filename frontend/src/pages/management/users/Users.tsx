import { useEffect, useMemo, useState } from "react";
import { Edit2, Eye, Search, Shield } from "lucide-react";
import { Link } from "react-router-dom";

import { PageHeader } from "../../../components/common/PageHeader";
import { useAuthStore } from "../../../store/authStore";
import { useUserStore } from "../../../store/userStore";
import type { Role, UserResponse } from "../../../types/user";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";

const roleLabels: Record<Role, string> = {
  TEAM_MEMBER: "Team Member",
  MANAGER: "Manager",
  ADMIN: "Administrator",
};

export function Users() {
  const { authUser } = useAuthStore();

  const {
    users,
    isLoading,
    error,
    fetchUsers,
    changeUserRole,
    clearError,
  } = useUserStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>("TEAM_MEMBER");
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUsers().catch(() => {});
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query),
    );
  }, [users, searchQuery]);

  const startEdit = (user: UserResponse) => {
    clearError();
    setEditingUser(user);
    setName(user.name);
    setSelectedRole(user.role);
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setName("");
    setSelectedRole("TEAM_MEMBER");
    clearError();
  };

  const handleSave = async () => {
    if (!editingUser) return;

    const isOwnUser = authUser?.id === editingUser.id;

    if (isOwnUser) {
      if (!name.trim()) {
        toast.add({
          title: "Name Required",
          description: "Please enter your name.",
          type: "error",
        });
        return;
      }

      /*
       * Your current userStore only exposes changeUserRole().
       * Add a profile/name update method to the backend and userStore
       * before enabling the actual API request here.
       */
      toast.add({
        title: "Name Update Unavailable",
        description:
          "The current user API does not yet provide a name update endpoint.",
        type: "error",
      });

      return;
    }

    if (selectedRole === editingUser.role) {
      cancelEdit();
      return;
    }

    setIsSaving(true);

    try {
      await changeUserRole(editingUser.id, {
        role: selectedRole,
      });

      toast.add({
        title: "Role Updated",
        description: `${editingUser.name}'s role has been updated to ${roleLabels[selectedRole]}.`,
        type: "success",
      });

      cancelEdit();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to change the user's role.";

      toast.add({
        title: "Role Update Failed",
        description: message,
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isEditingOwnUser =
    editingUser !== null && authUser?.id === editingUser.id;

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Access & Role Administration"
        description="Manage workspace users and their permission levels."
      />

      {error && (
        <Card className="border-rose-200 bg-rose-50 shadow-none">
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <p className="text-xs font-medium text-rose-700">{error}</p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fetchUsers().catch(() => {})}
              className="shrink-0 border-rose-200 bg-white text-xs text-rose-700 hover:bg-rose-100"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {editingUser && (
        <Card className="border-[#8DF688] bg-[#8DF688]/10 shadow-none animate-in fade-in duration-150">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-[#171A18]">
              {isEditingOwnUser ? "Edit Your Profile" : "Edit User Role"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor="user-name"
                  className="text-xs font-semibold text-[#171A18]"
                >
                  Full Name
                </Label>

                <Input
                  id="user-name"
                  value={name}
                  readOnly={!isEditingOwnUser}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 rounded-xl border-[#E5E7E5] bg-white text-xs font-medium text-[#171A18]"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="user-email"
                  className="text-xs font-semibold text-[#171A18]"
                >
                  Email
                </Label>

                <Input
                  id="user-email"
                  value={editingUser.email}
                  readOnly
                  className="h-9 rounded-xl border-[#E5E7E5] bg-white text-xs font-medium text-[#171A18]"
                />
              </div>

              {!isEditingOwnUser && (
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold text-[#171A18]">
                    Role Permission Level
                  </Label>

                  <Select
                    value={selectedRole}
                    onValueChange={(value) =>
                      setSelectedRole(value as Role)
                    }
                  >
                    <SelectTrigger className="h-9 rounded-xl border-[#E5E7E5] bg-white text-xs font-semibold text-[#171A18]">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="TEAM_MEMBER">
                        Team Member
                      </SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="ADMIN">
                        Administrator
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={cancelEdit}
                disabled={isSaving}
                className="rounded-lg border-[#E5E7E5] bg-white px-4 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7]"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-lg bg-[#171A18] px-5 text-xs font-bold text-white hover:bg-black"
              >
                {isSaving
                  ? "Saving..."
                  : isEditingOwnUser
                    ? "Save Name"
                    : "Save Role Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-[#E5E7E5] bg-white shadow-none">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6B726D]" />

            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or role..."
              className="h-9 rounded-lg border-[#E5E7E5] bg-[#F7F8F7] pl-9 text-xs font-medium text-[#171A18]"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading && users.length === 0 ? (
        <Card className="border-[#E5E7E5] shadow-none">
          <CardContent className="p-6">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-14 animate-pulse rounded-lg bg-[#F7F8F7]"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : users.length === 0 ? (
        <Card className="border-dashed border-[#E5E7E5] shadow-none">
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[#E5E7E5] bg-[#F7F8F7]">
              <Shield className="h-5 w-5 text-[#6B726D]" />
            </div>

            <h3 className="text-sm font-bold text-[#171A18]">
              No users found
            </h3>

            <p className="mt-1 max-w-sm text-xs text-[#6B726D]">
              There are currently no users available in the workspace.
            </p>
          </CardContent>
        </Card>
      ) : filteredUsers.length === 0 ? (
        <Card className="border-dashed border-[#E5E7E5] shadow-none">
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <Search className="mb-3 h-5 w-5 text-[#6B726D]" />

            <h3 className="text-sm font-bold text-[#171A18]">
              No matching users
            </h3>

            <p className="mt-1 text-xs text-[#6B726D]">
              Try a different name, email address, or role.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden border-[#E5E7E5] bg-white shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E5E7E5] bg-[#F7F8F7] text-[#6B726D]">
                  <th className="px-4 py-3 font-semibold">User Details</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E5E7E5]">
                {filteredUsers.map((user) => {
                  const isOwnUser = authUser?.id === user.id;

                  return (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-[#F7F8F7]/50"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#171A18] text-xs font-bold text-white">
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#171A18]">
                                {user.name}
                              </span>

                              {isOwnUser && (
                                <Badge
                                  variant="secondary"
                                  className="bg-[#8DF688]/30 px-2 py-0.5 text-[10px] font-bold text-[#171A18] hover:bg-[#8DF688]/30"
                                >
                                  You
                                </Badge>
                              )}
                            </div>

                            <div className="truncate text-[11px] font-normal text-[#6B726D]">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <Badge
                          variant="outline"
                          className="gap-1 border-[#E5E7E5] bg-[#F7F8F7] px-2.5 py-1 text-[10px] font-bold text-[#171A18]"
                        >
                          <Shield className="h-3 w-3 text-[#8DF688]" />
                          {roleLabels[user.role]}
                        </Badge>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(user)}
                            className="h-8 gap-1.5 rounded-md border-[#E5E7E5] px-2.5 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7]"
                          >
                            <Edit2 className="h-3.5 w-3.5 text-[#6B726D]" />
                            Edit
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            render={
                              <Link to={`/management/users/${user.id}`} />
                            }
                            className="h-8 gap-1.5 rounded-md border-[#E5E7E5] px-2.5 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7]"
                          >
                            <Eye className="h-3.5 w-3.5 text-[#6B726D]" />
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}