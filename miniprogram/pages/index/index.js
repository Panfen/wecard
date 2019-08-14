//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    mycard: {},
    nocard: false
  },

  onLoad: function() {

  },

  /**
    * 生命周期函数--监听页面初次渲染完成
    */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    this.getMyCard()
  },

  getMyCard: function () {
    wx.showLoading({
      title: '数据加载中',
    })
    const db = wx.cloud.database()
    db.collection('cards').where({
      _openid: 'oNPv50Aht_HLlkyfpsgIYbTV1z_U'  // 待修改
    }).get({
      success: res => {
        console.log(res)
        if (res.data.length !== 0) {
          const card = res.data[0]
          card._isrecommend = 0
          this.setData({
            mycard: card
          })
        } else {
          this.setData({ nocard: true })
        }
        wx.hideLoading()
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
    // 腾讯云OCR名片识别接口：https://cloud.tencent.com/document/product/866/36214
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
