import { useState } from "react"

interface FetchResult {
    fetchData: () => Promise<void>;
    apiStatus: string;
    res: Response | null;
    res_data: any;
    res_error: any;
  }

interface Params {
    limit?: number,
    offset?: number,
    id?: number
}

// interface Headers {
//     "content-type": string,
//     "x-hasura-admin-secret": string,
//     'x-hasura-role'?: string,
//     'x-hasura-user-id'?: number
// }
interface Body {
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

// interface Options {
//     method: string,
//     headers: HeadersInit ,
//     body?: BodyInit | Body,
// }

interface FetchProps {
    url: string,
    method: string,
    headers: HeadersInit,
    params?: Params | undefined,
    body?: BodyInit | Body
}

const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS"
}
function useFetch(props: FetchProps):FetchResult {
    const { url, method, headers, body, params } = props
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const [res, setRes] = useState<Response | any>(null)
    const [resData, setResData] = useState<any>(null)
    const [resError, setResError] = useState<any>(null)
    let options: RequestInit = {method,headers};
    if (body !== undefined) {
        options = {method,headers, body: JSON.stringify(body) };
      }
    let modifiedUrl = url
    if (params !== undefined && Object.keys(params).length > 0) {
        if (params.id === undefined) {
            const limit = params.limit
            const offset = params.offset
            modifiedUrl = `${url}?limit=${limit}&offset=${offset}`
        } else {
            const id = params.id
            modifiedUrl = `${url}?id=${id}`
        }
    }
    const fetchData = async (): Promise<void> => {
        setApiStatus(apiStatusConstants.inProgress)
        try {
            const response:Response = await fetch(modifiedUrl, options)
            setRes(response)
            if (response.ok === true) {
                const data = await response.json()
                setResData(data)
                setResError(null)
                setApiStatus(apiStatusConstants.success)
            } else {
                const err = response.status
                setResError(err)
                setResData(null)
                setApiStatus(apiStatusConstants.failure)
            }
        } catch (err) {
            setResError(err)
            setApiStatus(apiStatusConstants.failure)
        }
    }

    return { fetchData, apiStatus, res, res_data: resData, res_error: resError }
}


export default useFetch