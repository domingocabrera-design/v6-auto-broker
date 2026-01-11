export function isAdmin(email?: string | null) {
  if (!email) return false;

  const admins = [
    "v6autobroker@yahoo.com",
    "v6autobroker@gmail.com",
    "empire.com@yourdomain.com",
  ];

  return admins.includes(email);
}
