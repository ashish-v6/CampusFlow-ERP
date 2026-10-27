import { z } from "zod";
import { AttendanceStatus } from "../../generated/prisma/enums.js";

export class AttendanceSchema {
    public markAttendance = z.object({
        studentId : z.uuid().trim(),
        date : z.coerce.date(),
        status : z.enum(AttendanceStatus)
    })
}

export const attendanceSchema = new AttendanceSchema();
