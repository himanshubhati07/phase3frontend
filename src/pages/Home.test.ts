import { render } from '@testing-library/svelte';
import { test } from 'vitest';
import DesignPage from '../design/DesignPage.svelte';

test('renders without crashing', () => {
  render(DesignPage);
});
