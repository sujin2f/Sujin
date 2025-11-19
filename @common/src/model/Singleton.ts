/**
 * Creates a Singleton pattern class factory.
 * Ensures only one instance of a class exists throughout the application.
 * @template T The type of the singleton instance.
 * @returns A class that implements the Singleton pattern.
 */
export const Singleton = <T>() => {
    return class {
        static _instance: T
        /**
         * Protected constructor to prevent direct instantiation.
         * @param {...unknown[]} args Arguments passed to the constructor.
         * @protected
         */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        protected constructor(...args: unknown[]) {}

        /**
         * Gets or creates the singleton instance.
         * @param {...unknown[]} args Arguments passed to the constructor on first call.
         * @returns {T} The singleton instance.
         * @static
         */
        public static getInstance(...args: unknown[]): T {
            if (!this._instance) {
                this._instance = new this(...args) as T
            }

            return this._instance
        }
    }
}
