const STORAGE_KEY = "researchAI_notifications";

export const getNotifications = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

export const addNotification = (message, type = "info") => {
  const notifications = getNotifications();

  const newNotification = {
    id: Date.now() + Math.random(),
    message,
    type,
    read: false,
    createdAt: new Date().toISOString()
  };

  const updated = [newNotification, ...notifications].slice(0, 50);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("researchai-notifications-updated"));

  return newNotification;
};

export const markNotificationRead = (id) => {
  const updated = getNotifications().map(item =>
    item.id === id ? { ...item, read: true } : item
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("researchai-notifications-updated"));
};

export const markAllNotificationsRead = () => {
  const updated = getNotifications().map(item => ({
    ...item,
    read: true
  }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("researchai-notifications-updated"));
};

export const clearNotifications = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  window.dispatchEvent(new Event("researchai-notifications-updated"));
};
