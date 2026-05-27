import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, name, type } = await request.json();

    let subject = "";
    let html = "";

    if (type === "welcome") {
      subject = "Welcome to VisaSeek AI! 🎉✈️";
      html = `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; font-weight: 700; color: #111;">✈️ VisaSeek AI</h1>
          </div>
          
          <h2 style="font-size: 24px; font-weight: 600; color: #111;">Welcome, ${name}! 🎉</h2>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Thank you for joining VisaSeek AI — your personal AI immigration assistant!
          </p>

          <div style="background: #f9f9f9; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <h3 style="font-size: 16px; font-weight: 600; color: #111; margin-bottom: 16px;">
              What you can do with VisaSeek AI:
            </h3>
            <ul style="color: #555; font-size: 15px; line-height: 2; padding-left: 20px;">
              <li>🛂 Get instant visa guidance for any country</li>
              <li>📊 Calculate your Express Entry CRS score</li>
              <li>📄 Generate professional SOP letters</li>
              <li>🌍 Find the best country for your profile</li>
              <li>🚫 Analyze visa refusal letters</li>
              <li>💼 Get work permit guidance</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 32px 0;">
            <a href="https://visaseekai.com" 
               style="background: #000; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 500;">
              Start Chatting Now →
            </a>
          </div>

          <div style="background: #fff3cd; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="color: #856404; font-size: 14px; margin: 0;">
              🆓 <strong>Free Plan:</strong> 10 messages every 7 hours<br/>
              ⭐ <strong>Pro Plan:</strong> Unlimited messages for just $19/month
            </p>
          </div>

          <p style="color: #555; font-size: 15px; line-height: 1.6;">
            Have questions? Reply to this email or visit our 
            <a href="https://visaseekai.com/help" style="color: #000;">Help Center</a>.
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          
          <p style="color: #999; font-size: 13px; text-align: center;">
            VisaSeek AI — Your AI Immigration Assistant<br/>
            <a href="https://visaseekai.com" style="color: #999;">visaseekai.com</a>
          </p>
          
          <p style="color: #bbb; font-size: 11px; text-align: center; margin-top: 8px;">
            ⚠️ VisaSeek AI provides guidance only, not legal advice. 
            Always verify with official government sources.
          </p>
        </div>
      `;
    }

    if (type === "upgrade") {
      subject = "Welcome to VisaSeek AI Pro! 🚀";
      html = `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; font-weight: 700; color: #111;">✈️ VisaSeek AI</h1>
          </div>
          
          <h2 style="font-size: 24px; font-weight: 600; color: #111;">You're now a Pro member! 🎉</h2>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Thank you for upgrading to VisaSeek AI Pro, ${name}!
          </p>

          <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <h3 style="font-size: 16px; font-weight: 600; color: #111; margin-bottom: 16px;">
              Your Pro benefits are now active:
            </h3>
            <ul style="color: #555; font-size: 15px; line-height: 2; padding-left: 20px;">
              <li>✅ Unlimited AI messages</li>
              <li>✅ File and image upload</li>
              <li>✅ Refusal letter analysis</li>
              <li>✅ Document generation</li>
              <li>✅ Priority support</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 32px 0;">
            <a href="https://visaseekai.com" 
               style="background: #000; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 500;">
              Start Using Pro →
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          
          <p style="color: #999; font-size: 13px; text-align: center;">
            VisaSeek AI — Your AI Immigration Assistant<br/>
            <a href="https://visaseekai.com" style="color: #999;">visaseekai.com</a>
          </p>
        </div>
      `;
    }

    const data = await resend.emails.send({
      from: "VisaSeek AI <welcome@visaseekai.com>",
      to: email,
      subject,
      html,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
