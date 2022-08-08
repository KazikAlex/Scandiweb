import { Link } from 'react-router-dom'
import { Component } from 'react'

export default class page404 extends Component {
  render() {
    return (
      <div className="container">
        <h1>Something went wrong</h1>
        <Link to="/">Home</Link>
      </div>
    )
  }
}