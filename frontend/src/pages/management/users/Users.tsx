import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../../components/common/PageHeader';
import { DUMMY_USERS } from '../../../lib/dummyData';
import type { User, UserRole } from '../../../types/user';
import { formatDate } from '../../../lib/utils';
import { Plus, Search, Shield, Edit2, Eye, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';

export const Users: React.FC = () => {
  const [usersList, setUsersList] = useState<User[]>(DUMMY_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('TEAM_MEMBER');
  const [department, setDepartment] = useState('Frontend');

  const filteredUsers = usersList.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (editingUser) {
      setUsersList(
        usersList.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: name.trim(), email: email.trim(), role, department }
            : u
        )
      );
      setEditingUser(null);
    } else {
      const newUser: User = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        role,
        department,
        joinedDate: new Date().toISOString().split('T')[0],
        reportCompletionRate: 100,
      };
      setUsersList([newUser, ...usersList]);
    }

    setName('');
    setEmail('');
    setRole('TEAM_MEMBER');
    setShowAddForm(false);
  };

  const startEdit = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setDepartment(user.department || 'Frontend');
    setShowAddForm(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setUsersList(usersList.filter((u) => u.id !== deletingId));
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Access & Role Administration"
        description="Manage workspace users, permissions, and departmental role assignments."
        action={
          <button
            onClick={() => {
              setEditingUser(null);
              setName('');
              setEmail('');
              setRole('TEAM_MEMBER');
              setShowAddForm(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#8DF688] px-4 py-2 text-xs font-bold text-[#171A18] hover:bg-[#7ae875] transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        }
      />

      {/* Add / Edit Form Modal */}
      {showAddForm && (
        <form
          onSubmit={handleSaveUser}
          className="rounded-2xl border border-[#8DF688] bg-[#8DF688]/10 p-6 space-y-4 animate-in fade-in duration-150"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#171A18]">
            {editingUser ? 'Edit User Credentials & Role' : 'Invite New Team Member'}
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#171A18] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rachel Adams"
                className="w-full rounded-xl border border-[#E5E7E5] bg-white px-3.5 py-2 text-xs font-medium text-[#171A18] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171A18] mb-1">
                Work Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rachel@teampulse.io"
                className="w-full rounded-xl border border-[#E5E7E5] bg-white px-3.5 py-2 text-xs font-medium text-[#171A18] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171A18] mb-1">
                Role Permission Level *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full rounded-xl border border-[#E5E7E5] bg-white px-3.5 py-2 text-xs font-semibold text-[#171A18] outline-none"
              >
                <option value="TEAM_MEMBER">Team Member</option>
                <option value="MANAGER">Engineering Manager</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171A18] mb-1">
                Department / Team
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Frontend Core"
                className="w-full rounded-xl border border-[#E5E7E5] bg-white px-3.5 py-2 text-xs font-medium text-[#171A18] outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-lg border border-[#E5E7E5] bg-white px-4 py-2 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#171A18] px-5 py-2 text-xs font-bold text-white hover:bg-black cursor-pointer"
            >
              {editingUser ? 'Save User Changes' : 'Send Invitation'}
            </button>
          </div>
        </form>
      )}

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between rounded-xl border border-[#E5E7E5] bg-white p-4">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] px-3 py-1.5 text-xs max-w-sm">
          <Search className="h-3.5 w-3.5 text-[#6B726D]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user name, email, or role..."
            className="w-full bg-transparent text-[#171A18] outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-[#E5E7E5] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E7E5] bg-[#F7F8F7] text-[#6B726D]">
                <th className="py-3 px-4 font-semibold">User Details</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Department</th>
                <th className="py-3 px-3 font-semibold">Joined Date</th>
                <th className="py-3 px-3 font-semibold">Compliance</th>
                <th className="py-3 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7E5]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#F7F8F7]/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#171A18]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#171A18] text-white text-xs font-bold">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div>{u.name}</div>
                        <div className="text-[11px] text-[#6B726D] font-normal">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-[#171A18] bg-[#F7F8F7] px-2.5 py-1 rounded-md border border-[#E5E7E5]">
                      <Shield className="h-3 w-3 text-[#8DF688]" />
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#6B726D] font-medium">{u.department || 'Engineering'}</td>
                  <td className="py-3.5 px-3 text-[#6B726D]">{formatDate(u.joinedDate)}</td>
                  <td className="py-3.5 px-3 font-bold text-emerald-700">
                    {u.reportCompletionRate || 95}%
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Link
                      to={`/management/users/${u.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7] px-2.5 py-1 rounded-md border border-[#E5E7E5]"
                    >
                      <Eye className="h-3.5 w-3.5 text-[#6B726D]" />
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => startEdit(u)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7] px-2.5 py-1 rounded-md border border-[#E5E7E5] cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5 text-[#6B726D]" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(u.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deletingId !== null}
        title="Revoke User Access"
        message="Are you sure you want to deactivate and remove this user account?"
        confirmText="Revoke User"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
