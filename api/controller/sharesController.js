import tryCatch from "../utils/tryCatch.js"
import AppError from "../utils/appError.js";
import Shares from "../models/sharesModel.js";

const addShares = tryCatch(async (req, res) => {
    let { name, description, price, totalSupply } = req.body
    name = name.toUpperCase()
    const numericPrice = price.toFixed(2);
    console.log(numericPrice);
    const data = await Shares.create({ name, description, price: numericPrice,  totalSupply, availableShares: totalSupply })

    res.status(200).json({
        succeded: true,
        data: {
            data,
            message: "Hisse Başarışı Şekilde Eklendi"
        }
    })
})
const sharesFindAll = tryCatch(async (req, res) => {
    const data = await Shares.findAll({})
    if (!data) {
        throw new AppError("İşlem Sırasında Hata ile karşılaşıldı. Lütfen daha sonra tekrar deneyiniz.", 404)
    }
    res.status(200).json({
        succeded: true,
        data: {
            data,
            message: "Hisseler listelendi."
        }
    })
})
const bringAShares = tryCatch(async (req, res) => {
    const id = req.params.id
    const shares = await Shares.findOne({
        where: {
            id: id,
        },
    });
    if (!shares) {
        throw new AppError("İşlem Sırasında Hata ile karşılaşıldı. Lütfen daha sonra tekrar deneyiniz.", 404)
    }
    res.status(200).json({
        succeded: true,
        data: {
            data: shares,
            message: "Hisse listelendi."
        }
    })
})
const sharesDelete = tryCatch(async (req, res) => {
    const id = req.params.id
    const deletedUserCount = await Shares.destroy({
        where: {
            id: id,
        },
    });

    if (deletedUserCount > 0) {
        res.status(200).json({
            succeded: true,
            data: {
                message: "Hisse başarıyla silindi."
            }
        })
        console.log('Hisse başarıyla silindi.');
    } else {
        res.status(404).json({
            succeded: false,
            data: {
                message: "Belirtilen id\'ye sahip hisse bulunamadı."
            }
        })
        console.log('Belirtilen id\'ye sahip hisse bulunamadı.');
    }
})
const sharesPriceUpdate = tryCatch(async (req, res) => {
    const id = req.params.id
    const { price } = req.body
    const [updatedRowCount] = await Shares.update({
        price,
    }, {
        where: {
            id: id,
        },
    });

    if (updatedRowCount > 0) {
        res.status(200).json({
            succeded: true,
            data: {
                message: 'Hisse başarıyla güncellendi.'
            }
        })
        console.log('Hisse başarıyla güncellendi.');
    } else {
        res.status(404).json({
            succeded: false,
            data: {
                message: "Belirtilen id\'ye sahip hisse bulunamadı."
            }
        })
        console.log('Belirtilen id\'ye sahip hisse bulunamadı.');
    }
})

const SharesDefault = {
    addShares,
    sharesFindAll,
    bringAShares,
    sharesDelete,
    sharesPriceUpdate
}
export default SharesDefault