const product = require('../libs/myProduct');
class SiteController {
  // [GET] /
  index(req, res) {
    //console.log('product:',product);    
    if(global.idCart){
      res.locals.idCart = global.idCart;    
      res.locals.totals = global.totals;
    }
    res.render('home',{ layout : 'layoutWebsite' , product:product.product});
  } 
}

module.exports = new SiteController();
 