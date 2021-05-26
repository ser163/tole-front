<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">角色管理</div>
    </div>
    <div class="page-body">
      <fes-search-panel>
        <Wb-form :label-width="150" type="query">
          <Form-item label="">
            <wb-input type="hide"/>
          </Form-item>
        </Wb-form>
        <div slot="button">
          <Wb-button @click="add" type="primary" icon="md-add">新增</Wb-button>
        </div>
      </fes-search-panel>
      <fes-list-panel>
        <Wb-table :data="data">
          <Column prop="name" name="角色名"/>
          <Column prop="full_name" name="角色全名"/>
          <Column prop="desc" name="说明"/>
          <Column prop="created" name="建立时间"/>
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
    <modal ref="createModal" title="新增角色">
      <Wb-form ref="addRoleForm" :rule="addRoleRuleValidate" :label-width="85">
        <Form-item label="角色名：" prop="name">
          <wb-input v-model="roleObj.name"  :maxlength="20" placeholder="请输入角色名"></wb-input>
        </Form-item>
        <Form-item label="角色全名：" prop="full_name">
          <wb-input v-model="roleObj.full_name" :maxlength="10" placeholder="请输入中文名"></wb-input>
        </Form-item>
        <Form-item label="说明:" prop="desc">
          <wb-input v-model="roleObj.desc" :maxlength="254" placeholder="请输入说明"></wb-input>
        </Form-item>
        <Form-item>
          <Wb-button ref="addButton" @click="handleAdd" type="primary">提交</Wb-button>
        </Form-item>
      </Wb-form>
    </modal>
    <modal ref="editModal" title="编辑角色" width="650">
      <Wb-form ref="editRoleForm" :rule="editRoleRuleValidate" :label-width="80">
        <Row>
          <Cell span="12">
            <Form-item label="角色名:" prop="name">
              <wb-input v-model="editObj.name" :maxlength="20" placeholder="请输入角色" disabled></wb-input>
            </Form-item>
            <Form-item label="角色全名:" prop="full_name">
              <wb-input v-model="editObj.full_name" :maxlength="10" placeholder="请输入中文名"></wb-input>
            </Form-item>
            <Form-item label="说明:" prop="desc">
              <wb-input v-model="editObj.desc" placeholder="请输入说明"></wb-input>
            </Form-item>
            <Form-item label="建立日期:" prop="created">
              <Wb-input v-model="editObj.created" disabled/>
            </Form-item>
          </Cell>
          <Cell span="12">
            <Panel title="角色内的用户" class="user_list">
              <Wb-button icon="md-trash" @click="deleteUserOnRoles(editObj.id)" slot="action"></Wb-button>
              <Wb-button icon="md-add" @click="addUserOnRoles(editObj.id)" slot="action"></Wb-button>
              <Checkbox-group v-model="userSelect" vertical class="checkbox_user">
                <Checkbox v-for="item in userData" :key="item.id" :value="item.id">
                  {{ item.username }}
                </Checkbox>
              </Checkbox-group>
            </Panel>
          </Cell>
        </Row>
        <Row>
          <Cell span="24">
            <Form-item>
              <Wb-button ref="editButton" @click="handleEdit" type="primary">提交</Wb-button>
            </Form-item>
          </Cell>
        </Row>
      </Wb-form>
    </modal>

    <modal ref="addUserOnRolesWin"
           width="360"
           title="添加用户到角色">
      <Row>
        <Cell span="24">
          <Panel title="角色内的用户" class="user_list">
            <Wb-input v-model="search" slot="action"/>
            <Wb-button icon="md-search" @click="findUserOnRoles(editObj.id)" clearable slot="action"></Wb-button>
            <Checkbox-group v-model="userIdList" vertical class="checkbox_user">
              <Checkbox v-for="item in userAllData" :key="item.id" :value="item.id" :disabled="item.disable">
                {{ item.username }}
              </Checkbox>
            </Checkbox-group>
          </Panel>
        </Cell>
      </Row>
      <Row>
        <Cell span="5" offset="5" class="add-user-bottom">
          <Wb-button type="primary" @click="clickAddUserOnRoles(editObj.id)">添加</Wb-button>
        </Cell>
      </Row>
    </modal>
  </div>
</template>
<script>
export default {
  FesData() {
    return {
      // 添加用户
      // 添加用户到角色时的查询条件
      search: '',
      // 选中的用户列表
      userIdList: [],
      // 所有用户列表
      userAllData: [],

      userSelect: [],
      // 角色内的用户列表
      userData: [],
      addRoleRuleValidate: {
        name: [
          {required: true, message: '角色名不能为空'}
        ],
        full_name: [
          {required: true, message: '全名不能为空'}
        ],
      },
      editRoleRuleValidate: {
        name: [
          {required: true, message: '角色名不能为空'}
        ],
        full_name: [
          {required: true, message: '全名不能为空'}
        ],
      },
      roleObj: {
        name: '',
        full_name: '',
        desc: '',
      },
      editObj: {
        name: '',
        full_name: '',
        desc: '',
        created: ''
      },
      data: [],
      paginationOption: {
        pageSize: 10,
        currentPage: 1,
        totalPage: 2
      },
      action: [
        {
          text: '修改',
          func(trData) {
            // 将用户选择组清空
            this.userSelect.splice(0, this.userSelect.length)
            Object.assign(this.editObj, trData);
            this.getRoleInUser(trData.id)
            this.$refs.editModal.show();
          }
        },
        {
          text: '删除',
          func(trData) {
            this.$Message.confirm('警告', `确认删除${trData.name}吗`).then((index) => {
              if (index === 0) {
                this.FesApi.fetch("/api/role/deleteRoles", {
                  "id": trData.id,
                }).then(rst => {
                  this.retSucceedInfo(rst)
                  if (rst.type === 0) {
                    this.getAllRoles()
                  }
                })
              }
            });
          }
        }
      ]
    };
  },
  FesReady() {
    // 获取角色
    this.getAllRoles();
  },
  methods: {
    // 获取所有用户，并把角色内的用户禁用
    async getUserAllInRoles(id) {
      let search = this.search
      await this.FesApi.fetch("/api/role/getUserAllInRoles", {
        id,
        search
      }).then(rst => {
        this.userAllData = rst
      })
    },
    // 单击添加用户到角色内按钮
    clickAddUserOnRoles(id) {
       let userCount = this.userIdList.length
      if (userCount == 0){
        this.$Toast.warn('请至少选择一个用户', {align: 'top'})
      }
      this.FesApi.fetch("/api/role/joinRoles", {
        id,
        users: this.userIdList
      }).then(rst => {
        this.retSucceedInfo(rst)
        this.getRoleInUser(id)
        this.$refs.addUserOnRolesWin.close()
      })

    },
    // 查找用户
    findUserOnRoles(id) {
      this.getUserAllInRoles(id)
    },
    // 添加用户到组内
    addUserOnRoles(id) {
      this.search = ''
      this.getUserAllInRoles(id)
      this.$refs.addUserOnRolesWin.show()
    },
    // 删除角色内用户
    deleteUserOnRoles(roleId) {
      if (this.userSelect.length === 0) {
        this.$Toast.warn(`请选择一个用户`, {align: 'top'})
        return false
      }
      this.$Message.confirm('警告', `确定要将用户从该组中删除吗？`).then((index) => {
        if (index === 0) {
          this.FesApi.fetch("/api/role/deleteUserOnRoles", {
            "id": roleId,
            "users": this.userSelect
          }).then(rst => {
            this.retSucceedInfo(rst)
            if (rst.type === 0) {
              this.getRoleInUser(roleId)
            }
          })
        }
      });

    },
    // 获取角色内的用户
    async getRoleInUser(id) {
      await this.FesApi.fetch("/api/role/getRoleInUser", {
        id
      }).then(rst => {
        this.userData = rst.data
      })
    },
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
    getAllRoles() {
      this.FesApi.fetch("/api/role/getAllRoles", {
        size: this.paginationOption.pageSize,
        current: this.paginationOption.currentPage,
      }).then(rst => {
        this.data = rst.data
        this.paginationOption.pageSize = rst.per_page
        this.paginationOption.currentPage = rst.current_page
        this.paginationOption.totalPage = rst.total_page
      })
    },
    changePage({current, size}) {
      this.paginationOption.currentPage = current;
      this.paginationOption.pageSize = size;
      this.getAllRoles()
    },
    add() {
      this.restCreate()
      this.$refs.createModal.show();
    },
    // 清空表单
    restCreate(){
      this.roleObj.name =''
      this.roleObj.full_name =''
      this.roleObj.desc =''
    },
    handleAdd() {
      this.$refs.addRoleForm.validate((valid, errors) => {
        if (valid) {
          this.FesApi.fetch("/api/role/addRoles", {
            "name": this.roleObj.name,
            "full_name": this.roleObj.full_name,
            "desc": this.roleObj.desc,
          }).then(rst => {
            this.retSucceedInfo(rst)
            if (rst.type === 0) {
              this.getAllRoles()
              this.$refs.createModal.close();
            }
          })
        }
      })
    },
    handleEdit() {
      this.$refs.editRoleForm.validate((valid, errors) => {
        if (valid) {
          this.FesApi.fetch("/api/role/editRoles", {
            "id": this.editObj.id,
            "name": this.editObj.name,
            "full_name": this.editObj.full_name,
            "desc": this.editObj.desc,
          }).then(rst => {
            this.retSucceedInfo(rst)
            if (rst.type === 0) {
              this.getAllRoles()
              this.$refs.editModal.close();
            }
          })
        }
      })
    }
  }
};
</script>
<style lang="scss">
@import "~@/assets/styles/variables";

.add-user-bottom {
  margin-top: 20px;
}

.user_list {
  margin-left: 20px;

  .ui-panel-title-button > button {
    margin-right: 8px;
  }

  .ui-panel-title-button {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .ui-input {
    margin-left: 5px;
  }

  .ui-panel-content {
    height: 162px;
    overflow: auto;
  }

}

</style>