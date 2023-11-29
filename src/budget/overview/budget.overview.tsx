import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import BudgetRepository from "../../core/repositories/budget.repository";

const BudgetOverview = () => {
    const [firstBudget, setFirstBudget] = useState<Date>()
    const navigate = useNavigate()

    useEffect(() => {
        BudgetRepository.firstBudget()
            .then(date => setFirstBudget(new Date(date)))
            .catch(() => navigate('/budgets/first-setup'))
    }, [navigate])

    return <>
    </>
}

export default BudgetOverview