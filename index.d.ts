type EtherDataProps = {
    type: 'ether' | 'orbital'
    atom: string
    ion: string
}

type EtherDataServerProps = {
    params: Promise<EtherDataProps>
}
