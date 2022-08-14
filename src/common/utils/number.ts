export const formatCurrency = (amount: number, currency = 'USD'): string => {
    const value = amount || 0
    return value.toLocaleString('en-US', {
        style: 'currency',
        currency,
    })
}
