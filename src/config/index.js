import PropTypes from 'prop-types'

const AccountRef = PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    type: PropTypes.string
})

const Account = PropTypes.shape({
    ...AccountRef,
    currency: PropTypes.string
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
    destination: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
    }),
    split: PropTypes.arrayOf(PropTypes.shape({
        amount: PropTypes.number,
        description: PropTypes.string
    }))
})

const EntityShapes = {
    Account,
    TransactionSchedule,
    Transaction
}

export {
    EntityShapes
}
