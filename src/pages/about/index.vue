<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">
        树洞密码 v 0.0.1
      </div>
      <div class="page-header-desc">
        树洞就是一个可以放心倾诉心事和秘密的地方，而且不用担心秘密会被泄漏。
      </div>
    </div>
    <div class="page-body">
      <Row>
        <Cell offset="5" span="12" class="about-title">
          关于树洞密码
        </Cell>
      </Row>
      <Row>
        <Cell offset="5" span="12" class="about-desc">
          <span>一个安全无忧的密码管理平台</span>
        </Cell>
      </Row>
      <Row>
        <Cell offset="5" span="12" class="about-desc">
          <span>字段级加密保护，放心安全</span>
        </Cell>
      </Row>
      <Row>
        <Cell offset="5" span="12" class="about-desc">
          <span>使用简单，操作方便。</span>
        </Cell>
      </Row>
      <Row>
        <Cell offset="5" span="12" class="about-desc">
          <span>适合中小型企业的密码存储方案</span>
        </Cell>
      </Row>
      <Row>
        <Cell offset="8" span="4" class="about-desc">
          <span class="author-info">---- <em>Harry Liu</em></span>
        </Cell>
      </Row>
      <Row>
        <Cell offset="5" span="12" class="about-desc">
          <span>
            <b>GitHub:</b>
            <a href="https://github.com/ser163/tole">
                https://github.com/ser163/tole
            </a></span>
        </Cell>
      </Row>
      <Row>
        <Cell offset="5" span="12" class="about-desc">
          <span>
            <b>Gitee:</b>
            <a href="https://gitee.com/ser163/tole">
              https://gitee.com/ser163/tole
            </a></span>
        </Cell>
      </Row>
      <Row>
        <Cell offset="5" span="12" class="about-desc">
          <span>请作者喝杯茶🍵</span>
        </Cell>
      </Row>
      <Row>
        <Cell offset="5" span="4" class="about-desc">
          <img v-tooltip="'支付宝'" src="static/alipay.png"/>
        </Cell>
        <Cell span="5" class="about-desc">
          <img v-tooltip="'微信'" src="static/weixin.png"/>
        </Cell>
      </Row>
    </div>
  </div>
</template>
<script>
export default {
  FesData() {
    return {};
  },
  methods: {}
};
</script>
<style lang="scss">
.author-info{
  font-size: 20px;
}
.page-body {
  .about-title {
    margin-top: 20px;
    font-size: 30px;
  }

  .about-desc {
    margin-top: 20px;
    font-size: 20px;
  }
}
</style>