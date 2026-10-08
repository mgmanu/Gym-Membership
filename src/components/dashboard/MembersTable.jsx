import React from "react";
import {
  Eye,
  Trash2,
  CalendarCheck,
} from "lucide-react";

function MembersTable({
  members,
  onDelete,
  onView,
  onCheckIn,
  attendancePage = false,
}) {
  function getInitials(name) {
    if (
      typeof name !== "string" ||
      name.trim() === ""
    ) {
      return "?";
    }

    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>MEMBER</th>
            <th>PLAN</th>
            <th>PAYMENT</th>
            <th>EXPIRY</th>

            {attendancePage && (
              <th>ATTENDANCE</th>
            )}

            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {members.length === 0 ? (
            <tr>
              <td
                colSpan={
                  attendancePage ? 6 : 5
                }
                className="empty-table"
              >
                No members found.
              </td>
            </tr>
          ) : (
            members.map((member) => {
              // Supabase database fields
              const memberName =
                member.full_name ??
                member.name ??
                "Unknown Member";

              const phone =
                member.phone ?? "-";

              const plan =
                member.plan_type ??
                member.plan ??
                "-";

              const payment =
                member.payment_status ??
                member.payment ??
                "Pending";

              const expiry =
                member.expiry_date ??
                member.expiry;

              return (
                <tr key={member.id}>
                  {/* MEMBER */}
                  <td>
                    <div className="table-member">
                      <div className="member-avatar">
                        {getInitials(
                          memberName
                        )}
                      </div>

                      <div className="member-name">
                        <strong>
                          {memberName}
                        </strong>

                        <span>
                          {phone}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* PLAN */}
                  <td>
                    <span className="plan-badge">
                      {plan}
                    </span>
                  </td>

                  {/* PAYMENT */}
                  <td>
                    <span
                      className={`status-badge ${
                        payment === "Paid"
                          ? "active-status"
                          : "pending-status"
                      }`}
                    >
                      {payment}
                    </span>
                  </td>

                  {/* EXPIRY */}
                  <td>
                    {formatDate(expiry)}
                  </td>

                  {/* ATTENDANCE */}
                  {attendancePage && (
                    <td>
                      {member.attendance ? (
                        <span className="checkin-done">
                          <CalendarCheck
                            size={12}
                          />
                          Checked In
                        </span>
                      ) : (
                        <button
                          className="checkin-button"
                          onClick={() =>
                            onCheckIn?.(
                              member.id
                            )
                          }
                          type="button"
                        >
                          <CalendarCheck
                            size={12}
                          />
                          Check In
                        </button>
                      )}
                    </td>
                  )}

                  {/* ACTIONS */}
                  <td>
                    <div className="action-buttons">
                      <button
                        className="view-button"
                        onClick={() =>
                          onView?.(member)
                        }
                        title="View member"
                        type="button"
                      >
                        <Eye size={13} />
                      </button>

                      {!attendancePage && (
                        <button
                          className="delete-button"
                          onClick={() =>
                            onDelete?.(
                              member.id
                            )
                          }
                          title="Delete member"
                          type="button"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MembersTable;