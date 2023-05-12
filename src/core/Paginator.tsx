import React, {FC} from "react";
import {mdiChevronLeft, mdiChevronRight} from "@mdi/js";
import Icon from "@mdi/react";
import {Link} from "react-router-dom";

type PageButtonProp = {
    page: number,
    currentPage: number
}

const PageButton: FC<PageButtonProp> = ({page = 0, currentPage = 0}) => {
    if ((page + 1) === currentPage) {
        return <div className='flex items-center p-1 h-full border-[1px] border-blue-600 bg-blue-500 text-white'
                    data-testid='page-current'
                    key={page}>{page + 1}</div>
    }

    return <>
        <Link to={`?page=${page + 1}`}
              key={page}
              role='page-button'
              className='flex items-center p-1 h-full border-[1px] border-separator'>
            {page + 1}
        </Link>
    </>
}

type PaginatorProp = {
    page?: number,         // The currently active page
    records?: number,      // The amount of total records in the paged set
    pageSize?: number      // The size of each page of records
}

export const Paginator: FC<PaginatorProp> = ({page = 1, records = 1, pageSize = 10}) => {
    const pages = (Math.ceil(records / pageSize)) || 1
    const links = [...new Array(pages).keys()]
        .map(current => <PageButton key={current} page={current} currentPage={page}/>)

    return (
        <div className='flex justify-center items-center h-6'>
            <Link to={`?page=${page - 1}`}
                  data-testid='previous-button'
                  aria-disabled={page <= 1}
                  className={`flex items-center px-1 h-full border-[1px] border-separator
                              ${page > 1 ? '' : 'pointer-events-none text-gray-500 border-gray-200'}`}><Icon path={mdiChevronLeft} size={.5}/></Link>
            {links}
            <Link to={`?page=${page + 1}`}
                  data-testid='next-button'
                  className={`flex items-center px-1 h-full border-[1px] border-separator 
                              ${page < pages  ? '' : 'pointer-events-none text-gray-500 border-gray-200'}`}><Icon path={mdiChevronRight} size={.5}/></Link>
        </div>
    )
}
