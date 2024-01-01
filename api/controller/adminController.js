import tryCatch from "../utils/tryCatch.js"
import AppError from "../utils/appError.js";
import Admin from "../models/adminModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const adminRegister = tryCatch(async (req, res) => {
    const { name, email, password } = req.body
    
    const data = await Admin.create({name,email,password})
    if (!data) {
        throw new AppError("İşlem Sırasında Hata ile karşılaşıldı. Lütfen daha sonra tekrar deneyiniz.",404) 
    }
    res.status(200).json({
        succeded:true,
        data:{
            data,
            message:"Admin Başarılı Şekilde Kayıt Oldu."
        }
    })
})
const adminLogin = tryCatch (async (req, res) => {
    const { email, password } = req.body;
    const user = await Admin.findOne({
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
                message: "Admin Bulunamadı"
            }
        })
    }
    if (same) {

        const token = await createToken(user.id);
        if (!token) {
            res.status(404).json({
                succeded: false,
                data:{
                    message: "Token Oluşturulamadı."
                }
            })
        }
        const users = await Admin.findOne({
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
const adminDelete = tryCatch (async (req, res) => {
    const adminId = req.params.id
    const deletedAdminCount = await Admin.destroy({
        where: {
            id: adminId,
        },
    });

    if (deletedAdminCount > 0) {
        res.status(200).json({
            succeded: true,
            data: {
                message: "Admin başarıyla silindi."
            }
        })
    } else {
        res.status(404).json({
            succeded: false,
            data: {
                message: "Belirtilen id\'ye sahip admin bulunamadı."
            }
        })
    }
})
const adminUpdate = tryCatch (async (req, res) => {
    const adminId = req.params.id

    const [updatedRowCount] = await Admin.update(req.body, {
        where: {
            id: adminId,
        },
    });

    if (updatedRowCount > 0) {
        res.status(200).json({
            succeded: true,
            data: {
                message: 'Admin başarıyla güncellendi.'
            }
        })
    } else {
        res.status(404).json({
            succeded: false,
            data: {
                message: "Belirtilen id\'ye sahip admin bulunamadı."
            }
        })
    }
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
const AdminController = {
    adminRegister,
    adminLogin,
    adminDelete,
    adminUpdate
}

export default AdminController