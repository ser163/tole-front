<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">用户操作记录</div>
    </div>
    <div class="page-body">
      <fes-search-panel>
        <Wb-form :label-width="150" type="query">
          <Form-item label="用户：">
            <wb-input v-model="paginationOption.userName" placeholder="请输入用户名"/>
          </Form-item>
          <Form-item label="IP：">
            <wb-input v-model="paginationOption.ip" placeholder="请输入IP"/>
          </Form-item>
        </Wb-form>
        <div slot="button">
          <Wb-button @click="search" type="primary" icon="md-search">查询</Wb-button>
        </div>
      </fes-search-panel>
      <fes-list-panel>
        <Wb-table :data="data">
          <Column prop="username" name="用户"/>
          <Column prop="ip" name="IP"/>
          <Column prop="operation_time" name="时间"/>
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
    <modal ref="editModal" title="查看详细信息">
      <Wb-form ref="formValidate" :label-width="60" labelPosition="top">
        <Form-item label="详细信息：" prop="name">
          <wb-input v-model="editObj.desc" type="textarea" :row="6" readonly />
        </Form-item>
      </Wb-form>
    </modal>
  </div>
</template>
<script>
export default {
  FesData() {
    return {
      query: {
        name: '',
        id: ''
      },
      data: [],
      paginationOption: {
        pageSize: 10,
        currentPage: 1,
        totalPage: 1,
        seach: false,
        userName: '',
        ip: ''
      },
      action: [
        {
          text: '查看',
          func(trData) {
            Object.assign(this.editObj, trData);
            this.$refs.editModal.show();
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
      editObj: {
        desc: ''
      }
    };
  },
  FesReady() {
    this.getAllHistory()
  },
  methods: {
    changePage({current, size}) {
      this.paginationOption.currentPage = current;
      this.paginationOption.pageSize = size;
      this.getAllHistory()
    },
    search() {
      this.paginationOption.seach = true
      this.getAllHistory();
    },
    getAllHistory() {
      this.FesApi.fetch("/api/history/getAllHistory", {
        size: this.paginationOption.pageSize,
        current: this.paginationOption.currentPage,
        seach: this.paginationOption.seach,
        userName: this.paginationOption.userName,
        ip: this.paginationOption.ip
      }).then(rst => {
        this.data = rst.data
        this.paginationOption.pageSize = rst.per_page
        this.paginationOption.currentPage = rst.current_page
        this.paginationOption.totalPage = rst.total_page
        if (rst.seach) {
          this.paginationOption.seach = true
          this.paginationOption.userName = rst.userName
          this.paginationOption.ip = rst.ip
        }
      })
    },
  }
};
</script>
