import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ChefProfileScreen({ navigation }: any) {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={30}
          color={i <= rating ? colors.gold : colors.lightGray}
          style={globalStyles.star}
        />
      );
    }
    return stars;
  };

  return (
    <View style={globalStyles.profileContainer}>
      <View style={globalStyles.profileCard}>
        <View style={globalStyles.profileImage}>
          <Icon name="person" size={60} color={colors.white} />
        </View>
        
        <Text style={globalStyles.chefName}>Christoffel</Text>
        <Text style={globalStyles.chefTitle}>Executive Chef • Restaurant Owner</Text>
        
        <View style={globalStyles.starsContainer}>
          {renderStars(5)}
        </View>
        
        <Text style={{ color: colors.gray, textAlign: 'center', marginBottom: 20 }}>
          Passionate about creating memorable dining experiences with fresh, locally-sourced ingredients.
        </Text>
        
        <TouchableOpacity
          style={[globalStyles.button, globalStyles.buttonSecondary, { width: '100%' }]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={[globalStyles.buttonText, globalStyles.buttonSecondaryText]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}