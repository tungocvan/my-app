class CartController {
  // [GET] /
  index(req, res) {
    res.render('cart',{ layout : 'layoutWebsite'});
  } 

}

module.exports = new CartController();
