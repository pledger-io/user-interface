import {vi} from "vitest";

export const mockedReactRouter = {
    useNavigate: vi.fn(),
};

vi.mock('react-router', () => {
    return {
        ...vi.importActual("react-router"),
        useNavigate: () => mockedReactRouter.useNavigate,
    };
});
