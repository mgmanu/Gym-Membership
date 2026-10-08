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
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
                colSpan={attendancePage ? 6 : 5}
                className="empty-table"
              >
                No members found.
              </td>
            </tr>

          ) : (

            members.map((member) => (

              <tr key={member.id}>

                <td>

                  <div className="table-member">

                    <div className="member-avatar">
                      {getInitials(member.name)}
                    </div>

                    <div className="member-name">
                      <strong>{member.name}</strong>
                      <span>{member.phone}</span>
                    </div>

                  </div>

                </td>

                <td>
                  <span className="plan-badge">
                    {member.plan}
                  </span>
                </td>

                <td>

                  <span
                    className={`status-badge ${
                      member.payment === "Paid"
                        ? "active-status"
                        : "pending-status"
                    }`}
                  >
                    {member.payment}
                  </span>

                </td>

                <td>
                  {formatDate(member.expiry)}
                </td>

                {attendancePage && (

                  <td>

                    {member.attendance ? (

                      <span className="checkin-done">
                        <CalendarCheck size={12} />
                        Checked In
                      </span>

                    ) : (

                      <button
                        className="checkin-button"
                        onClick={() =>
                          onCheckIn(member.id)
                        }
                      >
                        <CalendarCheck size={12} />
                        Check In
                      </button>

                    )}

                  </td>

                )}

                <td>

                  <div className="action-buttons">

                    <button
                      className="view-button"
                      onClick={() =>
                        onView(member)
                      }
                      title="View member"
                    >
                      <Eye size={13} />
                    </button>

                    {!attendancePage && (
                      <button
                        className="delete-button"
                        onClick={() =>
                          onDelete(member.id)
                        }
                        title="Delete member"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}

                  </div>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}

export default MembersTable;