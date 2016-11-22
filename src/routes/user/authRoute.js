import express from "express";
import validator from "validator";
import base64Img from "base64-img";
import User from "../../models/user";
import authMiddleware from "../../middlewares/authMiddleware";
import AuthSocial from "../../controllers/AuthSocial";
import bscrypt from "../../utils/bcrypt";
import _ from "lodash";
import {createTokenAndGetUser} from "../../utils/index";
import EmailSender from "../../controllers/EmailSender";
import passwordDao from "../../dao/passwordDao";
import url from "url";
import logger from "../../utils/logger";

var route = express.Router();

route.get('/check-exists', (req, res) => {
    var {field, value} = req.query;
    if (!field || !value) return res.json({exists: false});
    User.findOne({
        [field]: value
    }).then(user => {
        if (user) {
            return res.json({exists: true});
        }
        else return res.json({exists: false});
    })
});

route.post('/login', (req, res) => {
    var errors = {};
    (async() => {
        var userRes = await User.findOne({
            email: req.body.email
        });
        if (!userRes) {
            errors.email = 'Account not found';
            res.json({success: false, errors});
        } else {
            if (!bscrypt.compare(req.body.password, userRes.password)) {
                errors.password = 'Password incorrect';
                res.json({success: false, errors});
            }
            else {
                var {token, user} = createTokenAndGetUser(userRes);
                user = _.extend(user, {
                    isRemember: true
                });
                res.json({
                    success: true,
                    message: 'Enjoy your token',
                    token: token,
                    user: user
                })
            }
        }
    })();
});

route.post('/register', (req, res) => {
    var {email, username, fullName, password} = req.body;

    var errors = {};
    if (!email || !username || !password || !fullName) {
        errors.error = 'Username, email, password shouldn\'t empty';
    }
    if (email && !validator.isEmail(email)) {
        errors.email = 'Email invalid';
    }

    if (errors.length > 0) return res.json({success: false, errors});

    (async() => {
        try {
            var user = await User.findOne({email}, {password: 0});
            if (!user) {
                user = await User.findOne({username});
                if (!user) {
                    user = new User({
                        email,
                        username,
                        fullName,
                        admin: true,
                        password: bscrypt.generate(password),
                        createdAt: new Date()
                    });
                    user.save().then((userRes)=> {
                        var {token, user} = createTokenAndGetUser(userRes);
                        return res.json({user: user, success: true, token});
                    });
                }
                else {
                    errors.username = 'Username have exists';
                    return res.json({success: false, errors});
                }
            }
            else {
                errors.email = 'Email have exists';
                return res.json({success: false, errors});
            }
        } catch (e) {
            return res.json({success: false, message: e.message});
        }
    })();
});

route.get('/me', authMiddleware, (req, res)=> {
    User.findOne({_id: req.user.id}, {password: 0}).then(user => {
        return res.json(user);
    }).catch(err => {
        console.log(err);
        res.status(404).send({message: 'Not found'});
    })

});


route.get('/profile', authMiddleware, (req, res) => {
    User.findOne({_id: req.user._id}, {password: 0}).then(user => {
        return res.json(user);
    })
});

route.put('/profile', authMiddleware, (req, res) => {
    const {fullName, birthday, gender, nickname, biography, facebook} = req.body;
    console.log("User: " + req.user._id);
    User.findOneAndUpdate({_id: req.user._id},
        {
            $set: {
                fullName,
                gender,
                birthday,
                nickname,
                biography,
                facebook
            }
        }, {new: true})
        .select({password: 0})
        .exec((err, user) => {
            if (err) {
                return res.json({success: false});
            } else {
                user.success = true;
                return res.json({success: true, user});
            }
        });
});

route.put('/password', authMiddleware, (req, res) => {
    const {password, newPassword} = req.body;
    if (newPassword.length < 6) {
        res.json({
            success: false, errors: {
                newPassword: 'Password require min length 5'
            }
        });
    }
    User.findOne({_id: req.user.id}).then(user => {
        if (bscrypt.compare(password, user.password)) {
            User.findOneAndUpdate({_id: req.user.id}, {
                $set: {
                    password: bscrypt.generate(newPassword)
                }
            }).then(user => {
                res.json({success: true});
            })
        } else {
            return res.json({
                success: false, errors: {
                    password: 'Password incorrect'
                }
            });
        }
    });
});

route.put('/avatar', authMiddleware, (req, res) => {
    const {imageBase64} = req.body;
    const {user} = req;
    var cleanAvatar = (filepath) => {
        var fPath = filepath.split('/');
        return fPath[fPath.length - 1];
    };
    base64Img.img(imageBase64, 'public/uploads/avatars', user.id + new Date(), function (err, filepath) {
        if (err) {
            return res.json({success: false});
        }

        var avatar = cleanAvatar(filepath);
        User.findOneAndUpdate({_id: user.id}, {$set: {avatar}}, {new: true}, function (err, user) {
            if (err) {
                return res.json({success: false});
            }
            const {avatar, avatarUrl} = user;
            return res.json({success: true, avatar, avatarUrl});
        })
    });
});

route.post('/forgot-password', (req, res) => {
    const {email} = req.body;
    if (email && validator.isEmail(email)) {
        passwordDao.createForgotPassword(email).then((p) => {
            new EmailSender(p.email, action => {
                action.sendMailForgotPassword(p.token);
            });
            res.json({success: true});
        }).catch(e => {
            res.json({success: false, ...e});
        })
    }
    else {
        res.json({success: false, message: 'Email incorrect'});
    }
});

route.post('/check-new-password', (req, res) => {
    const {token} = req.body;
    passwordDao.checkToken(token).then(password => {
        res.json({
            success: true,
            ...password
        })
    }).catch((e) => {
        res.json({success: false, ...e})
    })
});

route.post('/new-password', (req, res) => {
    const {token, password} = req.body;
    passwordDao.updatePassword(token, password).then(user => {
        res.json(createTokenAndGetUser(user));
    }).catch((e) => {
        res.json({success: false, ...e})
    })
});

route.post('/social/check-login', (req, res) => {
    var user = new AuthSocial(req, res);
    user.fetchUser(()=> {
        user.checkLoginUser()
    });
});

route.post('/social/confirm', (req, res) => {
    var {social, token, username, password} = req.body;
    if (!username || !password) return res.json({
        success: false,
        message: 'Các trường dữ liệu không đủ username, password'
    });
    var user = new AuthSocial(req, res);
    user.fetchUser(() => {
        user.createUser();
    });
});

export default route;