import React from 'react'
import {connect} from 'react-redux'
import {RAPID_KEY} from '../../secrets'

export class Recipes extends React.Component {
  componentDidMount() {}
  render() {
    return <div>Recipes Placeholder</div>
  }
}

export default connect()(Recipes)
