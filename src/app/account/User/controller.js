const extractObject = require( "../../../utilities/" ).extractObject;
const logger = require( "../../../utilities/logger" );
const userRepository = require( "./repository" );

exports.createNewUser = async (req,res) => {
    
    try {
        const savedUser = await userRepository.createNewUserRepository(req.body);
        res.status(200).json({data:savedUser})
    }catch(err) {
        console.log(err)
    }
}