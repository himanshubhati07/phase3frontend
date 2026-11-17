import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import NotFoundScreen from './NotFoundScreen';

test('renders without crashing', () => {
  render(
    <NavigationContainer>
      <NotFoundScreen />
    </NavigationContainer>,
  );
});
