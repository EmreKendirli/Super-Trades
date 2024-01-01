import tryCatch from "../utils/tryCatch.js"
import AppError from "../utils/appError.js";
import TradeHistory from "../models/tradeHistoryModel.js";
import Shares from "../models/sharesModel.js";
import { Sequelize } from 'sequelize';
import UserShares from "../models/userSharesModel.js"
import UserController from "./userController.js";
import User from "../models/userModel.js"


const buyShares = tryCatch(async (req, res) => {
    const shares_id = req.params.id
    const user_id = req.user.id
    const quantity = req.body.quantity

    // İstenilen miktar kadar stockta varmı yokmu kontrol ediliyor
    const check = await stockController(shares_id, quantity)
    if (check) {
        return res.status(422).json({
            succeded: false,
            data: {
                message: "Alınmak istenen miktarda hisse bulunmamaktadır."
            }
        })
    }

    // Stocktan istenilen miktar kadar düşürülüyor
    const stockCheck = await processStockDrop(shares_id, quantity, "buy")
    if (!stockCheck) {
        throw new AppError("Stok düşürme işleminde hata olultu", 404)
    }

    const shares = await Shares.findOne({
        where: {
            id: shares_id
        }
    })
    const totalPricePaid = quantity * shares.price
    const newData = {
        user_id,
        shares_id,
        quantity: quantity,
        type: "buy",
        totalPricePaid
    }

    const dataPromise = TradeHistory.create(newData)

    const resultPromise = processUserShares(user_id, shares_id, quantity, "buy")

    const [data, result] = await Promise.all([dataPromise, resultPromise])

    res.status(200).json({
        succeded: true,
        data: {
            data,
            message: "Hisse Alımı  Başarılı Şekilde Gerçekleşti"
        }
    })
})
const sellShares = tryCatch(async (req, res) => {
    const shares_id = req.params.id
    const quantity = req.body.quantity
    const user_id = req.user.id

    //Kullanıcının satmak istediği kadar hisse varmı kontrol ediyor
    const hasEnoughSharesCheck = await hasEnoughShares(user_id, shares_id, quantity)
    if (!hasEnoughSharesCheck) {
        return res.status(422).json({
            succeded: false,
            data: {
                message: "Kullanıcı yeterli hisse senedine sahip değil."
            }
        })
    }

    // Stocktan istenilen miktar kadar artırılıyor
    const stockCheck = await processStockDrop(shares_id, quantity, "sell")
    if (!stockCheck) {
        throw new AppError("Stok artırma işleminde hata olultu", 404)
    }

    const shares = await Shares.findOne({
        where: {
            id: shares_id
        }
    })
    const totalPricePaid = quantity * shares.price
    const newData = {
        user_id: req.user.id,
        shares_id: shares_id,
        quantity: quantity,
        type: "sell",
        totalPricePaid
    }

    const dataPromise = TradeHistory.create(newData)
    //Kullanıcı hisse miktarını düzenliyor
    const resultPromise = processUserShares(user_id, shares_id, quantity, "sell")

    const [data, result] = await Promise.all([dataPromise, resultPromise])
    res.status(200).json({
        succeded: true,
        data: {
            data,
            message: "Hisse Satımı Başarışı Şekilde Gerçekleşti"
        }
    })
})
async function stockController(id, quantity) {
    const data = await Shares.findOne({
        where: {
            id: id
        }
    })

    let same = false

    if (data.availableShares < quantity) {
        same = true
    }
    return same
}
async function processStockDrop(id, quantity, type) {
    let updatedRowCount
    if (type === "buy") {
        [updatedRowCount] = await Shares.update({
            availableShares: Sequelize.literal(`"availableShares" - ${quantity}`),
        },
            {
                where: {
                    id: id,
                },
            });
    } else if (type === "sell") {
        [updatedRowCount] = await Shares.update({
            availableShares: Sequelize.literal(`"availableShares" + ${quantity}`),
        },
            {
                where: {
                    id: id,
                },
            });
    }
    if (updatedRowCount > 0) {
        return true
    } else {
        return false
    }
}
async function processUserShares(user_id, shares_id, quantity, type) {
    const shares = await UserShares.findOne({
        where: {
            user_id: user_id,
            shares_id: shares_id
        }
    })
    if (shares) {
        if (type === "buy") {
            const [updatedRowCount] = await UserShares.update({
                quantity: Sequelize.literal(`"quantity" + ${quantity}`),
            },
                {
                    where: {
                        id: shares.id,
                    },
                }
            );
        } else if (type === "sell") {
            const [updatedRowCount] = await UserShares.update({
                quantity: Sequelize.literal(`"quantity" - ${quantity}`),
            },
                {
                    where: {
                        id: shares.id,
                    },
                }
            );
        }

    } else {
        const create = await UserShares.create({
            user_id: user_id,
            shares_id: shares_id,
            quantity: quantity,
        })
    }
}
async function hasEnoughShares(user_id, shares_id, quantity) {
    const shares = await UserShares.findOne({
        where: {
            user_id: user_id,
            shares_id: shares_id
        }
    })
    if (shares) {
        let same = true
        shares.quantity >= quantity ? same = true : same = false
        return same
    } else {
        return false
    }
}
const bulkTradeHistoryApi = tryCatch(async (req, res) => {
    const { users, share } = req.body
    const dataShare = []
    let checkSell = false
    const check = await stockController(share.buy.shares_id, share.buy.quantity * users.length)
    if (check) {
        return res.status(422).json({
            succeded: false,
            data: {
                message: "Alınmak istenen miktarda hisse bulunmamaktadır."
            }
        })
    }
    await Promise.all(users.map(async (id) => {
        const sharesBuy = await Shares.findOne({
            where: {
                id: share.buy.shares_id
            }
        })
        const totalPricePaidBuy = share.buy.quantity * sharesBuy.price
        const newDataBuy = {
            user_id: id,
            shares_id: share.buy.shares_id,
            quantity: share.buy.quantity,
            type: "buy",
            totalPricePaid: totalPricePaidBuy
        }
        dataShare.push(newDataBuy)

        //sell
        const sharesSell = await Shares.findOne({
            where: {
                id: share.sell.shares_id
            }
        })
        const totalPricePaidSell = share.sell.quantity * sharesSell.price
        const newDataSell = {
            user_id: id,
            shares_id: share.sell.shares_id,
            quantity: share.sell.quantity,
            type: "sell",
            totalPricePaid: totalPricePaidSell
        }
        dataShare.push(newDataSell)
        const hasEnoughSharesCheck = await hasEnoughShares(id, share.sell.shares_id, share.sell.quantity)
        if (!hasEnoughSharesCheck) {
            checkSell = true
        }
    }))
    //Kullanıcıların Yeterli Hissesi varmı kontrol ediyor
    if (checkSell) {
        return res.status(422).json({
            succeded: false,
            data: {
                message: "Kullanıcı yeterli hisse senedine sahip değil."
            }
        })
    }
    const createTradeHistory = await TradeHistory.bulkCreate(dataShare)
    if (!createTradeHistory) {
        throw new AppError("İstenmeyen Hata oluştu Lütfen daha sonra tekrar deneyiniz", 404)
    }
    // Stocktan istenilen miktar kadar düşürülüyor
    const stockCheckBuy = await processStockDrop(share.buy.shares_id, share.buy.quantity * users.length, "buy")
    if (!stockCheckBuy) {
        throw new AppError("Stok düşürme işleminde hata olultu", 404)
    }
    // Stocktan istenilen miktar kadar artırılıyor
    const stockCheckSell = await processStockDrop(share.sell.shares_id, share.sell.quantity * users.length, "sell")
    if (!stockCheckSell) {
        throw new AppError("Stok artırma işleminde hata olultu", 404)
    }
    users.map(async (id) => {
        //Kullanıcı hisse miktarını düzenliyor
        const resultPromiseBuy = await processUserShares(id, share.buy.shares_id, share.buy.quantity, "buy")
        //Kullanıcı hisse miktarını düzenliyor
        const resultPromiseSell = await processUserShares(id, share.sell.shares_id, share.sell.quantity, "sell")
    })
    res.status(200).json({
        succeded: true,
        data: {
            data: createTradeHistory
        }
    })
})
const TradeHistoryController = {
    buyShares,
    sellShares,
    bulkTradeHistoryApi
}
export default TradeHistoryController