// miniprogram/pages/circle/circle.js
Page({
  data: {
    cardList: []
  },

  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'getcardlist',
      data: {},
      success: res => {
        this.setData({
          cardList: res.result.data
        })
      }, 
      fail: err => {
        console.error('[数据库] [云函数查询记录] 失败：', err)
      }
    })
  },

  getCardList: function () {
    const db = wx.cloud.database()
    db.collection('cards').where({
      _ispublic: 1
    }).get({
      success: res => {
        console.log(JSON.stringify(res.data, null, 2))
        this.setData({
          cardList: res.data
        })
      },
      fail: err => {
        console.error('数据库查询记录失败：', err)
      }
    })
  },

  onViewCard: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../cardDetail/cardDetail?card_id=' + e.currentTarget.dataset.id,
    })
  }
})