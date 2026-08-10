/** Safe user object for API responses (no password) */
export const formatUserResponse = (user) => {
  if (!user) return null;

  const doc = user.toObject ? user.toObject() : user;
  const { password, ...safe } = doc;

  return {
    ...safe,
    position: safe.position || safe.designation || "",
    designation: safe.designation || safe.position || "",
  };
};
