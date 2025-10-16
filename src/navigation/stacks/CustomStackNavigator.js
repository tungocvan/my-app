import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StackHeader from './StackHeader';

const Stack = createNativeStackNavigator();

/**
 * CustomStackNavigator
 * - Hỗ trợ header custom StackHeader
 * - Cho phép override header mặc định qua options
 * - Hỗ trợ defaultHeaderOptions (showMenu, showLogout, isSearch)
 */
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
        // console.log(props?.showMenu);
        // Lấy showMenu/showLogout từ options nếu có, fallback về defaultHeaderOptions
        const showMenu = options.showMenu ?? defaultHeaderOptions.showMenu ?? false;
        const showLogout = options.showLogout ?? defaultHeaderOptions.showLogout ?? false;
        const isSearch = options.isSearch ?? defaultHeaderOptions.isSearch ?? false;
        const isCart = options.isCart ?? defaultHeaderOptions.isCart ?? true;

        return (
          <Stack.Screen
            {...props}
            options={{
              ...options,
              // ✅ Chỉ dùng StackHeader custom nếu không override header hoặc headerShown = false
              header:
                options.headerShown === false || options.header
                  ? options.header
                  : (headerProps) => (
                      <StackHeader
                        title={title}
                        showMenu={showMenu}
                        showLogout={showLogout}
                        isSearch={isSearch}
                        isCart={isCart}
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

// Giữ khả năng truy cập Stack.Screen
CustomStackNavigator.Screen = Stack.Screen;

export default CustomStackNavigator;
