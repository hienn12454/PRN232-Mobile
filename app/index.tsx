import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { getAuthInstance } from '@/src/core/firebase/auth';

export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const initAuth = async () => {
      try {
        const { onAuthStateChanged } = await import('firebase/auth');
        const auth = await getAuthInstance();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (!isMounted.current) return;

          setIsLoading(false);
          
          if (user) {
            router.replace('/(tabs)');
          } else {
            router.replace('/(auth)/login');
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted.current) {
          setIsLoading(false);
          router.replace('/(auth)/login');
        }
      }
    };

    let unsubscribe: (() => void) | undefined;
    initAuth().then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      isMounted.current = false;
      unsubscribe?.();
    };
  }, [router]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
});
