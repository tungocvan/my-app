class productDetailsController {
  // [GET] /
  index(req, res) {
    res.render('productDetails',{ layout : 'layoutWebsite'});
  } 

}

module.exports = new productDetailsController();
