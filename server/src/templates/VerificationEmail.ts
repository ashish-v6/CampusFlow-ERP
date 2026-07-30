const VerificationTemplate = (username: string, email: string, otp: string) => {
  return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Verification Code</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:30px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #ddd;border-radius:6px;overflow:hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background:#4285F4;padding:40px 30px;">
                  <h1 style="margin:0;color:#ffffff;font-size:30px;font-weight:normal;">
                    Verification Code
                  </h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding:35px 30px;color:#333;">
                  
                  <p style="font-size:16px;">
                    Hi <strong>${username}</strong>,
                  </p>

                  <p style="font-size:15px;line-height:1.6;">
                    We received a request to verify your email address
                    <strong>${email}</strong>.
                  </p>

                  <p style="font-size:15px;line-height:1.6;">
                    Your verification code is:
                  </p>

                  <!-- OTP Box -->
                  <div style="text-align:center;margin:35px 0;">
                    <span style="
                      display:inline-block;
                      background:#f3f4f6;
                      padding:15px 35px;
                      font-size:34px;
                      font-weight:bold;
                      letter-spacing:5px;
                      border-radius:8px;
                      color:#222;
                    ">
                      ${otp}
                    </span>
                  </div>

                  <p style="font-size:15px;line-height:1.6;">
                    This code will expire in <strong>10 minutes</strong>.
                  </p>

                  <p style="font-size:15px;line-height:1.6;">
                    If you did not request this code, please ignore this email.
                    Never share this code with anyone.
                  </p>

                  <p style="margin-top:35px;">
                    Sincerely,<br />
                    <strong>By Authentication Team</strong>
                  </p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="
                  background:#fafafa;
                  padding:20px;
                  text-align:center;
                  color:#777;
                  font-size:12px;
                  border-top:1px solid #eee;
                ">
                  This is an automated email. Please do not reply.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
};

export default VerificationTemplate;
