export interface CreateFacultyDTO {
  userId: string;
  facultyId: string;
  departmentId: string;
  designation: string;
  joiningDate: Date;
  phone: string;
}

export interface GetFacultyByIdDTO{
    id : string;
}