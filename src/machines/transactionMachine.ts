import { assign, createMachine } from 'xstate'
import { TransactionsList } from '../types/interfaces'
import Transaction from '../store/models/TransactionModel'

export const transactionMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDAdrdBjZAlgPaYCyeAFgZmAHQEQA2YAxAGZjK4UDaADAF1EoAA5FYBQiWEgAHogCMANgW0ATHz4KFmtQA4AnBr56ANCACei5bT0AWBQHYNjgwoOO7BgL7fzaLBx8YjJKajpGInQIaigWCBI6agA3IgBrOgDsPClQ7nDaSOjYhBSiXHRc-gFqmTEJXJl5BABWNSVaHRM+JSMlOyVHAGZzKwQ9VSHNPjs7IbsWg0GZ338MbOCScnyaQqiYzDiwVFQiVFoRRkq2M4BbWiyg3O2qXaKDqFLMVIqqwVqkCB6pIQk1EC1ZrRnC1XHwWko9BC9CNLIg1ANaC02nCYXp2nihqsQI8ciEXgU2OgCMwICxUJxUBYAaJxCDpIDmkNtLQ5sY7HxXAo7I4FKNEPNVHpHHolGo5f0WpoFL4-CBMEQIHAZCTNnlXmA6qzGhzEABaBa0IZLNoGewqfrosUIU0tWgGd0GeFKPi2vQCuFEnXPMK7BjMQ0NUEmhBqWje+aOLQtIbImEtMyohDaDoGBy9CHJoZqRwtQPrJ5kkMRfaxCNszBgmMqToKdpqIbwhb4p0GIaYhwin32LTSvRlwKkrZV2iwACuuFwcHggOBxtAzQmqgWSm9rZLak9Tp0sbliq56fsybUpdVQcrOzolOpkDra7kiE3PK9WmLNraTvaRweUcRM5j4a9lERFVvCAA */
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
        "success": { type:"final"},
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