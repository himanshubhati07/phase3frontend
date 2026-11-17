import React from 'react';
import { render } from '@testing-library/react-native';
import PageScreen from './PageScreen';

jest.mock('react-native-webview', () => ({ WebView: 'WebView' }));

test('renders without crashing', () => {
  const { getByTestId } = render(<PageScreen />);
  getByTestId('design-page');
});
