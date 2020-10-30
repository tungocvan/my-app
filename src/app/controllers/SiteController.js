const product = require('../libs/myProduct');
class SiteController {
  // [GET] /
  index(req, res) {
    console.log('product:',product);    
    res.render('home',{ layout : 'layoutWebsite' , product:product.product});
  } 
}

module.exports = new SiteController();
 