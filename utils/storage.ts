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

// NEW: Update an existing item
export const updateMenuItem = async (updatedItem: any) => {
  try {
    const existingItems = await loadMenuItems();
    const updatedItems = existingItems.map((item: any) => 
      item.id === updatedItem.id ? updatedItem : item
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    return true;
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

// NEW: Delete an item
export const deleteMenuItem = async (id: number) => {
  try {
    const existingItems = await loadMenuItems();
    const updatedItems = existingItems.filter((item: any) => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    return true;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};