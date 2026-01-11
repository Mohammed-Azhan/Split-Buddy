import User from '@/lib/models/User';
import { Connect } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';
export async function GET(request) {
    const session = await getServerSession(authOptions);
    const reciver_id = session.user.id;
    const { searchParams } = new URL(request.url);
    const sender_id = searchParams.get('invitation_id');

    if (!sender_id) {
        return NextResponse.redirect('/dashboard');
    }

    if(!mongoose.isValidObjectId(sender_id)){
        return NextResponse.json({message : "Invalid user id", status : false, type : 'error'});
    }
    
    await Connect();
    const reciver = await User.findById(reciver_id);
    const sender = await User.findById(sender_id);
    if(!sender){
        return NextResponse.json({message : "Invalid invitation please ask you friend to resend the fresh link", status : false, type : 'warning'});
    }
    sender.outgoingRequests.push(reciver_id);
    reciver.incomingRequests.push(sender_id);
    await sender.save();
    await reciver.save();
    return NextResponse.redirect('/dashboard');

}