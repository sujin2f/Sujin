/**
 * Creates a Multiton pattern class factory.
 * Allows multiple named instances of a class, one per identifier.
 * @template T The type of the multiton instance.
 * @returns A class that implements the Multiton pattern.
 */
export const Multiton = <T>() => {
    return class Multiton {
        static _instance: Record<string, T> = {}
        /**
         * Protected constructor to prevent direct instantiation.
         * @param {...unknown[]} args Arguments passed to the constructor.
         * @protected
         */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        protected constructor(...args: unknown[]) {}

        /**
         * Gets or creates a multiton instance for the specified identifier.
         * @param {string} identifier The unique identifier for this instance.
         * @param {...unknown[]} args Arguments passed to the constructor on first call.
         * @returns {T} The multiton instance for the identifier.
         * @static
         */
        public static getInstance(identifier: string, ...args: unknown[]): T {
            if (!this._instance[identifier]) {
                this._instance[identifier] = new this(...args) as T
            }

            return this._instance[identifier]
        }

        /**
         * Checks if an instance exists for the specified identifier.
         * @param {string} identifier The unique identifier to check.
         * @returns {boolean} True if an instance exists, false otherwise.
         * @static
         */
        public static hasInstance(identifier: string): boolean {
            return !!this._instance[identifier]
        }

        /**
         * Destroys the multiton instance for the specified identifier.
         * @param {string} identifier The unique identifier of the instance to destroy.
         * @static
         */
        public static destroy(identifier: string) {
            delete this._instance[identifier]
        }
    }
}
