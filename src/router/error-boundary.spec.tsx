import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { ErrorResponse } from "react-router";
import { vi } from "vitest";
import { mockedReactRouter } from "../../__mocks__/react-router.jsx";
import SecurityRepository from "../core/repositories/security-repository";
import { RootErrorBoundary } from './error-boundary';

vi.mock('../core/repositories/security-repository', () => ({
  default: { logout: vi.fn() },
}));

describe('RootErrorBoundary', () => {
  it('redirects to /two-factor on 403 error', () => {
    mockedReactRouter.useRouteError.mockReturnValue({
      response: { status: 403 } as ErrorResponse,
    });
    mockedReactRouter.isRouteErrorResponse.mockReturnValue(false);

    render(<RootErrorBoundary />);

    waitFor(() => expect(mockedReactRouter.useNavigate).toHaveBeenCalledWith('/two-factor'));
  });

  it('logs out and reloads the page on 401 error', () => {
    mockedReactRouter.useRouteError.mockReturnValue({
      response: { status: 401 } as ErrorResponse,
    });
    mockedReactRouter.isRouteErrorResponse.mockReturnValue(false);

    render(<RootErrorBoundary/>);
    waitFor(() => expect(mockedReactRouter.useNavigate).toHaveBeenCalled());
    expect(SecurityRepository.logout).toHaveBeenCalled();
  });

  it('logs a warning for an unexpected error', () => {
    const unexpectedError = new Error('Unexpected error');
    mockedReactRouter.useRouteError.mockReturnValue(unexpectedError);

    const { getByTestId } = render(<RootErrorBoundary/>);

    expect(getByTestId('error-message'))
      .toHaveTextContent('Unexpected error')
  });
});
