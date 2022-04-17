import React from "react";
import {mdiChevronLeft, mdiChevronRight} from "@mdi/js";
import Icon from "@mdi/react";
import {Link} from "react-router-dom";

import '../assets/css/Paginator.scss'

export class Paginator extends React.Component {
    render() {
        const {page, records, pageSize} = this.props;
        const pages = (Math.ceil(records / pageSize)) || 1

        const links = [...new Array(pages).keys()]
            .map(page => {
                if ((page + 1) === this.props.page) {
                    return <div className='PageLink Selected' key={page}>{page + 1}</div>
                }
                return (
                    <Link to={`?page=${page + 1}`}
                          key={page}
                          className='PageLink'>
                        {page + 1}
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
}
