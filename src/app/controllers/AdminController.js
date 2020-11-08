const fs = require('fs');
const Buffer = require('buffer/').Buffer;
const path = require('path'); 
const menu = require('../libs/myMenu');
const {readJson ,ChangeToSlug } = require('../libs/myFunction');


// function readJson(jsonFile) {
//     let myCategory = fs.readFileSync(jsonFile,{encoding:'utf8', flag:'r'}); 
//     let cate = JSON.parse(myCategory);
//     return cate.data;
// }            
class AdminController {
  // [GET] /
  index(req, res) {
    //console.log('slug:',ChangeToSlug('Từ-N-'));
    
    global.myCategory = readJson(global.basedir + '/public/json/category.json'); 
    let myDvt  =  readJson(global.basedir + '/public/json/attrib.json');                 
    global.myDvt = myDvt.dvt;
    let t = global.basedir + '/public/json/product.json';
    fs.readFile(t, (err, data) => {
      if (err) throw err;
      let productData = JSON.parse(data);
      let items = productData.data;
      global.product = items;     
      res.render('admin/admin',{ layout : 'layoutAdmin'});         
    })
    
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
                
        res.render('admin/product',{ layout : 'layoutAdmin', createProduct:true , summernote:true,myCategory, myDvt:global.myDvt});  
        break;
        case 'createCategory':
        var item = [];
        var slug = '';
        if(req.params.slug){
           slug = req.params.slug;
           item = global.myCategory.find(value => value.id ==req.params.slug);
        }        
        res.render('admin/product',{ layout : 'layoutAdmin', createCategory:true,myCategory,item,slug});
        break;
        default:  
          res.render('admin/product',{ layout : 'layoutAdmin' , product:true, items:global.product});
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
  createProduct(req, res) {
    // res.json(req.body);  
     let items = [];
     let t = global.basedir + '/public/json/product.json';
     if (fs.existsSync(t)) {      
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
          global.product = items;

          fs.writeFile(t,JSON.stringify({"data":items}), (err) => {
            if (err) throw err;
            return res.redirect('/admin/product');       
          }); 
          })      
     }else{
      req.body.id = 1;       
      items.push(req.body); 
      global.product = items;
      fs.writeFile(t,JSON.stringify({"data":items}), (err) => {
        if (err) throw err;
        res.redirect('/admin/product');       
      });
     }     
  }
  
  productDelete(req, res) {
      let id = parseInt(req.params.id);
      let items = global.product;
      let dataNew = items.filter(item => item.id !== id);
      let t = global.basedir + '/public/json/product.json';
      fs.writeFile(t,JSON.stringify({"data":dataNew}), (err) => {
        if (err) throw err;
        global.product = dataNew;
        return res.redirect('/admin/product');       
      });     

  }

  updateProduct(req, res) {
      // https://handlebarsjs.com/api-reference/data-variables.html#root
      let id = parseInt(req.params.id);
      let items = global.product;
      let dataNew = items.find(item => item.id == id);
      let album = dataNew.imgAlbum.split(',');
      let category = dataNew.category.split(',');
      res.render('admin/product',{ layout : 'layoutAdmin', updateProduct:true , summernote:true, item:dataNew , myCategory, album, category , myDvt:global.myDvt});   

  }
  updateProductById(req, res) {
      //res.json(req.body.id);
      let id = parseInt(req.body.id);
      let items = global.product;
      let index = items.findIndex(item => item.id == id);
      items[index] = req.body;
      global.product = items;
      let t = global.basedir + '/public/json/product.json';
      fs.writeFile(t,JSON.stringify({"data":items}), (err) => {
        if (err) throw err;
        res.redirect('/admin/product');      
      }); 

  }

  copyProduct(req, res) {
    let id = parseInt(req.params.id);
    let items = global.product;    
    let idArray = items.map((value)=> {
      return value.id;
    })
    let idMax = Math.max(...idArray);
    let item = items.find(value => value.id === id);
    item.id = parseInt(idMax) + 1;  
    let t = global.basedir + '/public/json/product.json';
    let itemNew = readJson(t); 
    itemNew.push(item);
    global.product = itemNew;
    fs.writeFile(t,JSON.stringify({"data":itemNew}), (err) => {
      if (err) throw err;      
      return res.redirect('/admin/product');      
    });
  }

  createCategory(req, res) {
    var items = global.myCategory;
    let id = parseInt(req.params.id);
    if(id){
       let items = global.myCategory;
       let index = items.findIndex(value => value.id == id);
       req.body.id = id;
       items[index] = req.body;       
    }else{      
      let idArray = items.map((item)=> { 
        return item.id;
      })
      let idMax = Math.max(...idArray);
      req.body.id = parseInt(idMax) + 1;
      req.body.slug = ChangeToSlug(req.body.name);
      items.push(req.body);    
    }
    let t= global.basedir + '/public/json/category.json';
    fs.writeFile(t,JSON.stringify({"data":items}), (err) => {
      if (err) throw err;
      global.myCategory = items;
      return res.redirect('/admin/product/createCategory');       
    }); 

   
    
  
  }
  categoryDelete(req, res) {
    let id = parseInt(req.params.id);
    let items = global.myCategory;
    let dataNew = items.filter(item => item.id !== id);
    let t = global.basedir + '/public/json/category.json';
    fs.writeFile(t,JSON.stringify({"data":dataNew}), (err) => {
      if (err) throw err;
      global.myCategory = dataNew;
      return res.redirect('/admin/product/createCategory');      
    });   
  }
}

module.exports = new AdminController();
