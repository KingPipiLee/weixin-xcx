const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

//获取应用实例
const app = getApp()
Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        navUrl: '',
        userId:''
    },

    onLoad: function (options) {
        let that = this;
        if (wx.getStorageSync("navUrl")) {
            that.setData(
                {
                    navUrl: wx.getStorageSync("navUrl")
                }
            )
        } else {
            that.setData(
                {
                    navUrl: '/pages/index/index'
                }
            )
        }
    },
  onShareAppMessage: function () {
    return {
      title: 'NideShop',
      desc: '仿网易严选微信小程序商城',
      path: '/pages/auth/btnAuth/btnAuth?userId='+this.data.userId
    }
  },
    bindGetUserInfo: function (e) {
      console.log(e);
      console.log(wx.getStorageSync('parentId'));
        let that = this;
        wx.login({
            success: function (res) {
                if (res.code) {
                    //登录远程服务器
                    util.request(api.AuthLoginByWeixin, {
                        code: res.code,
                        userInfo: e.detail,
                        userId: wx.getStorageSync('parentId')
                        // parentId: wx.getStorageSync('parentId')
                    }, 'POST', 'application/json').then(res => {
                        if (res.errno === 0) {
                            //存储用户信息
                            wx.setStorageSync('userInfo', res.data.userInfo);
                            wx.setStorageSync('token', res.data.token);
                            wx.setStorageSync('userId', res.data.userId);
                            that.setData(
                              {
                                userId: wx.getStorageSync("userId")
                              }
                            )
                          // console.log(that.data.userId);

                        } else {
                            // util.showErrorToast(res.errmsg)
                            wx.showModal({
                                title: '提示',
                                content: res.errmsg,
                                showCancel: false
                            });
                        }
                    });
                }
            }
        });

        if (that.data.navUrl && that.data.navUrl == '/pages/index/index') {
            wx.switchTab({
                url: that.data.navUrl,
            })
        } else if (that.data.navUrl) {
            wx.redirectTo({
                url: that.data.navUrl,
            })
        }
    },

    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
})
