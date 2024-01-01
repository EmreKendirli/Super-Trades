import { checkSchema, validationResult } from "express-validator";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
const userRegisterValidate = [checkSchema({
    email: {
        isEmail: {
            errorMessage: "Lütfen geçerli bir e-posta giriniz."
        },
        notEmpty: {
            errorMessage: "E-Posta boş geçilemez.",
        },
        custom: {
            options: async (value) => {
                const check = await User.findOne({
                    where: {
                        email: value
                    },
                });
                if (check) {
                    return Promise.reject();
                }
            },
            errorMessage: "Girmiş Oldugunuz E-mail Sisteme Kayıtlı",
        },
    },
    firstName: {
        notEmpty: {
            errorMessage: "İsim boş geçilemez.",
        },
        isString: {
            errorMessage: "İsim String bir ifade Olmalıdır.",
        }
    },
    lastName: {
        notEmpty: {
            errorMessage: "Soy İsim boş geçilemez.",
        },
        isString: {
            errorMessage: "Soy isim String bir ifade Olmalıdır.",
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
    identityNumber: {
        notEmpty: {
            errorMessage: "TC Kimlik No boş geçilemez.",
        },
        isString: { errorMessage: "Şifre string bir ifade olmalı" },
        isLength: {
            options: { min: 11, max: 11 },
            errorMessage: "TC Kimlik No 11 karakter olmalı.",
        },
        custom: {
            options: async (value) => {
                const check = await User.findOne({
                    where: {
                        identityNumber: value
                    },
                });
                if (check) {
                    return Promise.reject();
                }
            },
            errorMessage: "Girmiş Oldugunuz TC Sisteme Kayıtlı",
        },
    },
    birthYear: {
        notEmpty: {
            errorMessage: "Dogum Yılı boş geçilemez.",
        }
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
const userLoginValidate = [checkSchema({
    email: {
        isEmail: {
            errorMessage: "Lütfen geçerli bir e-posta giriniz."
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
const resetPasswordDataValidate = [checkSchema({
    password: {
        exists: {
            errorMessage: "Lütfen Yeni Şifrenizi Giriniz"
        },
        isLength: {
            options: {
                min: 8
            },
            errorMessage: "Şifreniz en az 8 karakter içermelidir",
        },
    },
    confirm_password: {
        custom: {
            options: (value, {
                req
            }) => {
                if (String(value) !== String(req.body.password)) {
                    return false
                } else {
                    return true
                }
            },
            errorMessage: "Girmiş olduğunuz şifreler uyuşmamaktadır."
        }

    }
}),

(req, res, next) => {
    const errors = validationResult(req)
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
    }
    else {
        next();
    }
}
]
const userUpdateValidate = [checkSchema({
    email: {
        isEmail: {
            errorMessage: "Lütfen geçerli bir e-posta giriniz."
        },
        notEmpty: {
            errorMessage: "E-Posta boş geçilemez.",
        },
        custom: {
            options: async (value, { req }) => {
                const check = await User.findOne({
                    where: {
                        email: value
                    },
                });
                if (check.id !== req.user.id) {
                    return Promise.reject();
                }
            },
            errorMessage: "Girmiş Oldugunuz E-mail Sisteme Kayıtlı",
        },
    },
}),

(req, res, next) => {
    const errors = validationResult(req)
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
    }
    else {
        next();
    }
}
]
const UserValidations = {
    userRegisterValidate,
    userLoginValidate,
    resetPasswordDataValidate,
    userUpdateValidate
};

export default UserValidations;