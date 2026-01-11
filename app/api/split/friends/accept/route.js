import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/lib/models/User";
import { Connect } from "@/lib/db";

export async function PATCH(req) {
  await Connect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { requesterId } = await req.json();
  if (!requesterId) {
    return Response.json({ error: "requesterId required" }, { status: 400 });
  }

  const user = await User.findOne({ email: session.user.email });
  const requester = await User.findById(requesterId);

  if (!user || !requester) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  // Remove request
  user.incomingRequests = user.incomingRequests.filter(
    id => !id.equals(requester._id)
  );
  requester.outgoingRequests = requester.outgoingRequests.filter(
    id => !id.equals(user._id)
  );

  // Add to friends (both sides)
  user.friends.push(requester._id);
  requester.friends.push(user._id);

  await user.save();
  await requester.save();

  return Response.json({ success: true });
}
