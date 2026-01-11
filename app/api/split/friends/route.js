import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import User from "@/lib/models/User";
import { Connect } from "@/lib/db";

export async function POST(req) {
  await Connect();
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { email } = await req.json();

  const sender = await User.findOne({ email: session.user.email });
  const receiver = await User.findOne({ email });

  if (!receiver) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  if (receiver._id.equals(sender._id)) {
    return Response.json({ error: "You can't add yourself" }, { status: 400 });
  }

  if (sender.friends.includes(receiver._id)) {
    return Response.json({ error: "Already friends" }, { status: 400 });
  }

  if (sender.outgoingRequests.includes(receiver._id)) {
    return Response.json({ error: "Request already sent" }, { status: 400 });
  }

  sender.outgoingRequests.push(receiver._id);
  receiver.incomingRequests.push(sender._id);

  await sender.save();
  await receiver.save();

  return Response.json({ success: true });
}



export async function GET() {
  await Connect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email })
    .populate("friends", "username email profileImg")
    .populate("incomingRequests", "username email profileImg")
    .populate("outgoingRequests", "username email profileImg");

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json({
    friends: user.friends,
    incoming: user.incomingRequests,
    outgoing: user.outgoingRequests,
  });
}



export async function DELETE(req) {
  await Connect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { friendId } = await req.json();
  if (!friendId) {
    return Response.json({ error: "friendId is required" }, { status: 400 });
  }

  const user = await User.findOne({ email: session.user.email });
  const friend = await User.findById(friendId);

  if (!user || !friend) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  // Remove both sides
  user.friends = user.friends.filter(
    id => !id.equals(new mongoose.Types.ObjectId(friendId))
  );

  friend.friends = friend.friends.filter(
    id => !id.equals(user._id)
  );

  await user.save();
  await friend.save();

  return Response.json({ success: true });
}