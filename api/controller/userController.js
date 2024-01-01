import User from "../models/userModel.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import axios from "axios";
import xml2js from "xml2js";
import tryCatch from "../utils/tryCatch.js"
import AppError from "../utils/appError.js";
import TradeHistory from "../models/tradeHistoryModel.js";
import Shares from "../models/sharesModel.js";
import UserShares from "../models/userSharesModel.js";
import { Sequelize } from 'sequelize';

const userFindAll = tryCatch (async (req, res) => {
    const data = await User.findAll({
        attributes: { exclude: ['password'] },
    })
    if (!data) {
        throw new AppError("İşlem Sırasında Hata ile karşılaşıldı. Lütfen daha sonra tekrar deneyiniz.",404) 
    }
    res.status(200).json({
        succeded: true,
        data:{
            data,
            message:"Kullanıcılar listelendi."
        }
    })
})
const bringAUser = tryCatch (async (req, res) => {
    const userId = req.params.id
    const user = await User.findOne({
        where: {
            id: userId,
        },
        attributes: { exclude: ['password'] }, // Şifre alanını hariç tut
    });
    if (!user) {
        throw new AppError("İşlem Sırasında Hata ile karşılaşıldı. Lütfen daha sonra tekrar deneyiniz.",404) 
    }
    res.status(200).json({
        succeded: true,
        data:{
            data:user,
            message:"Kullanıcı listelendi."
        } 
    })
})
const userDelete = tryCatch (async (req, res) => {
    const userId = req.params.id
    const deletedUserCount = await User.destroy({
        where: {
            id: userId,
        },
    });

    if (deletedUserCount > 0) {
        res.status(200).json({
            succeded: true,
            data: {
                message: "Kullanıcı başarıyla silindi."
            }
        })
        console.log('Kullanıcı başarıyla silindi.');
    } else {
        res.status(404).json({
            succeded: false,
            data: {
                message: "Belirtilen id\'ye sahip kullanıcı bulunamadı."
            }
        })
        console.log('Belirtilen id\'ye sahip kullanıcı bulunamadı.');
    }
})
const userUpdate = tryCatch (async (req, res) => {
    const userId = req.params.id

    const [updatedRowCount] = await User.update(req.body, {
        where: {
            id: userId,
        },
    });

    if (updatedRowCount > 0) {
        res.status(200).json({
            succeded: true,
            data: {
                message: 'Kullanıcı başarıyla güncellendi.'
            }
        })
        console.log('Kullanıcı başarıyla güncellendi.');
    } else {
        res.status(404).json({
            succeded: false,
            data: {
                message: "Belirtilen id\'ye sahip kullanıcı bulunamadı."
            }
        })
        console.log('Belirtilen id\'ye sahip kullanıcı bulunamadı.');
    }
})
const userRegister = tryCatch (async (req, res) => {
    const { firstName, lastName, email, password, identityNumber, birthYear } = req.body

    const isValid = await identityNumberVerification(
        identityNumber,
        firstName,
        lastName,
        birthYear
    );
    if (!isValid) {
        return res.status(422).json({
            succeded: false,
            data: {
                message: "Kimlik Bilgileriniz Uyuşmuyor.",
            }
        });
    }


    const data = await User.create({ firstName, lastName, email, password, identityNumber, birthYear })
   
    if (!data) {
        throw new AppError("İşlem Sırasında Hata ile karşılaşıldı. Lütfen daha sonra tekrar deneyiniz.",404) 
    }

    res.status(200).json({
        succeded: true,
        data:{
            message: "Kullanıcı Başarılı Şekilde Kayıt Oldu"
        }
    })
})
const userLogin = tryCatch (async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({
        where: {
            email: email,
        },
    });

    let same = false;
    if (user) {
        same = await bcrypt.compare(password, user.password);
    } else {
        res.status(404).json({
            succeded: false,
            data:{
                message: "Kullanıcı Bulunamadı"
            }
        })
    }
    if (same) {
        console.log(user.id);//user.dataValues

        const token = await createToken(user.id);
        if (!token) {
            res.status(404).json({
                succeded: false,
                data:{
                    message: "Token Oluşturulamadı."
                }
            })
        }
        console.log(token);
        const users = await User.findOne({
            where: {
                email: email,
            },
            attributes: { exclude: ['password'] }, // Şifre alanını hariç tut
        });
        return res.status(200).json({
            succeded: true,
            data: {
                token,
                user: users,
                message:"Giriş Başarılı."
            },
        });
    } else {
        res.status(422).json({
            succeded: false,
            data: {
                message: "Şifreniz yanlış",
            },
        });
    }
    
});

//kullanıcının alım satım geçmişi getirilir
const getTradeHistory = tryCatch(async (req,res)=>{
    const userId = req.user.id
    const data = await TradeHistory.findAll({
        where:{
            user_id:userId
        },
        include: Shares,
    })
    if (!data) {
        throw new AppError("İşlem Sırasında Hata ile karşılaşıldı. Lütfen daha sonra tekrar deneyiniz.",404) 
    }

    res.status(200).json({
        succeded:true,
        data:{
            data,
            message:"Başarılı şekilde listelendi"
        }
    })
})
//kullanıcının elindeki hisseleri getirir
const getUserShares = tryCatch (async (req,res)=>{
    const userId = req.user.id
    const data = await UserShares.findAll({
        where:{
            user_id:userId,
            quantity: {
                [Sequelize.Op.gt]: 0, // Op.gt, "greater than" anlamına gelir
              },
        },
        include: Shares,
    })
    if (!data) {
        throw new AppError("İşlem Sırasında Hata ile karşılaşıldı. Lütfen daha sonra tekrar deneyiniz.",404) 
    }

    res.status(200).json({
        succeded:true,
        data:{
            data,
            message:"Başarılı şekilde listelendi"
        }
    })
})
const createToken = async (id) => {
    return jwt.sign(
        {
            id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );
};
//TC Kimlik No Kontrol
async function identityNumberVerification(tc, firstName, lastName, birthYear) {
    let data = `<?xml version="1.0" encoding="utf-8"?>\r\n<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\r\n  <soap12:Body>\r\n    <TCKimlikNoDogrula xmlns="http://tckimlik.nvi.gov.tr/WS">\r\n      <TCKimlikNo>${tc}</TCKimlikNo>\r\n      <Ad>${firstName}</Ad>\r\n      <Soyad>${lastName}</Soyad>\r\n      <DogumYili>${birthYear}</DogumYili>\r\n    </TCKimlikNoDogrula>\r\n  </soap12:Body>\r\n</soap12:Envelope>`;

    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx",
        headers: {
            "Content-Type": "application/soap+xml",
            Cookie:
                "TS0193588c=01e4b3044298c893548bd93ae566bcb9d3c39aa3f1d7d620b6132cc94ca2993988f25436901f49b672d8b0041b83bfe3ccbddd0264",
        },
        data: data,
    };

    const response = await axios.request(config);
    return new Promise((resolve, reject) => {
        const parser = new xml2js.Parser();

        parser.parseString(response.data, (err, result) => {
            if (err) {
                reject(err);
            } else {
                const tckimlikResult =
                    result["soap:Envelope"]["soap:Body"][0][
                    "TCKimlikNoDogrulaResponse"
                    ][0]["TCKimlikNoDogrulaResult"][0];
                resolve(tckimlikResult === "true");
            }
        });
    });
}
const UserController = {
    userFindAll,
    userRegister,
    userLogin,
    bringAUser,
    userDelete,
    userUpdate,
    getTradeHistory,
    getUserShares
}

export default UserController