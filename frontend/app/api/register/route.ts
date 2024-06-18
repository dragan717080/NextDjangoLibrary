import { NextResponse } from "next/server";

import bcrypt from "bcrypt";

/**
 * Create user on the backend, then it will go to the
 * 'authorize' and 'signIn' functions in config.
 *
 * @param {Request} request
 * @returns {NextResponse}
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const password_hash = await bcrypt.hash(formData.get("password")! as string, 12);

    // Rename fields
    formData.append("username", formData.get("name") as string);
    formData.delete("name");
    formData.append("password_hash", password_hash);
    formData.delete("password");
    const userUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`;

    const response = await fetch(userUrl, {
      method: "POST",
      body: formData,
    });

    const userData = await response.json() as { message: string };

    if (response.status !== 201) {
      const errorMessage = userData.message.includes("duplicate key")
        ? "User with that username or email already exists"
        : userData.message;
      return NextResponse.json({ message: errorMessage }, { status: 500 });
    }

    return NextResponse.json({ message: "User created" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to upload" }, { status: 500 });
  }
}
