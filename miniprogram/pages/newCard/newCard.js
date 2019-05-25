Page({
  data: {
    currentPattern: 'pattern3',
    defaultCard: {
      name: '名字',
      position: '职位',
      company: '公司名称',
      phone: '电话号码',
      location: '公司地址家庭住址',
      email: '电子邮件',
      avatar_url: 'http://img1.imgtn.bdimg.com/it/u=1975246254,621884563&fm=26&gp=0.jpg'
    }
  },

  onLoad: function (options) {

  },

  onChoosePattern: function (event) {
    this.setData({
      currentPattern: event.currentTarget.dataset.pattern
    })
  }

  
})