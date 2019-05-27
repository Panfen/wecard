// miniprogram/pages/cardDetail/cardDetail.js
Page({
  data: {
    currentCard: {}
  },

  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'getCardById',
      data: {
        _id: options.card_id
      },
      success: res => {
        this.setData({
          currentCard: res.result.data[0]
        })
      },
      fail: err => {
        console.error('[数据库] [云函数查询记录] 失败：', err)
      }
    })
  },

})