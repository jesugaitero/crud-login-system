require("dotenv").config();
const userCtrl = {}
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { errorHandler } = require('../helpers/help')

//signup function to regist a user

module.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'worker']
        if (!roles.includes(req.user.role)) {
            return res.status(403).send('Dont have permission to do that action.')
        }
        next();
    };
};

userCtrl.signup = (req, res) => {

    const { username, password, email } = req.body
    
    let checkRole = User.findOne()

    if (checkRole.length == 0) {
        req.body.role = 'admin'
    } else {
        req.body.role = "user"
    }
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                error: errorHandler(err)
                // error: 'Email is taken'
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    });
};

//signin function to login a user
userCtrl.authenticateUser = (req, res) => {
    // find the user based on email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (!user || err) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please ask to admin'
            });
        }
        // if user is found make sure the email and password match
        // create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password dont match'
            });
        }
        // generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        // persist the token as 't' in cookie with expiry date
        res.cookie('t', token, { expire: new Date() + 1 });
        // return response with user and token to frontend client
        const { _id, username, email, role } = user;
        return res.json({ token, user: { _id, email, username, role } });
    });
};

//signout function to get out a user signed 
userCtrl.signout = async (req, res) => {
    res.clearCookie('t');
    res.json({ message: "Signout success" })
}

//check JWT token, then decode to _id
userCtrl.isToken = (req, res, next) => {

    let token = req.headers['x-access-token'] || req.headers["authorization"];
    if (token != undefined) {

        token = token.replace(/^Bearer\s+/, "");

        if (token != undefined) {

            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

                if (err) {

                    return res.status(404).send({
                        success: false,
                        message: 'Token is not valid',
                        error: err
                    });
                }

                req._id = decoded;


                User.findById({ _id: decoded._id }, (err, user) => {
                    if (err || !user) {

                    }


                    req.profile = user

                    next();
                })


            });
        } else {
            return res.status(400).send({
                success: false,
                message: 'Token not provided'
            });
        }
    } else {
        return res.status(400).send({
            success: false,
            message: 'Token not provided'
        });
    }


}

userCtrl.getUsers = (req, res, next) => {
    User.find((err, users) => {
        if (err) {
            //apears to exist a error
        }

        if (user.length == 0) {
            return res.send({ users: [] })
        } else {
            return res.send({ users })
        }
    })
}

//check if the role is a admin or not
userCtrl.isAdmin = (req, res, next) => {

    User.findById(req.profile._id, (err, user) => {
        if (err) {
            return res.status(404).send({ message: 'No admin verification passed', error: err })
        }

        if (user.role === "admin") {
            req.profile = user;
            next();
        } else {
            return res.send({ message: "Admin privileges are not granted" })
        }

    })

}

userCtrl.addUser = (req, res, next) => {
    const { username, email, password, role } = req.body

    const newUser = new User(req.body)
    newUser.save((err, saved) => {
        if (err) {
            return res.status(400).send({ message: "User is already in use." })
        } else {
            return res.send({ message: "User successfully added" })
        }
    })

}

userCtrl.editUser = (req, res, next) => {
    const { id } = req.params

    const { username, email, password, role } = req.body

    let object = req.body

    User.findById(id, (err, user) => {
        if (err) {
            return res.status(400).send({ message: "User data is already in Use" })
        } else {
            for (let key in object) {
                user[key] = object[key]
            }
            user.save((err, saved) => {
                if (err) {
                    //appears to be an error
                } else {
                    return res.send({ message: "User successfully updated" })
                }
            })
        }
    })
}

userCtrl.deleteUser = (req, res, next) => {
    const { id } = req.params
    User.findOneAndDelete(id, (err, deletedUser) => {
        if (err) {
            //appears to be an error
        } else {
            return res.send({ message: "User successfully deleted" })
        }
    })
}

userCtrl.deleteManyUsers = (req, res, next) => {

    const { users } = req.body

    for (let user of users) {
        User.findOneAndDelete(user.id, (err, deletedUser) => {
            if (err) {
                console.log("there is a issue with:")
                console.log({ user })
            } else {
                console.log("user successfully deleted")
                console.log({ user })
            }
        })
    }

    return res.send({ message: "Users successfully deleted" })

}


module.exports = userCtrl;