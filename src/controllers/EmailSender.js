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
        var emailTemplatesSetting = await settingDao.getKey('email_content');
        var emailTemplates = emailTemplatesSetting.value;
        if(emailTemplates && emailTemplates[template]){
            var emailTemplate = emailTemplates[template];
            var subject = ejs.render(emailTemplate.subject, data);
            var content = marked(ejs.render(emailTemplate.content, data));
            this.emailSubject = subject;
            this.content = content;
            return {subject, content}
        }
        return false;
    }

    async sendMailForgotPassword(token){
        const url = `http://${Config.domainPublic}/#/auth/new-password?token=${token}`;
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

    async sendMailContactUs(fromEmail, name, message) {
        var emailsAdmin = await settingDao.getKey('email');
        var emails = emailsAdmin.value;
        this.emailSubject = `Contact us from ${fromEmail}`;
        this.content = `
            <p>From email: ${fromEmail}</p>
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