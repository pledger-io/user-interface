import { vi } from "vitest";

function createMocks() {
    const mocks = vi.hoisted(() => ({
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
                    get: mocks.get,
                    post: mocks.post,
                })),
            },
        };
    });

    return mocks
}

const mockedAxios = createMocks()
export { mockedAxios }