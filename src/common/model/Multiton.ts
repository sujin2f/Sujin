export const Multiton = <T>() => {
    return class Multiton {
        static _instance: Record<string, T> = {}
        protected constructor(...args: any[]) {}

        public static getInstance(identifier: string, ...args: any[]): T {
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
