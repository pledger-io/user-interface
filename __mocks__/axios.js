import { vi } from "vitest";

const mockedAxios = vi.hoisted(() => ({
    get: vi.fn(() => Promise.resolve({data: {}})),
    post: vi.fn(() => Promise.resolve({data: {}})),
}));

vi.mock('axios', async () => {
    const actual = await vi.importActual("axios");
    return {
        default: {
            ...actual.default,
            create: vi.fn(() => ({
                ...actual.default.create(),
                get: mockedAxios.get,
                post: mockedAxios.post,
            })),
        },
    };
});

export { mockedAxios }
