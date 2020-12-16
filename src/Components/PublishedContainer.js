import React from 'react'
import {connect} from 'react-redux';

const msp = state => {
    return {
        published: state.published
    }
}

const PublishedContainer = ({published}) => {
    return (
        <div>
            
        </div>
    )
}

export default connect(msp)(PublishedContainer);