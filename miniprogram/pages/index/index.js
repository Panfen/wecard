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
    wx.showLoading({
      title: '数据加载中',
    })
    this.getMyCard();
    wx.hideLoading()
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
  },

  getMyCard: function () {
    const db = wx.cloud.database()
    db.collection('cards').where({
      _openid: 'oNPv50Aht_HLlkyfpsgIYbTV1z_U'  // 待修改
    }).get({
      success: res => {
        const card = res.data[0]
        card._isrecommend = 0
        this.setData({
          // mycard: card
        })
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }    
    })
  },

  onhandCard: function() {
    
  },

  onEditCard: function(e) {
    wx.navigateTo({
      url: '../newCard/newCard?card_id=' + e.currentTarget.dataset.id,
    })
  },

  onCreateCard: function () {
    wx.navigateTo({
      url: '../newCard/newCard?action=new'
    })
  },

  onScanCard: function () {
    /*
    wx.scanCode({
      success: res => {
        wx.showToast({
          title: res.result,
        })
      }
    })
    */

    wx.navigateTo({
      url: '../scanCard/scanCard'
    })
  }

})
