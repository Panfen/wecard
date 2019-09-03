const { uploadImage } = require('../../utils/util.js')

const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    mycard: {
      background_url: 'http://pic.51yuansu.com/pic3/cover/01/91/36/59829799f40f5_610.jpg'
    },
    nocard: false,
    qrcodeUrl: '',
    showModal: false
  },

  onLoad: function() {
    this.getMyCard();
    this.getQrcode();
  },

  backToIndex: function () {
    this.setData({ showModal: false });
  },

  getQrcode: function () {
    wx.cloud.callFunction({
      name: 'createQrcode',
      data: {
        _id: 'xxx'
      },
      success: res => {
        const base64 =  wx.arrayBufferToBase64(res.result.buffer)
        this.setData({ qrcodeUrl: base64})
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getMyCard()
  },

  getMyCard: function () {
    wx.showLoading({
      title: '数据加载中',
    })
    const db = wx.cloud.database()
    db.collection('cards').where({
      _openid: 'oNPv50Aht_HLlkyfpsgIYbTV1z_U'  // 待修改
    }).get().then(res => {
      if (res.data.length !== 0) {
        const card = res.data[0]
        card._isrecommend = 0
        this.setData({
          mycard: { ...this.data.mycard, ...card }
        })
      } else {
        this.setData({ nocard: true })
      }
      wx.hideLoading()
    })
  },

  onhandCard: function() {
    this.setData({ showModal: true });
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

  onScanCard: function() {
    wx.navigateTo({
      url: '../scanCard/scanCard'
    })
  }

})
