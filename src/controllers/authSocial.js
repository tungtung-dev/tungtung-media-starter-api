import User from '../models/user';
import fetch from 'node-fetch';
import bcrypt from '../utils/bcrypt';
import EmailSender from './emailSender';
import {createTokenAndGetUser, downloadImage} from '../utils/index';

export default class AuthSocial {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.social = req.body.social;
        this.userSocial = {
            id: '', email: '', name: '', birthday: '', gender: '', avatar_url: ''
        };
        if (!this.social) {
            this.res.json({success: false, message: "Không tìm thấy trường social"});
        }
    }

    fetchUser(callback) {
        switch (this.social) {
            case 'facebook':
                return this.fetchUserFacebook(callback);
            case 'google':
                return this.fetchUserGoogle(callback);
        }
    }

    fetchUserFacebook(callback) {
        var {token} = this.req.body;
        fetch(`https://graph.facebook.com/v2.7/me?access_token=${token}&fields=id,email,birthday,name,gender,picture.type(large){url}`).then(data => data.json()).then((userSocial)=> {
            if (userSocial.error) {
                this.res.json({success: false, message: 'Không kết nối được tài khoản facebook'});
            }
            else {
                this.userSocial = Object.assign(
                    userSocial,
                    {
                        avatar_url: userSocial.picture.data.url
                    }
                );
                callback();
            }
        })
    }

    fetchUserGoogle(callback) {
        var {token} = this.req.body;
        fetch(`https://content-people.googleapis.com/v1/people/me?access_token=${token}`).then(data => data.json()).then(userGoogle => {
            if (userGoogle.error) {
                this.res.json({
                    success: false,
                    message: 'Không kết nối được tài khoản google error',
                    errors: userGoogle.error
                });
            }
            else {
                const names = userGoogle.names[0];
                const gender = userGoogle.genders[0].value;
                const avatarUrl = userGoogle.photos[0].url;
                const email = userGoogle.emailAddresses[0].value;
                this.userSocial = {
                    id: names.metadata.source.id,
                    name: names.displayName,
                    email,
                    gender,
                    avatarUrl
                };
                callback();
            }
        })
    }

    getKeySocialID() {
        switch (this.social) {
            case 'facebook':
                return 'facebookID';
                break;
            case 'google':
                return 'googleID';
            default:
                return this.res.json({success: false, message: 'Không tìm thấy mạng xã hội'});
        }
    }

    checkLoginUser() {
        var keySocialID = this.getKeySocialID();
        var createToken = (user) => {
            var {token, userFromToken} = createTokenAndGetUser(user);
            return this.res.json({user: userFromToken, success: true, token});
        };
        (async() => {
            var user = await User.findOne({$or: [{[keySocialID]: this.userSocial.id}, {email: this.userSocial.email}]});
            if (!user) {
                return this.res.json({success: false, message: "Tài khoản mạng xã hội không tồn tại"});
            }
            else {
                if (user[keySocialID]) {
                    return createToken(user);
                }
                else {
                    // Integrate user social ID, if email social = local user email
                    var userUpdate = await User.findOneAndUpdate({email: this.userSocial.email}, {
                        $set: {
                            [keySocialID]: this.userSocial.id
                        }
                    }, {new: true});
                    if (userUpdate) {
                        return createToken(userUpdate);
                    }
                    else {
                        this.res.json({success: false});
                    }
                }
            }
        })();
    }

    createUser() {
        var {username, password} = this.req.body;
        var keySocialID = this.getKeySocialID();
        (async() => {
            var user = await User.findOne({[keySocialID]: this.userSocial.id});
            if (user) {
                return this.res.json({success: false, message: 'Tài khoản đã tồn tại'});
            }
            else {
                user = await User.findOne({$or: [{username}, {email: this.userSocial.email}]});
                if (user) {
                    return this.res.json({
                        success: false,
                        errors: {username: 'Tên tài khoản hoặc email đã tồn tại'}
                    });
                }
                else {
                    user = new User({
                        email: this.userSocial.email,
                        birthday: this.userSocial.birthday,
                        fullName: this.userSocial.name,
                        gender: this.userSocial.gender,
                        [keySocialID]: this.userSocial.id,
                        username,
                        password: bcrypt.generate(password)
                    });
                    user = await user.save();
                    var filename = `${user._id}.jpg`;

                    new EmailSender(user.email, function (action) {
                        action.sendMailWelcome(user.fullName);
                    });

                    if (this.userSocial.avatarUrl) {
                        downloadImage(this.userSocial.avatarUrl, `public/uploads/avatars/${filename}`, ()=> {
                            User.findOneAndUpdate({_id: user._id}, {
                                $set: {
                                    avatar: filename
                                }
                            }, {new: true}, (err, user) => {
                                if (user) {
                                    let {token, userFromToken} = createTokenAndGetUser(user);
                                    return this.res.json({user: userFromToken, success: true, token});
                                }
                            })
                        })
                    }
                    else {
                        let {token, userFromToken} = createTokenAndGetUser(user);
                        return this.res.json({user: userFromToken, success: true, token});
                    }
                }
            }
        })();
    }
}