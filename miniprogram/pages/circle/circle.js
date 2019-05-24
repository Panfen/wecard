// miniprogram/pages/circle/circle.js
Page({
  data: {
    cardList: []
  },

  onLoad: function (options) {
    // this.getCardList()
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
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})