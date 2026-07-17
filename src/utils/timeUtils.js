export function convertTo12Hour(time24) {
  if (!time24) return "Time TBD";

  const [hours, minutes] = time24.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return time24;

  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;

  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

/**
 * Convert IST time to user's timezone
 * @param {string} dateStr - Date in YYYY-MM-DD format (IST)
 * @param {string} timeStr - Time in HH:MM format (IST)
 * @param {string} userTimezone - IANA timezone string (e.g., "Asia/Riyadh")
 * @returns {object} - { date: string, time: string } in user's timezone
 */
export function convertISTToUserTimezone(dateStr, timeStr, userTimezone) {
  if (!dateStr || !timeStr || !userTimezone) {
    return { date: dateStr, time: timeStr };
  }

  try {
    // Create IST date object (UTC +05:30)
    // Format: YYYY-MM-DDTHH:MM:SS+05:30
    const istDateTimeString = `${dateStr}T${timeStr}:00+05:30`;
    const istDate = new Date(istDateTimeString);

    // Validate date
    if (isNaN(istDate.getTime())) {
      console.error("Invalid date:", istDateTimeString);
      return { date: dateStr, time: timeStr };
    }

    // Convert to user's timezone using Intl API
    const options = {
      timeZone: userTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(istDate);

    // Extract date/time components
    let year, month, day, hour, minute;
    parts.forEach(part => {
      if (part.type === 'year') year = part.value;
      if (part.type === 'month') month = part.value;
      if (part.type === 'day') day = part.value;
      if (part.type === 'hour') hour = part.value;
      if (part.type === 'minute') minute = part.value;
    });

    return {
      date: `${year}-${month}-${day}`,
      time: `${hour}:${minute}`
    };
  } catch (err) {
    console.error("Timezone conversion error:", err);
    return { date: dateStr, time: timeStr };
  }
}

/**
 * Get display time in user's timezone with 12-hour format
 * This is the main function used by dashboards
 * 
 * @param {string} dateStr - Date in YYYY-MM-DD format (IST)
 * @param {string} timeStr - Time in HH:MM format (IST)
 * @param {string} userTimezone - IANA timezone string
 * @returns {string} - Time in 12-hour format (e.g., "2:30 PM")
 */
export function getDisplayTime(dateStr, timeStr, userTimezone) {
  console.log("Converting for timezone:", userTimezone);
  // If no timezone or timezone is IST, just convert to 12-hour format
  if (!userTimezone || userTimezone === "Asia/Kolkata") {
    return convertTo12Hour(timeStr);
  }

  // Convert from IST to user's timezone
  const { time } = convertISTToUserTimezone(dateStr, timeStr, userTimezone);

  // Convert to 12-hour format
  return convertTo12Hour(time);
}

/**
 * Get display date in user's timezone
 * Use this if timezone conversion might change the date (e.g., crossing midnight)
 * 
 * @param {string} dateStr - Date in YYYY-MM-DD format (IST)
 * @param {string} timeStr - Time in HH:MM format (IST)
 * @param {string} userTimezone - IANA timezone string
 * @returns {string} - Date in YYYY-MM-DD format
 */
export function getDisplayDate(dateStr, timeStr, userTimezone) {
  if (!userTimezone || userTimezone === "Asia/Kolkata") {
    return dateStr;
  }

  const { date } = convertISTToUserTimezone(dateStr, timeStr, userTimezone);
  return date;
}

/**
 * Available timezones for user registration
 * Covers major regions where students/tutors might be located
 */
export const TIMEZONES = [
  // Middle East
  { value: "Asia/Dubai", label: "UAE (GST)" },
  { value: "Asia/Riyadh", label: "Saudi Arabia (AST)" },
  { value: "Asia/Qatar", label: "Qatar (AST)" },
  { value: "Asia/Kuwait", label: "Kuwait (AST)" },
  { value: "Asia/Bahrain", label: "Bahrain (AST)" },

  // Asia
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Colombo", label: "Sri Lanka (IST)" },
  { value: "Asia/Dhaka", label: "Bangladesh (BST)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Asia/Tokyo", label: "Japan (JST)" },

  // Europe
  { value: "Europe/London", label: "UK (GMT/BST)" },
  { value: "Europe/Paris", label: "France (CET)" },
  { value: "Europe/Berlin", label: "Germany (CET)" },

  // America
  { value: "America/New_York", label: "USA – Eastern" },
  { value: "America/Chicago", label: "USA – Central" },
  { value: "America/Denver", label: "USA – Mountain" },
  { value: "America/Los_Angeles", label: "USA – Pacific" },

  // Australia / NZ
  { value: "Australia/Sydney", label: "Australia" },
  { value: "Pacific/Auckland", label: "New Zealand" },
];