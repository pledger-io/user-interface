import React from "react";
import {mdiChevronLeft, mdiChevronRight} from "@mdi/js";
import Icon from "@mdi/react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";

import '../assets/css/Paginator.scss'

export const Paginator = ({page = 1, records = 1, pageSize = 10}) => {
    const pages = (Math.ceil(records / pageSize)) || 1
    const links = [...new Array(pages).keys()]
        .map(current => {
            if ((current + 1) === page) {
                return <div className='PageLink Selected' key={current}>{current + 1}</div>
            }
            return (
                <Link to={`?page=${current + 1}`}
                      key={current}
                      className='PageLink'>
                    {current + 1}
                </Link>
            )
        })

    return (
        <div className='Paginator'>
            <Link to={`?page=${page - 1}`}
                  className={`PageLink ${page > 1}`}><Icon path={mdiChevronLeft} size={.5}/></Link>
            {links}
            <Link to={`?page=${page + 1}`}
                  className={`PageLink ${page < pages}`}><Icon path={mdiChevronRight} size={.5}/></Link>
        </div>
    )
}
Paginator.propTypes = {
    // The currently active page
    page: PropTypes.number,
    // The amount of total records in the paged set
    records: PropTypes.number,
    // The size of each page of records
    pageSize: PropTypes.number
}
