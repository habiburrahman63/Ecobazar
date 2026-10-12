import { Link } from "react-router";
import { Eye, Trash2 } from "../common/Icons";

function RoleBadge({ role }) {
  const isPrivileged = role === "admin" || role === "manager";
  return (
    <span
      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize border ${
        isPrivileged
          ? "text-amber bg-amber/10 border-amber/25"
          : "text-slate bg-ink/5 border-ink/10"
      }`}
    >
      {role || "user"}
    </span>
  );
}

function StatusBadge({ isHold, isDelete }) {
  if (isDelete) {
    return (
      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-red-600 bg-red-50 border border-red-200">
        Deleted
      </span>
    );
  }
  if (isHold) {
    return (
      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-amber bg-amber/10 border border-amber/20">
        On Hold
      </span>
    );
  }
  return (
    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-emerald-700 bg-emerald-50 border border-emerald-200">
      Active
    </span>
  );
}

export default function UserTable({
  users,
  handleDelete,
  onDeleteClick,
  handleActive,
}) {
  if (users.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-ink/10 shadow-sm">
        <p className="text-slate text-xs font-semibold uppercase tracking-wider">
          No registered users found
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-ink/10 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-ink/10 text-left text-[11px] text-slate font-bold uppercase tracking-wider bg-[#f8fafc]">
              <th className="px-5 py-3.5">User Identity</th>
              <th className="px-5 py-3.5">Contact Phone</th>
              <th className="px-5 py-3.5">System Role</th>
              <th className="px-5 py-3.5">Account Status</th>
              <th className="px-5 py-3.5">Registered On</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {users.map((user) => {
              const displayName = user.fullname || user.name || "Customer";
              const initials =
                displayName
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() || "U";

              return (
                <tr
                  key={user._id}
                  className="hover:bg-[#f8fafc]/70 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ink to-[#1a2942] text-amber flex items-center justify-center text-xs font-bold shrink-0 shadow-xs border border-white/10">
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold text-ink">{displayName}</p>
                        <p className="text-[11px] text-slate/70">
                          {user.email || "No email"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate font-mono text-[11px]">
                    {user.telephone || user.phone || "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge
                      isHold={user.isHold}
                      isDelete={user.isDelete}
                    />
                  </td>
                  <td className="px-5 py-3.5 text-slate">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/admin/users/${user._id}`}
                        className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate hover:bg-ink/[0.04] hover:text-ink transition-colors"
                        title="View user details"
                      >
                        <Eye size={15} />
                      </Link>

                      {user.isDelete ? (
                        <button
                          onClick={() => handleActive(user._id)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            onDeleteClick ? onDeleteClick(user) : handleDelete(user._id)
                          }
                          className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-red-500/70 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete user"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
