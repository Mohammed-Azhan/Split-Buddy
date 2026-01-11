import User from '@/lib/models/User';
import { Connect } from '@/lib/db';
import { NextResponse } from 'next/server';
import { sendMail } from '../../../../lib/mailer';
export async function POST(request) {
    const { email } = await request.json();
    try {
        await Connect();
        const findUser = await User.findOne({ email });
        if (!findUser) {
            return NextResponse.json({ message: "No user found with this email", status: false, type: "warning" });
        }
        if(findUser.googleId){
            return NextResponse.json({ message: "Unable to send the verification link at the moement", status: false, type: "error" });
        }
        const response = await sendMail({ username: findUser.username, email: findUser.email, uid: findUser._id, mailType: "resetpassword" });
        if (!response) {
            return NextResponse.json({ message: "There is a trouble in sending an email", status: false, type: "error" });
        }
        return NextResponse.json({ message: `An email is sent to ${findUser.email} , navigate to the email to reset your password`, status: true, type: "success" });

    }
    catch (e) {
        console.log("Password reset error : " + e);
    }
}