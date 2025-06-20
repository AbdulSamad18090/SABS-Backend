process.env = {
  PORT: 3000,
  ACCESS_TOKEN_SECRET: "MY_ACCESS_TOKEN_SECRET",
  REFRESH_TOKEN_SECRET: "MY_REFRESH_TOKEN_SECRET",

  SMTP_EMAIL: "abdulsamad18090@gmail.com",
  SMTP_PASSWORD: "kfuq jjza abog qrrp",
};

const data = require("jest-extended");
expect.extend(data);
