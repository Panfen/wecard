Page({
  data: {
    currentCard: {
      name: '名字',
      position: '职位',
      company: '公司名称',
      phone: '电话号码',
      location: '公司地址家庭住址',
      email: '电子邮件',
      pattern: 'pattern1',
      background_url: 'http://img0.imgtn.bdimg.com/it/u=2619623045,2062180631&fm=26&gp=0.jpg',
      avatar_url: 'http://img5.imgtn.bdimg.com/it/u=2290911925,3144166826&fm=26&gp=0.jpg'
    }
  },

  onLoad: function (options) {
    
  },

  onChoosePattern: function (event) {
    this.setCurrentCard(this, 'pattern', event.currentTarget.dataset.pattern)
  },

  // 上传头像
  onUploadAvatar: function () {
    const that = this
    that.uploadImage(function(res, imagePath){
      if (res.statusCode == 200) {
        that.setCurrentCard(that, 'avatar_url', imagePath)
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
            wx.showToast({
              title: '上传成功',
            })
            cb(res, filePath)
          },
          fail: e => {
            wx.showToast({
              icon: 'none',
              title: '上传失败，请重试',
            })
          },
          complete: () => {
            wx.hideLoading()
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
    console.log(e.detail.value)
  }
  
})