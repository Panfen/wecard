// 云函数入口文件
const cloud = require('wx-server-sdk')
const AipOcrClient = require('baidu-aip-sdk').ocr

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const APP_ID = '17029974';
  const APP_KEY = 'IthFGfvqMx19VpDnCCiD9DWK';
  const SECRET_KEY = 'ofdkZoOghpNOK5iy049hAwnOtrhfhweT';
  const client = new AipOcrClient(APP_ID, APP_KEY, SECRET_KEY)
  const res = await cloud.downloadFile({fileID: event.fileID})
  const image = res.fileContent.toString('base64')
  return await client.businessCard(image)
}