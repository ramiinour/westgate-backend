const glob = require('glob'),
    Sequelize = require('sequelize'),
    path = require('path'),
    Logger = require("./logger.winston"),
    root = path.normalize(__dirname + '/../');
const passport = require('passport');

const LocalStrategy   = require('passport-local').Strategy;
// // //     }));
// const Response = require('./config.response'),
// sequelizeConfig = require('./config.sequelize'),
//     db = sequelizeConfig.database;

// const {User} = require("../modules/user/models/user.model");
// passport.use(new LocalStrategy({
//     username: 'email'
// }, function
// (email, password, done) {
//   db.User.findOne({ email: email }, function (err, user) {
//     if (err) { return done(err); }
//     if (!email) { return done(null, false); }
//     if (!email.verifyPassword(password)) { return done(null, false); }
//     return done(null, user);
//   });
// }
// ));

// // passport local strategy for local-login, local refers to this app
// passport.use('local-login', new LocalStrategy(
//     function (email, password, done) {
//         if (username === email[0].username && password === email[0].password) {
//             return done(null, email[0]);
//         } else {
//             return done(null, false, {"message": "User not found."});
//         }
//     })
// );
 

 
// const glob = require('glob'),
//     Sequelize = require('sequelize'),
//     path = require('path'),
//     Logger = require("./logger.winston"),
//     root = path.normalize(__dirname + '/../');


// passport.use(
//   new StrategyJwt(
//     {
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: process.env.JWT_SECRET,
//     },
//     function (jwtPayload, done) {
//       return db.User.findOne({ where: { id: jwtPayload.id } })
//         .then((user) => {
//           return done(null, user);
//         })
//         .catch((err) => {
//           return done(err);
//         });
//     }
//   )
// );

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
       User.findOne({ username: 'email' }, function (err, user) {
      
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      });
    } catch (error) {
      return done(error, false);
      
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) =>{
  try {
const user = await User.findById(id);
done(null, user);
  } catch (error) {
    done(error, false);
  }
})