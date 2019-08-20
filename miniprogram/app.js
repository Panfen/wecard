App({

  globalData: {
    appid: '',
    secret: '',
    userInfo: null
  },

  onLaunch: function () {

    const that = this;

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          /*
          const data = that.globalData;
          const url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + data.appid + '&secret=' + data.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
          wx.request({
            url: url,
            data: {},
            method: 'GET',
            success: function (res) {
              
            }
          });
        */
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
  }
})
