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

  onShareAppMessage: function() {
    return {
      title: this.data.currentCard.name + '的名片',
      path: '/pages/cardDetail/cardDetail?card_id=' + this.data.currentCard._id,
      imageUrl: 'http://img0.imgtn.bdimg.com/it/u=2989671597,4007587093&fm=26&gp=0.jpg'
    }
  }

})