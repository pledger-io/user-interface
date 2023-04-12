import React from "react";
import {mdiChevronLeft, mdiChevronRight} from "@mdi/js";
import Icon from "@mdi/react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";

import '../assets/css/Paginator.scss'

const PageButton = ({page = 0, currentPage = 0}) => {
    if ((page + 1) === currentPage) {
        return <div className='PageLink Selected'
                    data-testid='page-current'
                    key={page}>{page + 1}</div>
    }

    return <>
        <Link to={`?page=${page + 1}`}
              key={page}
              role='page-button'
              className='PageLink'>
            {page + 1}
        </Link>
    </>
}

export const Paginator = ({page = 1, records = 1, pageSize = 10}) => {
    const pages = (Math.ceil(records / pageSize)) || 1
    const links = [...new Array(pages).keys()]
        .map(current => <PageButton key={current} page={current} currentPage={page}/>)

    return (
        <div className='Paginator'>
            <Link to={`?page=${page - 1}`}
                  data-testid='previous-button'
                  className={`PageLink ${page > 1}`}><Icon path={mdiChevronLeft} size={.5}/></Link>
            {links}
            <Link to={`?page=${page + 1}`}
                  data-testid='next-button'
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
