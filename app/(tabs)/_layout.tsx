// app/(drawer)/_layout.tsx
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { auth } from '../../firebaseConfig';
import AuthGuard from '../../authGuard';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { signOut } from 'firebase/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../authContext';

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { user } = useAuth(); 
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const isHomePage = pathname === '/index' || pathname === '/';

  const handleProfilePress = () => {
    router.push('/manageProfile');
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#8a1b33', '#a04f5a']}
        style={{ flex: 1, paddingTop: 40 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
          <TouchableOpacity style={styles.profileContainer} onPress={handleProfilePress} activeOpacity={0.7}>
            <View style={styles.profileImageWrapper}>
              <Image
                source={{ uri: user?.photoURL || 'https://via.placeholder.com/50x50.png?text=User' }}
                style={styles.profileImage}
              />
              <View style={styles.onlineIndicator} />
            </View>
            <Text style={styles.profileName} numberOfLines={1}>
              {user?.displayName || user?.email || 'Guest'}
            </Text>
          </TouchableOpacity>

          <DrawerItemList {...props} />
          {isHomePage && (
            <View style={styles.sidebarMarkContainer}>
              <Text style={styles.sidebarMarkText}>Sidebar Mark</Text>
            </View>
          )}
          <View style={styles.logoutContainer}>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <View style={styles.logoutBox}>
                <Ionicons name="exit-outline" size={20} color="#fff" style={styles.logoutIcon} />
                <Text style={styles.logoutText}>Log Out</Text>
              </View>
            </TouchableOpacity>
          </View>
        </DrawerContentScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
  },
  profileImageWrapper: {
    position: 'relative',
    marginRight: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fb6090',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4cd137', // green color for online
    borderWidth: 2,
    borderColor: '#8a1b33', // match the gradient start color for border
  },
  profileName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    maxWidth: 150,
  },
  logoutContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  logoutButton: {
    paddingVertical: 10,
  },
  logoutBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sidebarMarkContainer: {
    padding: 10,
    backgroundColor: '#fb6090',
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  sidebarMarkText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default function DrawerLayout() {
  return (
    <AuthGuard>
      <Drawer
        screenOptions={({ navigation }) => ({
          headerShown: true,
          drawerActiveTintColor: '#FFFFFF',
          drawerInactiveTintColor: '#FFFFFF',
          drawerLabelStyle: {
            fontSize: 16,
          },
          headerStyle: {
            backgroundColor: '#fb6090',
          },
          headerTintColor: '#fff',
          drawerStyle: {
            backgroundColor: 'transparent',
          },
          headerLeft: () => {
            const { user } = useAuth(); 
            if (user && user.photoURL) {
              return (
                <TouchableOpacity
                  onPress={() => navigation.toggleDrawer()}
                  style={{ marginLeft: 15, flexDirection: 'row', alignItems: 'center' }}
                >
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: '#fb6090',
                      borderRadius: 20,
                      padding: 2,
                      marginRight: 8,
                    }}
                  >
                    <Image
                      source={{ uri: user.photoURL }}
                      style={{ width: 36, height: 36, borderRadius: 18 }}
                    />
                  </View>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14, maxWidth: 120 }} numberOfLines={1}>
                    {user.email}
                  </Text>
                </TouchableOpacity>
              );
            } else {
              return (
                <TouchableOpacity
                  onPress={() => navigation.toggleDrawer()}
                  style={{ marginLeft: 15, flexDirection: 'row', alignItems: 'center' }}
                >
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: '#fb6090',
                      borderRadius: 20,
                      padding: 2,
                      marginRight: 8,
                    }}
                  >
                    <Image
                      source={{ uri: 'https://via.placeholder.com/36x36.png?text=User' }}
                      style={{ width: 36, height: 36, borderRadius: 18 }}
                    />
                  </View>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14, maxWidth: 120 }} numberOfLines={1}>
                    Guest
                  </Text>
                </TouchableOpacity>
              );
            }
          },
        })}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Home',
            title: 'CakeSmile 🍰',
          }}
        />
        <Drawer.Screen
          name="favorite"
          options={{
            drawerLabel: 'Favorites',
            title: 'Favorites',
          }}
        />
        <Drawer.Screen
          name="menu"
          options={{
            drawerLabel: 'Menu',
            title: 'Menu',
          }}
        />
        <Drawer.Screen
          name="notifications"
          options={{
            drawerLabel: 'Notifications',
            title: 'Notifications',
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: 'Profile',
            title: 'Profile',
          }}
        />
      </Drawer>
    </AuthGuard>
  );
}
