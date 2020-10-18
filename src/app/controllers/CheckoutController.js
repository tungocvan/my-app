class CheckoutController {
  // [GET] /
  index(req, res) {
    res.render('checkout',{ layout : 'layoutWebsite'});
  } 

}

module.exports = new CheckoutController();
