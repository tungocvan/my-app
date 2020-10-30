const product = require('../libs/myProduct');
class productDetailsController {
  // [GET] /
  index(req, res) {
    let id = req.params['id'];    
    let items = product.productById(id);
    let albumImg = items.albumImg.split(';');     
    res.render('productDetails',{ layout : 'layoutWebsite' , product:items , albumImg});
  } 

}

module.exports = new productDetailsController();
