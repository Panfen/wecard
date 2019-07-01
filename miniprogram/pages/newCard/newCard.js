Page({
  data: {
    card:{
      name: '姓名',
      position: '职位',
      company: '公司',
      phone: '电话',
      location: '地址',
      email: '邮件',
      avatar_url: '头像'
    },
    currentCard: {
      name: '姓名',
      position: '职位',
      company: '公司',
      phone: '电话',
      location: '地址',
      email: '邮件',
      pattern: 'pattern1',
      background_url: '',
      avatar_url: '',
    }
  },

  onLoad: function (options) {
    // 加载名片
    if (options.card_id) {
      wx.cloud.callFunction({
        name: 'getCardById',
        data: {
          _id: options.card_id
        },
        success: res => {
          const currentCard = res.result.data[0];
          currentCard._isrecommend = false;
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
    that.uploadImage(function(res, imagePath){
      if (res.statusCode == 200) {
        that.setCurrentCard(that, e.currentTarget.dataset.type == 'avatar' ? 'avatar_url' : 'background_url', imagePath)
      }
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

  // 上传图片
  uploadImage: function (cb) {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '图片上传中',
        })
        const filePath = res.tempFilePaths[0]
        // 上传图片
        const cloudPath = 'wecard-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            wx.hideLoading()
            wx.showToast({
              title: '上传成功',
            })
            cb(res, filePath)
          },
          fail: e => {
            wx.hideLoading()
            wx.showToast({
              icon: 'none',
              title: '上传失败，请重试',
            })
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },

  onCancelCard: function () {

  },

  onCardSubmit: function (e) {
    const postData = { ...e.detail.value, ...this.data.currentCard }
    let flag = true
    Object.keys(this.data.card).forEach(key => {
      if (postData[key].length === 0) {
        this.showEmptyWarning(key)
        flag = false
      }
    })
    if (flag) {
      const db = wx.cloud.database();
      db.collection('cards').add({
        data: postData,
        success: res => {
          wx.showToast({
            title: '新增记录成功!',
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败!',
          })
          console.log(err)
        }
      })
    }
  },

  showEmptyWarning: function (type) {
    wx.showToast({
      icon: 'none',
      title: this.data.card[type] + '不能为空!'
    })
  }
  
})