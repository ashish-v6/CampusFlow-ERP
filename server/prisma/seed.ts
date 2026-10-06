import "dotenv/config";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { PrismaClient } from "../src/generated/prisma/client.js";
import {
  Roles,
  UserStatus,
  Gender,
  StudentStatus,
  FacultyStatus,
  AttendanceStatus,
  VerificationTokenType,
  DepartmentStatus,
  ProgramStatus,
} from "../src/generated/prisma/enums.js";

const targetUrl = process.env.CLOUD_DATABASE_URL || process.env.DATABASE_URL;
const prisma = targetUrl
  ? new PrismaClient({
      datasources: {
        db: {
          url: targetUrl,
        },
      },
    })
  : new PrismaClient();

// Common testing password for ALL accounts
const COMMON_PASSWORD_PLAIN = "Ashish@2006";

async function main() {
  console.log("\n========================================================");
  console.log("🌱 CampusFlow ERP - Database Seeding Started");
  if (targetUrl) {
    const masked = targetUrl.replace(/:([^:@]+)@/, ":****@");
    console.log(`📡 Target Database: ${masked}`);
  }
  console.log("========================================================\n");

  // 1. Precompute bcrypt hash once to ensure fast bulk seeding
  console.log("🔐 Hashing common password (Ashish@2006) with bcrypt (rounds: 11)...");
  const commonPasswordHash = await bcrypt.hash(COMMON_PASSWORD_PLAIN, 11);
  console.log("✅ Common password hashed successfully.\n");

  // 2. Clean existing records safely (works with empty db, existing data, or missing tables)
  console.log("🧹 Cleaning existing data (if any)...");
  const safeDelete = async (modelName: string, deleteFn: () => Promise<unknown>) => {
    try {
      await deleteFn();
    } catch (err: any) {
      if (err?.code === "P2021") {
        console.log(`   ℹ️ Table ${modelName} does not exist in DB yet. Skipping cleanup.`);
      } else {
        console.warn(`   ⚠️ Notice while cleaning ${modelName}:`, err?.message || err);
      }
    }
  };

  await safeDelete("Attendance", () => prisma.attendance.deleteMany({}));
  await safeDelete("Session", () => prisma.session.deleteMany({}));
  await safeDelete("VerificationToken", () => prisma.verificationToken.deleteMany({}));
  await safeDelete("Student", () => prisma.student.deleteMany({}));
  await safeDelete("Faculty", () => prisma.faculty.deleteMany({}));
  await safeDelete("Program", () => prisma.program.deleteMany({}));
  await safeDelete("Department", () => prisma.department.deleteMany({}));
  await safeDelete("User", () => prisma.user.deleteMany({}));
  console.log("✅ Cleanup completed. Ready for insertion.\n");

  // --------------------------------------------------------------------------
  // 3. SEED ADMINISTRATORS (including requested test account)
  // --------------------------------------------------------------------------
  console.log("👤 Seeding Administrator accounts...");

  // Required Primary Test Account
  const primaryAdmin = await prisma.user.create({
    data: {
      firstName: "Ashish",
      lastName: "Vekariya",
      email: "apitesting65@gmail.com",
      password: commonPasswordHash,
      role: Roles.ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: true,
      phone: "+91 9876543210",
      address: "Admin Block A, Suite 101, CampusFlow University",
    },
  });

  const additionalAdminsData = [
    {
      firstName: "Super",
      lastName: "Admin",
      email: "superadmin@campusflow.edu",
      role: Roles.ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: true,
      phone: "+91 9876500001",
      address: "Central IT Operations, Tech Wing 404",
    },
    {
      firstName: "Sarah",
      lastName: "Jenkins",
      email: "admin@campusflow.edu",
      role: Roles.ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: true,
      phone: "+91 9876500002",
      address: "Registrar Office, Administrative Complex",
    },
    {
      firstName: "Robert",
      lastName: "Chen",
      email: "dean.academics@campusflow.edu",
      role: Roles.ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: true,
      phone: "+91 9876500003",
      address: "Deanery of Academic Affairs, North Campus",
    },
    {
      firstName: "Meera",
      lastName: "Iyer",
      email: "exam.controller@campusflow.edu",
      role: Roles.ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: true,
      phone: "+91 9876500004",
      address: "Examination Controller Wing, South Tower",
    },
  ];

  for (const admin of additionalAdminsData) {
    await prisma.user.create({
      data: {
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        password: commonPasswordHash,
        role: admin.role,
        status: admin.status,
        isVerified: admin.isVerified,
        phone: admin.phone,
        address: admin.address,
      },
    });
  }
  console.log(`✅ Seeded ${additionalAdminsData.length + 1} Administrators.`);

  // --------------------------------------------------------------------------
  // 4. SEED DEPARTMENTS
  // --------------------------------------------------------------------------
  console.log("🏛️  Seeding Departments...");
  const departmentsData = [
    { name: "Computer Science & Engineering", code: "CSE", status: DepartmentStatus.ACTIVE },
    { name: "Information Technology", code: "IT", status: DepartmentStatus.ACTIVE },
    { name: "Electronics & Communication Engineering", code: "ECE", status: DepartmentStatus.ACTIVE },
    { name: "Mechanical Engineering", code: "ME", status: DepartmentStatus.ACTIVE },
    { name: "Civil Engineering", code: "CE", status: DepartmentStatus.ACTIVE },
    { name: "School of Management Studies", code: "MGMT", status: DepartmentStatus.ACTIVE },
    { name: "Applied Sciences & Humanities", code: "ASH", status: DepartmentStatus.ACTIVE },
    { name: "Architecture & Planning (Upcoming)", code: "ARCH", status: DepartmentStatus.INACTIVE },
  ];

  const createdDepartments: Record<string, { id: string; name: string; code: string }> = {};

  for (const dept of departmentsData) {
    const created = await prisma.department.create({
      data: dept,
    });
    createdDepartments[dept.code] = created;
  }
  console.log(`✅ Seeded ${departmentsData.length} Departments.`);

  // --------------------------------------------------------------------------
  // 5. SEED PROGRAMS
  // --------------------------------------------------------------------------
  console.log("🎓 Seeding Programs...");
  const programsData = [
    // CSE
    {
      name: "B.Tech in Computer Science & Engineering",
      code: "BTECH-CSE",
      deptCode: "CSE",
      status: ProgramStatus.ACTIVE,
    },
    {
      name: "M.Tech in Computer Science & Engineering",
      code: "MTECH-CSE",
      deptCode: "CSE",
      status: ProgramStatus.ACTIVE,
    },
    {
      name: "Ph.D. in Computer Science & Engineering",
      code: "PHD-CSE",
      deptCode: "CSE",
      status: ProgramStatus.ACTIVE,
    },
    // IT
    {
      name: "B.Tech in Information Technology",
      code: "BTECH-IT",
      deptCode: "IT",
      status: ProgramStatus.ACTIVE,
    },
    {
      name: "Master of Computer Applications",
      code: "MCA",
      deptCode: "IT",
      status: ProgramStatus.ACTIVE,
    },
    // ECE
    {
      name: "B.Tech in Electronics & Communication",
      code: "BTECH-ECE",
      deptCode: "ECE",
      status: ProgramStatus.ACTIVE,
    },
    {
      name: "M.Tech in VLSI & Embedded Systems",
      code: "MTECH-VLSI",
      deptCode: "ECE",
      status: ProgramStatus.ACTIVE,
    },
    // ME
    {
      name: "B.Tech in Mechanical Engineering",
      code: "BTECH-ME",
      deptCode: "ME",
      status: ProgramStatus.ACTIVE,
    },
    {
      name: "M.Tech in Thermal Engineering",
      code: "MTECH-THM",
      deptCode: "ME",
      status: ProgramStatus.ACTIVE,
    },
    // CE
    {
      name: "B.Tech in Civil Engineering",
      code: "BTECH-CE",
      deptCode: "CE",
      status: ProgramStatus.ACTIVE,
    },
    {
      name: "M.Tech in Structural Engineering",
      code: "MTECH-STR",
      deptCode: "CE",
      status: ProgramStatus.ACTIVE,
    },
    // MGMT
    {
      name: "Master of Business Administration",
      code: "MBA",
      deptCode: "MGMT",
      status: ProgramStatus.ACTIVE,
    },
    {
      name: "Bachelor of Business Administration",
      code: "BBA",
      deptCode: "MGMT",
      status: ProgramStatus.ACTIVE,
    },
    // ARCH (INACTIVE for testing)
    {
      name: "Bachelor of Architecture (Proposed)",
      code: "BARCH",
      deptCode: "ARCH",
      status: ProgramStatus.INACTIVE,
    },
  ];

  const createdPrograms: Record<string, { id: string; name: string; code: string; deptCode: string }> = {};

  for (const prog of programsData) {
    const dept = createdDepartments[prog.deptCode];
    if (!dept) continue;
    const created = await prisma.program.create({
      data: {
        name: prog.name,
        code: prog.code,
        status: prog.status,
        departmentId: dept.id,
      },
    });
    createdPrograms[prog.code] = { ...created, deptCode: prog.deptCode };
  }
  console.log(`✅ Seeded ${Object.keys(createdPrograms).length} Programs.`);

  // --------------------------------------------------------------------------
  // 6. SEED FACULTY (Users + Faculty Profile)
  // --------------------------------------------------------------------------
  console.log("👨‍🏫 Seeding Faculty members...");

  const facultyDataList = [
    // CSE Department
    {
      firstName: "Rajesh",
      lastName: "Sharma",
      email: "rajesh.sharma@campusflow.edu",
      facultyId: "FAC-CSE-001",
      deptCode: "CSE",
      designation: "Professor & HOD",
      phone: "+91 98200 11001",
      joiningDate: new Date("2015-07-01"),
    },
    {
      firstName: "Priya",
      lastName: "Patel",
      email: "priya.patel@campusflow.edu",
      facultyId: "FAC-CSE-002",
      deptCode: "CSE",
      designation: "Associate Professor",
      phone: "+91 98200 11002",
      joiningDate: new Date("2018-01-15"),
    },
    {
      firstName: "Amit",
      lastName: "Verma",
      email: "amit.verma@campusflow.edu",
      facultyId: "FAC-CSE-003",
      deptCode: "CSE",
      designation: "Assistant Professor",
      phone: "+91 98200 11003",
      joiningDate: new Date("2020-08-10"),
    },
    {
      firstName: "Neha",
      lastName: "Gupta",
      email: "neha.gupta@campusflow.edu",
      facultyId: "FAC-CSE-004",
      deptCode: "CSE",
      designation: "Assistant Professor",
      phone: "+91 98200 11004",
      joiningDate: new Date("2022-03-01"),
    },
    // IT Department
    {
      firstName: "Suresh",
      lastName: "Nair",
      email: "suresh.nair@campusflow.edu",
      facultyId: "FAC-IT-001",
      deptCode: "IT",
      designation: "Professor & HOD",
      phone: "+91 98200 22001",
      joiningDate: new Date("2016-06-20"),
    },
    {
      firstName: "Ananya",
      lastName: "Deshmukh",
      email: "ananya.deshmukh@campusflow.edu",
      facultyId: "FAC-IT-002",
      deptCode: "IT",
      designation: "Associate Professor",
      phone: "+91 98200 22002",
      joiningDate: new Date("2019-09-05"),
    },
    {
      firstName: "Vikram",
      lastName: "Singh",
      email: "vikram.singh@campusflow.edu",
      facultyId: "FAC-IT-003",
      deptCode: "IT",
      designation: "Assistant Professor",
      phone: "+91 98200 22003",
      joiningDate: new Date("2021-11-12"),
    },
    {
      firstName: "Kavita",
      lastName: "Reddy",
      email: "kavita.reddy@campusflow.edu",
      facultyId: "FAC-IT-004",
      deptCode: "IT",
      designation: "Assistant Professor",
      phone: "+91 98200 22004",
      joiningDate: new Date("2023-02-15"),
    },
    // ECE Department
    {
      firstName: "Arun",
      lastName: "Joshi",
      email: "arun.joshi@campusflow.edu",
      facultyId: "FAC-ECE-001",
      deptCode: "ECE",
      designation: "Professor & HOD",
      phone: "+91 98200 33001",
      joiningDate: new Date("2014-04-10"),
    },
    {
      firstName: "Sunita",
      lastName: "Rao",
      email: "sunita.rao@campusflow.edu",
      facultyId: "FAC-ECE-002",
      deptCode: "ECE",
      designation: "Associate Professor",
      phone: "+91 98200 33002",
      joiningDate: new Date("2017-10-01"),
    },
    {
      firstName: "Rahul",
      lastName: "Menon",
      email: "rahul.menon@campusflow.edu",
      facultyId: "FAC-ECE-003",
      deptCode: "ECE",
      designation: "Assistant Professor",
      phone: "+91 98200 33003",
      joiningDate: new Date("2021-06-18"),
    },
    // ME Department
    {
      firstName: "Manoj",
      lastName: "Kumar",
      email: "manoj.kumar@campusflow.edu",
      facultyId: "FAC-ME-001",
      deptCode: "ME",
      designation: "Professor & HOD",
      phone: "+91 98200 44001",
      joiningDate: new Date("2013-05-14"),
    },
    {
      firstName: "Deepak",
      lastName: "Choudhary",
      email: "deepak.choudhary@campusflow.edu",
      facultyId: "FAC-ME-002",
      deptCode: "ME",
      designation: "Associate Professor",
      phone: "+91 98200 44002",
      joiningDate: new Date("2018-07-22"),
    },
    {
      firstName: "Pooja",
      lastName: "Bhatia",
      email: "pooja.bhatia@campusflow.edu",
      facultyId: "FAC-ME-003",
      deptCode: "ME",
      designation: "Assistant Professor",
      phone: "+91 98200 44003",
      joiningDate: new Date("2022-09-01"),
    },
    // CE Department
    {
      firstName: "Sanjay",
      lastName: "Kulkarni",
      email: "sanjay.kulkarni@campusflow.edu",
      facultyId: "FAC-CE-001",
      deptCode: "CE",
      designation: "Professor & HOD",
      phone: "+91 98200 55001",
      joiningDate: new Date("2012-08-25"),
    },
    {
      firstName: "Swati",
      lastName: "Tiwari",
      email: "swati.tiwari@campusflow.edu",
      facultyId: "FAC-CE-002",
      deptCode: "CE",
      designation: "Associate Professor",
      phone: "+91 98200 55002",
      joiningDate: new Date("2019-03-10"),
    },
    {
      firstName: "Alok",
      lastName: "Mishra",
      email: "alok.mishra@campusflow.edu",
      facultyId: "FAC-CE-003",
      deptCode: "CE",
      designation: "Assistant Professor",
      phone: "+91 98200 55003",
      joiningDate: new Date("2023-01-08"),
    },
    // Management Studies
    {
      firstName: "Anupam",
      lastName: "Mehta",
      email: "anupam.mehta@campusflow.edu",
      facultyId: "FAC-MGMT-001",
      deptCode: "MGMT",
      designation: "Professor & Dean",
      phone: "+91 98200 66001",
      joiningDate: new Date("2015-11-01"),
    },
    {
      firstName: "Ritika",
      lastName: "Kapoor",
      email: "ritika.kapoor@campusflow.edu",
      facultyId: "FAC-MGMT-002",
      deptCode: "MGMT",
      designation: "Associate Professor",
      phone: "+91 98200 66002",
      joiningDate: new Date("2020-04-15"),
    },
    {
      firstName: "James",
      lastName: "Wilson",
      email: "james.wilson@campusflow.edu",
      facultyId: "FAC-MGMT-003",
      deptCode: "MGMT",
      designation: "Assistant Professor",
      phone: "+91 98200 66003",
      joiningDate: new Date("2022-07-20"),
    },
    // Inactive Faculty Member for filter/test validation
    {
      firstName: "Harish",
      lastName: "Bansal",
      email: "harish.bansal@campusflow.edu",
      facultyId: "FAC-CSE-099",
      deptCode: "CSE",
      designation: "Former Adjunct Professor",
      phone: "+91 98200 11099",
      joiningDate: new Date("2016-01-10"),
      status: FacultyStatus.INACTIVE,
    },
  ];

  const createdFacultyList: Array<{
    id: string;
    facultyId: string;
    departmentId: string;
    deptCode: string;
    userId: string;
  }> = [];

  for (const fac of facultyDataList) {
    const dept = createdDepartments[fac.deptCode];
    if (!dept) continue;

    // Create Faculty User
    const user = await prisma.user.create({
      data: {
        firstName: fac.firstName,
        lastName: fac.lastName,
        email: fac.email,
        password: commonPasswordHash,
        role: Roles.FACULTY,
        status: fac.status === FacultyStatus.INACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE,
        isVerified: true,
        address: `Faculty Quarters Block B, Room ${fac.facultyId.slice(-3)}, CampusFlow Campus`,
      },
    });

    // Create Faculty Profile
    const faculty = await prisma.faculty.create({
      data: {
        facultyId: fac.facultyId,
        userId: user.id,
        designation: fac.designation,
        joiningDate: fac.joiningDate,
        phone: fac.phone,
        status: fac.status ?? FacultyStatus.ACTIVE,
        departmentId: dept.id,
      },
    });

    createdFacultyList.push({
      id: faculty.id,
      facultyId: faculty.facultyId,
      departmentId: dept.id,
      deptCode: fac.deptCode,
      userId: user.id,
    });
  }
  console.log(`✅ Seeded ${createdFacultyList.length} Faculty members with User profiles.`);

  // --------------------------------------------------------------------------
  // 7. SEED STUDENTS (Users + Student Profiles)
  // --------------------------------------------------------------------------
  console.log("🎒 Seeding a massive cohort of Students (120+ students across programs)...");

  const firstNamesPoolMale = [
    "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna",
    "Ishaan", "Shaurya", "Atharv", "Dhruv", "Kabir", "Rohan", "Siddharth", "Varun", "Karan",
    "Aryan", "Rishi", "Kartik", "Harsh", "Pranav", "Nikhil", "Gaurav", "Yash", "Tanmay",
    "Dev", "Rajat", "Manish", "Tushar", "Ayush", "Samarth", "Aniket", "Hardik"
  ];

  const firstNamesPoolFemale = [
    "Diya", "Saanvi", "Aanya", "Aadhya", "Pari", "Ananya", "Myra", "Riya", "Isha", "Anika",
    "Navya", "Avani", "Tanvi", "Shreya", "Kavya", "Sneha", "Aditi", "Pooja", "Meera", "Divya",
    "Nidhi", "Simran", "Khushi", "Roshni", "Swara", "Tara", "Bhavya", "Sakshi", "Kritika",
    "Palak", "Muskan", "Prerna", "Rashmi", "Akanksha", "Neha"
  ];

  const lastNamesPool = [
    "Sharma", "Patel", "Venkatesh", "Gupta", "Deshmukh", "Singh", "Reddy", "Joshi", "Rao",
    "Menon", "Kumar", "Choudhary", "Bhatia", "Kulkarni", "Tiwari", "Mishra", "Mehta", "Kapoor",
    "Agarwal", "Bansal", "Shah", "Jain", "Nair", "Saxena", "Chawla", "Pandey", "Verma", "Yadav"
  ];

  const citiesPool = [
    { city: "Mumbai", state: "Maharashtra", pin: "400001" },
    { city: "Ahmedabad", state: "Gujarat", pin: "380015" },
    { city: "Bengaluru", state: "Karnataka", pin: "560001" },
    { city: "Pune", state: "Maharashtra", pin: "411004" },
    { city: "Hyderabad", state: "Telangana", pin: "500081" },
    { city: "Delhi", state: "Delhi", pin: "110001" },
    { city: "Jaipur", state: "Rajasthan", pin: "302001" },
    { city: "Chennai", state: "Tamil Nadu", pin: "600001" },
    { city: "Kolkata", state: "West Bengal", pin: "700001" },
    { city: "Indore", state: "Madhya Pradesh", pin: "452001" },
    { city: "Surat", state: "Gujarat", pin: "395007" },
    { city: "Vadodara", state: "Gujarat", pin: "390001" },
  ];

  const activeProgramCodes = [
    "BTECH-CSE", "MTECH-CSE", "PHD-CSE",
    "BTECH-IT", "MCA",
    "BTECH-ECE", "MTECH-VLSI",
    "BTECH-ME", "MTECH-THM",
    "BTECH-CE", "MTECH-STR",
    "MBA", "BBA"
  ];

  const createdStudentsList: Array<{
    id: string;
    studentId: string;
    programId: string;
    deptCode: string;
    userId: string;
  }> = [];

  const TOTAL_STUDENTS_TO_SEED = 120;

  for (let i = 1; i <= TOTAL_STUDENTS_TO_SEED; i++) {
    const isFemale = i % 2 === 0;
    const isOtherGender = i % 47 === 0; // occasional edge-case test value

    const firstName = isOtherGender
      ? "Alex"
      : isFemale
        ? firstNamesPoolFemale[(i - 1) % firstNamesPoolFemale.length]!
        : firstNamesPoolMale[(i - 1) % firstNamesPoolMale.length]!;

    const lastName = lastNamesPool[(i * 3) % lastNamesPool.length]!;
    const progCode = activeProgramCodes[(i - 1) % activeProgramCodes.length]!;
    const program = createdPrograms[progCode]!;
    const cityInfo = citiesPool[(i * 7) % citiesPool.length]!;

    // Varied statuses: Mostly ACTIVE, a couple INACTIVE / SUSPENDED for testing
    let userStatus: UserStatus = UserStatus.ACTIVE;
    let studentStatus: StudentStatus = StudentStatus.ACTIVE;
    let isVerified = true;

    if (i === 115) {
      userStatus = UserStatus.SUSPENDED;
      studentStatus = StudentStatus.INACTIVE;
    } else if (i === 118) {
      userStatus = UserStatus.INACTIVE;
      studentStatus = StudentStatus.INACTIVE;
    } else if (i === 120) {
      isVerified = false; // test unverified student
    }

    const email = `student${String(i).padStart(3, "0")}@campusflow.edu`;
    const studentIdStr = `STU-2024-${progCode}-${String(i).padStart(3, "0")}`;

    // Admission dates: 2021 to 2024
    const admissionYear = 2021 + ((i - 1) % 4);
    const admissionDate = new Date(`${admissionYear}-08-01`);

    // Date of birth: 2000 to 2005
    const birthYear = 2000 + ((i + 2) % 6);
    const birthMonth = String(((i % 12) + 1)).padStart(2, "0");
    const birthDay = String(((i % 27) + 1)).padStart(2, "0");
    const dateOfBirth = new Date(`${birthYear}-${birthMonth}-${birthDay}`);

    const phone = `+91 98${String(10000000 + i * 23145).slice(0, 8)}`;
    const address = `${(i * 12) % 350 + 1}, Greenfield Avenue, Sector ${(i % 25) + 1}, ${cityInfo.city}, ${cityInfo.state} - ${cityInfo.pin}`;

    // Create User record
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: commonPasswordHash,
        role: Roles.STUDENT,
        status: userStatus,
        isVerified,
        address,
      },
    });

    // Create Student record
    const student = await prisma.student.create({
      data: {
        userId: user.id,
        studentId: studentIdStr,
        programId: program.id,
        status: studentStatus,
        admissionDate,
        dateOfBirth,
        gender: isOtherGender ? Gender.OTHER : isFemale ? Gender.FEMALE : Gender.MALE,
        phone,
        address,
      },
    });

    createdStudentsList.push({
      id: student.id,
      studentId: student.studentId,
      programId: program.id,
      deptCode: program.deptCode,
      userId: user.id,
    });
  }
  console.log(`✅ Seeded ${createdStudentsList.length} Students with linked User profiles.`);

  // --------------------------------------------------------------------------
  // 8. SEED ATTENDANCE RECORDS (Massive attendance history)
  // --------------------------------------------------------------------------
  console.log("📋 Seeding realistic Attendance history from today to the past 2 months (current year)...");

  // Query actual committed students and faculty directly from database
  const dbStudents = await prisma.student.findMany({
    include: {
      program: {
        include: {
          department: true,
        },
      },
    },
  });

  const dbFaculties = await prisma.faculty.findMany({
    include: {
      department: true,
    },
  });

  // Generate instructional dates (Monday-Friday) from today back to 2 months ago (current year)
  const attendanceDates: Date[] = [];
  const today = new Date();
  const twoMonthsAgo = new Date(today);
  twoMonthsAgo.setMonth(today.getMonth() - 2);

  const currDate = new Date(today);
  while (currDate >= twoMonthsAgo) {
    const dayOfWeek = currDate.getDay(); // 0 is Sunday, 6 is Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Normalize to UTC midnight for @db.Date column
      const normalizedDate = new Date(
        Date.UTC(currDate.getFullYear(), currDate.getMonth(), currDate.getDate())
      );
      attendanceDates.push(normalizedDate);
    }
    currDate.setDate(currDate.getDate() - 1);
  }

  // Sort ascending (chronological order)
  attendanceDates.sort((a, b) => a.getTime() - b.getTime());

  // Pre-index faculties by deptCode for quick assignment
  const facultyByDept: Record<string, typeof dbFaculties> = {};
  for (const fac of dbFaculties) {
    const code = fac.department.code;
    if (!facultyByDept[code]) {
      facultyByDept[code] = [];
    }
    facultyByDept[code]!.push(fac);
  }

  const attendanceBatch: Array<{
    studentId: string;
    facultyId: string | null;
    date: Date;
    status: AttendanceStatus;
    remarks: string | null;
  }> = [];

  const absentRemarks = [
    "Medical Leave - Viral Fever",
    "Family Emergency",
    "Approved Leave by Proctor",
    "Unexcused Absence",
    "Attending Inter-College Tech Symposium",
    "Sports Meet Participation",
  ];

  const lateRemarks = [
    "College Transit Bus Delayed",
    "Heavy Traffic on Ring Road",
    "Late arrival by 15 mins",
    "Hostel Gate Check Delay",
    "Medical appointment delay",
  ];

  for (let sIdx = 0; sIdx < dbStudents.length; sIdx++) {
    const student = dbStudents[sIdx]!;
    const deptCode = student.program.department.code;
    const deptFaculties = facultyByDept[deptCode] || dbFaculties;

    for (let dIdx = 0; dIdx < attendanceDates.length; dIdx++) {
      const date = attendanceDates[dIdx]!;
      const assignedFaculty = deptFaculties.length > 0
        ? deptFaculties[(sIdx + dIdx) % deptFaculties.length]!
        : null;

      // Realistic Status Distribution: ~84% PRESENT, ~10% ABSENT, ~6% LATE
      const pseudoRandom = (sIdx * 31 + dIdx * 17 + 7) % 100;
      let status: AttendanceStatus = AttendanceStatus.PRESENT;
      let remarks: string | null = null;

      if (pseudoRandom < 10) {
        status = AttendanceStatus.ABSENT;
        remarks = absentRemarks[(sIdx + dIdx) % absentRemarks.length]!;
      } else if (pseudoRandom < 16) {
        status = AttendanceStatus.LATE;
        remarks = lateRemarks[(sIdx + dIdx) % lateRemarks.length]!;
      }

      attendanceBatch.push({
        studentId: student.id,
        facultyId: assignedFaculty ? assignedFaculty.id : null,
        date,
        status,
        remarks,
      });
    }
  }

  // Use createMany in chunks for speed and reliability with skipDuplicates
  const CHUNK_SIZE = 250;
  for (let i = 0; i < attendanceBatch.length; i += CHUNK_SIZE) {
    const chunk = attendanceBatch.slice(i, i + CHUNK_SIZE);
    await prisma.attendance.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }
  console.log(`✅ Seeded ${attendanceBatch.length} Attendance records across 20 instructional dates.`);

  // --------------------------------------------------------------------------
  // 9. SEED ACTIVE & EXPIRED SESSIONS
  // --------------------------------------------------------------------------
  console.log("🔑 Seeding Sessions for test accounts...");

  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148",
    "Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0",
    "CampusFlow Mobile Android/2.4.0",
  ];

  const ipList = [
    "127.0.0.1", "192.168.1.45", "10.14.2.110", "172.16.8.22", "103.21.244.1", "49.207.198.88"
  ];

  const sessionsData = [
    // Primary Admin Active Session
    {
      userId: primaryAdmin.id,
      ip: "127.0.0.1",
      userAgent: userAgents[0]!,
      refreshTokenHash: crypto.createHash("sha256").update("test-refresh-token-admin-1").digest("hex"),
      revoked: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days ahead
    },
    // Primary Admin Revoked Session
    {
      userId: primaryAdmin.id,
      ip: "192.168.1.120",
      userAgent: userAgents[2]!,
      refreshTokenHash: crypto.createHash("sha256").update("test-refresh-token-admin-2").digest("hex"),
      revoked: true,
      expiresAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // expired & revoked
    },
    // Faculty sessions
    ...createdFacultyList.slice(0, 5).map((fac, idx) => ({
      userId: fac.userId,
      ip: ipList[idx % ipList.length]!,
      userAgent: userAgents[idx % userAgents.length]!,
      refreshTokenHash: crypto.createHash("sha256").update(`fac-refresh-${idx}`).digest("hex"),
      revoked: false,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    })),
    // Student sessions
    ...createdStudentsList.slice(0, 10).map((stu, idx) => ({
      userId: stu.userId,
      ip: ipList[(idx + 2) % ipList.length]!,
      userAgent: userAgents[(idx + 1) % userAgents.length]!,
      refreshTokenHash: crypto.createHash("sha256").update(`stu-refresh-${idx}`).digest("hex"),
      revoked: idx % 4 === 0, // occasionally revoked
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })),
  ];

  await prisma.session.createMany({
    data: sessionsData,
  });
  console.log(`✅ Seeded ${sessionsData.length} Session records.`);

  // --------------------------------------------------------------------------
  // 10. SEED VERIFICATION TOKENS
  // --------------------------------------------------------------------------
  console.log("🎫 Seeding Verification Tokens...");

  const verificationTokensData = [
    // Unverified student token
    {
      userId: createdStudentsList[119]?.userId ?? primaryAdmin.id,
      type: VerificationTokenType.EMAIL_VERIFICATION,
      token: crypto.randomBytes(32).toString("hex"),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    // Password reset token for admin
    {
      userId: primaryAdmin.id,
      type: VerificationTokenType.RESET_PASSWORD,
      token: crypto.randomBytes(32).toString("hex"),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
    // Faculty email verification
    ...createdFacultyList.slice(0, 3).map((fac, idx) => ({
      userId: fac.userId,
      type: idx % 2 === 0 ? VerificationTokenType.RESET_PASSWORD : VerificationTokenType.EMAIL_VERIFICATION,
      token: crypto.randomBytes(32).toString("hex"),
      expiresAt: new Date(Date.now() + (idx + 1) * 3600 * 1000),
    })),
    // Expired token for testing token expiration handling
    {
      userId: primaryAdmin.id,
      type: VerificationTokenType.RESET_PASSWORD,
      token: crypto.randomBytes(32).toString("hex"),
      expiresAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // expired 2 days ago
    },
  ];

  await prisma.verificationToken.createMany({
    data: verificationTokensData,
  });
  console.log(`✅ Seeded ${verificationTokensData.length} Verification Token records.`);

  // --------------------------------------------------------------------------
  // SUMMARY REPORT
  // --------------------------------------------------------------------------
  console.log("\n========================================================");
  console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
  console.log("========================================================");
  console.log("\n📊 Summary of Seeded Data:");
  console.log(`   • Administrators  : ${additionalAdminsData.length + 1}`);
  console.log(`   • Departments     : ${departmentsData.length}`);
  console.log(`   • Programs        : ${Object.keys(createdPrograms).length}`);
  console.log(`   • Faculty Users   : ${createdFacultyList.length}`);
  console.log(`   • Students        : ${createdStudentsList.length}`);
  console.log(`   • Attendance Logs : ${attendanceBatch.length}`);
  console.log(`   • Active Sessions : ${sessionsData.length}`);
  console.log(`   • Verify Tokens   : ${verificationTokensData.length}`);
  console.log(`   • TOTAL USERS     : ${additionalAdminsData.length + 1 + createdFacultyList.length + createdStudentsList.length}`);
  console.log("--------------------------------------------------------");
  console.log("🔑 Primary Test Credentials:");
  console.log(`   • Email    : apitesting65@gmail.com`);
  console.log(`   • Password : ${COMMON_PASSWORD_PLAIN}`);
  console.log(`   • Role     : ADMIN`);
  console.log("--------------------------------------------------------");
  console.log("👥 Other Sample Credentials (Same Password: Ashish@2006):");
  console.log(`   • Admin    : superadmin@campusflow.edu`);
  console.log(`   • Faculty  : rajesh.sharma@campusflow.edu (CSE HOD)`);
  console.log(`   • Faculty  : priya.patel@campusflow.edu (Associate Prof)`);
  console.log(`   • Student  : student001@campusflow.edu (B.Tech CSE)`);
  console.log(`   • Student  : student050@campusflow.edu`);
  console.log(`   • Student  : student100@campusflow.edu`);
  console.log("========================================================\n");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed with error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
