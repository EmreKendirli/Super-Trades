import tryCatch from "../utils/tryCatch.js"
import AppError from "../utils/appError.js";
import Shares from "../models/sharesModel.js";
import TradeHistory from "../models/tradeHistoryModel.js";
import UserShares from "../models/userSharesModel.js";

const addShares = tryCatch(async (req, res) => {
    let { name, description, price, totalSupply } = req.body
    const user_id = req.user.id
    name = name.toUpperCase()
    const numericPrice = price.toFixed(2);
    const data = await Shares.create({ user_id, name, description, price: numericPrice, totalSupply, availableShares: totalSupply })

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

    const checkTradeHistoryPromise =  tradehistoryDelete(id)
    const checkUserSharesPromise =  userSharesDelete(id)

    const [checkTradeHistory,checkUserShares] = await Promise.all([checkTradeHistoryPromise,checkUserSharesPromise])
    if (!checkTradeHistory || !checkUserShares) {
        throw new AppError("Silme işleminde hata ile karşılaşıldı",404)
    }
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
    const check = await updatePriceHourly(id)
    if (!check) {
        res.status(422).json({
            succeded: false,
            data: {
                message: "Fiyatı saate bir defa güncelleyebilirsiniz"
            }
        })
    }
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
async function updatePriceHourly(id) {
    const data = await Shares.findOne({
        where: {
            id: id
        }
    })
    const date = new Date()
    // Tarih farkını saniye cinsinden hesapla
    const timeDifferenceInSeconds = Math.abs((date - data.updatedAt) / 1000);

    // Fark 1 saatten fazla ise true, değilse false döndür
    return timeDifferenceInSeconds >= 3600;
}
async function tradehistoryDelete(id) {
    try {
        const result = await TradeHistory.destroy({
            where: {
                shares_id: id,
            },
        });
        return true
    } catch (error) {
        return false
    }

}
async function userSharesDelete(id) {
    try {
        const result = await UserShares.destroy({
            where: {
                shares_id: id,
            },
        });
        return true
    } catch (error) {
        return false
    }

}
const SharesDefault = {
    addShares,
    sharesFindAll,
    bringAShares,
    sharesDelete,
    sharesPriceUpdate
}
export default SharesDefault