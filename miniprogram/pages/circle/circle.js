const { getPublicImageUrl } = require('../../utils/util.js')

Page({
  data: {
    cardList: []
  },

  onLoad: function (options) {
    
  },

  onShow: function () {
    wx.showLoading({
      title: '列表加载中',
    })
    this.getCardList()
  },

  getCardList: function () {
    wx.cloud.callFunction({
      name: 'getCardList',
      data: {}, 
      success: res => {
        this.setData({
          cardList: res.result.data
        })
      },
      fail: err => {
        console.error('[数据库] [云函数查询记录] 失败：', err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  onViewCard: function (e) {
    wx.navigateTo({
      url: '../cardDetail/cardDetail?card_id=' + e.currentTarget.dataset.id,
    })
  },

  OnSearchCard: function (e) {
    const searchName = e.detail.value.trim()
    if (searchName) {
      const db = wx.cloud.database()
      db.collection('cards').where({
        name: {
          $regex: '.*' + searchName,
          $options: 'i'
        }
      }).get({
        success: res => {
          this.setData({
            cardList: res.data
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
    }
    else {
      this.getCardList()
    }
  }
})