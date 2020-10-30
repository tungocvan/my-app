const product = require('../libs/myProduct');
class CartController {
  // [GET] /
  index(req, res) {
    let id = req.params['id'];     
    if(id === undefined) {
      if(global.totals === 0 || global.totals === undefined) res.redirect('/'); 
    }else{
      let items = product.productById(id);  
      if(global.idCart !== undefined){
        let find = global.idCart.findIndex(value => value.id == id);
        //console.log('find:',find);
        if(find === -1){
            items.quantity = 1 ;
            items.total = items.salePrice;
            global.totals = global.totals + items.total;
            global.idCart.push(items);
        }else{
          global.idCart[find].quantity = global.idCart[find].quantity + 1;
          global.totals = global.totals + global.idCart[find].salePrice;
          items.total = items.salePrice * global.idCart[find].quantity;        
        }
        
      }else{
        items.quantity = 1 ;
        items.total = items.salePrice;
        global.idCart = [items];
        global.totals = items.total;
      }
    }
    res.locals.idCart = global.idCart; 
    res.render('cart',{ layout : 'layoutWebsite',product: global.idCart , totals:global.totals});
  } 
  
  delete(req, res){
    let id = req.params['id'];
    let find = global.idCart.findIndex(value => value.id == id);
    if(find !==-1){
      global.totals = global.totals - global.idCart[find].total;
      global.idCart.splice(find,1);  
      res.locals.idCart = global.idCart;
    }
    if(global.totals == 0) res.redirect('/');
    // res.render('cart',{ layout : 'layoutWebsite',product: global.idCart , totals:global.totals});
    res.redirect('/cart');
  }

  updateQuantity(req, res){
     //console.log('update id sl:',req.body);
     let id = parseInt(req.body.id);
     let sl = parseInt(req.body.sl);
     let find = global.idCart.findIndex(value => value.id == id);
     global.idCart[find].quantity = sl;
     global.totals = global.totals - global.idCart[find].total;
     global.idCart[find].total = sl * global.idCart[find].salePrice;
     global.totals = global.totals + global.idCart[find].total; 
     res.locals.idCart = global.idCart;
     
     res.render('cart',{ layout : 'layoutWebsite',product: global.idCart , totals:global.totals});
  }
}

module.exports = new CartController();
