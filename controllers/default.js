require('babel-core/register');
const React = require('react');
const ReactDom = require('react-dom/server');
const Router = require('react-router');
const routesConfig = require('../client/routesConfig');
const routerContext = require('../client/routerContext');

exports.install = function() {

 F.route('*',function() {
     let self = this;
     let req= self.req;
     let res= self.response;


   Router.match(
    {routes: routesConfig, location: req.url},
    function(error, redirectLocation, renderProps)  {
      if (error) {
        res.status(500).send(error.message)
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search)
      } else if (renderProps) {

        const markup = ReactDom.renderToString(routerContext(renderProps));
        // OR alternative way
       // const markup = ReactDom.renderToString(<Router.RouterContext {...renderProps} />);
       console.log('markup',markup);
        self.view('index', {markup:markup});
      } else {
        res.status(404).send('Not found..')
      }
    });

});

};

