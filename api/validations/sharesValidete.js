import { checkSchema, validationResult } from "express-validator";
import Shares from "../models/sharesModel.js";
import AppError from "../utils/appError.js";
const sharesValidate = [checkSchema({
    name: {
        notEmpty: {
            errorMessage: "Hisse ismi boş geçilemez.",
        },
        custom: {
            options: async (value) => {
                const check = await Shares.findOne({
                    where: {
                        name:value.toUpperCase()
                    },
                });
                if (check) {
                    return Promise.reject();
                }
            },
            errorMessage: "Girmiş Oldugunuz İsim Sisteme Kayıtlı",
        },
    },
    description: {
        notEmpty: {
            errorMessage: "Açıklama boş geçilemez.",
        },
        isString: {
            errorMessage: "Açıklama String bir ifade Olmalıdır.",
        }
    },
    price: {
        notEmpty: {
            errorMessage: "Fiyat boş geçilemez.",
        },
        isNumeric:{
            errorMessage:"Number ifade olmalı"
        },
        custom: {
            options: async (value) => {
                console.log(typeof value);
                if (value <= 0) {
                    return Promise.reject();
                }
            },
            errorMessage: "Girmiş Oldugunuz değer 0 dan büyük olmalı",
        },
    },
    totalSupply: {
        notEmpty: {
            errorMessage: "Toplam Hisse sayısı boş geçilemez.",
        },
        custom: {
            options: async (value) => {
                
                if (value <= 0) {
                    return Promise.reject();
                }
            },
            errorMessage: "Girmiş Oldugunuz değer 0 dan büyük olmalı",
        },
    }
}),
(req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        const msg = [];
        for (let i = 0; i < errors.errors.length; i++) {
            msg.push({
                "path":errors.errors[i].path,
                "message":errors.errors[i].msg
            });
        }
        return res.status(422).json({
          succeded:false,
          data:{
            error:msg
          }
        })
    } else {
        next();
    }
},
];
const sharesUpdateValidate = [checkSchema({
    price: {
        notEmpty: {
            errorMessage: "Fiyat boş geçilemez.",
        },
        isNumeric:{
            errorMessage:"Number ifade olmalı"
        },
        custom: {
            options: async (value) => {
                console.log( value);
                if (parseFloat(value) <= 0) {
                    return Promise.reject();
                }
            },
            errorMessage: "Girmiş Oldugunuz değer 0 dan büyük olmalı",
        },
    }
}),
(req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        const msg = [];
        for (let i = 0; i < errors.errors.length; i++) {
            msg.push({
                "path":errors.errors[i].path,
                "message":errors.errors[i].msg
            });
        }
        return res.status(422).json({
          succeded:false,
          data:{
            error:msg
          }
        })
    } else {
        next();
    }
},
];

const SharesValidations = {
    sharesValidate,
    sharesUpdateValidate
};

export default SharesValidations;