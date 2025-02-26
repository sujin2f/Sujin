type EtherDataProps = {
    type: 'ether' | 'orbital'
    atom: string
    ion: string
    term: string
}

type EtherDataServerProps = {
    params: Promise<EtherDataProps>
}
