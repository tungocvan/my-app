const fs = require('fs');
class LoginRegisterController {
  // [GET] /
  index(req, res) {
    if(global.isLogin){
      res.locals.profile = global.profile;
      let slug = req.params.slug;
      switch (slug) {
        case 'info':
          res.render('myAccount',{ layout : 'layoutWebsite', slug:'Thông Tin Tài Khoản',info:true});
          break;
        case 'order':
          res.render('myAccount',{ layout : 'layoutWebsite', slug:'Theo dõi đơn hàng',order:true});
          break;
        case 'wishlist':
          res.render('myAccount',{ layout : 'layoutWebsite', slug:'Sản phẩm yêu thích',wishlist:true});
          break;
        case 'history':
          res.render('myAccount',{ layout : 'layoutWebsite', slug:'Lịch sử giao dịch',history:true});
          break;
        default:
          res.render('myAccount',{ layout : 'layoutWebsite', slug});
          break;
      }
      
    }else{       
       res.render('loginRegister',{ layout : 'layoutWebsite' , isLog:'show active'});
    }      
  } 
  logout(req, res) {
    if(global.isLogin){
      global.isLogin = false;
      return res.redirect('/');
    }
  } 
  register(req, res,next) {    
    let t = global.basedir + '/public/json/dataKhach.json';  
    if(req.body.firstName === undefined){
      console.log('login');       
      fs.readFile(t, (err, data) => {
        if (err) throw err;
         let dataKh = JSON.parse(data);
         let items = dataKh.khachhang;       
         let email = req.body.email;
         let password = req.body.password;
         let indexIdEdit = items.find(i => i.email === email && i.password === password);       
         //console.log('indexIdEdit:',indexIdEdit);                 
         if(indexIdEdit) {
            global.isLogin = true;          
            global.profile = indexIdEdit;        
            return  res.redirect('/');
         }     
         res.render('loginRegister',{ layout : 'layoutWebsite' , isLog:'show active'});
         

      });
      
       
    }else{
      console.log('register');         
      fs.readFile(t, (err, data) => {
        if (err) throw err;
         let dataKh = JSON.parse(data);
         let items = dataKh.khachhang;       
         let email = req.body.email;
         let indexIdEdit = items.findIndex(i => i.email === email);        
         if(indexIdEdit === -1) {
            req.body.lastName = "";
            req.body.phone = "";
            req.body.address = "";
            items.push(req.body);
            fs.writeFile(t,JSON.stringify({"khachhang":items}), (err) => {
              if (err) throw err;
              return res.redirect('/');        
            }); 
         }else{
           res.render('loginRegister',{ layout : 'layoutWebsite' , isReg:'show active'});
         }         
        
      });
      
    }
    
  } 

}

module.exports = new LoginRegisterController();
