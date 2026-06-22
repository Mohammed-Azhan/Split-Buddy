import User from '@/lib/models/User';
import { Connect } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';

export async function POST(request) {
    try {
        const { email, newPassword } = await request.json();
        
        await Connect();
        const user = await User.findOne({ email });
        
        if (!user) {
            return NextResponse.json({ message: "User not found", status: false });
        }
        
        if (user.googleId) {
            return NextResponse.json({ message: "Google users cannot change password", status: false });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ message: "Password updated successfully!", status: true });
    } catch (e) {
        console.error("Direct password update error: " + e);
        return NextResponse.json({ message: "Server error", status: false });
    }
}
