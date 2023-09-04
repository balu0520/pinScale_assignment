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
import { DateOptions, TransactionsList } from '../../types/interfaces';
import { useContext } from 'react';
import { observer } from 'mobx-react';
import { TransactionContext } from '../../context/transactionContext';

const UserTransactions = () => {
    const [activeId, setActiveId] = useState(0);
    const [load, setLoad] = useState(false)
    const [cookie, _] = useCookies(["user_id"])
    const store = useContext(TransactionContext)
    const { fetchData, apiStatus, res_data } = useFetch({
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
    }, [])

    useEffect(() => {
        getData()
    }, [res_data])

    const filterTransactions = (transactions: TransactionsList[], id: number): TransactionsList[] => {
        if (id === 0) {
            transactions.sort((a: TransactionsList, b: TransactionsList): number => {
                const dateA = new Date(a.date).getTime()
                const dateB = new Date(b.date).getTime()
                return dateB - dateA
            });
            return transactions
        } else if (id === 1) {
            const filteredTransactions = transactions.filter(transaction => transaction.type === "debit");
            filteredTransactions.sort((a: TransactionsList, b: TransactionsList): number => {
                const dateA = new Date(a.date).getTime()
                const dateB = new Date(b.date).getTime()
                return dateB - dateA
            });
            return filteredTransactions
        } else {
            const filteredTransactions = transactions.filter(transaction => transaction.type === "credit")
            filteredTransactions.sort((a: TransactionsList, b: TransactionsList): number => {
                const dateA = new Date(a.date).getTime()
                const dateB = new Date(b.date).getTime()
                return dateB - dateA
            });
            return filteredTransactions
        }
    }

    const getData = () => {
        if (res_data !== null) {
            const newTransactions: TransactionsList[] = filterTransactions(res_data.transactions, activeId)
            store?.addTransactions(newTransactions)
        }
    }

    const fetchAllTransactions = async (id?: number) => {
        if (id === undefined) {
            setActiveId(0)
        } else {
            setActiveId(id)
        }
        await fetchData();
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
        </div>
    )

    const formatDate = (dateString: Date) => {
        const date = new Date(dateString);
        const options: DateOptions = {
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };

        return date.toLocaleString('en-US', options);
    }

    const renderAllTransactionsSuccessView = () => {
        const transactions = store?.transactions
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
                        <li key={transaction.id}>
                            <div className='all-transaction-item'>
                                <div className='all-transaction-name-container'>
                                    {transaction.type.toLowerCase() === "credit" && (<img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690869118/credit-no-clr_fxhpyy.png' alt='creditted' />)}
                                    {transaction.type.toLowerCase() !== "credit" && (<img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690868931/debit-no-clr_yjqzmc.png' alt='debitted' />)}
                                    <h1 className='all-transaction-name'>{transaction.transaction_name}</h1>
                                </div>
                                <p className='all-transaction-category'>{transaction.category}</p>
                                <p className='all-transaction-date'>{formatDate(transaction.date)}</p>
                                <div className='all-transaction-update-delete-container'>
                                    <p className={`transaction-amount ${transaction.type.toLowerCase() === "credit" ? 'credit' : 'debit'}`}>{`${transaction.type.toLowerCase() === "credit" ? '+' : '-'}$${transaction.amount}`}</p>
                                </div>
                                <div className='all-transaction-update-delete-sub-container'>
                                    <UpdatePopup transaction={transaction} reloadOperation={fetchAllTransactions} id={activeId} />
                                    <DeletePopup transaction={transaction} reloadOperation={fetchAllTransactions} id={activeId} />
                                </div>
                            </div>
                            {ind !== len - 1 && (<hr className='separator' />)}
                        </li>
                    ))}
                </ul>
            )
        }
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
                    <li key={transaction.id}>
                        <div className='all-transaction-item'>
                            <div className='all-transaction-name-container'>
                                {transaction.type.toLowerCase() === "credit" && (<img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690869118/credit-no-clr_fxhpyy.png' alt='creditted' />)}
                                {transaction.type.toLowerCase() !== "credit" && (<img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690868931/debit-no-clr_yjqzmc.png' alt='debitted' />)}
                                <h1 className='all-transaction-name'>{transaction.transaction_name}</h1>
                            </div>
                            <p className='all-transaction-category'>{transaction.category}</p>
                            <p className='all-transaction-date'>{formatDate(transaction.date)}</p>
                            <div className='all-transaction-update-delete-container'>
                                <p className={`transaction-amount ${transaction.type.toLowerCase() === "credit" ? 'credit' : 'debit'}`}>{`${transaction.type.toLowerCase() === "credit" ? '+' : '-'}$${transaction.amount}`}</p>
                            </div>
                            <div className='all-transaction-update-delete-sub-container'>
                                <UpdatePopup transaction={transaction} reloadOperation={fetchAllTransactions} id={activeId} />
                                <DeletePopup transaction={transaction} reloadOperation={fetchAllTransactions} id={activeId} />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        )
    }

    const renderAllTransactions = () => {
        switch (apiStatus) {
            case "SUCCESS":
                return renderAllTransactionsSuccessView()
            case "FAILURE":
                return renderAllTransactionsFailureView()
            case "IN_PROGRESS":
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
                            <AddPopup reloadOperation={fetchAllTransactions} id={activeId} />
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