import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { colors } from '../styles/globalStyles';

const COURSE_OPTIONS = ['Starter', 'Main Course', 'Dessert'];

interface MenuItem {
  id: number;
  dishName: string;
  description: string;
  course: string;
  price: number;
}

interface MenuFormProps {
  editingItem: MenuItem | null;
  onSubmit: (itemData: any) => void;
  onCancelEdit: () => void;
}

export default function MenuForm({ editingItem, onSubmit, onCancelEdit }: MenuFormProps) {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // If an item is passed for editing, fill the form
  useEffect(() => {
    if (editingItem) {
      setDishName(editingItem.dishName);
      setDescription(editingItem.description);
      setCourse(editingItem.course);
      setPrice(editingItem.price.toString());
    } else {
      clearForm();
    }
  }, [editingItem]);

  const clearForm = () => {
    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');
    setErrors({});
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

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill in all fields correctly.');
      return;
    }

    const itemData = {
      dishName: dishName.trim(),
      description: description.trim(),
      course,
      price: parseFloat(price),
    };

    onSubmit(itemData);
    
    if (!editingItem) {
      clearForm(); // Only clear if we are adding a new item
    }
  };

  return (
    <View style={styles.formCard}>
      <Text style={styles.formTitle}>
        {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
      </Text>

      {/* Dish Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Dish Name *</Text>
        <TextInput
          style={[styles.input, errors.dishName && styles.inputError]}
          placeholder="e.g., Grilled Salmon"
          value={dishName}
          onChangeText={setDishName}
        />
        {errors.dishName && <Text style={styles.errorText}>{errors.dishName}</Text>}
      </View>

      {/* Description */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Description *</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline, errors.description && styles.inputError]}
          placeholder="Describe the dish..."
          multiline
          value={description}
          onChangeText={setDescription}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
      </View>

      {/* Course Selection */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Course *</Text>
        <View style={styles.courseContainer}>
          {COURSE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.courseOption, course === option && styles.courseOptionSelected]}
              onPress={() => setCourse(option)}
            >
              <Text style={[styles.courseOptionText, course === option && styles.courseOptionTextSelected]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.course && <Text style={styles.errorText}>{errors.course}</Text>}
      </View>

      {/* Price */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Price (R) *</Text>
        <TextInput
          style={[styles.input, errors.price && styles.inputError]}
          placeholder="e.g., 149.99"
          keyboardType="decimal-pad"
          value={price}
          onChangeText={setPrice}
        />
        {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        {editingItem && (
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancelEdit}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{editingItem ? 'Save Changes' : 'Add Item'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: { marginBottom: 12 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: colors.darkText, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: colors.cream,
  },
  inputMultiline: { minHeight: 70, textAlignVertical: 'top' },
  inputError: { borderColor: colors.danger },
  errorText: { color: colors.danger, fontSize: 12, marginTop: 4 },
  courseContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  courseOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cream,
  },
  courseOptionSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  courseOptionText: { color: colors.darkText, fontSize: 13 },
  courseOptionTextSelected: { color: colors.white, fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  button: { flex: 1, backgroundColor: colors.gold, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: colors.primary, fontSize: 16, fontWeight: 'bold' },
  cancelButton: { backgroundColor: colors.lightGray },
  cancelButtonText: { color: colors.darkText, fontSize: 16, fontWeight: 'bold' },
});