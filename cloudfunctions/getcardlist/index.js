// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const result = await db.collection('cards').where({
    _ispublic: true
  }).get()
  const cards = result.data
  const res = await cloud.getTempFileURL({
    fileList: ['cloud://wecard-9mzfv.7765-wecard-9mzfv-1259286379/avatar.jpg']
  })
  cards.map(card => {
    // const res = await cloud.getTempFileURL({
    //   fileList: [card.avatar_fileId]
    // })
    // card.avatar_url = res.fileList[0].tempFileURL
  })
  return cards
}