import nodemailer from "nodemailer";
import crypto from "crypto";
import User from "@/lib/models/User";

// =========================================================
// BASE EMAIL TEMPLATE
// =========================================================
const BASE_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SplitBuddy Email</title>
</head>
<body style="margin:0;padding:0;font-family:Inter, sans-serif;background:#f4f7f6;">
<table align="center" width="100%" style="max-width:600px;background:#fff;margin:40px auto;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
    <tr>
        <td style="padding:30px 20px;text-align:center;border-bottom:1px solid #eee;">
            <h1 style="margin:0;color:#10b981;font-size:28px;">Split<span style="color:#3b82f6;">Buddy</span></h1>
            <p style="color:#6b7280;margin:5px 0 0;font-size:14px;">The smarter way to split expenses.</p>
        </td>
    </tr>

    <tr>
        <td style="padding:40px 30px;">
            [CONTENT]
        </td>
    </tr>

    <tr>
        <td style="padding:20px 30px;text-align:center;border-top:1px solid #eee;">
            <p style="color:#9ca3af;margin:0 0 10px;font-size:12px;">This email was sent to [EMAIL].</p>
            <p style="color:#9ca3af;margin:0;font-size:12px;">© [YEAR] SplitBuddy. All rights reserved.</p>
        </td>
    </tr>
</table>
</body>
</html>`;
    

// =========================================================
// TEMPLATES CLEAN VERSION
// =========================================================
const MAIL_TEMPLATES = {
    emailverify: ({ username, domain, token, expiryMinutes }) => {
        const link = `${domain}/verifyemail?token=${token}`;

        const html = `
            <h2 style="font-size:24px;margin:0 0 15px;color:#1f2937;">Verify Your Email Address</h2>
            <p style="font-size:16px;color:#374151;">Hi <strong>${username}</strong>,</p>
            <p style="font-size:16px;color:#374151;line-height:1.6;">
                Thank you for signing up for SplitBuddy! Please verify your email to continue.
            </p>

            <div style="text-align:center;margin:30px 0;">
                <a href="${link}" style="background:#10b981;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
                    Verify Email
                </a>
            </div>

            <p style="font-size:14px;color:#6b7280;">If the button doesn't work, use this link:</p>
            <p style="font-size:14px;color:#3b82f6;word-break:break-all;">
                ${link}
            </p>

            <p style="color:#ef4444;font-size:14px;font-weight:600;">This link is valid for ${expiryMinutes} minutes.</p>
        `;

        return {
            subject: "Verify Your Email Address",
            html,
            updateDB: (uid, expiryTime) =>
                User.findByIdAndUpdate(uid, {
                    verifyToken: token,
                    verifyTokenExpiry: Date.now() + expiryTime,
                }),
        };
    },

    resetpassword: ({ username, domain, token, expiryMinutes }) => {
        const link = `${domain}/resetpassword?token=${token}`;

        const html = `
            <h2 style="font-size:24px;margin:0 0 15px;color:#1f2937;">Reset Your Password</h2>
            <p style="font-size:16px;color:#374151;">Hi <strong>${username}</strong>,</p>
            <p style="font-size:16px;color:#374151;">
                We received a request to reset your SplitBuddy password.
            </p>

            <div style="text-align:center;margin:30px 0;">
                <a href="${link}" style="background:#ef4444;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
                    Reset Password
                </a>
            </div>

            <p style="font-size:14px;color:#6b7280;">If you did not request this, please ignore this email.</p>

            <p style="color:#ef4444;font-size:14px;font-weight:600;">This link is valid for ${expiryMinutes} minutes.</p>
        `;

        return {
            subject: "Reset Your SplitBuddy Password",
            html,
            updateDB: (uid, expiryTime) =>
                User.findByIdAndUpdate(uid, {
                    verifyResetToken: token,
                    verifyResetTokenExpiry: Date.now() + expiryTime,
                }),
        };
    },

    userinvitation: ({ username, domain, uid }) => {
        const link = `${domain}`;

        const html = `
            <h2 style="font-size:24px;margin:0 0 15px;color:#1f2937;">You've Been Invited!</h2>
            <p style="font-size:16px;color:#374151;">
                <strong>${username}</strong> has invited you to join SplitBuddy.
            </p>

            <div style="text-align:center;margin:30px 0;">
                <a href="${link}" style="background:#3b82f6;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
                    Join SplitBuddy
                </a>
            </div>

            <p style="font-size:14px;color:#6b7280;">If you were not expecting this, simply ignore this email.</p>
        `;

        return {
            subject: `${username} invited you to SplitBuddy 🎉`,
            html,
            updateDB: null,
        };
    },
};

// =========================================================
// MAIN SEND MAIL FUNCTION
// =========================================================
export const sendMail = async ({ username, email, uid, mailType }) => {
    const domain = process.env.DOMAIN;
    const expiryMinutes = 10;
    const expiryTime = expiryMinutes * 60 * 1000;
    const token =
        mailType === "emailverify" || mailType === "resetpassword"
            ? crypto.randomBytes(32).toString("hex")
            : null;

    const templateFn = MAIL_TEMPLATES[mailType];
    if (!templateFn) throw new Error("Invalid mailType");

    const { subject, html, updateDB } = templateFn({
        username,
        email,
        uid,
        domain,
        token,
        expiryMinutes,
    });

    if (updateDB) await updateDB(uid, expiryTime);

    // Insert into base layout
    let finalHtml = BASE_TEMPLATE.replace("[CONTENT]", html)
        .replace("[EMAIL]", email)
        .replace("[YEAR]", new Date().getFullYear());

    // SEND EMAIL
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,
        },
    });

    const response = await transporter.sendMail({
        from: "SplitBuddy <no-reply@splitbuddy.com>",
        to: email,
        subject,
        html: finalHtml,
    });

    return response;
};
