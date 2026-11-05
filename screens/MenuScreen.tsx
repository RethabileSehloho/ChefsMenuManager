import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';
import { loadMenuItems, saveMenuItem, updateMenuItem, deleteMenuItem } from '../utils/storage';
import { calculateStatistics } from '../utils/statistics';
import MenuItemCard from '../components/MenuItemCard';
import MenuForm from '../components/MenuForm';
import Icon from 'react-native-vector-icons/Ionicons';

const COURSE_OPTIONS = ['Starter', 'Main Course', 'Dessert'];

export default function MenuScreen() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit State
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');

  const loadItems = useCallback(async () => {
    const items = await loadMenuItems();
    setMenuItems(items);
  }, []);

  useEffect(() => {
    loadItems();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  };

  // --- CRUD Functions ---
  const handleSaveItem = async (itemData: any) => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        // Update existing
        await updateMenuItem({ ...itemData, id: editingItem.id });
        Alert.alert('Success', 'Menu item updated successfully!');
        setEditingItem(null);
      } else {
        // Add new
        await saveMenuItem({ ...itemData, id: Date.now() });
        Alert.alert('Success', 'Menu item added successfully!');
      }
      await loadItems();
    } catch (error) {
      Alert.alert('Error', 'Failed to save menu item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this menu item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteMenuItem(id);
            await loadItems();
            // If we deleted the item currently being edited, cancel edit mode
            if (editingItem && editingItem.id === id) {
              setEditingItem(null);
            }
          },
        },
      ]
    );
  };

  // --- Filtering Logic ---
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.dishName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedFilter ? item.course === selectedFilter : true;
    return matchesSearch && matchesCourse;
  });

  const stats = calculateStatistics(menuItems);

  return (
    <View style={globalStyles.menuContainer}>
      {/* Header */}
      <View style={globalStyles.menuHeader}>
        <Text style={globalStyles.menuHeaderTitle}>🍽️ Menu</Text>
        <View style={globalStyles.menuHeaderCount}>
          <Text style={{ color: colors.cream, fontWeight: 'bold' }}>
            {menuItems.length} Total
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold} />
          }
        >
          {/* Statistics Dashboard */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.totalItems}</Text>
              <Text style={styles.statLabel}>Total Items</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>R{stats.averagePrice}</Text>
              <Text style={styles.statLabel}>Avg Price</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.courseCounts['Dessert'] || 0}</Text>
              <Text style={styles.statLabel}>Desserts</Text>
            </View>
          </View>

          {/* Search & Filter Section */}
          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Icon name="search" size={20} color={colors.gray} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by dish name..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Icon name="close-circle" size={20} color={colors.gray} />
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.filterRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  style={[styles.filterBtn, selectedFilter === '' && styles.filterBtnActive]}
                  onPress={() => setSelectedFilter('')}
                >
                  <Text style={[styles.filterText, selectedFilter === '' && styles.filterTextActive]}>All</Text>
                </TouchableOpacity>
                {COURSE_OPTIONS.map(course => (
                  <TouchableOpacity
                    key={course}
                    style={[styles.filterBtn, selectedFilter === course && styles.filterBtnActive]}
                    onPress={() => setSelectedFilter(course)}
                  >
                    <Text style={[styles.filterText, selectedFilter === course && styles.filterTextActive]}>{course}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Form Component */}
          <MenuForm 
            editingItem={editingItem}
            onSubmit={handleSaveItem}
            onCancelEdit={() => setEditingItem(null)}
          />

          {/* List Component */}
          <View style={{ paddingBottom: 40 }}>
            <Text style={styles.listTitle}>
              {selectedFilter || searchQuery ? 'Filtered Results' : 'All Menu Items'}
            </Text>
            
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onEdit={(itemToEdit) => setEditingItem(itemToEdit)}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <View style={globalStyles.emptyState}>
                <Icon name="restaurant-outline" size={60} color={colors.gold} />
                <Text style={globalStyles.emptyStateTitle}>No Items Found</Text>
                <Text style={globalStyles.emptyStateText}>
                  {searchQuery || selectedFilter 
                    ? "No items match your search or filter." 
                    : "Start adding your delicious dishes above."}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.primary,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    justifyContent: 'space-between',
  },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: colors.gold },
  statLabel: { fontSize: 12, color: colors.cream, marginTop: 4 },
  
  searchSection: {
    padding: 16,
    paddingBottom: 0,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  searchInput: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, fontSize: 16 },
  
  filterRow: { flexDirection: 'row', marginBottom: 16 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  filterBtnActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  filterText: { color: colors.darkText, fontSize: 14 },
  filterTextActive: { color: colors.primary, fontWeight: 'bold' },

  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },
});