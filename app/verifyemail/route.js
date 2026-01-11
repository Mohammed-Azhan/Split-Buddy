import User from '@/lib/models/User';
import {Connect} from '@/lib/db';
import { NextResponse } from 'next/server';
export async function GET(req){
    await Connect();
    const {searchParams} = new URL(req.url);
    const token = searchParams.get('token');
    const findUser = await User.findOne({verifyToken : token});
    if(findUser && !(findUser.verifyTokenExpiry < Date.now())){
        findUser.isVerified = true;
        findUser.verifyToken = null;
        findUser.verifyTokenExpiry = null;
        await findUser.save();
        return NextResponse.redirect('http://localhost:3000/signin?message=verificationsuccess');
    }
    return NextResponse.redirect('http://localhost:3000/blank?message=accountverificationfailed');
}   