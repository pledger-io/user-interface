import {Charts, Layout, Statistical, Translations} from "../../core";
import React, {useEffect, useState} from "react";
import CategoryRepository from "../../core/repositories/category-repository";
import {Loading} from "../../core/layout";

const CategoriesBalance = ({ range }) => {
    const [categorySeries, setCategorySeries] = useState({labels: [], data: []})

    useEffect(() => {
        CategoryRepository.all()
            .then(async categories => {
                setCategorySeries({
                    labels: categories.map(c => c.label),
                    data: {
                        label: await Translations.LocalizationService.get('graph.series.category'),
                        backgroundColor: '#9abdd2',
                        data: (await Promise.all(
                            categories.map(c =>
                                Statistical.Service.balance({
                                    dateRange: range,
                                    categories: [
                                        {id: c.id}
                                    ]
                                })))).map(b => b.balance)
                    }
                })
            })
    }, [range])

    return <>
        <Layout.Card title='page.dashboard.categories.balance'>
            <Loading condition={categorySeries.labels.length}>
                <Charts.Chart height={300}
                              id='dashboard-categories-graph'
                              labels={categorySeries.labels}
                              dataSets={categorySeries.data}
                              type='bar'/>
            </Loading>
        </Layout.Card>
    </>
}

export default CategoriesBalance