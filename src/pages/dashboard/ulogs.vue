<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">用户登录记录</div>
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
          <Column prop="login_time" name="时间"/>
          <Column :filter="even" prop="login" name="事件"/>
        </Wb-table>
        <Pagination
            :size="paginationOption.pageSize"
            :current="paginationOption.currentPage"
            :total="paginationOption.totalPage"
            @on-change="changePage"
        />
      </fes-list-panel>
    </div>
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
          text: '修改',
          func(trData) {
            Object.assign(this.editObj, trData);
            this.$refs.editModal.show();
          }
        },
        {
          text: '删除',
          func(trData) {
            this.$Message.confirm('警告', `确认删除用户${trData.name}吗`).then((index) => {
              if (index === 0) {
                this.$Toast.success('删除用户成功！', {align: 'top'});
              }
            });
          }
        }
      ],
      even: [
        {
          value: 1,
          text: '登录'
        },
        {
          value: 0,
          text: '注销'
        }
      ]
    };
  },
  FesReady() {
    this.getAllUserLogs()
  },
  methods: {
    changePage({current, size}) {
      this.paginationOption.currentPage = current;
      this.paginationOption.pageSize = size;
      this.getAllUserLogs()
    },
    search() {
      this.paginationOption.seach = true
      this.getAllUserLogs();
    },
    getAllUserLogs() {
      this.FesApi.fetch("/api/logs/getAllUserLogs", {
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
