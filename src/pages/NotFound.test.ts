import { render } from '@testing-library/svelte';
import { test } from 'vitest';
import NotFoundWrapper from './NotFoundWrapper.test.svelte';

test('renders without crashing', () => {
  render(NotFoundWrapper);
});
