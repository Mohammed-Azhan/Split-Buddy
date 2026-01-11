import { NextResponse } from "next/server";
import { Connect } from "@/lib/db";
import User from "@/lib/models/User";
import { sendMail } from "@/lib/mailer";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await Connect();

    const { username, email, password } = await request.json();

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        message: "User already exists with the email you entered",
        success: false,
        type: "warning",
      });
    }

    // Create user with proper defaults so arrays are created
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hash,
      incomingRequests: [],
      outgoingRequests: []
    });

    if (!user) {
      return NextResponse.json({
        message: "Internal server error",
        success: false,
        type: "error",
      });
    }

    // Send verification mail
    const mailSent = await sendMail({
      username: user.username,
      email: user.email,
      uid: user._id,
      mailType: "emailverify",
    });

    if (mailSent) {
      return NextResponse.json({
        message: `Registration successful. A verification link has been sent to ${user.email}`,
        success: true,
        type: "success",
      });
    }

    return NextResponse.json({
      message: "Unable to send verification mail. Try again later.",
      success: false,
      type: "warning",
    });
  }
  catch(e){
    console.log("Error : " + e);
  }
}
