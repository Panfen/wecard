Page({

  data: {

  },

  onLoad: function (options) {

  },

  takePhoto: function () {
  	const ctx = wx.createCameraContext()
  	ctx.takePhoto({
  		quality: 'high',
  		success: res => {
  			wx.showLoading({
  				title: '识别中, 请稍等...'
  			})
  			this.uploadFile(res.tempImagePath)
  		}
  	})
  },

  choosePhoto: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePath = res.tempFilePaths[0]
        wx.showLoading({
          title: '识别中, 请稍等...'
        })
        this.uploadFile(tempFilePath)
      },
    })
  },

  uploadFile: function (path) {
    wx.cloud.uploadFile({
    	filePath: path,
      cloudPath: path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
    }).then(res => {
      wx.cloud.callFunction({
        name: 'ocr',
        data: {
          fileID: res.fileID
        }
      }).then(res => {
        wx.hideLoading()
        const result = res.result.words_result;
        wx.navigateTo({
          url: '../newCard/newCard?action=new',
          success: res => {
            res.eventChannel.emit('acceptScanCardData', { data: result })
          }
        })
      })
    })
  },

  error: e => {
  	wx.showToast({
      icon: 'none',
      title: '请允许使用相机功能'
    })
  }

})