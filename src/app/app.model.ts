export interface Expense{
    key: string,
    data: {
        total: string,
        purpose: string,
        description: string,
        date: string,
        costExp: any[]
    }
}