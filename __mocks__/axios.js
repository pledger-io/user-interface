
const axiosMock = {
    get: jest.fn(() => Promise.resolve({data: {}})),
    post: jest.fn(() => Promise.resolve({data: {}})),
    create: _ => axiosMock
}

export default axiosMock