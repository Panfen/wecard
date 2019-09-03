// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
      page: 'pages/ardDetail/cardDetail?card_id=' + event._id,
    })
    return result
  } catch (err) {
    console.log('[Error] getUnlimited:'+ err)
    return err
  }
}