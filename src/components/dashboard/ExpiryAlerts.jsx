import React from "react";
import {
  ChevronRight,
  Clock,
} from "lucide-react";

function ExpiryAlerts({
  members,
  onView,
}) {
  function getDaysLeft(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);

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
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    <div className="expiry-card">

      <div className="card-header">

        <div>
          <h3>Expiry Alerts</h3>

          <p>
            Memberships requiring attention
          </p>
        </div>

        <div className="alert-count">
          {members.length}
        </div>

      </div>

      <div className="expiry-list">

        {members.length === 0 ? (

          <div className="empty-alert">
            No memberships expiring soon.
          </div>

        ) : (

          members.slice(0, 4).map((member) => {

            const days =
              getDaysLeft(member.expiry);

            return (
              <div
                className="expiry-item"
                key={member.id}
              >

                <div className="member-avatar">
                  {getInitials(member.name)}
                </div>

                <div className="expiry-info">

                  <strong>
                    {member.name}
                  </strong>

                  <span>
                    Expires{" "}
                    {formatDate(member.expiry)}
                  </span>

                </div>

                <span className="days-left">

                  {days <= 0
                    ? "Expired"
                    : `${days} days`}

                </span>

                <button
                  className="view-button"
                  onClick={() =>
                    onView(member)
                  }
                >
                  <ChevronRight size={13} />
                </button>

              </div>
            );
          })

        )}

      </div>

      <button className="view-alerts">
        <Clock size={12} />
        View all expiry alerts
      </button>

    </div>
  );
}

export default ExpiryAlerts;