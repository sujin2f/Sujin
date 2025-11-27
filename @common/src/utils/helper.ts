export const promiseLike = async <T>(func: () => T): Promise<T> => {
    return new Promise((resolve, reject) => {
        try {
            const result = func()
            resolve(result)
        } catch (e) {
            reject(e)
        }
    })
}
