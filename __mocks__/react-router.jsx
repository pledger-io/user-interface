import { vi } from "vitest";

export const mockedReactRouter = {
  useNavigate: vi.fn(),
  useRouteError: vi.fn(),
  isRouteErrorResponse: vi.fn()
};

vi.mock('react-router', () => {
  return {
    ...vi.importActual("react-router"),
    useNavigate: () => mockedReactRouter.useNavigate,
    useRouteError: mockedReactRouter.useRouteError,
    isRouteErrorResponse: mockedReactRouter.isRouteErrorResponse,
  };
});
