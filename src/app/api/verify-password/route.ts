import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Get the password from the request body
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password is required" },
        { status: 400 }
      );
    }

    // Get the correct password from server-side environment variables
    const correctPassword = process.env.SITE_PASSWORD;

    // Verify the password
    const isValid = password === correctPassword;

    return NextResponse.json({ success: isValid });
  } catch (error) {
    console.error("Error verifying password:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while verifying the password",
      },
      { status: 500 }
    );
  }
}
