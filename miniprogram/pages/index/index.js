const { uploadImage, getPublicImageUrl } = require('../../utils/util.js')

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
    nocard: false
  },

  onLoad: function() {
    this.getMyCard()
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
        getPublicImageUrl(card.avatar_fileId).then(realUrl => {
          card.avatar_url = realUrl
          this.setData({
            mycard: {...this.data.mycard, ...card}
          })
        })
      } else {
        this.setData({ nocard: true })
      }
      wx.hideLoading()
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

  onScanCard: function() {
    wx.navigateTo({
      url: '../scanCard/scanCard'
    })
  }

})
