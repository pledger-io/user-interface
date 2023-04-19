import PropTypes from "prop-types";
import Icon from "@mdi/react";
import {mdiLoading} from "@mdi/js";

/**
 * Display a loading icon until the condition becomes true.
 */
const Loading = ({condition, children}) => {
    if (!condition) {
        return (
            <div className='Loading'>
                <Icon path={mdiLoading} spin={true} size={2} />
            </div>
        )
    } else {
        return children
    }
}
Loading.propTypes = {
    // the condition used, as long as false the loading icon is shown
    condition: PropTypes.oneOfType([PropTypes.bool, PropTypes.object, PropTypes.any])
}

export default Loading