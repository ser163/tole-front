<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">规则操作列表</div>
    </div>
    <div class="page-body">
      <fes-search-panel>
        <Wb-form :label-width="150" type="query">
          <Form-item label="用户：">
            <wb-input v-model="paginationOption.role" placeholder="请输入角色"/>
          </Form-item>
          <Form-item label="资源路径：">
            <wb-input v-model="paginationOption.rout" placeholder="请输入资源路径"/>
          </Form-item>
        </Wb-form>
        <div slot="button">
          <Wb-button @click="search" type="primary" icon="md-search">查询</Wb-button>
          <Wb-button @click="add" type="primary" icon="md-add">新增</Wb-button>
        </div>
      </fes-search-panel>
      <fes-list-panel>
        <Wb-table :data="data">
          <Column prop="id" name="ID"/>
          <Column prop="ptype" name="类型"/>
          <Column prop="rout" name="资源路径"/>
          <Column prop="role" name="角色"/>
          <Column prop="name" name="角色名"/>
          <Column :filter="even" prop="action" name="事件"/>
          <Column :action="action" name="查看详细记录"/>
        </Wb-table>
        <Pagination
            :size="paginationOption.pageSize"
            :current="paginationOption.currentPage"
            :total="paginationOption.totalPage"
            @on-change="changePage"
        />
      </fes-list-panel>
    </div>
    <modal ref="createModal" title="新增规则">
      <Wb-form ref="ruleNewForm" :rule="addRuleValidate" :label-width="60">
        <Form-item label="类型：" prop="ptype">
          <wb-input v-model="newObj.ptype" disabled></wb-input>
        </Form-item>
        <Form-item label="角色：" prop="role">
          <Wb-select v-model="newObj.role">
            <wb-option v-for="item in roleList" :key="item.id" :value="item.name" :label="item.full_name"/>
          </Wb-select>
        </Form-item>
        <Form-item label="资源：" prop="rout">
          <wb-input v-model="newObj.rout"/>
        </Form-item>
        <Form-item label="事件：" prop="action">
          <Wb-select v-model="newObj.action">
            <wb-option value="read" label="读取"/>
            <wb-option value="write" label="写入"/>
          </Wb-select>
        </Form-item>
        <Form-item>
          <Wb-button ref="addButton" @click="handleAdd" type="primary">提交</Wb-button>
        </Form-item>
      </Wb-form>
    </modal>
    <modal ref="editModal" title="编辑规则">
      <Wb-form ref="ruleEditForm" :rule="editRuleValidate" :label-width="60">
        <Form-item label="类型：" prop="ptype">
          <wb-input v-model="editObj.ptype" disabled></wb-input>
        </Form-item>
        <Form-item label="角色：" prop="role">
          <Wb-select v-model="editObj.role">
            <wb-option v-for="item in roleList" :key="item.id" :value="item.name" :label="item.full_name"/>
          </Wb-select>
        </Form-item>
        <Form-item label="资源：" prop="rout">
          <wb-input v-model="editObj.rout"/>
        </Form-item>
        <Form-item label="事件：" prop="action">
          <Wb-select v-model="editObj.action">
            <wb-option value="read" label="读取"/>
            <wb-option value="write" label="写入"/>
          </Wb-select>
        </Form-item>
        <Form-item>
          <Wb-button ref="editButton" @click="handleEdit" type="primary">保存</Wb-button>
        </Form-item>
      </Wb-form>
    </modal>
  </div>
</template>
<script>
export default {
  FesData() {
    return {
      data: [],
      paginationOption: {
        pageSize: 10,
        currentPage: 1,
        totalPage: 1,
        seach: false,
        role: '',
        rout: ''
      },
      action: [
        {
          text: '修改',
          func(trData) {
            Object.assign(this.editObj, trData);
            this.getAllRole()
            this.$refs.editModal.show();
          }
        },
        {
          text: '删除',
          func(trData) {
            this.$Message.confirm('警告', `确认删除此规则吗？`).then((index) => {
              if (index === 0) {
                this.delRules(trData.id)
              }
            });
          }
        }
      ],
      even: [
        {
          value: "AddUser",
          text: '添加用户'
        },
        {
          value: "DisableUser",
          text: '禁用用户'
        },
        {
          value: "EnableUser",
          text: '启用用户'
        },
        {
          value: "ModifyUser",
          text: '修改用户'
        },
        {
          value: "ChangeUserPW",
          text: '修改用户密码'
        },
        {
          value: "DelUserOnRoles",
          text: '删除用户角色'
        },
      ],
      newObj: {
        ptype: 'p',
        role: '',
        rout: '',
        action: 'read'
      },
      editObj: {
        id: '',
        ptype: '',
        role: '',
        rout: '',
        action: ''
      },
      roleList: [],
      addRuleValidate: {
        role: [
          {required: true, message: '角色名不能为空'}
        ],
        rout: [
          {
            required: true, message: '资源路径不能为空'
          },
        ],
        action: [
          {
            required: true, message: '动作不能为空'
          },
        ],
      },
      editRuleValidate: {
        role: [
          {required: true, message: '角色名不能为空'}
        ],
        rout: [
          {
            required: true, message: '资源路径不能为空'
          },
        ],
        action: [
          {
            required: true, message: '动作不能为空'
          },
        ],
      },
    };
  },
  FesReady() {
    this.getAllRules()
  },
  methods: {
    // 删除id
    delRules(id) {
      this.FesApi.fetch("/api/rule/deleteRules", {
        id
      }).then(rst => {
        this.retSucceedInfo(rst)
        if (rst.type === 0) {
          this.getAllRules()
        }
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
    // 编辑提交
    handleEdit() {
      this.$refs.ruleEditForm.validate((valid, errors) => {
        if (valid) {
          this.FesApi.fetch("/api/rule/editRules", {
            id: this.editObj.id,
            ptype: this.editObj.ptype,
            role: this.editObj.role,
            rout: this.editObj.rout,
            action: this.editObj.action
          }).then(rst => {
            this.retSucceedInfo(rst)
            if (rst.type === 0) {
              this.paginationOption.seach = false
              this.getAllRules()
              this.$refs.editModal.close();
            }
          })
        }
      })
    },
    // 新建提交
    handleAdd() {
      this.$refs.ruleNewForm.validate((valid, errors) => {
        if (valid) {
          this.FesApi.fetch("/api/rule/addRules", {
            ptype: this.newObj.ptype,
            role: this.newObj.role,
            rout: this.newObj.rout,
            action: this.newObj.action
          }).then(rst => {
            this.retSucceedInfo(rst)
            if (rst.type == 0) {
              this.paginationOption.seach = false
              this.getAllRules()
              this.$refs.createModal.close();
            }
          })
        }
      })
    },
    // 新增条目
    add() {
      this.getAllRole()
      this.$refs.createModal.show();
    },
    // 获取所有用户的角色
    async getAllRole() {
      await this.FesApi.fetch("/api/user/getAllRole", {}).then(rst => {
        this.roleList = rst
      })
    },
    changePage({current, size}) {
      this.paginationOption.currentPage = current;
      this.paginationOption.pageSize = size;
      this.getAllRules()
    },
    search() {
      this.paginationOption.seach = true
      this.getAllRules();
    },
    getAllRules() {
      this.FesApi.fetch("/api/rule/getAllRules", {
        size: this.paginationOption.pageSize,
        current: this.paginationOption.currentPage,
        seach: this.paginationOption.seach,
        role: this.paginationOption.role,
        rout: this.paginationOption.rout
      }).then(rst => {
        this.data = rst.data
        this.paginationOption.pageSize = rst.per_page
        this.paginationOption.currentPage = rst.current_page
        this.paginationOption.totalPage = rst.total_page
        if (rst.seach) {
          this.paginationOption.seach = true
          this.paginationOption.role = rst.role
          this.paginationOption.rout = rst.rout
        }
      })
    },
  }
};
</script>
