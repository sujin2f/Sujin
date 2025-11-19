/**
 * Loading status enumeration for asset and data loading states.
 */
export enum LoadingStatus {
    /** Initial state before loading starts */
    INIT,
    /** Currently loading */
    LOADING,
    /** Loading completed successfully */
    DONE,
    /** Loading failed with an error */
    ERROR,
}
