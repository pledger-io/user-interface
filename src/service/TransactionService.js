import { TransactionRepository } from "../core/RestAPI";

export const TransactionService = {
    persist: (account, entity, navigate, id = NaN, success, warning) => {
        const transaction = {
            description: entity.description,
            source: entity.from.id,
            target: entity.to.id,
            amount: entity.amount,
            currency: account.account.currency,
            date: entity.date,
            budget: entity.budget ? entity.budget.id : null,
            category: entity.category ? entity.category.id : null,
            contract: entity.contract ? entity.contract.id : null,
            tags: entity.tags,
        }

        const promises = []
        if (isNaN(id)) {
            promises.push(TransactionRepository.create(account.id, transaction));
        } else {
            promises.push(TransactionRepository.update(id, transaction))
        }

        if (entity.split) {
            promises.push(TransactionRepository.splits(id, entity.split))
        }

        Promise.all(promises)
            .then(() => success(replaceAction('page.transaction.{action}.success', id)))
            .then(() => navigate(-1))
            .catch(() => warning(replaceAction('page.transaction.{action}.failed', id)))
    }
};

function replaceAction(text, id = null) {
    const action = isNaN(id) ? 'add' : 'update'
    return text.replaceAll('{action}', action)
}
