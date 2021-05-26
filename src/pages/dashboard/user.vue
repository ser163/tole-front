<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">用户列表</div>
    </div>
    <div class="page-body">
      <fes-search-panel>
        <Wb-form :label-width="150" type="query">
          <Form-item label="账号：">
            <wb-input v-model="paginationOption.userName" placeholder="请输入" clearable/>
          </Form-item>
          <Form-item label="电话: ">
            <wb-input v-model="paginationOption.mobile" placeholder="请输入" clearable/>
          </Form-item>
        </Wb-form>
        <div slot="button">
          <Wb-button @click="search" type="primary" icon="md-search">查询</Wb-button>
          <Wb-button @click="add" type="primary" icon="md-add">新增</Wb-button>
        </div>
      </fes-search-panel>
      <fes-list-panel>
        <Wb-table :data="data" no-data-text="暂无用户">
          <Column prop="username" name="账号"/>
          <Column prop="mobile" name="手机"/>
          <Column prop="email" name="邮箱"/>
          <Column prop="first_name" name="名字"/>
          <Column prop="last_name" name="姓"/>
          <Column prop="created" name="建立时间"/>
          <Column prop="enable" :component="component" name="状态"/>
          <Column :action="action" name="配置"/>
        </Wb-table>
        <Pagination
            :size="paginationOption.pageSize"
            :current="paginationOption.currentPage"
            :total="paginationOption.totalPage"
            @on-change="changePage"
        />
      </fes-list-panel>
    </div>
    <modal ref="createModal" title="新增用户" width="600">
      <Wb-form ref="addUserForm" :rule="addUserRuleValidate" :label-width="80" autocomplete="off">
        <Row>
          <Cell span="12">
            <Form-item label="账号:" prop="username">
              <wb-input placeholder="请输入用户名" v-model="user.username" autocomplete="off"></wb-input>
            </Form-item>
            <Form-item label="手机号:" prop="mobile">
              <wb-input type="number" :maxlength="11" placeholder="请输入手机号" v-model="user.mobile"></wb-input>
            </Form-item>
            <Form-item label="邮箱:" prop="email">
              <wb-input placeholder="请输入邮箱" v-model="user.email"></wb-input>
            </Form-item>
            <Form-item label="密码:" prop="password">
              <wb-input type="password" placeholder="请输入密码" v-model="user.password" autocomplete="off"></wb-input>
            </Form-item>
            <Form-item label="确认密码:" prop="re_password">
              <wb-input type="password" placeholder="请输入密码" v-model="user.re_password" autocomplete="off"></wb-input>
            </Form-item>
          </Cell>
          <Cell span="12">
            <Form-item label="名字:" prop="first_name">
              <wb-input placeholder="请输入名字" v-model="user.first_name"></wb-input>
            </Form-item>
            <Form-item label="姓:" prop="last_name">
              <wb-input placeholder="请输入姓" v-model="user.last_name"></wb-input>
            </Form-item>
            <FormItem label="角色:" prop="role">
              <Checkbox-group v-model="user.role" vertical>
                <Checkbox :value="item.id" v-for="item in roleData" :key="item.id">
                  {{ item.full_name }}
                </Checkbox>
              </Checkbox-group>
            </FormItem>
          </Cell>
        </Row>
        <Row>
          <Cell span="24">
            <Form-item>
              <Wb-button ref="addButton" @click="handleAdd" type="primary">提交</Wb-button>
            </Form-item>
          </Cell>
        </Row>
      </Wb-form>
    </modal>
    <modal ref="editModal" title="编辑用户" width="650">
      <Wb-form ref="editFormValidate" :rule="editUserRuleValidate" :label-width="80">
        <Row>
          <Cell span="12">
            <Form-item label="账号:" prop="username">
              <wb-input placeholder="请输入用户名" v-model="editObj.username" disabled></wb-input>
            </Form-item>
            <Form-item label="手机号:" prop="mobile">
              <wb-input type="number" :maxlength="11" placeholder="请输入手机号" v-model="editObj.mobile"></wb-input>
            </Form-item>
            <Form-item label="邮箱:" prop="email">
              <wb-input placeholder="请输入邮箱" v-model="editObj.email" disabled></wb-input>
            </Form-item>
            <Form-item label="密码:" prop="password">
              <wb-input type="password" placeholder="请输入密码" v-model="editObj.password" autocomplete="off"></wb-input>
            </Form-item>
            <Form-item label="确认密码:" prop="re_password">
              <wb-input type="password" placeholder="请输入密码" v-model="editObj.re_password" autocomplete="off"></wb-input>
            </Form-item>
          </Cell>
          <Cell span="12">
            <Form-item label="名字:" prop="first_name">
              <wb-input placeholder="请输入名字" v-model="editObj.first_name"></wb-input>
            </Form-item>
            <Form-item label="姓:" prop="last_name">
              <wb-input placeholder="请输入姓" v-model="editObj.last_name"></wb-input>
            </Form-item>
            <Form-item label="启用:" prop="enable">
              <wb-switch v-model="editObj.enable" :confirm="confirm"></wb-switch>
            </Form-item>
            <FormItem label="角色:" prop="role">
              <Checkbox-group v-model="roleList" vertical>
                <Checkbox :value="item.id" v-for="item in roleData" :key="item.id">
                  {{ item.full_name }}
                </Checkbox>
              </Checkbox-group>
            </FormItem>
          </Cell>
        </Row>
        <Row>
          <Cell span="24">
            <Form-item>
              <Wb-button ref="editButton" @click="handleEdit" type="primary">保存</Wb-button>
            </Form-item>
          </Cell>
        </Row>
      </Wb-form>
    </modal>
  </div>
</template>
<script>
import Vue from "vue";

export default {
  FesData() {
    return {
      roleList: [],
      query: {
        name: '',
        id: ''
      },
      user: {
        username: '',
        mobile: '',
        email: '',
        password: '',
        re_password: '',
        first_name: '',
        last_name: '',
        role: []
      },
      editObj: {
        id: '',
        username: '',
        mobile: '',
        email: '',
        password: '',
        re_password: '',
        first_name: '',
        last_name: '',
        enable: false,
        role: []
      },
      data: [],
      roleData: [],
      userRoleData: [],
      paginationOption: {
        pageSize: 10,
        currentPage: 1,
        totalPage: 2,
        seach: false,
        userName: '',
        mobile: ''
      },
      action: [
        {
          text: '修改',
          func(trData) {
            // Object.assign(this.editObj, trData);
            this.editObj = trData
            this.roleList.splice(0,this.roleList.length)
            this.getAllRole()
            this.getUserRoles(trData.id)
          }
        }
      ],
      component: function (trData, tdData) {
        return new Vue({
          data: function () {
            return {
              trData,
              tdData
            }
          },
          methods: {
            confirm() {
              return new Promise((resolve, reject) => {
                let msg = trData.enable ? '确定要禁用用户吗？' : '是否要启用用户？'
                this.$Message({
                  title: '警告', // 可以传入文本和domString
                  template: msg, // 可以传入文本和domString
                  buttons: [
                    {
                      text: '确定'
                    }, {
                      text: '取消'
                    }
                  ]
                }).then(function (index) {
                  if (index === 0) {
                    resolve()
                  }
                })
              })
            }
          },
          render(h) {
            let _this = this
            return h("wb-switch", {
              props: {
                'value': this.trData.enable,
                'confirm': this.confirm
              },
              on: {
                "on-change": function (val) {
                  _this.FesApi.fetch("/api/user/setUserEnable", {
                    id: _this.trData.id,
                    enable: val
                  }).then(rst => {
                    if (rst.type === 0) {
                      _this.$Toast.success(rst.msg)
                    }
                    if (rst.type === 1) {
                      _this.$Toast.warn(rst.msg)
                    }
                    if (rst.type === 2) {
                      _this.$Toast.error(rst.msg)
                    }
                  })
                  _this.trData.enable = val
                }
              }
            }, [this.tdData])
          }
        })
      },
      addUserRuleValidate: {
        username: [
          {required: true, message: '用户名不能为空'}
        ],
        mobile: [
          {
            required: true, type: 'mobile', message: '请输入正确的手机号'
          },
        ],
        email: [
          {
            required: true, type: 'email', message: '邮箱不能为空'
          },
        ],
        password: [
          {required: true, type: 'string', min: 8, max: 16},
          {type: 'password'},
        ],
        re_password: [
          {
            required: true, type: 'string', min: 8, max: 16
          },
          {type: 'password'},
        ],
        first_name: [
          {required: true, type: 'string', message: '请输入名字'},
        ],
        last_name: [
          {required: true, type: 'string', message: '请输入姓'},
        ],
        role: [
          {required: true, message: '不能为空', type: 'array', min: 1},
        ],
      },
      editUserRuleValidate: {
        mobile: [
          {
            required: true, type: 'mobile', message: '请输入正确的手机号'
          },
        ],
        password: [
          {min: 8, max: 16},
          {type: 'password'},
        ],
        re_password: [
          {
            min: 8, max: 16
          },
          {type: 'password'},
        ],
        first_name: [
          {required: true, type: 'string', message: '请输入名字'},
        ],
        last_name: [
          {required: true, type: 'string', message: '请输入姓'},
        ],
        role: [
          {required: true, message: '不能为空', type: 'array', min: 1},
        ],
      }
    };
  },
  FesReady() {
    this.getAllUser()
  },
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
    // 设置用户启用禁用
    setUserEnable(id, enable) {
      this.FesApi.fetch("/api/user/setUserEnable", {
        id,
        enable
      }).then(rst => {
        this.retSucceedInfo(rst)
      })
    },
    // 获取所有角色
    async getAllRole() {
      await this.FesApi.fetch("/api/user/getAllRole", {}).then(rst => {
        this.roleData = rst
      })
    },
    // 获取所有用户的角色
    async getUserRoles(id) {
      let _this = this
      await this.FesApi.fetch("/api/user/getUserRoles", {
        id
      }).then(rst => {
        rst.forEach(item => _this.roleList.push(item.id));
        this.$refs.editModal.show();
      })
    },
    // 切换禁用时询问
    confirm() {
      return new Promise((resolve, reject) => {
        let msg = this.editObj.enable ? '确定要禁用用户吗？' : '是否要启用用户？'
        this.$Message({
          title: '警告', // 可以传入文本和domString
          template: msg, // 可以传入文本和domString
        }).then(function (index) {
          if (index == 0) {
            resolve()
          }
        })
      })
    },
    // 获取所有用户数据
    getAllUser() {
      this.FesApi.fetch("/api/user/getAllUser", {
        size: this.paginationOption.pageSize,
        current: this.paginationOption.currentPage,
        seach: this.paginationOption.seach,
        userName: this.paginationOption.userName,
        mobile: this.paginationOption.mobile
      }).then(rst => {
        this.data = rst.data
        this.paginationOption.pageSize = rst.per_page
        this.paginationOption.currentPage = rst.current_page
        this.paginationOption.totalPage = rst.total_page
        if (rst.seach) {
          this.paginationOption.seach = true
          this.paginationOption.userName = rst.userName
          this.paginationOption.mobile = rst.mobile
        }
      })
    },
    changePage({current, size}) {
      this.paginationOption.currentPage = current;
      this.paginationOption.pageSize = size;
      this.getAllUser()
    },
    search() {
      this.paginationOption.seach = true
      this.getAllUser();
    },
    rest() {
      this.user.username = ''
      this.user.mobile = ''
      this.user.email = ''
      this.user.password = ''
      this.user.re_password = ''
      this.user.first_name = ''
      this.user.last_name = ''
      this.user.role = []
    },
    add() {
      this.rest()
      this.getAllRole()
      this.$refs.createModal.show();
    },
    handleAdd() {
      this.$refs.addUserForm.validate((valid, errors) => {
        if (valid) {
          this.FesApi.fetch("/api/user/addUser", {
            "userName": this.user.username,
            "mobile": this.user.mobile,
            "email": this.user.email,
            "password": this.user.password,
            "rePassword": this.user.re_password,
            "firstName": this.user.first_name,
            "lastName": this.user.last_name,
            "role": this.user.role
          }).then(rst => {
            this.retSucceedInfo(rst)
            if (rst.type == 0) {
              this.paginationOption.seach = false
              this.getAllUser()
              this.$refs.createModal.close();
            }
          })
        }
      })
    },
    handleEdit() {
      this.$refs.editFormValidate.validate((valid, errors) => {
        if (valid) {
          this.editObj.role = this.roleList
          this.FesApi.fetch("/api/user/setUserInfo", {
            "id": this.editObj.id,
            "userName": this.editObj.username,
            "mobile": this.editObj.mobile,
            "email": this.editObj.email,
            "password": this.editObj.password,
            "rePassword": this.editObj.re_password,
            "firstName": this.editObj.first_name,
            "lastName": this.editObj.last_name,
            "enable": this.editObj.enable,
            "role": this.editObj.role
          }).then(rst => {
            this.retSucceedInfo(rst)
            if (rst.type === 0) {
              this.paginationOption.seach = false
              this.getAllUser()
              this.$refs.editModal.close();
            }
          })
        }
      })
    }
  }
};
</script>
