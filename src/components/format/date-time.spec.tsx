// date-time.spec.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import _ from './date-time.component';

describe('date-time.component', () => {
    it('renders formatted date when date and language are provided', () => {
        const date = '2025-09-15T12:34:56Z';

        render(<_ date={ date }/>);

        const formattedDate = new Intl.DateTimeFormat('en', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(new Date(date));

        expect(screen.getByText(formattedDate)).toBeInTheDocument();
    });

    it('formats date based on different language setting', () => {
      localStorage.setItem("language", '"nl"')
      const date = '2025-09-15T12:34:56Z';

        render(<_ date={ date }/>);

        const formattedDate = new Intl.DateTimeFormat('nl', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(new Date(date));

        expect(screen.getByText(formattedDate)).toBeInTheDocument();
    });
});