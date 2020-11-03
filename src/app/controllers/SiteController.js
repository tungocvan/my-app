const getProduct = require('../libs/myProduct');
class SiteController {
  // [GET] /
  index(req, res) {
    //console.log('product:',product);    
    if(global.idCart){
      res.locals.idCart = global.idCart;    
      res.locals.totals = global.totals;
    }
    getProduct.product.then((data)=>{
      let dataObj = JSON.parse(data);
      let items = dataObj.data;
      global.product = items;
      res.render('home',{ layout : 'layoutWebsite' ,product:items });
      
    })
    
    
    
  } 
}

module.exports = new SiteController();
 