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
    <div className="attendance-card">

      <div className="card-header">

        <div>
          <h3>Today's Attendance</h3>

          <p>
            Member check-ins for today
          </p>
        </div>

        <CalendarCheck size={18} />

      </div>

      <div className="attendance-body">

        <div className="attendance-number">

          <span>Checked In</span>

          <strong>{attendance}</strong>

          <div className="attendance-growth">

            <TrendingUp size={11} />

            {percentage}% of members

          </div>

        </div>

        <div className="attendance-chart">

          <div className="chart-bars">

            {chartData.map((height, index) => (

              <div
                key={index}
                className={`bar ${
                  index === 6 ? "current" : ""
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

          <div className="chart-labels">
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