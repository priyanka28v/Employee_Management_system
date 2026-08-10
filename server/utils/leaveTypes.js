/** Canonical leave type labels stored on Leave documents */
export const LEAVE_TYPE_LABELS = {
  casualLeave: "Casual Leave",
  sickLeave: "Sick Leave",
  earnedLeave: "Earned Leave",
  privilegeLeave: "Privilege Leave",
  compOff: "Compensatory Off",
};

const LABEL_TO_KEY = Object.fromEntries(
  Object.entries(LEAVE_TYPE_LABELS).map(([key, label]) => [label.toLowerCase(), key])
);

const KEY_SET = new Set(Object.keys(LEAVE_TYPE_LABELS));

/**
 * Resolve a leave type input (label or balance key) to the LeaveBalance schema key.
 */
export const resolveLeaveBalanceKey = (input) => {
  if (!input || typeof input !== "string") return null;

  const trimmed = input.trim();
  if (KEY_SET.has(trimmed)) return trimmed;

  const byLabel = LABEL_TO_KEY[trimmed.toLowerCase()];
  if (byLabel) return byLabel;

  // Legacy: "Casual Leave" with different casing
  for (const [key, label] of Object.entries(LEAVE_TYPE_LABELS)) {
    if (label.toLowerCase() === trimmed.toLowerCase()) return key;
  }

  return null;
};

/** Normalize to the canonical label stored on Leave documents */
export const resolveLeaveTypeLabel = (input) => {
  const key = resolveLeaveBalanceKey(input);
  return key ? LEAVE_TYPE_LABELS[key] : null;
};

export const isValidLeaveType = (input) => resolveLeaveBalanceKey(input) !== null;
