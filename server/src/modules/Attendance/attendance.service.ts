import { AttendanceRepository } from "./attendance.repository.js";
import * as dtos from "./attendance.dto.js";
import createHttpError from "http-errors";

export class AttendanceService {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}
}

export const attendanceService = new AttendanceService(new AttendanceRepository());
