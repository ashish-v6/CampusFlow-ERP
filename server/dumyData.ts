const BASE_URL = "http://localhost:5000";
const SIGNUP_URL = `${BASE_URL}/api/auth/sign-up`;

const TOTAL_USERS = Number(process.argv[2] || 100);

const PASSWORD = "Test@12345";

async function createUser(index: number) {
  const user = {
    firstName: `Test${index}`,
    lastName: "Student",
    email: `teststudent${index}@example.com`,
    password: PASSWORD,
  };

  try {
    const response = await fetch(SIGNUP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json().catch(() => null);

    if (response.ok) {
      console.log(`✓ [${index}/${TOTAL_USERS}] ${user.email}`);
    } else {
      console.log(
        `✗ [${index}/${TOTAL_USERS}] ${user.email} → ${response.status}`,
        data
      );
    }
  } catch (error) {
    console.error(`✗ [${index}/${TOTAL_USERS}] ${user.email}`, error);
  }
}

async function main() {
  console.log(`Creating ${TOTAL_USERS} test users...\n`);

  for (let i = 1; i <= TOTAL_USERS; i++) {
    await createUser(i);
  }

  console.log("\nDone.");
}

main();