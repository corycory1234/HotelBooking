import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestBtn } from './testBtn';

test('Vitest - 按鈕頁面', () => {
  render(<TestBtn/>)
  expect(screen.getByText('測試按鈕')).toBeInTheDocument();
})