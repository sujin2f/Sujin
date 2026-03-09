export type T_Focus_Message = {
    _id: string
    title: string
    key: string
    device: string
    machineId: string
    type: 'bookmark' | 'keystroke'
    message: string
}

export type T_Focus_Device = {
    _id: string
    device: string
    machineId: string
}
