<template>
  <van-row type="flex"
           justify="center">
    <van-col span="18">
      <div class="panel">
        <div class="text">验收已成功提交，{{second}}秒后关闭界面...</div>
        <div class="button">
          <van-button type="primary"
                      size="small"
                      @click.native="close">关闭</van-button>
        </div>
      </div>
    </van-col>
  </van-row>
</template>

<script>

export default {
  name: 'Close',
  data () {
    return {
      second: 3
    }
  },
  mounted () {
    const _this = this
    let clock = window.setInterval(() => {
      _this.second--
      if (_this.second <= 0) {
        weChatCfg.closeWechat();
      }
    }, 1000)
  },
  methods: {
    close () {
      weChatCfg.closeWechat();
    }
  },
}
</script>

<style lang="less" scoped>
.panel {
  display: flex;
  flex-direction: column;
  margin-top: 100px;
  height: 150px;
  background: #ddd;
  text-align: center;

  .text {
    display: flex;
    flex: 1;
    align-items: center; /*垂直居中*/
    justify-content: center; /*水平居中*/
  }

  .button {
    padding-bottom: 10px;
  }
}
</style>

