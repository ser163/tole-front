<template>
  <div class="page">
    <Panel title="部门设置" class="panel-depart">
      <Row>
        <Cell :span="level">
          <Tree :data="data" :inline="false" twiceClickSelected @on-select-change="clickDepart" class="tree-dom"></Tree>
        </Cell>
        <Cell span="4">
          <Wb-form label-position="top" ref="departForm" :rule="addDepartRuleValidate" :label-width="100">
            <Form-item label="组织名" prop="name">
              <wb-input placeholder="请输入" v-model="depart.name"></wb-input>
            </Form-item>
            <Form-item label="上级组织" prop="parent">
              <Wb-select v-model="depart.parent">
                <wb-option v-for="item in departList" :key="item.id" :value="item.id" :label="item.name"></wb-option>
              </Wb-select>
            </Form-item>
            <Form-item label="选择对应的角色" prop="role">
              <Wb-select v-model="depart.role">
                <wb-option v-for="item in roleData" :key="item.id" :value="item.id" :label="item.full_name"></wb-option>
              </Wb-select>
            </Form-item>
            <Form-item class="depart-from-bottom">
              <Wb-button type="primary" @click="add">新增</Wb-button>
              <Wb-button type="primary" @click="save">保存</Wb-button>
              <Wb-button type="error" @click="del">删除</Wb-button>
            </Form-item>
          </Wb-form>
        </Cell>
        <Cell :span="(20-level)"></Cell>
      </Row>
    </Panel>
  </div>
</template>
<script>
export default {
  FesData() {
    return {
      departList: [],
      data: [],
      level: 2,
      roleData: [],
      depart: {
        id: null,
        name: '',
        parent: null,
        role: null
      },
      addDepartRuleValidate: {
        name: [
          {required: true, message: '部门不能为空'}
        ],
        parent: [
          {
            required: true, message: '请选择上级组织'
          },
        ],
      },
    };
  },
  FesCreated() {
    this.getTreeData();
  },
  FesReady() {
    this.getAllRole()
  },
  methods: {
    // 删除部门
    del(){
      let id = this.depart.id
      if (id == null) {
        this.$Toast.error("请选择一个部门", {align: 'top'})
        return false
      }

      this.$Message.confirm('警告', `确定要将此部门删除吗？`).then((index) => {
        if (index === 0) {
          this.FesApi.fetch("/api/depart/deleteDepart", {
            id,
          }).then(rst => {
            this.retSucceedInfo(rst)
            this.restDepart()
            this.getTreeData()
          })
        }
      });

    },
    // 显示提示信息
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
    // 保存结果
    save() {
      this.$refs.departForm.validate((valid, errors) => {
        if (valid) {
          let id = this.depart.id
          // 如果id是null则新建
          if (id == null) {
            this.FesApi.fetch("/api/depart/addDepart", {
              "name": this.depart.name,
              "parent": this.depart.parent,
              "role": this.depart.role,
            }).then(rst => {
              this.retSucceedInfo(rst)
              this.restDepart()
              this.getTreeData()
            })
          } else {
            this.FesApi.fetch("/api/depart/updateDepart", {
              "id": this.depart.id,
              "name": this.depart.name,
              "parent": this.depart.parent,
              "role": this.depart.role,
            }).then(rst => {
              this.retSucceedInfo(rst)
              this.restDepart()
              this.getTreeData()
            })
          }
        }
      })
    },
    // 清空depart对象
    restDepart() {
      this.depart.id = null
      this.depart.name = ''
      this.depart.parent = null
      this.depart.role = null
    },
    // 添加部门
    add() {
      this.restDepart()
      this.getAllDepart()
    },
    // 返回部门数据列表
    async getAllDepart() {
      await this.FesApi.fetch("/api/depart/getAllDepart"
      ).then(rst => {
        this.departList = rst
      })
    },
    // 返回部门数据列表
    async getDepartData(id) {
      await this.FesApi.fetch("/api/depart/getDepartData",
          {
            id
          }
      ).then(rst => {
        this.departList = rst
      })
    },
    // 获取树形数据
    async getTreeData() {
      await this.FesApi.fetch("/api/depart/getTreeData",
          {}
          ,
          'get'
      ).then(rst => {
        this.data = rst.data
        this.level = rst.level * 2
      })
    },
    // 获取所有角色
    async getAllRole() {
      await this.FesApi.fetch("/api/user/getAllRole", {}).then(rst => {
        this.roleData = rst
      })
    },
    clickDepart(node) {
      Object.assign(this.depart, node)
      this.getDepartData(node.id)
    }
  }
};
</script>
<style lang="scss">
.panel-depart {
  margin: 10px;
}

.tree-dom {
  margin-top: 12px;
  margin-bottom: 12px;
  margin-left: 10px;
  margin-right: 10px;
}

.depart-from-bottom .ui-form-content {
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}
</style>
