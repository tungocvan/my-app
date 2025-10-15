import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StackHeader from './StackHeader';

const Stack = createNativeStackNavigator();

const CustomStackNavigator = ({ children, defaultHeaderOptions = {} }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerShadowVisible: false,
        headerTitle: () => null,
      }}
    >
      {React.Children.map(children, (child) => {
        const { props } = child;
        const options = props.options || {};
        const title = props?.title || options?.title || '';

        // Lấy showMenu/showLogout từ options nếu có, fallback về defaultHeaderOptions
        const showMenu = options.showMenu ?? defaultHeaderOptions.showMenu ?? false;
        const showLogout = options.showLogout ?? defaultHeaderOptions.showLogout ?? false;
        const isSearch = options.isSearch ?? defaultHeaderOptions.isSearch ?? false;

        return (
          <Stack.Screen
            {...props}
            options={{
              ...options,
              header: (headerProps) => (
                <StackHeader
                  title={title}
                  showMenu={showMenu}
                  showLogout={showLogout}
                  isSearch={isSearch}
                  {...headerProps}
                />
              ),
            }}
          />
        );
      })}
    </Stack.Navigator>
  );
};

CustomStackNavigator.Screen = Stack.Screen;

export default CustomStackNavigator;
