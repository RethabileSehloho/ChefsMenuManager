import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';
import Icon from 'react-native-vector-icons/Ionicons';

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={globalStyles.welcomeContainer}>
      <Icon 
        name="restaurant" 
        size={80} 
        color={colors.gold} 
        style={globalStyles.welcomeIcon} 
      />
      <Text style={globalStyles.welcomeTitle}>Chef's Menu Manager</Text>
      <Text style={globalStyles.welcomeSubtitle}>
        Manage your restaurant menu with elegance and ease
      </Text>
      
      <TouchableOpacity
        style={[
          globalStyles.button, 
          { backgroundColor: colors.gold, paddingHorizontal: 40 }
        ]}
        onPress={() => navigation.navigate('ChefProfile')}
      >
        <Text style={[globalStyles.buttonText, { color: colors.primary }]}>
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
  );
}