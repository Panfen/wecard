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
            console.log(res.fileID)
            resolve(filePath, res.fileID)
          },
          fail: e => {
            wx.hideLoading()
            wx.showToast({
              icon: 'none',
              title: '上传失败，请重试',
            })
            console.log(e)
            reject(e)
          }
        })
      },
      fail: e => {
        console.log(e)
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


/**
 * Bese64编码, https://www.cnblogs.com/Man-Dream-Necessary/p/8400376.html
 */
const base64_encode  = str => { // 编码，配合encodeURIComponent使用
    var c1, c2, c3;
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var i = 0, len = str.length, strin = '';
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            strin += base64EncodeChars.charAt(c1 >> 2);
            strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
            strin += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            strin += base64EncodeChars.charAt(c1 >> 2);
            strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
            strin += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        strin += base64EncodeChars.charAt(c1 >> 2);
        strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        strin += base64EncodeChars.charAt(c3 & 0x3F)
    }
    return strin;
}

module.exports = {
  uploadImage,
	getPublicImageUrl,
  base64_encode
}