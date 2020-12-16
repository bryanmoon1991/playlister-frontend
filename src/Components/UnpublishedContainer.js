import React from 'react'
import {connect} from 'react-redux';

const msp = state => {
    return {
        unPublished: state.unPublished
    }
}

const UnpublishedContainer = ({unPublished}) => {
    return (
        <div>
            
        </div>
    )
}


export default connect(msp)(UnpublishedContainer);