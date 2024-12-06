export const Singleton = <T>() => {
    return class {
        static _instance: T
        protected constructor(...args: any[]) {}

        public static getInstance(...args: any[]): T {
            if (!this._instance) {
                this._instance = new this(...args) as T
            }

            return this._instance
        }
    }
}
