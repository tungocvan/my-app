const fs = require('fs');
const Buffer = require('buffer/').Buffer;
const path = require('path'); 
const menu = require('../libs/myMenu');
class AdminController {
  // [GET] /
  index(req, res) {
     res.render('admin/admin',{ layout : 'layoutAdmin'});
  } 
  menu(req, res) {
      //console.log('menu:',menu.menu);    
      let t = global.basedir + '/public/azshopweb/menu/menuTop.json';
      fs.writeFile(t,JSON.stringify({"menu":menu.menu}), (err) => {
        if (err) throw err;
        res.render('admin/menu',{ layout : 'layoutAdmin'});        
      }); 
      
  } 
  product(req, res) {
  
      switch (req.params.id) {
        
        case 'createProduct':          
        res.render('admin/product',{ layout : 'layoutAdmin', createProduct:true , summernote:true});  
        break;
        case 'createCategory':
        res.render('admin/product',{ layout : 'layoutAdmin', createCategory:true});
        break;
        default:
        res.render('admin/product',{ layout : 'layoutAdmin' , product:true});  
        break;
      }
      
      
  } 
  upload(req, res,next) {
     let files  = req.body;
     let name = files.name;  
     let t = global.basedir + files.des + name;
     let img = files.tmp_name;
     let data = img.replace(/^data:image\/\w+;base64,/, "");
     let buf = new Buffer(data, 'base64');  
     fs.writeFile(t, buf, (err) => {
            if (err) throw err;
            res.json({"message":"Upload Ok !!!"});        
     }); 
   
  } 
  updateProduct(req, res) {
     //res.json(req.body);  
     let items = [];
     let t = global.basedir + '/public/json/product.json';
     if (fs.existsSync(t)) { 
      // do something 
        fs.readFile(t, (err, data) => {
          if (err) throw err;
          let product = JSON.parse(data);
          items = product.data;
          // tim max id
          let idArray = items.map((item)=> {
            return item.id;
          })
          let idMax = Math.max(...idArray);
          req.body.id = parseInt(idMax) + 1;           
          items.push(req.body);
          fs.writeFile(t,JSON.stringify({"data":items}), (err) => {
            if (err) throw err;
            res.redirect('/admin/product');       
          }); 
          })      
     }else{
      req.body.id = 1;       
      items.push(req.body); 
      fs.writeFile(t,JSON.stringify({"data":items}), (err) => {
        if (err) throw err;
        res.redirect('/admin/product');       
      });
     }     
  }
  
}

module.exports = new AdminController();
