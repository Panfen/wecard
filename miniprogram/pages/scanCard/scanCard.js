// miniprogram/pages/scanCard/scanCard.js
Page({

  data: {

  },

  onLoad: function (options) {

  },

  onScanCard: function (e) {
    wx.showToast({
      title: e.detail.result
    })
  }

  
})