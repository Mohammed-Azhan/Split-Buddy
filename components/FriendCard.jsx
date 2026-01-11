import { Check, X, ArrowRight } from "lucide-react";

export default function FriendCard({ user, type, removeFriend, acceptRequest, rejectRequest }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
      {/* User */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 uppercase bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
          {user.email[0]}
        </div>
        <div>
          <p className="font-semibold">{user.username}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {type === "incoming" && (
          <>
            <button onClick={() => acceptRequest(user._id)} className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600">
              <Check size={18} />
            </button>
            <button onClick={() => rejectRequest(user._id)} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600">
              <X size={18} />
            </button>
          </>
        )}

        {type === "outgoing" && (
          <span className="text-sm text-gray-500 flex items-center gap-1">
            Request sent <ArrowRight size={14} />
          </span>
        )}

        {type === "friend" && (
          <button onClick={() => removeFriend(user._id)} className="text-red-500 text-sm font-medium hover:underline">
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
