// Local storage keys
export const STORAGE_KEYS = {
  SALES_ENTRIES: 'rsgt_sales_entries',
  ASSOCIATES: 'rsgt_associates',
  MONTHLY_GOALS: 'rsgt_monthly_goals',
  STORE_SETTINGS: 'rsgt_store_settings',
};

// Generic storage helpers
export function getItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

// Domain-specific helpers (prepared for future data)
export function getSalesEntries() {
  return getItem(STORAGE_KEYS.SALES_ENTRIES, []);
}

export function getAssociates() {
  return getItem(STORAGE_KEYS.ASSOCIATES, []);
}

export function getMonthlyGoals() {
  return getItem(STORAGE_KEYS.MONTHLY_GOALS, {});
}

export function getStoreSettings() {
  return getItem(STORAGE_KEYS.STORE_SETTINGS, {
    storeName: 'My Store',
    currency: 'USD',
    fiscalStartMonth: 1,
  });
}
