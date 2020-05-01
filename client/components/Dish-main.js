import React from 'react'
import {connect} from 'react-redux'

export class Dish extends React.Component {
  render() {
    return (
      <div>
        <h2>This is the main app page</h2>
        <p>We are currently in construction</p>
      </div>
    )
  }
}

export default connect()(Dish)
