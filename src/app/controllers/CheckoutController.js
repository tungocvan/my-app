class CheckoutController {
  // [GET] /
  index(req, res) {
    if(global.idCart){
      res.locals.idCart = global.idCart;    
      res.locals.totals = global.totals;
    }
    res.render('checkout',{ layout : 'layoutWebsite'});
  } 
  payment(req, res) {
   
    res.json(req.body);
  } 
 
}

module.exports = new CheckoutController();
