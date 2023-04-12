import PropTypes from "prop-types";

import "../../assets/css/Grid.scss"

const Grid = ({type, children, minWidth}) => {
    const style = {
    }

    switch (type) {
        case 'column':
            style.gridTemplateColumns = `repeat(auto-fit, minmax(${minWidth}, 1fr))`
    }

    return <div className={`Grid ${type}`} style={style}>
        { children }
    </div>
}
Grid.propTypes = {
    type: PropTypes.oneOf(['column', 'row']),
    minWidth: PropTypes.string
}

export default Grid
