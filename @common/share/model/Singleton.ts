export const Singleton = <T>() => {
    return class {
        static _instance: T
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        protected constructor(...args: unknown[]) {}

        public static getInstance(...args: unknown[]): T {
            if (!this._instance) {
                this._instance = new this(...args) as T
            }

            return this._instance
        }
    }
}
