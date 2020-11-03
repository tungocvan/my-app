const fs = require('fs');
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
    let date = new Date();
    req.body.date = date.toString();
    req.body.status = "Chờ xác nhận đơn hàng."
    let t = global.basedir + '/public/json/dataDonHang.json'; 
    fs.readFile(t, (err, data) => {
      if (err) throw err;
       let dataDh = JSON.parse(data);
       let items = dataDh.donhang;
       items.push(req.body);       
       fs.writeFile(t,JSON.stringify({"donhang":items}), (err) => {
          if (err) throw err;
          global.idCart = [];
          global.totals = 0;
          return res.redirect('/');        
       }); 

    });
        
  } 
 
}

module.exports = new CheckoutController();
