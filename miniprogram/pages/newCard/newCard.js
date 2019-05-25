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
      avatar_url: 'http://img1.imgtn.bdimg.com/it/u=1975246254,621884563&fm=26&gp=0.jpg'
    }
  },

  onLoad: function (options) {

  },

  onChoosePattern: function (event) {
    const currentCard = this.data.currentCard
    currentCard.pattern = event.currentTarget.dataset.pattern
    this.setData({
      currentCard
    })
  },

  // 上传头像
  onUploadAvatar: function () {
    uploadImage(function(res){
      this.setData({})
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
            console.log(JSON.stringify(res, null, 2))
            cb(res)
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