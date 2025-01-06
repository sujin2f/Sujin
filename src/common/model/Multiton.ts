export const Multiton = <T>() => {
    return class Multiton {
        static _instance: Record<string, T> = {}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        protected constructor(...args: unknown[]) {}

        public static getInstance(identifier: string, ...args: unknown[]): T {
            if (!this._instance[identifier]) {
                this._instance[identifier] = new this(...args) as T
            }

            return this._instance[identifier]
        }

        public static hasInstance(identifier: string): boolean {
            return !!this._instance[identifier]
        }

        public static destroy(identifier: string) {
            delete this._instance[identifier]
        }
    }
}
