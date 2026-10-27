import { AttendanceRepository } from "./attendance.repository.js";
import * as dtos from "./attendance.dto.js";
import createHttpError from "http-errors";
import { studentRepository } from "../Student/student.repository.js";

export class AttendanceService {
  constructor(private readonly attendanceRepository: AttendanceRepository) {
  }
  public async markAttendance(dto : dtos.markAttendance){
    const { studentId, status } = dto;
    const date = new Date(dto.date.getTime());
    date.setUTCHours(0, 0, 0, 0);
    
    const student = await studentRepository.findById(studentId);
    if(!student){
      throw createHttpError(404,"Student not found")
    }
    if(student.status === "INACTIVE"){
      throw createHttpError(422,"Student is inactive")
    }

    const attendance = await this.attendanceRepository.findByStudentIdAndDate(studentId, date);
    if(attendance){
      throw createHttpError(409,"Attendance already marked")
    }

    return this.attendanceRepository.create({ studentId, date, status });
  }
}

export const attendanceService = new AttendanceService(new AttendanceRepository());
