import { checkSchema, validationResult } from "express-validator";
import Admin from "../models/adminModel.js";
import AppError from "../utils/appError.js";
const adminRegisterValidate = [checkSchema({
    email: {
        isEmail:{
            errorMessage:"Lütfen geçerli bir e-posta giriniz."
        },
        notEmpty: {
            errorMessage: "E-Posta boş geçilemez.",
        },
        custom: {
            options: async (value) => {
                const check = await Admin.findOne({
                    where: {
                        email:value
                    },
                });
                if (check) {
                    return Promise.reject();
                }
            },
            errorMessage: "Girmiş Oldugunuz E-mail Sisteme Kayıtlı",
        },
    },
    name: {
        notEmpty: {
            errorMessage: "İsim boş geçilemez.",
        },
        isString: {
            errorMessage: "İsim String bir ifade Olmalıdır.",
        }
    },
    password: {
        notEmpty: {
            errorMessage: "Şifre boş geçilemez.",
        },
        isString: { errorMessage: "Şifre string bir ifade olmalı" },
        isLength: {
            options: { min: 8 },
            errorMessage: "Şifre en az 8 karakter olmalı.",
        },
    },
}),
(req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
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
const adminLoginValidate = [checkSchema({
    email: {
        isEmail:{
            errorMessage:"Lütfen geçerli bir e-posta giriniz."
        },
        notEmpty: {
            errorMessage: "E-Posta boş geçilemez.",
        },
    },
    password: {
        notEmpty: {
            errorMessage: "Şifre boş geçilemez.",
        },
        isString: { errorMessage: "Şifre string bir ifade olmalı" },
        isLength: {
            options: { min: 8 },
            errorMessage: "Şifre en az 8 karakter olmalı.",
        },
    }
}),
(req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
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
const AdminValidations = {
    adminRegisterValidate,
    adminLoginValidate
};

export default AdminValidations;