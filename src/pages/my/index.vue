<template>
    <div class="page">
        <div class="page-header">
            <div class="page-header-title">修改密码</div>
        </div>
        <div class="page-body">
            <fes-list-panel>
              <Row>
                <Cell offset="8" span="8">
                  <Wb-form :label-width="150" ref="changWordForm" :rule="pwRuleValidate">
                    <Form-item label="原密码：" prop="old">
                      <wb-input type="password" v-model="word.old" autocomplete="off" placeholder="请输入旧密码" />
                    </Form-item>
                    <Form-item label="新密码：" prop="new">
                      <wb-input type="password" v-model="word.new"  autocomplete="off" placeholder="请输入新密码" />
                    </Form-item>
                    <Form-item label="确认新密码：" prop="rePassword">
                      <wb-input type="password" v-model="word.rePassword"  autocomplete="off" placeholder="请输入新密码" />
                    </Form-item>
                  </Wb-form>
                </Cell>
                <Cell offset="12" span="4">
                    <div>
                      <Wb-button @click="changNewPassWord" type="primary">修改</Wb-button>
                    </div>
                </Cell>
              </Row>
            </fes-list-panel>
        </div>
    </div>
</template>
<script>
import Card from "../../components/Card";
export default {
  components: {Card},
  FesData() {
        return {
          word:{
            old:'',
            new:'',
            rePassword:'',
          },
          pwRuleValidate: {
            old: [
              { required: true},
            ],
            new: [
              { required: true,min: 8, max: 16},
              {type: 'password'},
            ],
            rePassword: [
              {
                required: true,min: 8, max: 16
              },
              {type: 'password'},
            ],
          }
        };
    },
    FesReady() {},
    methods: {
      // 显示错误信息
      retSucceedInfo(msg) {
        if (msg.type === 0) {
          this.$Toast.success(msg.msg, {align: 'top'})
        }
        if (msg.type === 1) {
          this.$Toast.warn(msg.msg, {align: 'top'})
        }
        if (msg.type === 2) {
          this.$Toast.error(msg.msg, {align: 'top'})
        }
      },
     // 修改新密码
      changNewPassWord(){
        let uid = this.FesApp.get('uid')
        console.log(uid)
        if (this.word.new !== this.word.rePassword) {
          this.retSucceedInfo("两次输入密码不一致",2)
          return false
        }
        this.$refs.changWordForm.validate((valid, errors) => {
          if (valid) {
            this.FesApi.fetch("/api/user/setUserPassWord", {
              "id": uid,
              "new": this.word.new,
              "old": this.word.old,
            }).then(rst => {
              console.log(rst.msg)
              this.retSucceedInfo(rst)
              this.$router.push('/dashboard/console')
            })
          }
        })
      }
    }
};
</script>
