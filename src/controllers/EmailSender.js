var api_key = 'key-xxx';
var domain = 'need_to_define';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
import Config from '../config';
import marked from 'marked';
import ejs from 'ejs';
import validator from 'validator';

export default class EmailSender {
    constructor(toEmail, callback = () =>{}) {
        this.toEmail = toEmail;
        callback(this);
    }

    async getEmailTemplate(template, data){
        var email_templates_setting = await settingDao.getKey('email_content');
        var email_templates = email_templates_setting.value;
        if(email_templates && email_templates[template]){
            var email_template = email_templates[template];
            var subject = ejs.render(email_template.subject, data);
            var content = marked(ejs.render(email_template.content, data));
            this.emailSubject = subject;
            this.content = content;
            return {subject, content}
        }
        return false;
    }

    async sendMailForgotPassword(token){
        const url = `http://${Config.domain_public}/#/auth/new-password?token=${token}`;
        const emailTemplate = await this.getEmailTemplate('forgot_password', {url});
        if(!emailTemplate) return ;
        this.send();
    }

    ccMail(email = ''){
        if(email && validator.isEmail(email)){
            this.toEmail = email;
            this.send();
        }
    }

    async sendMailContactUs(from_email, name, message) {
        var emails_admin = await settingDao.getKey('email');
        var emails = emails_admin.value;
        this.emailSubject = `Contact us from ${from_email}`;
        this.content = `
            <p>From email: ${from_email}</p>
            <p>Name: ${name}</p>
            <p>Message: ${message}</p>
        `;
    }

    async sendMailWelcome(username, password) {
        const emailTemplate = await this.getEmailTemplate('welcome',{username, email: this.toEmail, password});
        if(!emailTemplate) return;
        this.send();
    }

    async sendMailWithdrawalSuccess(username, amount) {
        const emailTemplate = await this.getEmailTemplate('withdrawl_success',{username, amount});
        if(!emailTemplate) return ;
        this.send();
    }

    send() {
        var data = {
            from: "Admin <postmaster@tungtung.vn>",
            to: this.toEmail,
            subject: this.emailSubject,
            html: this.content
        };
        mailgun.messages().send(data, function (error, body) {
            console.log("err: " + error);
            console.log("err: " + body);
        });
    }
}