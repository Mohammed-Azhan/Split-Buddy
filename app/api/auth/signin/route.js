import { NextRequest, NextResponse } from "next/server";
import {Connect} from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";


export async function POST(request){
    const {email, password} = await request.json();
    const findUser = await User.findOne({email});
    if(findUser){
        const dcrypt = await bcrypt.compare(password, findUser.password);
        if(!dcrypt){
            return NextResponse.json({msg : "Invalid password"});
        }
        // create a user session .
        return NextResponse.json({msg : "User Verified successfully"});
    }
    return NextResponse.json({msg : "Invalid email entered"});
}