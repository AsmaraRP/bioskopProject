const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const fs = require("fs");
const mustache = require("mustache");

const clientId =
  "876845105975-p1ngp2pnbjjcg137cpa2nlkt9kirt38g.apps.googleusercontent.com";
const clientSecret = "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";
const refreshToken =
  "1//04FOPbJNcYaJmCgYIARAAGAQSNwF-L9IrNHi1uujVEWgoDN0yAmvTVdTsZ4jCtHfqLheEe-yvNfDlKa99A5GhFfpStRJ9G15Og1Y";

const { OAuth2 } = google.auth;
const OAuth2Client = new OAuth2(clientId, clientSecret);
OAuth2Client.setCredentials({
  refresh_token: refreshToken,
});

module.exports = {
  sendMail: (data) =>
    new Promise((resolve, reject) => {
      const accessToken = OAuth2Client.getAccessToken;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "bioskopproject1@gmail.com",
          clientId,
          clientSecret,
          refreshToken,
          accessToken,
        },
      });

      const fileTemplate = fs.readFileSync(
        `src/templates/email/${data.template}`,
        "utf8"
      );

      const mailOptions = {
        from: '"BIOSKOP PROJECT" <bioskopproject1@gmail.com>',
        to: data.to,
        subject: data.subject,
        html: mustache.render(fileTemplate, { ...data }),
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    }),
};