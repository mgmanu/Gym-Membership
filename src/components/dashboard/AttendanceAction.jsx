import React from "react";
import {
  CalendarCheck,
  TrendingUp,
} from "lucide-react";

function AttendanceAction({
  members,
  attendance,
}) {
  const percentage =
    members.length === 0
      ? 0
      : Math.round(
          (attendance / members.length) * 100
        );

  const chartData = [
    52,
    68,
    45,
    78,
    63,
    88,
    percentage,
  ];

  return (
    <div className="dashboard-mini-card attendance-dashboard-card">
      <div className="dashboard-mini-header">
        <div>
          <h3>Today's Attendance</h3>

          <p>
            Member check-ins for today
          </p>
        </div>

        <div className="dashboard-mini-icon">
          <CalendarCheck size={18} />
        </div>
      </div>

      <div className="attendance-dashboard-body">
        <div className="attendance-dashboard-number">
          <span>Checked In</span>

          <strong>{attendance}</strong>

          <div className="attendance-dashboard-growth">
            <TrendingUp size={11} />

            <span>
              {percentage}% of members
            </span>
          </div>
        </div>

        <div className="attendance-dashboard-chart">
          <div className="attendance-chart-bars">
            {chartData.map((height, index) => (
              <div
                key={index}
                className={`attendance-chart-bar ${
                  index === 6
                    ? "attendance-chart-current"
                    : ""
                }`}
                style={{
                  height: `${Math.max(
                    12,
                    height
                  )}%`,
                }}
              />
            ))}
          </div>

          <div className="attendance-chart-labels">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceAction;