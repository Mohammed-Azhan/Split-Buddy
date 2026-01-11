import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    googleId: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    profileImg: { type: String, default: null },

    verifyToken: { type: String },
    verifyTokenExpiry: { type: Date },
    verifyResetToken: { type: String },
    verifyResetTokenExpiry: { type: String },

    incomingRequests: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },

    outgoingRequests: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    friends : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "User",
        default : [],
    }
});

export default mongoose.models.User || mongoose.model("User", userSchema);
