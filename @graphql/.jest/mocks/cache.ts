export default {
    cachedRequest: (...args: unknown[]) => args[0],
    getCacheKey: () => jest.fn(),
}
