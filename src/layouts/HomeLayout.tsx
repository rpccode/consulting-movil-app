import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HomeLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

export const HomeLayout: React.FC<HomeLayoutProps> = ({ children, header }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {header && <View style={styles.header}>{header}</View>}
      <View style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  content: {
    flex: 1,
  },
});