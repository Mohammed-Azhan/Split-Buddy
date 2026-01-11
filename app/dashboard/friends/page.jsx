"use client";
import { useState, useEffect } from "react";
import { Users, UserPlus, Check, X, ArrowRight } from "lucide-react";
import SpotlightCard from "../../../components/SpotlightCard";
import FriendCard from "../../../components/FriendCard";
import { toast } from "sonner";
import axios from "axios";
export default function FriendsPage() {
    const [tab, setTab] = useState("friends");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");


    // 🔴 Dummy data (replace with API later)
    const [friends, setFriends] = useState([]);
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);
    const [loading, setLoading] = useState(true);







    const fetchFriends = async () => {
        try {
            const res = await axios.get("/api/split/friends");
            console.log(res.data);
            setFriends(res.data.friends);
            setIncoming(res.data.incoming);
            setOutgoing(res.data.outgoing);
        } catch (err) {
            toast.error("Failed to load friends");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, []);





    const sendRequestByEmail = async () => {
        if (!email.trim()) return;

        try {
            const res = await fetch("/api/split/friends", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error)
                setStatus(data.error || "Something went wrong");
                return;
            }

            setStatus("Friend request sent ✅");
            toast.success("Friend request sent ✅")
            setEmail("");
        } catch (err) {
            setStatus("Server error");
            toast.error("Server error")

        }
        finally {
            fetchFriends();
        }
    };


    const removeFriend = async (friendId) => {
        try {
            await axios.delete("/api/split/friends", {
                data: { friendId } // 🔑 axios DELETE body syntax
            });

            toast.success("Friend removed");
            fetchFriends();
        } catch (err) {
            toast.error("Failed to remove friend");
        }
    };



    const acceptRequest = async (requesterId) => {
        try {
            await axios.patch("/api/split/friends/accept", { requesterId });
            toast.success("Friend added");
            fetchFriends();
        } catch {
            toast.error("Failed to accept request");
        }
    };

    const rejectRequest = async (requesterId) => {
        try {
            await axios.delete("/api/split/friends/reject", {
                data: { requesterId },
            });
            toast.success("Request rejected");
            fetchFriends();
        } catch {
            toast.error("Failed to reject request");
        }
    };



    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                    <Users className="text-white w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Friends</h1>
                    <p className="text-gray-600">Manage your connections</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 mb-6">

                {["friends", "incoming", "outgoing"].map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-5 py-2 rounded-xl font-medium transition ${tab === t
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {t === "friends" && "All Friends"}
                        {t === "incoming" && "Incoming"}
                        {t === "outgoing" && "Outgoing"}
                    </button>
                ))}
            </div>

            <div className="max-w-full bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-lg font-semibold text-black">Add Friend</h3>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setStatus("");
                    }}
                    placeholder="Enter friend's email"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none"
                />

                <button
                    onClick={sendRequestByEmail}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-500 transition"
                >
                    Send Friend Request
                </button>

                {status && (
                    <p className="text-sm text-gray-600 text-center">{status}</p>
                )}
            </div>


            {/* Content */}
            <div className="grid grid-cols-1 gap-4">
                {tab === "friends" && friends.length > 0 ?
                    friends.map(u => (
                        <SpotlightCard
                            key={u._id}
                            className="p-4 rounded-2xl border border-gray-200 bg-white"
                            spotlightColor="rgba(99, 102, 241, 0.25)"
                        >
                            <FriendCard user={u} type="friend" removeFriend={removeFriend} />
                        </SpotlightCard>
                    )) : !loading && tab === "friends" ? <h1 className="text-3xl mt-5 font-semibold ">Ohh no looks like you have no friends, add one ?</h1> : null}

                {tab === "incoming" && incoming.length > 0 ?
                    incoming.map(u => (
                        <SpotlightCard
                            key={u._id}
                            className="p-4 rounded-2xl border border-gray-200 bg-white"
                            spotlightColor="rgba(34, 197, 94, 0.25)"
                        >
                            <FriendCard user={u} type="incoming" acceptRequest={acceptRequest} rejectRequest={rejectRequest} />
                        </SpotlightCard>
                    )) : !loading && tab === "incoming" ? <h1 className="text-3xl mt-5 font-semibold ">You have no incomming requests</h1> : null}


                {tab === "outgoing" && outgoing.length > 0 ?
                    outgoing.map(u => (
                        <SpotlightCard
                            key={u._id}
                            className="p-4 rounded-2xl border border-gray-200 bg-white"
                            spotlightColor="rgba(234, 179, 8, 0.25)"
                        >
                            <FriendCard user={u} type="outgoing" />
                        </SpotlightCard>
                    )) : !loading && tab === "outgoing" ? <h1 className="text-3xl mt-5 font-semibold ">You have no outgoing requests</h1> : null}
            </div>

        </div>
    );
}
