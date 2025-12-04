const client = {
    connect: async () => jest.fn(),
    isReady: true,
    keys: async () => jest.fn(),
    del: async () => jest.fn(),
    set: async () => jest.fn(),
    destroy: () => jest.fn(),
}
export const redis = { createClient: () => client }
