const { uploadImage } = require('../../utils/util.js')


Page({
  data: {
    currentCard: {
      name: '',
      position: '',
      company: '',
      phone: '',
      location: '', 
      email: '',
      pattern: 'pattern1',
      background_url: '',
      background_fileId: '',
      avatar_url: '',
      avatar_fileId: ''
    },
    act: 'add'
  },

  onLoad: function (options) {
    // 加载名片
    if (options.card_id) {
      this.setData({act: 'update'})
      wx.cloud.callFunction({
        name: 'getCardById',
        data: {
          _id: options.card_id
        },
        success: res => {
          const currentCard = res.result.data[0]
          currentCard._isrecommend = false
          delete currentCard._openid
          this.setData({
            currentCard
          })
        },
        fail: err => {
          console.error('[数据库] [云函数查询记录] 失败：', err)
        }
      })
    }
    // 新建名片
    else if (options.action) {
      this.setData({
        currentCard: { pattern: 'pattern1', avatar_url: ''}
      })
    }

    const eventChannel = this.getOpenerEventChannel()

    eventChannel.on('acceptScanCardData', data => {
      const info = data.data
      console.log(info)
      if (info.NAME.length > 0) this.setCurrentCard(this, 'name', info.NAME)
      if (info.TITLE.length > 0) this.setCurrentCard(this, 'position', info.TITLE)
      if (info.MOBILE.length > 0) this.setCurrentCard(this, 'phone', info.MOBILE)
      if (info.COMPANY.length > 0) this.setCurrentCard(this, 'company', info.COMPANY)
      if (info.ADDR.length > 0) this.setCurrentCard(this, 'location', info.ADDR)
      if (info.EMAIL.length > 0) this.setCurrentCard(this, 'email', info.EMAIL)
    })
  },

  onChoosePattern: function (event) {
    this.setCurrentCard(this, 'pattern', event.currentTarget.dataset.pattern)
  },

  onInputHandle: function (event) {
    this.setCurrentCard(this, event.currentTarget.dataset.field, event.detail.value)
  },

  // 上传头像或背景图
  onUploadImg: function (e) {
    const that = this
    const type = e.currentTarget.dataset.type
    uploadImage().then((filePath, fileId) => {
      that.setCurrentCard(that, type == 'avatar' ? 'avatar_url' : 'background_url', filePath)
      that.setCurrentCard(that, type == 'avatar' ? 'avatar_fileId' : 'background_fileId', fileId)
    })
  },

  // 设置currentCard某一项
  setCurrentCard: function (that, key, value) {
    const currentCard = that.data.currentCard
    currentCard[key] = value
    that.setData({
      currentCard
    })
  },



  onCardReset: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  onCardSubmit: function (e) {
    const postData = { ...e.detail.value, ...this.data.currentCard }
    console.log(JSON.stringify(postData, null, 2))
    let flag = true
    Object.keys(postData).forEach(key => {
      if (postData[key] === '') {
        this.showEmptyWarning(key)
        flag = false
      }
    })
    if (flag) {
      const db = wx.cloud.database();
      if (this.data.act === 'add') {
        // 添加记录
        db.collection('cards').add({
          data: postData,
          success: res => {
            wx.showToast({
              title: '新增记录成功'
            })
            wx.navigateBack({
              delta: 1
            })
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '新增记录失败'
            })
          }
        })
      }
       else {
         // 更新记录
        const _id = this.data.currentCard._id
        delete this.data.currentCard._id
        db.collection('cards').doc(_id).update({
          data: {...this.data.currentCard},
          success: res => {
            wx.showToast({
              title: '更新记录成功'
            })
            wx.navigateBack({
              delta: 1
            })
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '更新记录失败'
            })
          }
        })
       }
    }
  },

  showEmptyWarning: function (type) {
    wx.showToast({
      icon: 'none',
      title: this.data.card[type] + '不能为空!'
    })
  }
  
})