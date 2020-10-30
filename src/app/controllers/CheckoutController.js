class CheckoutController {
  // [GET] /
  index(req, res) {
    if(global.idCart){
      res.locals.idCart = global.idCart;    
      res.locals.totals = global.totals;
    } 
    if(global.profile){
       res.locals.profile = global.profile;
    }
    res.render('checkout',{ layout : 'layoutWebsite'});
  } 
  payment(req, res) {
    if(global.idCart){
      req.body.idCart = global.idCart;    
      req.body.totals = global.totals;
    } 
    res.json(req.body);
  } 
 
}

module.exports = new CheckoutController();
