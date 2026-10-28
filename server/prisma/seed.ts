import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../src/utils/prisma.js";
import {
  Roles,
  UserStatus,
  StudentStatus,
  FacultyStatus,
  DepartmentStatus,
  ProgramStatus,
  Gender,
  AttendanceStatus,
} from "../src/generated/prisma/enums.js";

const SHARED_PASSWORD_RAW = "Ashish@2006";
const BCRYPT_SALT_ROUNDS = 11;

async function main() {
  console.log("🌱 Starting CampusFlow ERP database seeding...\n");

  const hashedPassword = await bcrypt.hash(SHARED_PASSWORD_RAW, BCRYPT_SALT_ROUNDS);

  // ---------------------------------------------------------------------------
  // 1. Seed Departments (with ACTIVE and INACTIVE statuses)
  // ---------------------------------------------------------------------------
  console.log("📁 Seeding Departments...");
  const departmentsData = [
    {
      code: "CSE",
      name: "Computer Science and Engineering",
      status: DepartmentStatus.ACTIVE,
    },
    {
      code: "IT",
      name: "Information Technology",
      status: DepartmentStatus.ACTIVE,
    },
    {
      code: "ECE",
      name: "Electronics and Communication Engineering",
      status: DepartmentStatus.ACTIVE,
    },
    {
      code: "ME",
      name: "Mechanical Engineering",
      status: DepartmentStatus.ACTIVE,
    },
    {
      code: "ARCH",
      name: "Architecture and Planning",
      status: DepartmentStatus.INACTIVE,
    },
  ];

  const departmentMap = new Map<string, string>();
  for (const dept of departmentsData) {
    const record = await prisma.department.upsert({
      where: { code: dept.code },
      update: { name: dept.name, status: dept.status },
      create: dept,
    });
    departmentMap.set(dept.code, record.id);
  }
  console.log(`   ✓ ${departmentMap.size} departments synced (ACTIVE & INACTIVE).`);

  // ---------------------------------------------------------------------------
  // 2. Seed Programs (with ACTIVE and INACTIVE statuses)
  // ---------------------------------------------------------------------------
  console.log("🎓 Seeding Academic Programs...");
  const programsData = [
    {
      code: "BTECH-CSE",
      name: "B.Tech in Computer Science and Engineering",
      departmentCode: "CSE",
      status: ProgramStatus.ACTIVE,
    },
    {
      code: "BTECH-IT",
      name: "B.Tech in Information Technology",
      departmentCode: "IT",
      status: ProgramStatus.ACTIVE,
    },
    {
      code: "MCA",
      name: "Master of Computer Applications",
      departmentCode: "CSE",
      status: ProgramStatus.ACTIVE,
    },
    {
      code: "BTECH-ECE",
      name: "B.Tech in Electronics and Communication Engineering",
      departmentCode: "ECE",
      status: ProgramStatus.ACTIVE,
    },
    {
      code: "BTECH-ME",
      name: "B.Tech in Mechanical Engineering",
      departmentCode: "ME",
      status: ProgramStatus.ACTIVE,
    },
    {
      code: "DIP-ARCH",
      name: "Diploma in Architecture & Interior Design",
      departmentCode: "ARCH",
      status: ProgramStatus.INACTIVE,
    },
  ];

  const programMap = new Map<string, string>();
  for (const prog of programsData) {
    const deptId = departmentMap.get(prog.departmentCode);
    if (!deptId) continue;

    const record = await prisma.program.upsert({
      where: { code: prog.code },
      update: {
        name: prog.name,
        departmentId: deptId,
        status: prog.status,
      },
      create: {
        code: prog.code,
        name: prog.name,
        departmentId: deptId,
        status: prog.status,
      },
    });
    programMap.set(prog.code, record.id);
  }
  console.log(`   ✓ ${programMap.size} programs synced (ACTIVE & INACTIVE).`);

  // ---------------------------------------------------------------------------
  // 3. Seed Admins & General Users (with different statuses: ACTIVE, SUSPENDED, INACTIVE)
  // ---------------------------------------------------------------------------
  console.log("👤 Seeding System Users & Admins...");
  const systemUsersData = [
    {
      firstName: "Admin",
      lastName: "Master",
      email: "apitesting65@gmail.com", // Requested Admin account
      role: Roles.ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: true,
    },
    {
      firstName: "Super",
      lastName: "Administrator",
      email: "superadmin@campusflow.edu",
      role: Roles.ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: true,
    },
    {
      firstName: "Inactive",
      lastName: "Admin",
      email: "admin.inactive@campusflow.edu",
      role: Roles.ADMIN,
      status: UserStatus.INACTIVE,
      isVerified: true,
    },
    {
      firstName: "Suspended",
      lastName: "Auditor",
      email: "auditor.suspended@campusflow.edu",
      role: Roles.ADMIN,
      status: UserStatus.SUSPENDED,
      isVerified: true,
    },
    {
      firstName: "Unverified",
      lastName: "Applicant",
      email: "unverified.user@campusflow.edu",
      role: Roles.STUDENT,
      status: UserStatus.INACTIVE,
      isVerified: false,
    },
  ];

  for (const u of systemUsersData) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        firstName: u.firstName,
        lastName: u.lastName,
        password: hashedPassword,
        role: u.role,
        status: u.status,
        isVerified: u.isVerified,
      },
      create: {
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        password: hashedPassword,
        role: u.role,
        status: u.status,
        isVerified: u.isVerified,
      },
    });
  }
  console.log(`   ✓ ${systemUsersData.length} system users synced.`);

  // ---------------------------------------------------------------------------
  // 4. Seed Faculty Members (with different statuses: ACTIVE, INACTIVE, and User statuses)
  // ---------------------------------------------------------------------------
  console.log("👨‍🏫 Seeding Faculty Members...");
  const facultiesData = [
    {
      // Requested primary Faculty user
      user: {
        firstName: "Ashish",
        lastName: "Vekariya",
        email: "ashishvekariya04@gmail.com",
        role: Roles.FACULTY,
        status: UserStatus.ACTIVE,
        isVerified: true,
      },
      faculty: {
        facultyId: "FAC-CSE-001",
        designation: "Professor & Head of Department",
        joiningDate: new Date("2021-08-16"),
        phone: "+91 98250 12345",
        status: FacultyStatus.ACTIVE,
        departmentCode: "CSE",
      },
    },
    {
      user: {
        firstName: "Dr. Rajesh",
        lastName: "Patel",
        email: "rajesh.patel@campusflow.edu",
        role: Roles.FACULTY,
        status: UserStatus.ACTIVE,
        isVerified: true,
      },
      faculty: {
        facultyId: "FAC-CSE-002",
        designation: "Associate Professor",
        joiningDate: new Date("2022-02-01"),
        phone: "+91 98250 23456",
        status: FacultyStatus.ACTIVE,
        departmentCode: "CSE",
      },
    },
    {
      user: {
        firstName: "Priya",
        lastName: "Sharma",
        email: "priya.sharma@campusflow.edu",
        role: Roles.FACULTY,
        status: UserStatus.ACTIVE,
        isVerified: true,
      },
      faculty: {
        facultyId: "FAC-IT-003",
        designation: "Assistant Professor",
        joiningDate: new Date("2023-01-10"),
        phone: "+91 98250 34567",
        status: FacultyStatus.ACTIVE,
        departmentCode: "IT",
      },
    },
    {
      user: {
        firstName: "Dr. Vikram",
        lastName: "Deshmukh",
        email: "vikram.deshmukh@campusflow.edu",
        role: Roles.FACULTY,
        status: UserStatus.ACTIVE,
        isVerified: true,
      },
      faculty: {
        facultyId: "FAC-ECE-004",
        designation: "Associate Professor",
        joiningDate: new Date("2020-07-20"),
        phone: "+91 98250 45678",
        status: FacultyStatus.ACTIVE,
        departmentCode: "ECE",
      },
    },
    {
      // Faculty with INACTIVE Faculty status and ACTIVE User
      user: {
        firstName: "Ananya",
        lastName: "Mehta",
        email: "ananya.mehta@campusflow.edu",
        role: Roles.FACULTY,
        status: UserStatus.ACTIVE,
        isVerified: true,
      },
      faculty: {
        facultyId: "FAC-ME-005",
        designation: "Visiting Lecturer (On Leave)",
        joiningDate: new Date("2023-06-15"),
        phone: "+91 98250 56789",
        status: FacultyStatus.INACTIVE,
        departmentCode: "ME",
      },
    },
    {
      // Faculty with INACTIVE Faculty status and SUSPENDED User status
      user: {
        firstName: "Sanjay",
        lastName: "Verma",
        email: "sanjay.verma@campusflow.edu",
        role: Roles.FACULTY,
        status: UserStatus.SUSPENDED,
        isVerified: true,
      },
      faculty: {
        facultyId: "FAC-CSE-006",
        designation: "Former Adjunct Faculty",
        joiningDate: new Date("2021-09-01"),
        phone: "+91 98250 67890",
        status: FacultyStatus.INACTIVE,
        departmentCode: "CSE",
      },
    },
    {
      // Faculty with INACTIVE Faculty status and INACTIVE User status
      user: {
        firstName: "Kavita",
        lastName: "Joshi",
        email: "kavita.joshi@campusflow.edu",
        role: Roles.FACULTY,
        status: UserStatus.INACTIVE,
        isVerified: false,
      },
      faculty: {
        facultyId: "FAC-IT-007",
        designation: "Contract Lecturer (Resigned)",
        joiningDate: new Date("2022-08-01"),
        phone: "+91 98250 78901",
        status: FacultyStatus.INACTIVE,
        departmentCode: "IT",
      },
    },
  ];

  for (const item of facultiesData) {
    const userRecord = await prisma.user.upsert({
      where: { email: item.user.email },
      update: {
        firstName: item.user.firstName,
        lastName: item.user.lastName,
        password: hashedPassword,
        role: item.user.role,
        status: item.user.status,
        isVerified: item.user.isVerified,
      },
      create: {
        firstName: item.user.firstName,
        lastName: item.user.lastName,
        email: item.user.email,
        password: hashedPassword,
        role: item.user.role,
        status: item.user.status,
        isVerified: item.user.isVerified,
      },
    });

    const departmentId = departmentMap.get(item.faculty.departmentCode);
    if (!departmentId) {
      console.warn(`   ⚠️ Department not found for code: ${item.faculty.departmentCode}`);
      continue;
    }

    await prisma.faculty.upsert({
      where: { userId: userRecord.id },
      update: {
        facultyId: item.faculty.facultyId,
        designation: item.faculty.designation,
        joiningDate: item.faculty.joiningDate,
        phone: item.faculty.phone,
        status: item.faculty.status,
        departmentId: departmentId,
      },
      create: {
        userId: userRecord.id,
        facultyId: item.faculty.facultyId,
        designation: item.faculty.designation,
        joiningDate: item.faculty.joiningDate,
        phone: item.faculty.phone,
        status: item.faculty.status,
        departmentId: departmentId,
      },
    });
  }
  console.log(`   ✓ ${facultiesData.length} faculty members synced (ACTIVE & INACTIVE).`);

  // ---------------------------------------------------------------------------
  // 5. Seed Students (with different statuses: ACTIVE, INACTIVE, and User statuses)
  // ---------------------------------------------------------------------------
  console.log("🎒 Seeding Students...");
  const studentsData = [
    {
      // Requested primary Student user
      user: {
        firstName: "Ashish",
        lastName: "Vekariya",
        email: "ashishvekariya165@gmail.com",
        role: Roles.STUDENT,
        status: UserStatus.ACTIVE,
        isVerified: true,
      },
      student: {
        studentId: "STU-2024-001",
        programCode: "BTECH-CSE",
        status: StudentStatus.ACTIVE,
        admissionDate: new Date("2024-07-01"),
        dateOfBirth: new Date("2006-05-18"),
        gender: Gender.MALE,
        phone: "+91 99887 11223",
        address: "101 Silicon Valley Towers, Tech City, Gujarat, India",
      },
    },
    {
      user: {
        firstName: "Sneha",
        lastName: "Patel",
        email: "sneha.patel@campusflow.edu",
        role: Roles.STUDENT,
        status: UserStatus.ACTIVE,
        isVerified: true,
      },
      student: {
        studentId: "STU-2024-002",
        programCode: "BTECH-CSE",
        status: StudentStatus.ACTIVE,
        admissionDate: new Date("2024-07-01"),
        dateOfBirth: new Date("2006-08-22"),
        gender: Gender.FEMALE,
        phone: "+91 99887 22334",
        address: "204 Heritage Heights, Ring Road, Ahmedabad",
      },
    },
    {
      user: {
        firstName: "Rahul",
        lastName: "Kumar",
        email: "rahul.kumar@campusflow.edu",
        role: Roles.STUDENT,
        status: UserStatus.ACTIVE,
        isVerified: true,
      },
      student: {
        studentId: "STU-2024-003",
        programCode: "BTECH-IT",
        status: StudentStatus.ACTIVE,
        admissionDate: new Date("2024-07-05"),
        dateOfBirth: new Date("2005-11-14"),
        gender: Gender.MALE,
        phone: "+91 99887 33445",
        address: "Block B-12, Green Orchid Residency, Surat",
      },
    },
    {
      user: {
        firstName: "Kiran",
        lastName: "Rao",
        email: "kiran.rao@campusflow.edu",
        role: Roles.STUDENT,
        status: UserStatus.ACTIVE,
        isVerified: true,
      },
      student: {
        studentId: "STU-2024-004",
        programCode: "MCA",
        status: StudentStatus.ACTIVE,
        admissionDate: new Date("2024-07-10"),
        dateOfBirth: new Date("2003-03-30"),
        gender: Gender.OTHER,
        phone: "+91 99887 44556",
        address: "702 Sunrise Enclave, Vadodara",
      },
    },
    {
      user: {
        firstName: "Tanvi",
        lastName: "Shah",
        email: "tanvi.shah@campusflow.edu",
        role: Roles.STUDENT,
        status: UserStatus.ACTIVE,
        isVerified: true,
      },
      student: {
        studentId: "STU-2024-005",
        programCode: "BTECH-ECE",
        status: StudentStatus.ACTIVE,
        admissionDate: new Date("2024-07-12"),
        dateOfBirth: new Date("2006-01-19"),
        gender: Gender.FEMALE,
        phone: "+91 99887 55667",
        address: "15 Nilkanth Society, Rajkot",
      },
    },
    {
      // Inactive Student with Active User
      user: {
        firstName: "Rohit",
        lastName: "Sharma",
        email: "rohit.sharma@campusflow.edu",
        role: Roles.STUDENT,
        status: UserStatus.ACTIVE,
        isVerified: true,
      },
      student: {
        studentId: "STU-2023-015",
        programCode: "BTECH-ME",
        status: StudentStatus.INACTIVE,
        admissionDate: new Date("2023-07-01"),
        dateOfBirth: new Date("2005-04-12"),
        gender: Gender.MALE,
        phone: "+91 99887 66778",
        address: "88 Shivalik Avenue, Gandhinagar",
      },
    },
    {
      // Inactive Student with Suspended User
      user: {
        firstName: "Amit",
        lastName: "Trivedi",
        email: "amit.trivedi@campusflow.edu",
        role: Roles.STUDENT,
        status: UserStatus.SUSPENDED,
        isVerified: true,
      },
      student: {
        studentId: "STU-2024-006",
        programCode: "BTECH-ECE",
        status: StudentStatus.INACTIVE,
        admissionDate: new Date("2024-07-01"),
        dateOfBirth: new Date("2006-09-09"),
        gender: Gender.MALE,
        phone: "+91 99887 77889",
        address: "34 Golden Palms, Bhavnagar",
      },
    },
    {
      // Inactive Student with Inactive & Unverified User
      user: {
        firstName: "Neha",
        lastName: "Kapoor",
        email: "neha.kapoor@campusflow.edu",
        role: Roles.STUDENT,
        status: UserStatus.INACTIVE,
        isVerified: false,
      },
      student: {
        studentId: "STU-2024-007",
        programCode: "BTECH-IT",
        status: StudentStatus.INACTIVE,
        admissionDate: new Date("2024-07-01"),
        dateOfBirth: new Date("2006-12-05"),
        gender: Gender.FEMALE,
        phone: "+91 99887 88990",
        address: "501 Silver Nest, Anand",
      },
    },
  ];

  const studentRecords: Array<{ id: string; studentId: string }> = [];

  for (const item of studentsData) {
    const userRecord = await prisma.user.upsert({
      where: { email: item.user.email },
      update: {
        firstName: item.user.firstName,
        lastName: item.user.lastName,
        password: hashedPassword,
        role: item.user.role,
        status: item.user.status,
        isVerified: item.user.isVerified,
      },
      create: {
        firstName: item.user.firstName,
        lastName: item.user.lastName,
        email: item.user.email,
        password: hashedPassword,
        role: item.user.role,
        status: item.user.status,
        isVerified: item.user.isVerified,
      },
    });

    const programId = programMap.get(item.student.programCode);
    if (!programId) {
      console.warn(`   ⚠️ Program not found for code: ${item.student.programCode}`);
      continue;
    }

    const studentRecord = await prisma.student.upsert({
      where: { userId: userRecord.id },
      update: {
        studentId: item.student.studentId,
        programId: programId,
        status: item.student.status,
        admissionDate: item.student.admissionDate,
        dateOfBirth: item.student.dateOfBirth,
        gender: item.student.gender,
        phone: item.student.phone,
        address: item.student.address,
      },
      create: {
        userId: userRecord.id,
        studentId: item.student.studentId,
        programId: programId,
        status: item.student.status,
        admissionDate: item.student.admissionDate,
        dateOfBirth: item.student.dateOfBirth,
        gender: item.student.gender,
        phone: item.student.phone,
        address: item.student.address,
      },
    });

    studentRecords.push({ id: studentRecord.id, studentId: studentRecord.studentId });
  }
  console.log(`   ✓ ${studentsData.length} students synced (ACTIVE & INACTIVE).`);

  // ---------------------------------------------------------------------------
  // 6. Seed Attendance Records for Students
  // ---------------------------------------------------------------------------
  console.log("📅 Seeding Student Attendance records...");
  const attendanceDates = [
    new Date("2026-10-20T09:00:00Z"),
    new Date("2026-10-21T09:00:00Z"),
    new Date("2026-10-22T09:00:00Z"),
    new Date("2026-10-23T09:00:00Z"),
    new Date("2026-10-24T09:00:00Z"),
  ];

  let attendanceCount = 0;
  for (const s of studentRecords) {
    for (let i = 0; i < attendanceDates.length; i++) {
      const date = attendanceDates[i]!;
      // Distribute statuses realistically
      let status: AttendanceStatus = AttendanceStatus.PRESENT;
      if (i === 1 && s.studentId === "STU-2024-001") {
        status = AttendanceStatus.PRESENT;
      } else if (i === 3 && (s.studentId === "STU-2024-003" || s.studentId === "STU-2024-006")) {
        status = AttendanceStatus.ABSENT;
      } else if (i === 2 && s.studentId === "STU-2024-002") {
        status = AttendanceStatus.LATE;
      } else if (s.studentId === "STU-2024-006" || s.studentId === "STU-2024-007") {
        status = i % 2 === 0 ? AttendanceStatus.ABSENT : AttendanceStatus.LATE;
      }

      await prisma.attendance.upsert({
        where: {
          studentId_date: {
            studentId: s.id,
            date: date,
          },
        },
        update: {
          status: status,
        },
        create: {
          studentId: s.id,
          date: date,
          status: status,
        },
      });
      attendanceCount++;
    }
  }
  console.log(`   ✓ ${attendanceCount} attendance entries synced (PRESENT, ABSENT, LATE).`);

  // ---------------------------------------------------------------------------
  // Summary Table
  // ---------------------------------------------------------------------------
  console.log("\n========================================================");
  console.log("🎉 CAMPUSFLOW ERP DATABASE SEEDING COMPLETED!");
  console.log("========================================================");
  console.log("🔑 Primary Credentials (All use password: Ashish@2006):");
  console.log("--------------------------------------------------------");
  console.log("👑 ADMIN:");
  console.log("   Email   : apitesting65@gmail.com");
  console.log("   Role    : ADMIN | Status: ACTIVE");
  console.log("--------------------------------------------------------");
  console.log("👨‍🏫 FACULTY:");
  console.log("   Email   : ashishvekariya04@gmail.com");
  console.log("   Role    : FACULTY | Status: ACTIVE | Faculty ID: FAC-CSE-001");
  console.log("   Dept    : Computer Science and Engineering");
  console.log("--------------------------------------------------------");
  console.log("🎒 STUDENT:");
  console.log("   Email   : ashishvekariya165@gmail.com");
  console.log("   Role    : STUDENT | Status: ACTIVE | Student ID: STU-2024-001");
  console.log("   Program : BTECH-CSE");
  console.log("========================================================");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
