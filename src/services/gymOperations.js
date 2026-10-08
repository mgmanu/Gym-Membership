import { supabase } from "./supabaseClient";
import { calculateExpiryDate } from "../utils/dateHelpers";

// ==========================================
// MEMBERS
// ==========================================

export async function fetchMembers(userId) {
  const { data, error } = await supabase
    .from("gym_members")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function addMember(userId, memberData) {
  const expiryDate = calculateExpiryDate(
    memberData.planType
  );

  const { data, error } = await supabase
    .from("gym_members")
    .insert({
      user_id: userId,
      full_name: memberData.fullName,
      phone: memberData.phone,
      plan_type: memberData.planType,
      payment_status:
        memberData.paymentStatus || "Paid",
      expiry_date: expiryDate,
    })
    .select()
    .single();

  if (error) throw error;

  // Create payment record when member is registered
  if (memberData.paymentStatus === "Paid") {
    const amount =
      memberData.planType === "1 Month"
        ? 1000
        : memberData.planType === "3 Months"
        ? 2500
        : 8000;

    const { error: paymentError } =
      await supabase.from("payments").insert({
        user_id: userId,
        member_id: data.id,
        amount,
        payment_type: "Registration",
        payment_status: "Paid",
      });

    if (paymentError) {
      console.error(
        "Payment record failed:",
        paymentError
      );
    }
  }

  return data;
}

export async function deleteMember(memberId) {
  const { error } = await supabase
    .from("gym_members")
    .delete()
    .eq("id", memberId);

  if (error) throw error;

  return true;
}

export async function updateMember(
  memberId,
  updates
) {
  const { data, error } = await supabase
    .from("gym_members")
    .update(updates)
    .eq("id", memberId)
    .select()
    .single();

  if (error) throw error;

  return data;
}


// ==========================================
// RENEWALS
// ==========================================

export async function renewMember(
  memberId,
  planType,
  userId
) {
  const expiryDate =
    calculateExpiryDate(planType);

  const { data, error } = await supabase
    .from("gym_members")
    .update({
      plan_type: planType,
      payment_status: "Paid",
      expiry_date: expiryDate,
    })
    .eq("id", memberId)
    .select()
    .single();

  if (error) throw error;

  const amount =
    planType === "1 Month"
      ? 1000
      : planType === "3 Months"
      ? 2500
      : 8000;

  const { error: paymentError } =
    await supabase.from("payments").insert({
      user_id: userId,
      member_id: memberId,
      amount,
      payment_type: "Renewal",
      payment_status: "Paid",
    });

  if (paymentError) {
    console.error(
      "Renewal payment record failed:",
      paymentError
    );
  }

  return data;
}


// ==========================================
// ATTENDANCE
// ==========================================

export async function checkInMember(memberId) {
  const { data, error } = await supabase
    .from("attendance")
    .insert({
      member_id: memberId,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function fetchTodayAttendance(
  userId
) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("attendance")
    .select(`
      id,
      member_id,
      created_at,
      gym_members!inner (
        id,
        user_id,
        full_name,
        phone
      )
    `)
    .eq("gym_members.user_id", userId)
    .gte(
      "created_at",
      startOfDay.toISOString()
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data || [];
}


// ==========================================
// PAYMENTS
// ==========================================

export async function fetchPayments(userId) {
  const { data, error } = await supabase
    .from("payments")
    .select(`
      id,
      amount,
      payment_type,
      payment_status,
      created_at,
      member_id,
      gym_members (
        full_name,
        phone,
        plan_type
      )
    `)
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data || [];
}