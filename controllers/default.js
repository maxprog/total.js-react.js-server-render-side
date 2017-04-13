require('babel-core/register');
const React = require('react');
const ReactDom = require('react-dom/server');
const Router = require('react-router');
//const routesConfig = require('../src/routesConfig');
const routerContext = require('../src/routerContext');

exports.install = function() {
 F.route('*',(req, res) => {
   Router.match(
    {routes: routesConfig, location: req.url},
    (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message)
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search)
      } else if (renderProps) {
        
        let markup = ReactDOMServer.renderToString(RouterContext(renderProps));
      //  res.render('index', {markup});
      } else {
        res.status(404).send('Not found..')
      }
    });
    
});

};

