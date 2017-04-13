"use strict";

const React = require('react');
const Link = require('react-router').Link;
const Commanders = require('../commanders');

class CommandersIndex extends React.Component {
  render() {
    return (
      <div cen>
        <h1>The famous commanders</h1>
        <ul>{
          Object.keys(Commanders).map(id =>
            <li key={id}><Link to={`/commander/${id}`}>{Commanders[id].name}</Link></li>
          )
        }</ul>
      </div>
    )
  }
}

module.exports = CommandersIndex;
