const AUTH_KEY = "pharma-auth";

function normalizeSession(session) {
  if (!session) {
    return null;
  }

  const role = session.role || session.user?.role || "";

  const user = session.user
    ? {
        ...session.user,
        role,
      }
    : null;

  return {
    role,
    user,
  };
}

function saveAuthSession(session) {
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify(normalizeSession(session))
  );
}

function getAuthSession() {
  const raw = localStorage.getItem(AUTH_KEY);

  if (!raw) {
    return null;
  }

  try {
    return normalizeSession(JSON.parse(raw));
  } catch (error) {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
}

function clearAuthSession() {
  logout();
}

function isLoggedIn() {
  return getAuthSession() !== null;
}

function getUser() {
  return getAuthSession()?.user || null;
}

function getRole() {
  return getAuthSession()?.role || null;
}

function isAdmin() {
  return getRole() === "admin";
}

function isCustomer() {
  return getRole() === "customer";
}

function getCurrentUserEmail() {
  return getUser()?.email || "";
}

function updateAuthUser(user) {
  const session = getAuthSession();

  if (!session) {
    return;
  }

  saveAuthSession({
    role: session.role,
    user: {
      ...user,
      role: session.role,
    },
  });
}

export {
  saveAuthSession,
  getAuthSession,
  logout,
  clearAuthSession,
  isLoggedIn,
  getUser,
  getRole,
  isAdmin,
  isCustomer,
  getCurrentUserEmail,
  updateAuthUser,
};