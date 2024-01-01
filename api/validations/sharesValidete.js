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
                        name: value.toUpperCase()
                    },
                });
                if (check) {
                    return Promise.reject();
                }
            },
            errorMessage: "Girmiş Oldugunuz İsim Sisteme Kayıtlı",
        },
        isLength: {
            options: { min: 3, max: 3 },
            errorMessage: "Girmiş Oldugunuz isim 3 karakter olmalıdır.",
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
        isNumeric: {
            errorMessage: "Number ifade olmalı"
        },
        custom: {
            options: async (value) => {
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
    if (!errors.isEmpty()) {
        const errorObject = {};
        for (let i = 0; i < errors.errors.length; i++) {
            const key = errors.errors[i].path;
            const value = errors.errors[i].msg;
            errorObject[key] = value;
        }
        return res.status(422).json({
            succeded: false,
            data: {
                error: errorObject
            }
        });
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
        isNumeric: {
            errorMessage: "Number ifade olmalı"
        },
        custom: {
            options: async (value) => {
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
    if (!errors.isEmpty()) {
        const errorObject = {};
        for (let i = 0; i < errors.errors.length; i++) {
            const key = errors.errors[i].path;
            const value = errors.errors[i].msg;
            errorObject[key] = value;
        }
        return res.status(422).json({
            succeded: false,
            data: {
                error: errorObject
            }
        });
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