//const getProduct = require('../libs/myProduct');
const fs = require('fs');
class SiteController {
  // [GET] /
  index(req, res) {
    //console.log('product:',product);    
    if(global.idCart){
      res.locals.idCart = global.idCart;    
      res.locals.totals = global.totals;
    }
    let t = global.basedir + '/public/json/product.json';
    fs.readFile(t,'utf8', (err, data) => {
      if (err) throw err;
      let dataObj = JSON.parse(data);
      let items = dataObj.data;
      global.product = items;
      res.render('home',{ layout : 'layoutWebsite' ,product:items });              
    })

    
    
    
    
  } 
}

module.exports = new SiteController();
 