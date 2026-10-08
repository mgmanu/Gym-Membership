import React, { useMemo, useState } from "react";

import {
  Users,
  UserPlus,
  CreditCard,
  CalendarCheck,
  RefreshCw,
  Bell,
  Search,
  LogOut,
  LayoutDashboard,
  ChevronRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  X,
  Check,
  Menu,
  UserRound,
} from "lucide-react";

import MembersTable from "../components/dashboard/MembersTable";
import AttendanceAction from "../components/dashboard/AttendanceAction";
import ExpiryAlerts from "../components/dashboard/ExpiryAlerts";

const initialMembers = [
  {
    id: 1,
    name: "Rahul Sharma",
    phone: "9876543210",
    plan: "1 Year",
    payment: "Paid",
    expiry: "2027-08-14",
    joined: "2026-08-14",
    attendance: false,
  },
  {
    id: 2,
    name: "Priya Reddy",
    phone: "9845123456",
    plan: "3 Months",
    payment: "Paid",
    expiry: "2026-11-12",
    joined: "2026-08-12",
    attendance: true,
  },
  {
    id: 3,
    name: "Arjun Kumar",
    phone: "9988776655",
    plan: "1 Month",
    payment: "Pending",
    expiry: "2026-10-22",
    joined: "2026-09-22",
    attendance: false,
  },
  {
    id: 4,
    name: "Sneha Gowda",
    phone: "9911223344",
    plan: "1 Year",
    payment: "Paid",
    expiry: "2027-04-03",
    joined: "2026-04-03",
    attendance: true,
  },
  {
    id: 5,
    name: "Vikram Singh",
    phone: "9765432109",
    plan: "3 Months",
    payment: "Paid",
    expiry: "2026-10-18",
    joined: "2026-07-18",
    attendance: false,
  },
  {
    id: 6,
    name: "Ananya Rao",
    phone: "9898989898",
    plan: "1 Year",
    payment: "Paid",
    expiry: "2027-01-20",
    joined: "2026-01-20",
    attendance: false,
  },
];

const initialPayments = [
  {
    id: 101,
    member: "Rahul Sharma",
    amount: 12000,
    date: "2026-08-14",
    status: "Paid",
  },
  {
    id: 102,
    member: "Priya Reddy",
    amount: 4500,
    date: "2026-08-12",
    status: "Paid",
  },
  {
    id: 103,
    member: "Arjun Kumar",
    amount: 1800,
    date: "2026-09-22",
    status: "Pending",
  },
  {
    id: 104,
    member: "Sneha Gowda",
    amount: 12000,
    date: "2026-04-03",
    status: "Paid",
  },
];

function DashboardPage({ onLogout }) {
  const [activePage, setActivePage] =
    useState("Dashboard");

  const [members, setMembers] =
    useState(initialMembers);

  const [payments, setPayments] =
    useState(initialPayments);

  const [search, setSearch] = useState("");

  const [selectedMember, setSelectedMember] =
    useState(null);

  const [showRegister, setShowRegister] =
    useState(false);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showMobileMenu, setShowMobileMenu] =
    useState(false);

  const [notification, setNotification] =
    useState("");

  const [newMember, setNewMember] = useState({
    name: "",
    phone: "",
    plan: "",
    payment: "Paid",
  });

  const [attendance, setAttendance] =
    useState(
      initialMembers.filter(
        (member) => member.attendance
      ).length
    );

  const today = new Date();

  function formatDate(dateString) {
    return new Date(
      dateString
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function showMessage(message) {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 2500);
  }

  const activeMembers = members.filter(
    (member) =>
      new Date(member.expiry) >= today
  ).length;

  const pendingPayments = payments.filter(
    (payment) =>
      payment.status === "Pending"
  ).length;

  const totalRevenue = payments
    .filter(
      (payment) =>
        payment.status === "Paid"
    )
    .reduce(
      (sum, payment) =>
        sum + payment.amount,
      0
    );

  const expiryMembers = members.filter(
    (member) => {
      const expiry =
        new Date(member.expiry);

      const difference =
        (expiry.getTime() -
          today.getTime()) /
        (1000 * 60 * 60 * 24);

      return difference <= 30;
    }
  );

  const filteredMembers = useMemo(() => {
    return members.filter((member) =>
      `${member.name} ${member.phone} ${member.plan}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [members, search]);

  function handleNavigation(page) {
    setActivePage(page);
    setShowMobileMenu(false);
    setShowNotifications(false);
  }

  function handleDeleteMember(id) {
    const member = members.find(
      (item) => item.id === id
    );

    if (!member) return;

    const confirmed = window.confirm(
      `Delete ${member.name}?`
    );

    if (!confirmed) return;

    setMembers((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );

    setPayments((current) =>
      current.filter(
        (payment) =>
          payment.member !== member.name
      )
    );

    if (
      selectedMember?.id === id
    ) {
      setSelectedMember(null);
    }

    showMessage(
      `${member.name} removed successfully.`
    );
  }

  function handleCheckIn(id) {
    const member = members.find(
      (item) => item.id === id
    );

    if (!member) return;

    if (member.attendance) {
      showMessage(
        `${member.name} is already checked in.`
      );
      return;
    }

    setMembers((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              attendance: true,
            }
          : item
      )
    );

    setAttendance(
      (current) => current + 1
    );

    showMessage(
      `${member.name} checked in successfully.`
    );
  }

  function handleRegister(event) {
    event.preventDefault();

    if (
      !newMember.name.trim() ||
      !newMember.phone.trim() ||
      !newMember.plan
    ) {
      showMessage(
        "Please fill all required fields."
      );
      return;
    }

    const planMonths = {
      "1 Month": 1,
      "3 Months": 3,
      "1 Year": 12,
    };

    const planPrice = {
      "1 Month": 1800,
      "3 Months": 4500,
      "1 Year": 12000,
    };

    const expiry = new Date();

    expiry.setMonth(
      expiry.getMonth() +
        planMonths[newMember.plan]
    );

    const member = {
      id: Date.now(),
      name: newMember.name.trim(),
      phone: newMember.phone.trim(),
      plan: newMember.plan,
      payment: newMember.payment,
      expiry: expiry
        .toISOString()
        .split("T")[0],
      joined: new Date()
        .toISOString()
        .split("T")[0],
      attendance: false,
    };

    setMembers((current) => [
      member,
      ...current,
    ]);

    if (
      newMember.payment === "Paid"
    ) {
      setPayments((current) => [
        {
          id: Date.now(),
          member: member.name,
          amount:
            planPrice[newMember.plan],
          date: new Date()
            .toISOString()
            .split("T")[0],
          status: "Paid",
        },
        ...current,
      ]);
    }

    setNewMember({
      name: "",
      phone: "",
      plan: "",
      payment: "Paid",
    });

    setShowRegister(false);

    showMessage(
      `${member.name} registered successfully.`
    );
  }

  function handleRenew(member) {
    const months = {
      "1 Month": 1,
      "3 Months": 3,
      "1 Year": 12,
    };

    const newExpiry = new Date();

    newExpiry.setMonth(
      newExpiry.getMonth() + 1
    );

    setMembers((current) =>
      current.map((item) =>
        item.id === member.id
          ? {
              ...item,
              plan: "1 Month",
              expiry: newExpiry
                .toISOString()
                .split("T")[0],
              payment: "Paid",
            }
          : item
      )
    );

    setPayments((current) => [
      {
        id: Date.now(),
        member: member.name,
        amount: 1800,
        date: new Date()
          .toISOString()
          .split("T")[0],
        status: "Paid",
      },
      ...current,
    ]);

    showMessage(
      `${member.name}'s membership renewed.`
    );
  }

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={16} />,
    },
    {
      name: "Members",
      icon: <Users size={16} />,
    },
    {
      name: "Attendance",
      icon: <CalendarCheck size={16} />,
    },
    {
      name: "Payments",
      icon: <CreditCard size={16} />,
    },
    {
      name: "Renewals",
      icon: <RefreshCw size={16} />,
    },
  ];

  return (
    <div className="app">

      {/* NAVBAR */}

      <header className="navbar">

        <div className="brand">

          <div className="brand-logo">
            <ShieldCheck size={20} />
          </div>

          <div className="brand-text">
            <h2>Gym Management</h2>
            <span>ADMIN PORTAL</span>
          </div>

        </div>

        <button
          className="mobile-menu-button"
          onClick={() =>
            setShowMobileMenu(
              (value) => !value
            )
          }
        >
          <Menu size={20} />
        </button>

        <div className="navbar-right">

          <button
            className="nav-icon"
            onClick={() =>
              setShowNotifications(
                (value) => !value
              )
            }
          >
            <Bell size={17} />

            {expiryMembers.length > 0 && (
              <span className="notification-dot" />
            )}
          </button>

          <div className="profile">

            <div className="profile-avatar">
              M
            </div>

            <div className="profile-details">
              <strong>Manish</strong>
              <span>Administrator</span>
            </div>

          </div>

          <button
            className="nav-icon"
            onClick={onLogout}
            title="Logout"
          >
            <LogOut size={16} />
          </button>

        </div>

      </header>

      {/* NOTIFICATION PANEL */}

      {showNotifications && (

        <div className="notification-panel">

          <div className="notification-header">

            <strong>Notifications</strong>

            <button
              onClick={() =>
                setShowNotifications(false)
              }
            >
              <X size={15} />
            </button>

          </div>

          {expiryMembers.length === 0 ? (

            <p>No expiry alerts.</p>

          ) : (

            expiryMembers.map((member) => (

              <button
                className="notification-item"
                key={member.id}
                onClick={() => {
                  setSelectedMember(member);
                  setShowNotifications(false);
                }}
              >
                <strong>{member.name}</strong>

                <span>
                  Membership expires on{" "}
                  {formatDate(member.expiry)}
                </span>
              </button>

            ))

          )}

        </div>

      )}

      <div className="layout">

        {/* SIDEBAR */}

        <aside
          className={`sidebar ${
            showMobileMenu
              ? "sidebar-open"
              : ""
          }`}
        >

          <div className="menu-heading">
            MAIN MENU
          </div>

          <nav>

            {menuItems.map((item) => (

              <button
                key={item.name}
                className={`menu-item ${
                  activePage === item.name
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleNavigation(
                    item.name
                  )
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </button>

            ))}

          </nav>

          <div className="sidebar-bottom">

            <div className="gym-status">

              <span className="status-dot" />

              <div>
                <strong>Gym is Open</strong>
                <span>
                  06:00 AM - 10:00 PM
                </span>
              </div>

            </div>

            <button
              className="sidebar-logout"
              onClick={onLogout}
            >
              <LogOut size={13} />
              Logout
            </button>

            <div className="sidebar-version">
              Gym Management System
              <br />
              Version 1.0
            </div>

          </div>

        </aside>

        {/* MAIN */}

        <main className="main">

          {notification && (

            <div className="toast">

              <Check size={15} />

              {notification}

            </div>

          )}

          {/* PAGE HEADER */}

          <div className="page-header">

            <div>

              <div className="breadcrumb">
                <span>Home</span>
                <ChevronRight size={10} />
                <strong>{activePage}</strong>
              </div>

              <h1>{activePage}</h1>

              <p>
                {activePage === "Dashboard"
                  ? "Welcome back, Admin. Here's what's happening at your gym today."
                  : `Manage your gym's ${activePage.toLowerCase()} from one place.`}
              </p>

            </div>

            <button className="date-button">
              <Clock size={13} />

              {today.toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            </button>

          </div>

          {/* DASHBOARD */}

          {activePage === "Dashboard" && (

            <>

              <div className="stats-grid">

                <div className="stat-card">

                  <div className="stat-top">

                    <div className="stat-icon">
                      <Users size={18} />
                    </div>

                    <TrendingUp size={13} />

                  </div>

                  <div className="stat-content">

                    <span className="stat-title">
                      Total Members
                    </span>

                    <h2>
                      {members.length}
                    </h2>

                    <div className="stat-footer">
                      <span className="up">
                        +12%
                      </span>
                      <span>
                        this month
                      </span>
                    </div>

                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-top">

                    <div className="stat-icon">
                      <UserRound size={18} />
                    </div>

                  </div>

                  <div className="stat-content">

                    <span className="stat-title">
                      Active Members
                    </span>

                    <h2>
                      {activeMembers}
                    </h2>

                    <div className="stat-footer">
                      <span className="up">
                        {members.length
                          ? Math.round(
                              (activeMembers /
                                members.length) *
                                100
                            )
                          : 0}
                        %
                      </span>

                      <span>
                        of total
                      </span>
                    </div>

                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-top">

                    <div className="stat-icon">
                      <CreditCard size={18} />
                    </div>

                  </div>

                  <div className="stat-content">

                    <span className="stat-title">
                      Revenue
                    </span>

                    <h2>
                      ₹
                      {totalRevenue.toLocaleString(
                        "en-IN"
                      )}
                    </h2>

                    <div className="stat-footer">
                      <span className="up">
                        +8.4%
                      </span>

                      <span>
                        this month
                      </span>
                    </div>

                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-top">

                    <div className="stat-icon">
                      <Clock size={18} />
                    </div>

                  </div>

                  <div className="stat-content">

                    <span className="stat-title">
                      Expiring Soon
                    </span>

                    <h2>
                      {expiryMembers.length}
                    </h2>

                    <div className="stat-footer">
                      <span className="attention">
                        Attention
                      </span>

                      <span>
                        required
                      </span>
                    </div>

                  </div>

                </div>

              </div>

              <div className="middle-grid">

                <AttendanceAction
                  members={members}
                  attendance={attendance}
                />

                <ExpiryAlerts
                  members={expiryMembers}
                  onView={setSelectedMember}
                />

              </div>

              <div className="table-card">

                <div className="card-header">

                  <div>
                    <h3>
                      Recent Members
                    </h3>

                    <p>
                      Latest members registered
                      in your gym
                    </p>
                  </div>

                  <button
                    className="small-button"
                    onClick={() =>
                      handleNavigation(
                        "Members"
                      )
                    }
                  >
                    View All
                  </button>

                </div>

                <MembersTable
                  members={members.slice(0, 5)}
                  onDelete={
                    handleDeleteMember
                  }
                  onView={
                    setSelectedMember
                  }
                  onCheckIn={
                    handleCheckIn
                  }
                />

              </div>

            </>

          )}

          {/* MEMBERS */}

          {activePage === "Members" && (

            <>

              <div className="member-stats">

                <div className="member-stat">

                  <div className="member-stat-icon">
                    <Users size={18} />
                  </div>

                  <div>
                    <span>
                      Total Members
                    </span>

                    <strong>
                      {members.length}
                    </strong>
                  </div>

                </div>

                <div className="member-stat">

                  <div className="member-stat-icon">
                    <ShieldCheck size={18} />
                  </div>

                  <div>
                    <span>Active</span>

                    <strong>
                      {activeMembers}
                    </strong>
                  </div>

                </div>

                <div className="member-stat">

                  <div className="member-stat-icon">
                    <Clock size={18} />
                  </div>

                  <div>
                    <span>
                      Expiring Soon
                    </span>

                    <strong>
                      {expiryMembers.length}
                    </strong>
                  </div>

                </div>

              </div>

              <div className="table-card">

                <div className="members-toolbar">

                  <div>
                    <h3>All Members</h3>

                    <p>
                      Search and manage your
                      members
                    </p>
                  </div>

                  <div className="member-filters">

                    <div className="member-search">

                      <Search size={14} />

                      <input
                        value={search}
                        onChange={(event) =>
                          setSearch(
                            event.target.value
                          )
                        }
                        placeholder="Search members..."
                      />

                    </div>

                    <button
                      className="register-button"
                      onClick={() =>
                        setShowRegister(true)
                      }
                    >
                      <UserPlus size={13} />
                      Add Member
                    </button>

                  </div>

                </div>

                <MembersTable
                  members={filteredMembers}
                  onDelete={
                    handleDeleteMember
                  }
                  onView={
                    setSelectedMember
                  }
                  onCheckIn={
                    handleCheckIn
                  }
                />

              </div>

            </>

          )}

          {/* ATTENDANCE */}

          {activePage === "Attendance" && (

            <div className="table-card">

              <div className="card-header">

                <div>
                  <h3>
                    Today's Attendance
                  </h3>

                  <p>
                    {attendance} members
                    checked in today
                  </p>
                </div>

                <CalendarCheck size={19} />

              </div>

              <MembersTable
                members={members}
                attendancePage={true}
                onCheckIn={
                  handleCheckIn
                }
                onView={
                  setSelectedMember
                }
              />

            </div>

          )}

          {/* PAYMENTS */}

          {activePage === "Payments" && (

            <>

              <div className="payment-stats">

                <div className="payment-stat">

                  <div className="payment-icon">
                    <CreditCard size={18} />
                  </div>

                  <span>
                    Total Revenue
                  </span>

                  <strong>
                    ₹
                    {totalRevenue.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                  <small>
                    +8.4% this month
                  </small>

                </div>

                <div className="payment-stat">

                  <div className="payment-icon">
                    <Check size={18} />
                  </div>

                  <span>
                    Paid Transactions
                  </span>

                  <strong>
                    {
                      payments.filter(
                        (payment) =>
                          payment.status ===
                          "Paid"
                      ).length
                    }
                  </strong>

                </div>

                <div className="payment-stat">

                  <div className="payment-icon">
                    <Clock size={18} />
                  </div>

                  <span>
                    Pending
                  </span>

                  <strong>
                    {pendingPayments}
                  </strong>

                </div>

              </div>

              <div className="table-card">

                <div className="card-header">

                  <div>
                    <h3>
                      Payment History
                    </h3>

                    <p>
                      Recent membership
                      payments
                    </p>
                  </div>

                </div>

                <div className="table-wrapper">

                  <table>

                    <thead>
                      <tr>
                        <th>MEMBER</th>
                        <th>AMOUNT</th>
                        <th>DATE</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>

                    <tbody>

                      {payments.map(
                        (payment) => (

                          <tr
                            key={
                              payment.id
                            }
                          >

                            <td>
                              {payment.member}
                            </td>

                            <td>
                              ₹
                              {payment.amount.toLocaleString(
                                "en-IN"
                              )}
                            </td>

                            <td>
                              {formatDate(
                                payment.date
                              )}
                            </td>

                            <td>

                              <span
                                className={`status-badge ${
                                  payment.status ===
                                  "Paid"
                                    ? "active-status"
                                    : "pending-status"
                                }`}
                              >
                                {
                                  payment.status
                                }
                              </span>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </>

          )}

          {/* RENEWALS */}

          {activePage === "Renewals" && (

            <div className="renewal-grid">

              {expiryMembers.length === 0 ? (

                <div className="empty-page">
                  No memberships require renewal.
                </div>

              ) : (

                expiryMembers.map(
                  (member) => (

                    <div
                      className="renewal-card"
                      key={member.id}
                    >

                      <div className="renewal-card-top">

                        <div className="table-member">

                          <div className="member-avatar">
                            {member.name
                              .split(" ")
                              .map(
                                (word) =>
                                  word[0]
                              )
                              .join("")
                              .slice(0, 2)}
                          </div>

                          <div className="member-name">

                            <strong>
                              {member.name}
                            </strong>

                            <span>
                              {member.plan}
                            </span>

                          </div>

                        </div>

                        <span className="renewal-warning">
                          Expiring Soon
                        </span>

                      </div>

                      <div className="renewal-details">

                        <div>
                          <span>
                            Current Expiry
                          </span>

                          <strong>
                            {formatDate(
                              member.expiry
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Phone
                          </span>

                          <strong>
                            {member.phone}
                          </strong>
                        </div>

                      </div>

                      <button
                        className="renew-button"
                        onClick={() =>
                          handleRenew(
                            member
                          )
                        }
                      >
                        <RefreshCw size={13} />
                        Renew Membership
                      </button>

                    </div>

                  )
                )

              )}

            </div>

          )}

        </main>

      </div>

      {/* REGISTER MODAL */}

      {showRegister && (

        <div className="modal-overlay">

          <div className="member-modal">

            <div className="modal-header">

              <h2>
                Register New Member
              </h2>

              <button
                className="modal-close"
                onClick={() =>
                  setShowRegister(false)
                }
              >
                <X size={15} />
              </button>

            </div>

            <form
              onSubmit={handleRegister}
            >

              <div className="modal-form">

                <div className="form-group">

                  <label>
                    Full Name
                  </label>

                  <input
                    value={newMember.name}
                    onChange={(event) =>
                      setNewMember({
                        ...newMember,
                        name:
                          event.target.value,
                      })
                    }
                    placeholder="Enter full name"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Phone Number
                  </label>

                  <input
                    value={newMember.phone}
                    onChange={(event) =>
                      setNewMember({
                        ...newMember,
                        phone:
                          event.target.value,
                      })
                    }
                    placeholder="Enter phone number"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Membership Plan
                  </label>

                  <select
                    value={newMember.plan}
                    onChange={(event) =>
                      setNewMember({
                        ...newMember,
                        plan:
                          event.target.value,
                      })
                    }
                  >
                    <option value="">
                      Select plan
                    </option>

                    <option value="1 Month">
                      1 Month
                    </option>

                    <option value="3 Months">
                      3 Months
                    </option>

                    <option value="1 Year">
                      1 Year
                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Payment Status
                  </label>

                  <select
                    value={
                      newMember.payment
                    }
                    onChange={(event) =>
                      setNewMember({
                        ...newMember,
                        payment:
                          event.target.value,
                      })
                    }
                  >
                    <option value="Paid">
                      Paid
                    </option>

                    <option value="Pending">
                      Pending
                    </option>

                  </select>

                </div>

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setShowRegister(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="register-button"
                >
                  <UserPlus size={13} />
                  Register Member
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* MEMBER DETAILS MODAL */}

      {selectedMember && (

        <div className="modal-overlay">

          <div className="member-modal">

            <div className="modal-header">

              <h2>
                Member Details
              </h2>

              <button
                className="modal-close"
                onClick={() =>
                  setSelectedMember(null)
                }
              >
                <X size={15} />
              </button>

            </div>

            <div className="modal-profile">

              <div className="large-avatar">

                {selectedMember.name
                  .split(" ")
                  .map(
                    (word) => word[0]
                  )
                  .join("")
                  .slice(0, 2)}

              </div>

              <h3>
                {selectedMember.name}
              </h3>

              <span>
                {selectedMember.phone}
              </span>

            </div>

            <div className="member-details-grid">

              <div>
                <span>Plan</span>

                <strong>
                  {selectedMember.plan}
                </strong>
              </div>

              <div>
                <span>Payment</span>

                <strong>
                  {selectedMember.payment}
                </strong>
              </div>

              <div>
                <span>Joined</span>

                <strong>
                  {formatDate(
                    selectedMember.joined
                  )}
                </strong>
              </div>

              <div>
                <span>Expiry</span>

                <strong>
                  {formatDate(
                    selectedMember.expiry
                  )}
                </strong>
              </div>

            </div>

            <button
              className="register-button modal-button"
              onClick={() =>
                setSelectedMember(null)
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default DashboardPage;