type Props = {
    readonly page: number
    // readonly request: (my: boolean) => Promise<PropWithPages<T_Mongo<T_Recipe>>>
}

export async function List({ page }: Props) {
    console.log(page)
    // const data: T_Recipe['recipe'] = [
    //     { title: 'unsalted butter', amount: 226, unit: 'g' },
    //     { title: 'egg', amount: 4, unit: 'ea' },
    //     { title: 'sugar', amount: 200, unit: 'g' },
    //     { title: 'all-purpose flour', amount: 180, unit: 'g' },
    //     { title: 'sour cream', amount: 120, unit: 'ml' },
    //     { title: 'salt', amount: 1, unit: 'tbsp' },
    //     { title: 'vanilla', amount: 2, unit: 'tbsp' },
    //     { title: 'baking powder', amount: 0.5, unit: 'tsp' },
    // ]
    // const [converted, setConverted] = useState(data)

    // const onChange = useCallback(
    //     (index: number, value: number) => {
    //         if (!value || isNaN(value)) {
    //             return
    //         }
    //         const ratio = value / converted[index].amount
    //         setConverted(
    //             converted.map((item, i) => {
    //                 if (i === index) {
    //                     return { ...item, amount: value }
    //                 }
    //                 return { ...item, amount: item.amount * ratio }
    //             }),
    //         )
    //     },
    //     [converted],
    // )

    return (
        <>
            {/* <h2>https://preppykitchen.com/pound-cake/#recipe</h2>

            <Table>
                <tbody>
                    {list.map((item, index) => (
                        <tr key={item.title}>
                            <th className="--right">{item.title}</th>
                            <td>
                                <Input
                                    className="recipe__amount"
                                    type="number"
                                    value={parseFloat(
                                        item.amount.toString(),
                                    ).toFixed(2)}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>,
                                    ) => {
                                        e.preventDefault()
                                        onChange(
                                            index,
                                            parseInt(e.target.value),
                                        )
                                    }}
                                />
                            </td>
                            <td>{item.unit as string}</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={3} className="--loader--text"></td>
                    </tr>
                </tbody>
            </Table> */}
        </>
    )
}
