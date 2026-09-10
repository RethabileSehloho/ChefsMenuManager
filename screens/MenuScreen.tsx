import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';
import { loadMenuItems, saveMenuItem } from '../utils/storage';
import Icon from 'react-native-vector-icons/Ionicons';

interface MenuItem {
  id: number;
  dishName: string;
  description: string;
  course: string;
  price: number;
  createdAt: string;
}

const COURSE_OPTIONS = ['Starter', 'Main Course', 'Dessert'];

export default function MenuScreen() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!dishName.trim()) newErrors.dishName = 'Dish name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!course) newErrors.course = 'Please select a course';
    if (!price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = async () => {
    if (!validateForm()) {
      Alert.alert('Please fix errors', Object.values(errors).join('\n'));
      return;
    }

    setIsSubmitting(true);
    try {
      const newItem: MenuItem = {
        id: Date.now(),
        dishName: dishName.trim(),
        description: description.trim(),
        course: course,
        price: parseFloat(price),
        createdAt: new Date().toISOString(),
      };

      await saveMenuItem(newItem);
      
      setDishName('');
      setDescription('');
      setCourse('');
      setPrice('');
      setErrors({});
      await loadItems();
      
      Alert.alert(
        '✅ Success!',
        'Menu item added successfully!',
        [{ text: 'Great!' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add menu item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={globalStyles.itemCard}>
      <View style={globalStyles.itemHeader}>
        <Text style={globalStyles.itemName}>{item.dishName}</Text>
        <Text style={globalStyles.itemPrice}>R{item.price}</Text>
      </View>
      <Text style={globalStyles.itemDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={globalStyles.itemFooter}>
        <View style={globalStyles.itemCourse}>
          <Text style={globalStyles.itemCourseText}>{item.course}</Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={globalStyles.emptyState}>
      <Icon 
        name="restaurant-outline" 
        size={80} 
        color={colors.gold} 
        style={globalStyles.emptyStateIcon} 
      />
      <Text style={globalStyles.emptyStateTitle}>No Menu Items Yet</Text>
      <Text style={globalStyles.emptyStateText}>
        Start adding your delicious dishes below
      </Text>
    </View>
  );

  return (
    <View style={globalStyles.menuContainer}>
      <View style={globalStyles.menuHeader}>
        <Text style={globalStyles.menuHeaderTitle}>🍽️ Menu Items</Text>
        <View style={globalStyles.menuHeaderCount}>
          <Text style={{ color: colors.cream, fontWeight: 'bold' }}>
            {menuItems.length} items
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.gold}
              colors={[colors.gold]}
            />
          }
        >
          <View style={globalStyles.formContainer}>
            <View style={globalStyles.formCard}>
              <Text style={globalStyles.formTitle}>Add New Menu Item</Text>

              <View style={globalStyles.inputContainer}>
                <Text style={globalStyles.inputLabel}>
                  Dish Name <Text style={globalStyles.inputLabelRequired}>*</Text>
                </Text>
                <TextInput
                  style={[
                    globalStyles.input,
                    errors.dishName && globalStyles.inputError,
                  ]}
                  placeholder="e.g., Grilled Salmon"
                  placeholderTextColor={colors.gray}
                  value={dishName}
                  onChangeText={setDishName}
                  editable={!isSubmitting}
                />
                {errors.dishName && (
                  <Text style={globalStyles.errorText}>{errors.dishName}</Text>
                )}
              </View>

              <View style={globalStyles.inputContainer}>
                <Text style={globalStyles.inputLabel}>
                  Description <Text style={globalStyles.inputLabelRequired}>*</Text>
                </Text>
                <TextInput
                  style={[
                    globalStyles.input,
                    globalStyles.inputMultiline,
                    errors.description && globalStyles.inputError,
                  ]}
                  placeholder="Describe the dish..."
                  placeholderTextColor={colors.gray}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                  editable={!isSubmitting}
                />
                {errors.description && (
                  <Text style={globalStyles.errorText}>{errors.description}</Text>
                )}
              </View>

              <View style={globalStyles.inputContainer}>
                <Text style={globalStyles.inputLabel}>
                  Course <Text style={globalStyles.inputLabelRequired}>*</Text>
                </Text>
                <View style={globalStyles.courseContainer}>
                  {COURSE_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        globalStyles.courseOption,
                        course === option && globalStyles.courseOptionSelected,
                      ]}
                      onPress={() => setCourse(option)}
                      disabled={isSubmitting}
                    >
                      <Text
                        style={[
                          globalStyles.courseOptionText,
                          course === option && globalStyles.courseOptionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.course && (
                  <Text style={globalStyles.errorText}>{errors.course}</Text>
                )}
              </View>

              <View style={globalStyles.inputContainer}>
                <Text style={globalStyles.inputLabel}>
                  Price (R) <Text style={globalStyles.inputLabelRequired}>*</Text>
                </Text>
                <TextInput
                  style={[
                    globalStyles.input,
                    errors.price && globalStyles.inputError,
                  ]}
                  placeholder="e.g., 149.99"
                  placeholderTextColor={colors.gray}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                  editable={!isSubmitting}
                />
                {errors.price && (
                  <Text style={globalStyles.errorText}>{errors.price}</Text>
                )}
              </View>

              <TouchableOpacity
                style={[
                  globalStyles.button,
                  isSubmitting && globalStyles.buttonDisabled,
                ]}
                onPress={handleAddItem}
                disabled={isSubmitting}
              >
                <Text style={globalStyles.buttonText}>
                  {isSubmitting ? 'Adding...' : 'Add Menu Item'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ paddingBottom: 20 }}>
            <Text style={[globalStyles.formTitle, { fontSize: 18, color: colors.primary }]}>
              Current Menu
            </Text>
            
            {menuItems.length > 0 ? (
              <FlatList
                data={menuItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderMenuItem}
                scrollEnabled={false}
                contentContainerStyle={globalStyles.listContainer}
              />
            ) : (
              renderEmptyState()
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}