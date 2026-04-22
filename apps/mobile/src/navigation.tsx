import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuthStore } from './store/auth.store';
import { LoadingView } from './components';

import {
  LoginScreen,
  HomeScreen,
  SessionDetailScreen,
  MySessionsScreen,
  HostDashboardScreen,
  ProfileScreen,
  CreateSessionScreen,
  HostSessionDetailScreen,
  BecomeHostScreen,
} from './screens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="HomeList"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SessionDetail"
        component={SessionDetailScreen}
        options={{ title: 'Session Details' }}
      />
    </Stack.Navigator>
  );
}

function MySessionsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="MySessionsList"
        component={MySessionsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SessionDetail"
        component={SessionDetailScreen}
        options={{ title: 'Session Details' }}
      />
    </Stack.Navigator>
  );
}

function HostStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="HostDashboardScreen"
        component={HostDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateSession"
        component={CreateSessionScreen}
        options={{ title: 'Create Session' }}
      />
      <Stack.Screen
        name="HostSessionDetail"
        component={HostSessionDetailScreen}
        options={{ title: 'Manage Session' }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BecomeHost"
        component={BecomeHostScreen}
        options={{ title: 'Become a Host' }}
      />
    </Stack.Navigator>
  );
}

function AuthenticatedApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0066cc',
        tabBarInactiveTintColor: '#999',
        tabBarLabel: getTabLabel(route.name),
        tabBarIcon: ({ color }) => <TabIcon name={route.name} color={color} />,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ title: 'Browse' }}
      />
      <Tab.Screen
        name="MySessions"
        component={MySessionsStack}
        options={{ title: 'My Sessions' }}
      />
      <Tab.Screen
        name="Host"
        component={HostStack}
        options={{ title: 'Host' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

function UnauthenticatedApp() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

function TabIcon({ name, color }: { name: string; color: string }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    MySessions: '📋',
    Host: '🎯',
    Profile: '👤',
  };

  return <Text style={{ fontSize: 20 }}>{icons[name] || '❓'}</Text>;
}

function getTabLabel(name: string): string {
  const labels: Record<string, string> = {
    Home: 'Browse',
    MySessions: 'My Sessions',
    Host: 'Host',
    Profile: 'Profile',
  };
  return labels[name] || name;
}

export function Navigation() {
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // TODO: Check if user is already authenticated on app start
    // For now, just set loading to false
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingView />;
  }

  return (
    <NavigationContainer>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </NavigationContainer>
  );
}
