import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';
import Icon from 'react-native-vector-icons/Ionicons';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    navigation.navigate('Menu');
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.loginContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={globalStyles.loginCard}>
        <Text style={globalStyles.loginTitle}>Welcome Back</Text>
        <Text style={globalStyles.loginSubtitle}>Login to continue</Text>
        
        <View style={globalStyles.inputContainer}>
          <Text style={globalStyles.inputLabel}>Email Address</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="chef@restaurant.com"
            placeholderTextColor={colors.gray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={globalStyles.inputContainer}>
          <Text style={globalStyles.inputLabel}>Password</Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              style={globalStyles.input}
              placeholder="Enter your password"
              placeholderTextColor={colors.gray}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={{ position: 'absolute', right: 16, top: 16 }}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color={colors.gray}
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity
          style={globalStyles.button}
          onPress={handleLogin}
        >
          <Text style={globalStyles.buttonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity>
          <Text style={globalStyles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}