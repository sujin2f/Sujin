export type PropWithPages<T, N extends string> = {
    readonly numPages: number
} & {
    [key in N]: T[]
}
