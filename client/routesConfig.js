"use strict";

const CommandersIndex = require('./components/commandersIndex');
const CommanderPage = require('./components/commanderPage');
const NotFound = require('./components/notFound');

const routesConfig = [
  {path: '/', component: CommandersIndex},
  {path: '/commander/:id', component: CommanderPage},
  {path: '*', component: NotFound}
];

module.exports = routesConfig;
