//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    mycard: {}
  },

  onLoad: function() {
   this.getMyCard()
  },

  getMyCard: function () {
    const db = wx.cloud.database()
    db.collection('cards').where({
      _openid: 'oNPv50Aht_HLlkyfpsgIYbTV1z_U'
    }).get({
      success: res => {
        this.setData({
          mycard: res.data[0]
        })
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  onhandCard: function() {
    
  },

  onEditinfo: function() {
    wx.navigateTo({
      url: '../cardDetail/cardDetail',
    })
  }

})
