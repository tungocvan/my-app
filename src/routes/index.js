const cartRouter = require('./cart');
const siteRouter = require('./site');
const usersRouter = require('./users');
const loginRouter = require('./login');
const adminRouter = require('./admin');
const checkoutRouter = require('./checkout');
const contactRouter = require('./contact');
const loginRegisterRouter = require('./loginRegister');
const productDetailsRouter = require('./productDetails');
const wishlistRouter = require('./wishlist');

function route(app) {
  app.use('/admin',ensureAuthenticated, adminRouter);
  app.use('/register', loginRegisterRouter);
  app.use('/users',ensureAuthenticated, usersRouter);
  app.use('/login', loginRouter); 
  app.use('/logout', logout);
  app.use('/cart', cartRouter);
  app.use('/contact', contactRouter);
  app.use('/checkout', checkoutRouter);  
  app.use('/productDetails', productDetailsRouter);
  app.use('/wishlist', wishlistRouter);
  app.use('/', siteRouter);
}

function ensureAuthenticated(req, res, next) {
  
  // truyền biến qua router
  
    if (req.isAuthenticated()) { 
       // res.locals.isAdmin = true;
        res.locals.profile = global.profile;
        return next();    
     
    }else{
      res.redirect('/login')
    }
    
  
  //res.locals.menu = global.menu;
}

function logout(req, res){
  req.logout();
  res.redirect('/');
}

module.exports = route;
