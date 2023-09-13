import { useEffect, useState } from 'react'
import './index.css'
import { useCookies } from 'react-cookie';
import SideBar from '../Sidebar';
import { BallTriangle } from 'react-loader-spinner'
import { VscEdit } from 'react-icons/vsc'
import { FaRegTrashAlt } from 'react-icons/fa'
import DeletePopup from '../DeletePopup';
import AddPopup from '../AddPopup';
import UpdatePopup from '../UpdatePopup';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { TransactionsList } from '../../types/interfaces';
import { useContext } from 'react';
import { observer } from 'mobx-react';
import { TransactionContext } from '../../context/transactionContext';
import Transaction from '../../store/models/TransactionModel';
import { useMachine } from '@xstate/react'
import { transactionMachine } from '../../machines/transactionMachine'
import { formatDate } from '../../utils/DateUtils';
import { sortTransactionsByDate } from '../../utils/SortUtils';

const UserTransactions = () => {
    const [activeId, setActiveId] = useState(0);
    const [load, setLoad] = useState(false)
    const [cookie, _] = useCookies(["user_id"])
    const store = useContext(TransactionContext)
    const { fetchData } = useFetch({
        url: "https://bursting-gelding-24.hasura.app/api/rest/all-transactions", method: 'GET', headers: {
            'content-type': 'application/json',
            'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
            'x-hasura-role': 'user',
            'x-hasura-user-id': cookie.user_id
        }, params: {
            limit: 100,
            offset: 0
        }
    })
    const navigate = useNavigate()
    const [state, send] = useMachine(transactionMachine, {
        services: {
            loadTransactions: async (context, event) => {
                const data = await fetchData()
                return new Promise((res, rej) => {
                    if (data !== null) {
                        res(data.transactions)
                    }
                    if (data === null) {
                        rej("Failed To fetch")
                    }
                })
            }
        }
    })

    useEffect(() => {
        if (!cookie.user_id) {
            navigate("/login")
        } else if (cookie.user_id == 3) {
            navigate("/admin-transactions")
        } else {
            setLoad(true)
        }
    }, [cookie.user_id])

    if (cookie.user_id === 3) {
        navigate("/admin-transactions")
    }

    useEffect(() => {
        fetchAllTransactions(activeId)
        send({ type: "fetch" })
    }, [])

    useEffect(() => {
        assignDataToStore()
    }, [state])

    const assignDataToStore = () => {
        if (state.matches("success")) {
            const newTransactions = sortTransactionsByDate(state.context.transactionList)
            const sortedNewTransactions: any = newTransactions.slice()
            sortedNewTransactions.forEach((transaction: TransactionsList, ind: number, arr: any) => {
                arr[ind] = new Transaction(transaction.id, transaction.transaction_name, transaction.type, transaction.category, transaction.amount, String(transaction.date))
            })
            store?.setTransactions(sortedNewTransactions)
        }
    }

    const fetchAllTransactions = async (id?: number) => {
        if (id === undefined) {
            setActiveId(0)
        } else {
            setActiveId(id)
        }
    }

    const renderAllTransactionsLoadingView = () => (
        <div className='loader-container'>
            <BallTriangle
                height={100}
                width={100}
                radius={5}
                color="#2D60FF"
                ariaLabel="ball-triangle-loading"
                visible={true}
            />
        </div>
    )

    const renderAllTransactionsFailureView = () => (
        <div>
            <h1>Something Went Wrong</h1>
            <button onClick={() => send({ type: "retry" })}>Retry</button>
        </div>
    )

    const renderAllTransactionsSuccessView = () => {
        let transactions: Transaction[] | undefined = []
        if (activeId === 1) {
            transactions = store?.transactionDebitList
        } else if (activeId === 2) {
            transactions = store?.transactionCreditList
        } else {
            transactions = store?.transactionList
        }
        const len = transactions?.length;
        if (len !== undefined) {
            return (
                <ul className='all-transactions-list'>
                    <li>
                        <div className='all-transaction-item'>
                            <div className='all-transaction-name-container'>
                                <h1 className='all-transaction-name' style={{ color: '#343C6A' }}>Transaction name</h1>
                                <img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690724471/creditted_jcivrd.png' alt='creditted' style={{ visibility: 'hidden' }} />
                                <img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690724471/debitted_smwzwr.png' alt='debitted' style={{ visibility: 'hidden' }} />
                            </div>
                            <p className='all-transaction-category' style={{ color: '#343C6A' }}>Category</p>
                            <p className='all-transaction-date' style={{ color: '#343C6A' }}>Date</p>
                            <div className='all-transaction-update-delete-container'>
                                <p className="all-transaction-amount" style={{ color: '#343C6A' }}>Amount </p>
                            </div>
                            <div className='all-transaction-update-delete-sub-container'>
                                <button className='btn' style={{ color: "#2D60FF", visibility: 'hidden' }} ><VscEdit /></button>
                                <button className='btn' style={{ color: "#FE5C73", visibility: 'hidden' }}><FaRegTrashAlt /></button>
                            </div>
                        </div>
                        <hr className='separator' />
                    </li>
                    {transactions?.map((transaction, ind) => (
                        <li key={transaction.transactionId}>
                            <div className='all-transaction-item'>
                                <div className='all-transaction-name-container'>
                                    {transaction.transactionType.toLowerCase() === "credit" && (<img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690869118/credit-no-clr_fxhpyy.png' alt='creditted' />)}
                                    {transaction.transactionType.toLowerCase() !== "credit" && (<img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690868931/debit-no-clr_yjqzmc.png' alt='debitted' />)}
                                    <h1 className='all-transaction-name'>{transaction.transactionName}</h1>
                                </div>
                                <p className='all-transaction-category'>{transaction.transactionCategory}</p>
                                <p className='all-transaction-date'>{formatDate(new Date(transaction.transactionDate))}</p>
                                <div className='all-transaction-update-delete-container'>
                                    <p className={`transaction-amount ${transaction.transactionType.toLowerCase() === "credit" ? 'credit' : 'debit'}`}>{`${transaction.transactionType.toLowerCase() === "credit" ? '+' : '-'}$${transaction.transactionAmount}`}</p>
                                </div>
                                <div className='all-transaction-update-delete-sub-container'>
                                    <UpdatePopup transaction={transaction} />
                                    <DeletePopup transaction={transaction} />
                                </div>
                            </div>
                            {ind !== len - 1 && (<hr className='separator' />)}
                        </li>
                    ))}
                </ul>
            )
        }
        return (
            null
        )
    }

    const renderAllTransactions = () => {
        switch (state.value) {
            case "success":
                return renderAllTransactionsSuccessView()
            case "failed":
                return renderAllTransactionsFailureView()
            case "loading":
                return renderAllTransactionsLoadingView()
            default:
                return null
        }
    }

    return (
        <>
            {load && (
                <div className='user-transactions-container-1'>
                    <SideBar activeId={1} />
                    <div className='user-transactions-sub-container'>
                        <div className='all-transaction-header-container'>
                            <h1 className='all-transaction-heading'>Transactions</h1>
                            <AddPopup />
                        </div>
                        <div className='transaction-btn-container'>
                            <button className={`transaction-btn ${activeId === 0 ? 'active-btn' : ''}`} onClick={() => fetchAllTransactions(0)}>All Transactions</button>
                            <button className={`transaction-btn ${activeId === 1 ? 'active-btn' : ''}`} onClick={() => fetchAllTransactions(1)}>Debit</button>
                            <button className={`transaction-btn ${activeId === 2 ? 'active-btn' : ''}`} onClick={() => fetchAllTransactions(2)}>Credit</button>
                        </div>
                        <div className='all-transactions-container'>
                            <div className='all-transactions-sub-container'>
                                {renderAllTransactions()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default observer(UserTransactions)