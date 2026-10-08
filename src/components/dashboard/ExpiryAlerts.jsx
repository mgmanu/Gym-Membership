import React from "react";
import {
  ChevronRight,
  AlertCircle,
} from "lucide-react";

function ExpiryAlerts({
  members,
  onView,
}) {
  function getDaysLeft(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);

    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const difference =
      expiry.getTime() - today.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  function getInitials(name) {
    if (!name) return "?";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    <div className="dashboard-mini-card expiry-dashboard-card">
      <div className="dashboard-mini-header">
        <div>
          <h3>Expiry Alerts</h3>

          <p>
            Memberships requiring attention
          </p>
        </div>

        <div className="expiry-alert-count">
          {members.length}
        </div>
      </div>

      <div className="expiry-dashboard-list">
        {members.length === 0 ? (
          <div className="expiry-dashboard-empty">
            <div className="expiry-empty-icon">
              <AlertCircle size={17} />
            </div>

            <strong>
              No memberships expiring soon.
            </strong>

            <span>
              All active memberships are currently
              in good standing.
            </span>
          </div>
        ) : (
          members.slice(0, 4).map((member) => {
            const days = getDaysLeft(
              member.expiry_date ?? member.expiry
            );

            const memberName =
              member.full_name ?? member.name;

            return (
              <div
                className="expiry-dashboard-item"
                key={member.id}
              >
                <div className="expiry-dashboard-avatar">
                  {getInitials(memberName)}
                </div>

                <div className="expiry-dashboard-info">
                  <strong>
                    {memberName}
                  </strong>

                  <span>
                    Expires{" "}
                    {formatDate(
                      member.expiry_date ??
                        member.expiry
                    )}
                  </span>
                </div>

                <span
                  className={`expiry-dashboard-days ${
                    days <= 0
                      ? "expiry-dashboard-expired"
                      : days <= 7
                      ? "expiry-dashboard-warning"
                      : ""
                  }`}
                >
                  {days <= 0
                    ? "Expired"
                    : `${days} days`}
                </span>

                <button
                  className="expiry-dashboard-view"
                  onClick={() =>
                    onView(member)
                  }
                  type="button"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>

      <button
        className="expiry-dashboard-footer"
        type="button"
      >
        View all expiry alerts

        <ChevronRight size={13} />
      </button>
    </div>
  );
}

export default ExpiryAlerts;