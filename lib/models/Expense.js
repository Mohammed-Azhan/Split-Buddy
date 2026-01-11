import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema(
  {
    friendId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    paid: {
      type: Number,
      default: 0, // Amount paid by this person
    },

    percentage: {
      type: Number,
      default: 0, // Used when splitType === "percentage"
    },

    shares: {
      type: Number,
      default: 1, // Used when splitType === "shares"
    },

    share: {
      type: Number,
      default: 0, // Final calculated share
    },
  },
  { _id: false }
);

const SettlementSchema = new mongoose.Schema(
  {
    fromId: {
      type: String,
      required: true,
    },
    from: {
      type: String, // name (Rahim, You)
      required: true,
    },
    toId: {
      type: String,
      required: true,
    },

    to: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const ExpenseSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true, // "Dinner with buddies"
    },

    totalAmount: {
      type: Number,
      required: true, // 1000
    },

    splitType: {
      type: String,
      enum: ["equal", "percentage", "shares"],
      required: true,
    },

    participants: {
      type: [ParticipantSchema],
      required: true,
    },

    settlements: {
      type: [SettlementSchema],
      default: [],
    },

    calculated: {
      type: Boolean,
      default: false,
    },

    isSettled: {
      type: Boolean,
      default: false,
    },
    settledAt : {
      type : Date,
      default : null
    }


  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Expense ||
  mongoose.model("Expense", ExpenseSchema);
