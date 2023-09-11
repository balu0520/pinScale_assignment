import { assign, createMachine } from 'xstate'
import { TransactionsList } from '../types/interfaces'
import Transaction from '../store/models/TransactionModel'

export const transactionMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDAdrdBjZAlgPaYCyeAFgZmAHQEQA2YAxAGZjK4UDaADAF1EoAA5FYBQiWEgAHogCMANgW0ATHz4KFmtQA4AnBr56ANCACei5bT0AWBQHYNjgwoOO7BgL7fzaLBx8YjJKajpGInQIaigWCBI6agA3IgBrOgDsPClQ7nDaSOjYhBSiXHRc-gFqmTEJXJl5BABWNSVaHRM+JSMlOyVHAGZzKwQ9VSHNPjs7IbsWg0GZ338MbOCScnyaQqiYzDiwVFQiVFoRRkq2M4BbWiyg3O2qXaKDqFLMVIqqwVqkCB6pIQk1EC1ZrRnC1XHwWko9BC9CNLIg1ANaC02nCYXp2nihr4-CBMEQIHAZI8ciEXuE6uIQdJAc0ALQLWhDJZtAz2FT9dGjRAslq0AxigxeJRYvQTMWI1YgKmbPKvJJMMD0hqg5lo2hKPjzRxaFpDZEwlpmVEIbQdCXKAwQk1DNSOFoKpXPMJvfaxTWMzBghDtVTadpqIbwhb4wUIAxDTEORw6Hl2LSOGXu9ZPGleuiwACuuFwcHggOBjR1420tAWSn1Chd3JaMZ0anUahaBoUFvsJo7mcC1K2udobHQBGYED9FdAzQmqlr9cbagdahj7UcNccRrmfA7ynlRKAA */
    id: "transactionMachine",
    schema: {
        services: {} as {
            "loadTransactions": {
                data: TransactionsList[],
            }
        },
        context: {
            transactionList: [] as TransactionsList[],
            errorMsg: undefined as string | undefined
        },
        events:{} as {type:"fetch"} | {type:"retry"}
    },
    initial: "idle",
    states: {
        idle: {
            on:{
                "fetch":{
                    target:"loading"
                }
            }
        },
        loading:{
            invoke: {
                src: "loadTransactions",
                onDone: {
                    target: "success",
                    actions: "assignTransactionsToContext",
                },
                onError: {
                    target: "failed",
                    actions: "assignErrorToContext",
                }
            }

        },
        "success": {},
        "failed": {
            on:{
                "retry":{
                    target:"loading"
                }
            }
        }
    }
}, {
    actions: {
        assignTransactionsToContext: assign((context, event: any) => {
            return {
                transactionList: event.data
            }
        }),
        assignErrorToContext: assign((context, event: any) => {
            return {
                errorMsg: event.data
            }
        }),
    }
})