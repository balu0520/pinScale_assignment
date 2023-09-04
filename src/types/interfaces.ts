export interface AddPopupProps {
    reloadOperation: (id?: number) => Promise<void>,
    id: number
}
export type TransactionType = "credit" | "debit"

export interface DateOptions{
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
}
export interface TransactionItem {
    id:number
    transaction_name:string,
    type: TransactionType,
    amount:number,
    category:string
    date: Date,
}
export interface UserNames{
    user_id:number,
    username:string
}
export interface TransactionsList {
    id:number
    transaction_name:string,
    type:TransactionType,
    amount:number,
    category: string,
    user_id?:number,
    date: Date,
}
export interface Week7Transaction{
    date:Date,
    type:string,
    sum:number
}

export interface WeeklyData{
    credit:number,
    debit:number
}

export interface GroupedData {
    [key: string]: WeeklyData; 
}

export interface BarGraphProps{
    total7:Week7Transaction[]
}

export interface DeletePopupProps {
    transaction:TransactionItem
    reloadOperation: (id?:number) => Promise<any>,
    id:number
}
export interface SideBarProps{
    activeId:number
}
export interface TotalCreditDebit {
    url: string,
    method: string,
    headers: HeadersInit,
}
export interface TotalTransactionItem {
    type:string,
    sum:number
}
export interface UpdatePopupProps {
    transaction: TransactionItem
    reloadOperation: (id?: number) => Promise<any>,
    id: number
}

export interface TransactionItemResult{
    totalCredit:number,
    totalDebit:number
}
export interface UserData{
    id:number,
    name:string | undefined,
    email:string | undefined,
    country:string | undefined,
    date_of_birth: string,
    city: string | undefined,
    permanent_address:string | undefined,
    postal_code: string | number | undefined,
    present_address: string | undefined
}
export interface WeekCreditDebitProps {
    url: string,
    method: string,
    headers: HeadersInit,
}

export interface WeekCreditDebitItem {
    type: string,
    sum: number
}
export interface WeekCreditDebitResult {
    weekCredit: number,
    weekDebit: number
}
export interface FetchResult {
    fetchData: () => Promise<void>;
    apiStatus: string;
    res: Response | null;
    res_data: any;
    res_error: any;
  }

export interface Params {
    limit?: number,
    offset?: number,
    id?: number
}

export interface Body {
    id?: number,
    email?: string,
    password?: string,
    name?:string,
    type?:string,
    amount?:number | string,
    category?:string,
    date?: Date | string,
    user_id?:number
}

export interface FetchProps {
    url: string,
    method: string,
    headers: HeadersInit,
    params?: Params | undefined,
    body?: BodyInit | Body
}
// export interface TransactionUpdateItem {
//     transaction_name:string,
//     type:string,
//     amount:number,
//     category:string
//     date:  string,
// }