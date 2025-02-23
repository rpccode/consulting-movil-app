import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, Keyboard, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../config/env';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

interface AuthLayoutProps {
  children: React.ReactNode;
}

type RootStackParamList = {
  Home: undefined;
  // ... other screens
};


export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const isAuthenticate = async () => {
    try {
      const token = await AsyncStorage.getItem(`${config.storageKeyPrefix}token`);
      if (token) {
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };

  // Call isAuthenticate when component mounts
  useEffect(() => {
    isAuthenticate();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    const updateLayout = () => {
      setScreenHeight(Dimensions.get('window').height);
    };

    // ✅ Nueva forma de manejar eventos en Dimensions
    const subscription = Dimensions.addEventListener('change', updateLayout);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      subscription.remove(); // ✅ Elimina correctamente el evento de Dimensions
    };
  }, []);

  useEffect(()=>{

  },[])

  return (
   <>
      <StatusBar style="dark" backgroundColor="transparent" />
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {!isKeyboardVisible && (
            <View style={[styles.logoContainer, { height: screenHeight * 0.3 }]}>
              <Image 
                source={require('../../assets/Logo.png')} 
                style={styles.logo} 
                resizeMode="contain" 
              />
            </View>
          )}
          <View style={[styles.content, isKeyboardVisible && styles.contentKeyboardVisible]}>
            {children}
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
   
   </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop:0
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '60%',
    height: '60%',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  contentKeyboardVisible: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});
