export function frozenUserTemplate(email: string) {
  return `
    <h2>Your V6 Auto Broker account has been temporarily restricted</h2>
    <p>Hello ${email},</p>
    <p>Your account has been <strong>temporarily frozen</strong> by an administrator.</p>
    <p>You will not be able to place bids during this time.</p>
    <p>If you believe this is an error, please contact support.</p>
    <br />
    <p>— V6 Auto Broker</p>
  `;
}

export function unfrozenUserTemplate(email: string) {
  return `
    <h2>Your V6 Auto Broker account has been restored</h2>
    <p>Hello ${email},</p>
    <p>Your account has been <strong>unfrozen</strong>.</p>
    <p>You may now resume bidding.</p>
    <br />
    <p>— V6 Auto Broker</p>
  `;
}

export function adminAlertTemplate(
  email: string,
  action: "frozen" | "unfrozen"
) {
  return `
    <h3>Admin Alert</h3>
    <p>User <strong>${email}</strong> has been <strong>${action}</strong>.</p>
    <p>Timestamp: ${new Date().toLocaleString()}</p>
  `;
}
