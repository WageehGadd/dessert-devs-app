import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (!user) {
        if (mounted) {
          setTimeout(() => {
            router.replace('/(auth)/login');
          }, 0);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [mounted]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#fb6090" size="large" />
      </View>
    );
  }

  return <>{children}</>;
}
