/**
 * 上传图片返回本地路径和云文件的fileId
 */
const uploadImage = () => {
  return new Promise((resolve, reject) => {
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
          cloudPath: 'wecard' + filePath.match(/\.[^.]+?$/)[0],
          filePath,
          success: res => {
            wx.hideLoading()
            wx.showToast({
              title: '上传成功啦'
            })
            resolve(filePath, res.fileID)
          },
          fail: e => {
            wx.hideLoading()
            wx.showToast({
              icon: 'none',
              title: '上传失败，请重试',
            })
            reject(e)
          }
        })
      },
      fail: e => {
        reject(e)
      }
    })
  })
}


/**
 * 用云文件ID换取真实链接，可自定义有效期，默认一天且最大不超过一天。一次最多取50个。
 */
const getPublicImageUrl = fileId => {
  return new Promise((resolve, reject) => {
    wx.cloud.getTempFileURL({
      fileList: [fileId],
      success: res => {
        resolve(res.fileList[0].tempFileURL)
      },
      fail: err => {
        reject('err')
      }
    })
  })
}

module.exports = {
  uploadImage,
	getPublicImageUrl
}