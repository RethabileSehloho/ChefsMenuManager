import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@menu_items';

export const saveMenuItem = async (item: any) => {
  try {
    const existingItems = await loadMenuItems();
    const updatedItems = [...existingItems, item];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    return true;
  } catch (error) {
    console.error('Error saving menu item:', error);
    throw error;
  }
};

export const loadMenuItems = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading menu items:', error);
    return [];
  }
};

export const clearAllItems = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing items:', error);
  }
};