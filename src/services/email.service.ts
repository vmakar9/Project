import nodemailer,{Transporter} from "nodemailer";
import {configs} from "../configs/config";
import EmailTemplated from "email-templates";
import * as path from "path";
import {EEmailActions} from "../enum/email.enum";
import {allTemplates} from "../constants/email.constants";
class EmailService{
    private transporter:Transporter;
    private templateParser;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:configs.NO_REPLY_EMAIL,
                pass:configs.NO_REPLY_EMAIL_PASSWORD
            },
        });
        this.templateParser = new EmailTemplated({
            views:{
                root:path.join(process.cwd(),"src","statics"),
                options:{
                    extension:"hbs"
                },
            },
            juice:true,
            juiceResources:{
                webResources:{
                    relativeTo:path.join(process.cwd(),"src","statics","css"),
                }
            }
        })
    }

    public async sendEmail(email:string | string[],emailAction:EEmailActions,locals:Record<string, string> = {}){
        try{
            const templateInfo = allTemplates[emailAction]
            locals.frontUrl = configs.FRONT_URL
            const html = await this.templateParser.render(
                templateInfo.templateName,
                locals
            )
            return this.transporter.sendMail({
                from:"No reply",
                to: email,
                subject:templateInfo.subject,
                html,
            });
        }catch (e) {
            console.error(e.message)
        }
    }
}
export const emailService = new EmailService();