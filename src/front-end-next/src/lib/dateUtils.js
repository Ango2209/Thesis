import moment from "moment-timezone";

export function formatDateToVietnamTime(dateString) {
  return moment(dateString).tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY HH:mm");
}
