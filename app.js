var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');
const { isUndefined } = require('util');

var cookieParser = require('cookie-parser');
var session=require('express-session');
var userExists = false;

const port = 3000;

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


  
app.use(session({
  resave:false,
  saveUninitialized:false,
  secret:'ohMyS3cr3t',
  cookie:{
   maxAge: 1000 * 60 * 60 * 24,
   sameSite:true,
  }

}));

// const threeDays = 1000 * 60 * 60 * 24 * 3;
// app.use(session({
//     username:'ko',
//     secret: "ohMyS3cr3t",
//     saveUninitialized:true,
//     cookie: { maxAge: threeDays },
//     resave: false 
// }));



var {MongoClient} = require('mongodb');
var uri = "mongodb+srv://admin:admin123@cluster0.oscpq.mongodb.net/firstdb?retryWrites=true&w=majority";
var client = new MongoClient(uri,{useNewUrlParser:true, useUnifiedTopology:true});
var currentUser = null;

app.get('/',function(req,res){
  if(req.session.user)
    res.redirect('home')
  else
    res.render('login',{wrong: ""});
});

app.get('/logout',function(req,res){
  currentUser = null;
  delete req.session.user ;
  res.redirect('/');
});


app.get('/registration',function(req,res){

  res.render('registration',{wrong: ""});
});

app.get('/searchresults',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
    res.render('searchresults');
});

app.get('/sports',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  res.render('sports');
});

app.get('/sun',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  res.render('sun');
});


app.get('/tennis',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  res.render('tennis');
});

app.post('/tennisCart',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  insertInCart({username: req.session.user
                ,item : "Tennis",
                 price:"9$"},req,res);
});

app.post('/sunCart',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  insertInCart({username: req.session.user,
                item : "Sun",
                price: "59$"},req,res);
});

app.post('/iphoneCart',function(req,res){

  if(!req.session.user)
    res.redirect('/');
  else 
  insertInCart({username: req.session.user,
                item : "Iphone",
                price: "899$"},req,res);
});

app.post('/galaxyCart',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  insertInCart({username: req.session.user,
                item : "Galaxy",
                price: "699$"},req,res);
});

app.post('/boxingCart',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  insertInCart({username: req.session.user,
              item : "Boxing",
              price: "39$"},req,res);
});

app.post('/leavesCart',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  insertInCart({username: req.session.user,
                item : "Leaves",
                price : '99$'},req,res);
});



app.post('/removeTennis',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  removeFromCart({username: req.session.user
                ,item : "Tennis",
                 price:"9$"},req,res);
});

app.post('/removeSun',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  removeFromCart({username: req.session.user,
                item : "Sun",
                price: "59$"},req,res);
});

app.post('/removeIphone',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  removeFromCart({username: req.session.user,
                item : "Iphone",
                price: "899$"},req,res);
});

app.post('/removeGalaxy',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  removeFromCart({username: req.session.user,
                item : "Galaxy",
                price: "699$"},req,res);
});

app.post('/removeBoxing',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  removeFromCart({username:req.session.user,
              item : "Boxing",
              price: "39$"},req,res);
});

app.post('/removeLeaves',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  removeFromCart({username: req.session.user,
                item : "Leaves",
                price : '99$'},req, res);
});

app.get('/books',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  res.render('books');
});


app.get('/boxing',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  res.render('boxing');
});


app.get('/cart',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  res.render('cart');
});


app.get('/galaxy',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  res.render('galaxy');
});


app.get('/home',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  res.render('home', {username:req.session.user});
});


app.get('/iphone',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  res.render('iphone');
});


app.get('/leaves',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  res.render('leaves');
});


app.get('/phones',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else 
  res.render('phones');
});



app.post('/',function(req,res){
  var username = req.body.username;
  var password = req.body.password;

  
  var user = 
  {
    username : username,
    password : password
  };
  checkInDb(req, user,res);
});

app.post('/register',function(req,res){
  var username = req.body.username;
  currentUser = username;
  req.session.user = username;
  var password = req.body.password;
  var user = 
  {
    username : username,
    password : password
  };
  insertInDb(user,res);
  
});

app.post('/cart',function(req,res){
  if(!req.session.user)
    res.redirect('/');
  else if (req.session.user){
  var query = {username: req.session.user};
  findInCart(query,res);
}

});


//Mongo DB connection


async function insertInDb(user,res){
  await client.connect();
  var query = {username : user.username}
  var output = await client.db('firstdb').collection('firstcollection').find(query).toArray();
  if(output.length == 0 && user.username.length > 0 && user.password.length > 0 ){
  await client.db('firstdb').collection('firstcollection').insertOne(user);
  res.redirect('home');
  }
  else {
    res.render('registration',{wrong: "Please enter a valid username and/or password"});
  }
  client.close();

}

async function insertInCart(item,req,res){
  await client.connect();
  var output = await client.db('firstdb').collection('secondcollection').find(item).toArray();
  if(output.length == 0){
  item.count = 1 
  await client.db('firstdb').collection('secondcollection').insertOne(item);
  }
  else{
  var newvalues = { $set: { count: output[0].count+1 } };
  await client.db('firstdb').collection('secondcollection').updateOne(item, newvalues);
  }
  res.redirect('home');
  client.close();

}

async function removeFromCart(item,req,res){
  await client.connect();
  var output = await client.db('firstdb').collection('secondcollection').find(item).toArray();
  if(output[0].count==1){
  await client.db('firstdb').collection('secondcollection').deleteOne(item);
  }
  else{
  var newvalues = { $set: { count: output[0].count-1 } };
  await client.db('firstdb').collection('secondcollection').updateOne(item, newvalues);
  }
  var new_output = await client.db('firstdb').collection('secondcollection').find({username: req.session.user}).toArray();
  var total = 0;
  for (var i = 0 ;i<new_output.length; i++) {
    total = total + ( parseInt(new_output[i].price.replace('$','')) * new_output[i].count);
  }
  total += "$";
  res.render('cart',{items:new_output, tot:total});
  client.close();


}

async function findInCart(queryUser,res){
  await client.connect();
  var output = await client.db('firstdb').collection('secondcollection').find(queryUser).toArray();
  var total = 0;
  for (var i = 0 ;i<output.length; i++) {
    total = total + ( parseInt(output[i].price.replace('$','')) * output[i].count);
  }
  total += "$";
  res.render('cart', {items:output, tot:total});
  client.close();

}


async function checkInDb(req,user,res){
  await client.connect();
  var output = await client.db('firstdb').collection('firstcollection').find(user).toArray();
  if(output.length != 0){
 
    
    currentUser = user.username;
    req.session.user = user.username;
    res.redirect('home');
    }
    else{
      res.render('login',{wrong: "Incorrect Username or Password."});
    }
  client.close();
}

app.post('/search',function(req,res){

  var query = req.body.Search || '';

  query =  query.replace(/[^a-z0-9]/gi, ' ');

  query = query.replace(/\s+/g,' ').trim();

  query = query.toLowerCase();

  query = query.split(' ');

  var allItems = ['iphone 13 pro', 'galaxy s21', 'leaves of grass', 'the sun and her flowers', 'boxing bag', 'tennis racket'];
  var categories = ['phones', 'books', 'sports'];
  var allItemsCategory = {
    phones: ['iphone 13 pro', 'galaxy s21'],
    books: [ 'leaves of grass', 'the sun and her flowers'],
    sports: ['boxing bag', 'tennis racket']
  }
  var itemsInfo = {
    'iphone 13 pro' : {
      name:'iPhone 13 Pro Max',
      img: 'iphone.jpg',
      price: '899$',
      href:'iphone'
    },
    'galaxy s21' : {
      name:'Galaxy S21',
      img: 'galaxy.jpg',
      price: '699$',
      href:'galaxy'
    },
    'leaves of grass' :{
      name:'Leaves Of Grass',
      img: 'leaves.jpg',
      price: '99$',
      href:'leaves'
    },
    'the sun and her flowers':{
      name:'The Sun And Her Flowers',
      img: 'sun.jpg',
      price: '59$',
      href:'sun'
    },
    'boxing bag':{
      name:'Boxing Bag',
      img: 'boxing.jpg',
      price: '39$',
      href:'boxing'
    },
    'tennis racket':{
      name:'Tennis Racket',
      img: 'tennis.jpg',
      price: '9$',
      href:'tennis'
    }

  }
  var addedItems = [];
  var result = [];


  query.map((value, index)=>{
    categories.map((category,index)=>{
      if(category === value){
        allItemsCategory[category].map((item, index)=>{
          if(!addedItems.includes(item)){
            addedItems.push(item);
            result.push(itemsInfo[item]);
          }
        })
      }
    }) 
  })

  query.map((value, index)=>{
    allItems.map((item, index)=>{
        if(item.includes(value) && !addedItems.includes(item)){
          addedItems.push(item);
          result.push(itemsInfo[item]);
        }
    }) 
  })


  if(result.length === 0){
    result = [];
  }
 
  res.render('searchresults', {result:result});
});


app.get('*', function(req, res){
  res.redirect('/');
  });

//app.listen(port); 

app.listen(process.env.PORT || port, () => console.log(`Example app listening at http://localhost:${port}`));
