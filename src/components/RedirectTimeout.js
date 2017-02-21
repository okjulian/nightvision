import React, { Component } from 'react';
import { Redirect } from 'react-router';

class RedirectTimeout extends Component {
  constructor() {
    super();
    this.state = { shouldRedirect: false };
  }
  componentDidMount() {
    setTimeout(() => this.setState({ shouldRedirect: true }), this.props.timeout);
  }
  render() {
    return (
      this.state.shouldRedirect ?
        <Redirect to={this.props.to} />
        :
        this.props.children
    );
  }
}

export default RedirectTimeout;
