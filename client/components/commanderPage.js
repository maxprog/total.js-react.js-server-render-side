"use strict";

const React = require('react');
const Link = require('react-router').Link;
const Commanders = require('../commanders');

class CommanderPage extends React.Component {
  render() {
    let commander = Commanders[this.props.params.id];
    return (
      <div>
        <h2>{commander.name}'s major battles</h2>
        <ul className="battles">{
          commander.battles.map( (battle, key) =>
              <li key={key} className="battle">{battle}</li>
          )
        }</ul>
        <Link to="/">Go back to index</Link>
      </div>
    );
  }
}

module.exports = CommanderPage;
