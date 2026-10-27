import type { AttendanceStatus } from "../../generated/prisma/enums.js";

export interface markAttendance{
    studentId : string,
    date : Date,
    status : AttendanceStatus
}