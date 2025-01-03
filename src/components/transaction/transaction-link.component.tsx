import React, { FC } from "react";
import { Link } from "react-router";

import { Resolver } from "../../core";
import { Account, Transaction } from "../../types/types";

type TransactionUrlProps = {
    account: Account,
    transaction: Transaction
}

const TransactionOverviewUrl: FC<TransactionUrlProps> = ({ transaction, account }) => {
    const transactionDate = new Date(transaction.dates.transaction)

    return <>
        <Link to={`${ Resolver.Account.resolveUrl(account) }/transactions/${ transactionDate.getFullYear() }/${ transactionDate.getMonth() + 1 }`}>
            { account.name }
        </Link>
    </>
}

export default TransactionOverviewUrl