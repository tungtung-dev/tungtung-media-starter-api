import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import mongoose from 'mongoose';
import morgan from 'morgan';
import config from './config';
import userRoutes from './routes/user/index';
import adminRoutes from './routes/admin/index';
import supperAdminRoutes from './routes/super-admin/index';
import session from 'express-session';

var app = express();
mongoose.connect(config.database);

app.use(session({
    secret: config.sessionCookie,
    cookie: {maxAge: config.cookieMaxAge}
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true, limit: '100mb'}));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../public')));

app.use(function (req, res, next) {
    if (app.get('env') === 'development') {
        res.setHeader('Access-Control-Allow-Origin', '*');
    } else {
        // TODO Allowed domain needs to be updated corresponding with your site
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Cache-Control, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/media', userRoutes.mediaRoute);

app.use('/auth', userRoutes.authRoute);

app.use('/posts', userRoutes.postRoute);

app.use('/settings', userRoutes.settingRoute);

app.use('/tags', userRoutes.tagRoute);


app.use('/admin/settings', adminRoutes.settingRoute);
app.use('/admin/permissions', adminRoutes.permissionRoute);
app.use('/admin/user-permissions', adminRoutes.userPermissionRoute);
app.use('/admin/content-types', adminRoutes.contentTypeRoute);
app.use('/admin/posts', adminRoutes.postRoute);
app.use('/admin/tags', adminRoutes.tagRoute);


app.use('/super-admin/', supperAdminRoutes.setupRoute);

app.listen(config.port, ()=> {
    console.log(`App listening ${config.port}!!`);
});