const client = {
    connect: () => jest.fn(),
    isReady: true,
    keys: () => jest.fn(),
    del: () => jest.fn(),
    set: () => jest.fn(),
    destroy: () => jest.fn(),
}
export const redis = { createClient: () => client }
