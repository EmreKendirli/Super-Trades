import { checkSchema, validationResult } from "express-validator";

const tradeHistoryValidate = [checkSchema({
    quantity: {
        notEmpty: {
            errorMessage: "Satın alınacak miktar boş geçilemez.",
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
const TradeHistoryValidations = {
    tradeHistoryValidate,
};

export default TradeHistoryValidations;