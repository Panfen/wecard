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
    this.uploadImage(e.currentTarget.dataset.type)
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
  uploadImage: function (type) {
    // 选择图片
    const that = this;
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
        wx.cloud.uploadFile({
          cloudPath: type + filePath.match(/\.[^.]+?$/)[0],
          filePath,
          success: res => {
            that.getPublicImgUrl(res.fileID, type)
            wx.hideLoading()
            wx.showToast({
              title: '上传成功啦'
            })
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

  onCardReset: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  getPublicImgUrl: function(fileId, type) {
    const that = this
    wx.cloud.getTempFileURL({
      fileList: [fileId],
      success: res => {
        console.log(res)
        that.setCurrentCard(that, type == 'avatar' ? 'avatar_url' : 'background_url', res.fileList[0].tempFileURL)
      },
      fail: err => {
        console.log('获取图片真实链接失败')
      }
    })
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