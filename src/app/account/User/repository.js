const mongoose = require( "mongoose" );
const User = mongoose.model( "User" );
const mailer = require("../../../utilities/mailer")

const createNewUserRepository = (data) => {
    const user = new User({
        name:data.name,
        username:data.username,
        password:data.password,
        email:data.email,
        location:
         { state: data.state,
          city: data.city ,
          street:data.street
        }
    })

    user.password = user.hashPassword(data.password);

mailer.confirmMail(data.email)
    return user.save()
    // user.getUserByEmail(User,data.email,(err,data)=> {
    //     if(err) {
    //     console.log("cutome error")
    //     return;
    //     }
    // if(data.length >= 1){
    //     return
    // }

 


    
    
    
  
}

module.exports = {
    createNewUserRepository
};