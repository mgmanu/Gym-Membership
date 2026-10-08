import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Bell,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  LogOut,
  Menu,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
  Eye,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import MembersTable from "../components/dashboard/MembersTable";
import AttendanceAction from "../components/dashboard/AttendanceAction";
import ExpiryAlerts from "../components/dashboard/ExpiryAlerts";

import { useAuth } from "../context/AuthContext";

import {
  fetchMembers,
  addMember,
  deleteMember,
  renewMember,
  checkInMember,
  fetchTodayAttendance,
  fetchPayments,
} from "../services/gymOperations";

import {
  getDaysLeft,
  formatDate,
} from "../utils/dateHelpers";

import { supabase } from "../services/supabaseClient";

function DashboardPage({ onLogout, user }) {
  const { user: authUser } = useAuth();

  const currentUser = user || authUser;

  const [activePage, setActivePage] =
    useState("Dashboard");

  const [members, setMembers] = useState([]);

  const [attendance, setAttendance] =
    useState([]);

  const [payments, setPayments] =
    useState([]);

  const [membersLoading, setMembersLoading] =
    useState(true);

  const [attendanceLoading, setAttendanceLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [selectedMember, setSelectedMember] =
    useState(null);

  const [showRegister, setShowRegister] =
    useState(false);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [toast, setToast] =
    useState("");

  const [newMember, setNewMember] =
    useState({
      fullName: "",
      phone: "",
      planType: "1 Month",
      paymentStatus: "Paid",
    });

  const menuItems = [
    {
      label: "Dashboard",
      icon: <CalendarDays size={17} />,
    },
    {
      label: "Members",
      icon: <Users size={17} />,
    },
    {
      label: "Attendance",
      icon: <UserCheck size={17} />,
    },
    {
      label: "Payments",
      icon: <CreditCard size={17} />,
    },
    {
      label: "Renewals",
      icon: <RefreshCw size={17} />,
    },
  ];

  function showToast(message) {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 3000);
  }

  // ==========================================
  // LOAD MEMBERS
  // ==========================================

  async function loadMembers() {
    if (!currentUser?.id) return;

    try {
      setMembersLoading(true);

      const data =
        await fetchMembers(currentUser.id);

      setMembers(data);
    } catch (error) {
      console.error(
        "Unable to load members:",
        error
      );

      showToast(
        "Unable to load members from Supabase."
      );
    } finally {
      setMembersLoading(false);
    }
  }

  // ==========================================
  // LOAD ATTENDANCE
  // ==========================================

  async function loadAttendance() {
    if (!currentUser?.id) return;

    try {
      setAttendanceLoading(true);

      const data =
        await fetchTodayAttendance(
          currentUser.id
        );

      setAttendance(data);
    } catch (error) {
      console.error(
        "Unable to load attendance:",
        error
      );
    } finally {
      setAttendanceLoading(false);
    }
  }

  // ==========================================
  // LOAD PAYMENTS
  // ==========================================

  async function loadPayments() {
    if (!currentUser?.id) return;

    try {
      const data =
        await fetchPayments(currentUser.id);

      setPayments(data);
    } catch (error) {
      console.error(
        "Unable to load payments:",
        error
      );
    }
  }

  // ==========================================
  // INITIAL DATA LOAD
  // ==========================================

  useEffect(() => {
    if (!currentUser?.id) return;

    loadMembers();
    loadAttendance();
    loadPayments();
  }, [currentUser?.id]);

  // ==========================================
  // SUPABASE REALTIME
  // ==========================================

  useEffect(() => {
    if (!currentUser?.id) return;

    console.log(
      "Starting Supabase realtime..."
    );

    const membersChannel =
      supabase
        .channel(
          `gym-members-${currentUser.id}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "gym_members",
            filter: `user_id=eq.${currentUser.id}`,
          },
          async (payload) => {
            console.log(
              "Realtime member change:",
              payload
            );

            await loadMembers();
          }
        )
        .subscribe((status) => {
          console.log(
            "Members realtime status:",
            status
          );
        });

    const paymentsChannel =
      supabase
        .channel(
          `gym-payments-${currentUser.id}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "payments",
            filter: `user_id=eq.${currentUser.id}`,
          },
          async (payload) => {
            console.log(
              "Realtime payment change:",
              payload
            );

            await loadPayments();
          }
        )
        .subscribe((status) => {
          console.log(
            "Payments realtime status:",
            status
          );
        });

    const attendanceChannel =
      supabase
        .channel(
          `gym-attendance-${currentUser.id}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "attendance",
          },
          async (payload) => {
            console.log(
              "Realtime attendance change:",
              payload
            );

            await loadAttendance();
          }
        )
        .subscribe((status) => {
          console.log(
            "Attendance realtime status:",
            status
          );
        });

    return () => {
      console.log(
        "Stopping Supabase realtime..."
      );

      supabase.removeChannel(
        membersChannel
      );

      supabase.removeChannel(
        paymentsChannel
      );

      supabase.removeChannel(
        attendanceChannel
      );
    };
  }, [currentUser?.id]);

  // ==========================================
  // ADD MEMBER
  // ==========================================

  async function handleAddMember(event) {
    event?.preventDefault();

    if (!newMember.fullName.trim()) {
      showToast(
        "Please enter the member name."
      );
      return;
    }

    if (!newMember.phone.trim()) {
      showToast(
        "Please enter the phone number."
      );
      return;
    }

    if (
      !/^[0-9]{10}$/.test(
        newMember.phone
      )
    ) {
      showToast(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    try {
      const createdMember =
        await addMember(
          currentUser.id,
          newMember
        );

      setMembers((current) => [
        createdMember,
        ...current,
      ]);

      setShowRegister(false);

      setNewMember({
        fullName: "",
        phone: "",
        planType: "1 Month",
        paymentStatus: "Paid",
      });

      await loadPayments();

      showToast(
        "Member registered successfully."
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Unable to register member."
      );
    }
  }

  // ==========================================
  // DELETE MEMBER
  // ==========================================

  async function handleDeleteMember(
    memberId
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this member?"
      );

    if (!confirmed) return;

    try {
      await deleteMember(memberId);

      setMembers((current) =>
        current.filter(
          (member) =>
            member.id !== memberId
        )
      );

      if (
        selectedMember?.id === memberId
      ) {
        setSelectedMember(null);
      }

      await loadPayments();

      showToast(
        "Member deleted successfully."
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Unable to delete member."
      );
    }
  }

  // ==========================================
  // CHECK IN
  // ==========================================

  async function handleCheckIn(
    memberId
  ) {
    try {
      await checkInMember(memberId);

      showToast(
        "Member checked in successfully."
      );

      await loadAttendance();
    } catch (error) {
      console.error(error);

      showToast(
        "Unable to record attendance."
      );
    }
  }

  // ==========================================
  // RENEW MEMBER
  // ==========================================

  async function handleRenew(member) {
    try {
      const updatedMember =
        await renewMember(
          member.id,
          member.plan_type,
          currentUser.id
        );

      setMembers((current) =>
        current.map((item) =>
          item.id === updatedMember.id
            ? updatedMember
            : item
        )
      );

      setSelectedMember(
        updatedMember
      );

      await loadPayments();

      showToast(
        `${member.full_name}'s membership renewed.`
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Unable to renew membership."
      );
    }
  }

  // ==========================================
  // FILTER MEMBERS
  // ==========================================

  const filteredMembers = useMemo(() => {
    const value =
      search.trim().toLowerCase();

    if (!value) return members;

    return members.filter((member) => {
      return (
        member.full_name
          ?.toLowerCase()
          .includes(value) ||
        member.phone
          ?.toLowerCase()
          .includes(value) ||
        member.plan_type
          ?.toLowerCase()
          .includes(value)
      );
    });
  }, [members, search]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalMembers =
    members.length;

  const activeMembers =
    members.filter((member) => {
      if (!member.expiry_date)
        return false;

      return (
        getDaysLeft(
          member.expiry_date
        ) >= 0
      );
    }).length;

  const expiringMembers =
    members.filter((member) => {
      if (!member.expiry_date)
        return false;

      const days =
        getDaysLeft(
          member.expiry_date
        );

      return (
        days >= 0 &&
        days <= 30
      );
    }).length;

  const pendingPayments =
    members.filter(
      (member) =>
        member.payment_status ===
        "Pending"
    ).length;

  const totalRevenue =
    payments.reduce(
      (total, payment) => {
        if (
          payment.payment_status ===
          "Paid"
        ) {
          return (
            total +
            Number(payment.amount)
          );
        }

        return total;
      },
      0
    );

  // ==========================================
  // EXPIRING MEMBERS
  // ==========================================

  const expiryMembers =
    members
      .filter((member) => {
        const days =
          getDaysLeft(
            member.expiry_date
          );

        return (
          days >= 0 &&
          days <= 30
        );
      })
      .sort(
        (a, b) =>
          getDaysLeft(
            a.expiry_date
          ) -
          getDaysLeft(
            b.expiry_date
          )
      );

  // ==========================================
  // RECENT MEMBERS
  // ==========================================

  const recentMembers =
    [...members]
      .sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      )
      .slice(0, 5);

  // ==========================================
  // PAGE NAVIGATION
  // ==========================================

  function navigate(page) {
    setActivePage(page);
    setMobileMenu(false);
    setSearch("");
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  function renderDashboard() {
    return (
      <>
        <div className="page-heading">
          <div>
            <div className="breadcrumb">
              Home
              <ChevronRight size={12} />
              Dashboard
            </div>

            <h1>Dashboard</h1>

            <p>
              Welcome back, Admin. Here's
              what's happening at your gym
              today.
            </p>
          </div>

          <div className="date-badge">
            <CalendarDays size={14} />

            {new Date().toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )}
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={18} />
            </div>

            <span className="stat-label">
              TOTAL MEMBERS
            </span>

            <strong>
              {totalMembers}
            </strong>

            <small>
              Members registered
            </small>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <UserCheck size={18} />
            </div>

            <span className="stat-label">
              ACTIVE MEMBERS
            </span>

            <strong>
              {activeMembers}
            </strong>

            <small>
              Currently active
            </small>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <CircleDollarSign size={18} />
            </div>

            <span className="stat-label">
              REVENUE
            </span>

            <strong>
              ₹
              {totalRevenue.toLocaleString(
                "en-IN"
              )}
            </strong>

            <small>
              Total paid revenue
            </small>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Clock3 size={18} />
            </div>

            <span className="stat-label">
              EXPIRING SOON
            </span>

            <strong>
              {expiringMembers}
            </strong>

            <small>
              Next 30 days
            </small>
          </div>
        </div>

        <div className="dashboard-two-column">
          <AttendanceAction
            members={members}
            attendance={attendance.length}
          />

          <ExpiryAlerts
            members={expiryMembers}
            onView={setSelectedMember}
          />
        </div>

        <div className="dashboard-section-card">
          <div className="section-card-header">
            <div>
              <h2>
                Recent Members
              </h2>

              <p>
                Latest members registered
                in your gym
              </p>
            </div>

            <button
              className="secondary-button"
              onClick={() =>
                navigate("Members")
              }
            >
              View All
            </button>
          </div>

          {membersLoading ? (
            <div className="empty-table">
              Loading members...
            </div>
          ) : recentMembers.length === 0 ? (
            <div className="empty-table">
              <Users size={28} />

              <strong>
                No members yet
              </strong>

              <span>
                Register your first member
                to get started.
              </span>

              <button
                className="primary-button"
                onClick={() =>
                  setShowRegister(true)
                }
              >
                <Plus size={15} />
                Add Member
              </button>
            </div>
          ) : (
            <MembersTable
              members={recentMembers}
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
          )}
        </div>
      </>
    );
  }

  // ==========================================
  // MEMBERS PAGE
  // ==========================================

  function renderMembers() {
    return (
      <>
        <div className="page-heading">
          <div>
            <div className="breadcrumb">
              Home
              <ChevronRight size={12} />
              Members
            </div>

            <h1>Members</h1>

            <p>
              Manage all registered gym
              members.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() =>
              setShowRegister(true)
            }
          >
            <UserPlus size={16} />
            Add Member
          </button>
        </div>

        <div className="toolbar-card">
          <div className="search-box">
            <Search size={16} />

            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

            {search && (
              <button
                onClick={() =>
                  setSearch("")
                }
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="member-count">
            {filteredMembers.length} members
          </div>
        </div>

        <div className="dashboard-section-card">
          {membersLoading ? (
            <div className="empty-table">
              Loading members...
            </div>
          ) : (
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
          )}
        </div>
      </>
    );
  }

  // ==========================================
  // ATTENDANCE PAGE
  // ==========================================

  function renderAttendance() {
    return (
      <>
        <div className="page-heading">
          <div>
            <div className="breadcrumb">
              Home
              <ChevronRight size={12} />
              Attendance
            </div>

            <h1>Attendance</h1>

            <p>
              Track today's member
              check-ins.
            </p>
          </div>
        </div>

        <AttendanceAction
          members={members}
          attendance={attendance.length}
        />

        <div className="dashboard-section-card">
          <div className="section-card-header">
            <div>
              <h2>
                Today's Check-ins
              </h2>

              <p>
                Members who checked in
                today
              </p>
            </div>

            <span className="member-count">
              {attendance.length} check-ins
            </span>
          </div>

          {attendanceLoading ? (
            <div className="empty-table">
              Loading attendance...
            </div>
          ) : attendance.length === 0 ? (
            <div className="empty-table">
              <UserCheck size={28} />

              <strong>
                No check-ins today
              </strong>

              <span>
                Check in members from the
                Members page.
              </span>
            </div>
          ) : (
            <div className="attendance-list">
              {attendance.map((item) => (
                <div
                  className="attendance-row"
                  key={item.id}
                >
                  <div className="member-avatar">
                    {item.gym_members?.full_name
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>

                  <div className="attendance-member">
                    <strong>
                      {
                        item.gym_members
                          ?.full_name
                      }
                    </strong>

                    <span>
                      {
                        item.gym_members
                          ?.phone
                      }
                    </span>
                  </div>

                  <span>
                    {new Date(
                      item.created_at
                    ).toLocaleTimeString(
                      "en-IN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>

                  <CheckCircle2 size={18} />
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }

  // ==========================================
  // PAYMENTS PAGE
  // ==========================================

  function renderPayments() {
    return (
      <>
        <div className="page-heading">
          <div>
            <div className="breadcrumb">
              Home
              <ChevronRight size={12} />
              Payments
            </div>

            <h1>Payments</h1>

            <p>
              Track all registration and
              renewal payments.
            </p>
          </div>
        </div>

        <div className="dashboard-section-card">
          <div className="section-card-header">
            <div>
              <h2>
                Payment History
              </h2>

              <p>
                Today's and previous
                payment records
              </p>
            </div>

            <strong>
              ₹
              {totalRevenue.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          {payments.length === 0 ? (
            <div className="empty-table">
              <CircleDollarSign size={28} />

              <strong>
                No payments yet
              </strong>

              <span>
                Payment records will
                appear here when members
                register or renew.
              </span>
            </div>
          ) : (
            <div className="attendance-list">
              {payments.map((payment) => (
                <div
                  className="attendance-row"
                  key={payment.id}
                >
                  <div className="member-avatar">
                    {payment.gym_members
                      ?.full_name
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "?"}
                  </div>

                  <div className="attendance-member">
                    <strong>
                      {payment.gym_members
                        ?.full_name ||
                        "Unknown Member"}
                    </strong>

                    <span>
                      {payment.gym_members
                        ?.phone ||
                        "No phone number"}
                    </span>
                  </div>

                  <span>
                    {payment.payment_type}
                  </span>

                  <span>
                    {new Date(
                      payment.created_at
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>

                  <strong>
                    ₹
                    {Number(
                      payment.amount
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                  <span className="payment-status">
                    {payment.payment_status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }

  // ==========================================
  // RENEWALS PAGE
  // ==========================================

  function renderRenewals() {
    const renewalMembers =
      members.filter(
        (member) =>
          getDaysLeft(
            member.expiry_date
          ) <= 30
      );

    return (
      <>
        <div className="page-heading">
          <div>
            <div className="breadcrumb">
              Home
              <ChevronRight size={12} />
              Renewals
            </div>

            <h1>Renewals</h1>

            <p>
              Manage upcoming membership
              renewals.
            </p>
          </div>
        </div>

        <div className="dashboard-section-card">
          {renewalMembers.length === 0 ? (
            <div className="empty-table">
              <RefreshCw size={30} />

              <strong>
                No renewals required
              </strong>

              <span>
                There are no memberships
                expiring within 30 days.
              </span>
            </div>
          ) : (
            <div className="renewal-list">
              {renewalMembers.map(
                (member) => {
                  const days =
                    getDaysLeft(
                      member.expiry_date
                    );

                  return (
                    <div
                      className="renewal-row"
                      key={member.id}
                    >
                      <div className="member-avatar">
                        {member.full_name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div>
                        <strong>
                          {member.full_name}
                        </strong>

                        <span>
                          Expires{" "}
                          {formatDate(
                            member.expiry_date
                          )}
                        </span>
                      </div>

                      <span>
                        {days < 0
                          ? "Expired"
                          : `${days} days left`}
                      </span>

                      <button
                        className="primary-button small"
                        onClick={() =>
                          handleRenew(
                            member
                          )
                        }
                      >
                        Renew
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </>
    );
  }

  // ==========================================
  // PAGE SELECTOR
  // ==========================================

  function renderPage() {
    switch (activePage) {
      case "Members":
        return renderMembers();

      case "Attendance":
        return renderAttendance();

      case "Payments":
        return renderPayments();

      case "Renewals":
        return renderRenewals();

      default:
        return renderDashboard();
    }
  }

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="dashboard-logo">
            <AlertCircle size={19} />
          </div>

          <div>
            <h2>
              Gym Management
            </h2>

            <span>
              ADMIN PORTAL
            </span>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="icon-button"
            onClick={() =>
              setShowNotifications(
                (value) => !value
              )
            }
          >
            <Bell size={18} />

            {expiringMembers > 0 && (
              <span className="notification-dot">
                {expiringMembers}
              </span>
            )}
          </button>

          <div className="profile">
            <div className="profile-avatar">
              {currentUser?.email
                ?.charAt(0)
                ?.toUpperCase() || "A"}
            </div>

            <div>
              <strong>
                {currentUser?.email
                  ?.split("@")[0] ||
                  "Admin"}
              </strong>

              <span>
                Administrator
              </span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={onLogout}
            title="Logout"
          >
            <LogOut size={17} />
          </button>

          <button
            className="mobile-menu-button"
            onClick={() =>
              setMobileMenu(
                (value) => !value
              )
            }
          >
            {mobileMenu ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </header>

      {/* NOTIFICATIONS */}

      {showNotifications && (
        <div className="notification-panel">
          <div className="notification-header">
            <strong>
              Notifications
            </strong>

            <button
              onClick={() =>
                setShowNotifications(false)
              }
            >
              <X size={15} />
            </button>
          </div>

          {expiryMembers.length === 0 ? (
            <div className="notification-empty">
              <CheckCircle2 size={20} />

              <span>
                No expiry alerts.
              </span>
            </div>
          ) : (
            expiryMembers
              .slice(0, 5)
              .map((member) => (
                <button
                  className="notification-item"
                  key={member.id}
                  onClick={() => {
                    setSelectedMember(
                      member
                    );

                    setShowNotifications(
                      false
                    );
                  }}
                >
                  <AlertCircle size={16} />

                  <div>
                    <strong>
                      {member.full_name}
                    </strong>

                    <span>
                      Expires{" "}
                      {formatDate(
                        member.expiry_date
                      )}
                    </span>
                  </div>
                </button>
              ))
          )}
        </div>
      )}

      <div className="dashboard-layout">

        {/* SIDEBAR */}

        <aside
          className={`dashboard-sidebar ${
            mobileMenu
              ? "mobile-open"
              : ""
          }`}
        >
          <div className="sidebar-menu">
            <span className="sidebar-label">
              MAIN MENU
            </span>

            {menuItems.map((item) => (
              <button
                key={item.label}
                className={`sidebar-item ${
                  activePage === item.label
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  navigate(item.label)
                }
              >
                {item.icon}

                <span>
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div className="sidebar-bottom">
            <div className="gym-status">
              <span className="status-dot"></span>

              <div>
                <strong>
                  Gym is Open
                </strong>

                <span>
                  06:00 AM – 10:00 PM
                </span>
              </div>
            </div>

            <button
              className="sidebar-logout"
              onClick={onLogout}
            >
              <LogOut size={14} />
              Logout
            </button>

            <small>
              Gym Management System
              <br />
              Version 1.0
            </small>
          </div>
        </aside>

        {/* MAIN CONTENT */}

        <main className="dashboard-main">
          {renderPage()}
        </main>
      </div>

      {/* REGISTER MEMBER MODAL */}

      {showRegister && (
        <div
          className="modal-overlay"
          onClick={() =>
            setShowRegister(false)
          }
        >
          <div
            className="modal-card"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>
                  Register New Member
                </h2>

                <p>
                  Add a new member to your
                  gym.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowRegister(false)
                }
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleAddMember}
            >
              <div className="form-group">
                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter full name"
                  value={
                    newMember.fullName
                  }
                  onChange={(event) =>
                    setNewMember(
                      (current) => ({
                        ...current,
                        fullName:
                          event.target.value,
                      })
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="10-digit phone number"
                  maxLength={10}
                  value={
                    newMember.phone
                  }
                  onChange={(event) =>
                    setNewMember(
                      (current) => ({
                        ...current,
                        phone:
                          event.target.value.replace(
                            /\D/g,
                            ""
                          ),
                      })
                    )
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Membership Plan
                  </label>

                  <select
                    value={
                      newMember.planType
                    }
                    onChange={(event) =>
                      setNewMember(
                        (current) => ({
                          ...current,
                          planType:
                            event.target
                              .value,
                        })
                      )
                    }
                  >
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
                      newMember.paymentStatus
                    }
                    onChange={(event) =>
                      setNewMember(
                        (current) => ({
                          ...current,
                          paymentStatus:
                            event.target
                              .value,
                        })
                      )
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

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowRegister(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  <Plus size={15} />
                  Register Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEMBER DETAILS MODAL */}

      {selectedMember && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedMember(null)
          }
        >
          <div
            className="modal-card member-detail-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>
                  Member Details
                </h2>

                <p>
                  Membership information
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setSelectedMember(null)
                }
              >
                <X size={18} />
              </button>
            </div>

            <div className="member-detail-top">
              <div className="large-member-avatar">
                {selectedMember.full_name
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>

              <div>
                <h3>
                  {selectedMember.full_name}
                </h3>

                <span>
                  {selectedMember.phone}
                </span>
              </div>
            </div>

            <div className="member-detail-grid">
              <div>
                <span>PLAN</span>

                <strong>
                  {selectedMember.plan_type}
                </strong>
              </div>

              <div>
                <span>PAYMENT</span>

                <strong>
                  {
                    selectedMember.payment_status
                  }
                </strong>
              </div>

              <div>
                <span>EXPIRY</span>

                <strong>
                  {formatDate(
                    selectedMember.expiry_date
                  )}
                </strong>
              </div>

              <div>
                <span>DAYS LEFT</span>

                <strong>
                  {getDaysLeft(
                    selectedMember.expiry_date
                  )}
                </strong>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() =>
                  handleCheckIn(
                    selectedMember.id
                  )
                }
              >
                <UserCheck size={15} />
                Check In
              </button>

              <button
                className="primary-button"
                onClick={() =>
                  handleRenew(
                    selectedMember
                  )
                }
              >
                <RefreshCw size={15} />
                Renew
              </button>

              <button
                className="danger-button"
                onClick={() =>
                  handleDeleteMember(
                    selectedMember.id
                  )
                }
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}

      {toast && (
        <div className="toast">
          <CheckCircle2 size={16} />
          {toast}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;