import PropTypes from 'prop-types'

const AccountIdentifier = PropTypes.shape({
    id: PropTypes.number.isRequired
})
const AccountRef = PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    type: PropTypes.string
})

const Account = PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    type: PropTypes.string,
    currency: PropTypes.string,
    history: PropTypes.shape({
        lastTransaction: PropTypes.string
    }),
    interest: PropTypes.shape({
        interest: PropTypes.number,
        periodicity: PropTypes.string
    }),
    iconFileCode: PropTypes.string,
    savingGoals: PropTypes.array
})

const TransactionSchedule = PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    amount: PropTypes.number,
    description: PropTypes.string,
    range: PropTypes.shape({
        start: PropTypes.string,
        end: PropTypes.string
    }),
    source: AccountRef,
    destination: AccountRef
})

const Transaction = PropTypes.shape({
    amount: PropTypes.number,
    description: PropTypes.string,
    currency: PropTypes.string,
    source: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
    }),
    dates: PropTypes.shape({
        transaction: PropTypes.string.isRequired
    }),
    type: PropTypes.shape({
        code: PropTypes.string
    }),
    destination: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
    }),
    split: PropTypes.arrayOf(PropTypes.shape({
        amount: PropTypes.number,
        description: PropTypes.string
    }))
})

const Category = PropTypes.shape({
    id: PropTypes.number,
    label: PropTypes.string,
    description: PropTypes.string,
    lastUsed: PropTypes.string
})

const EntityShapes = {
    AccountIdentifier,
    Account,
    TransactionSchedule,
    Transaction,
    Category
}

export {
    EntityShapes
}
