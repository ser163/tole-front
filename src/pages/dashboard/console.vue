<template>
  <div class="page page-console">
    <div class="page-header">
      <div class="page-header-title">工作台</div>
      <div class="page-hader-content">
        <img
            class="avatar"
            alt="修改密码"
            @click="changPassword"
            src="https://gw.alipayobjects.com/mdn/antopen_mi/afts/img/A*F_y_T73gNV4AAAAAAAAAAABkARQnAQ"
        />
        <div class="user">
          <div class="user-wellcome">早安，{{ username }}，祝你开心每一天！</div>
          <div class="user-role">
            树洞就是一个可以放心倾诉心事和秘密的地方，而且不用担心秘密会被泄漏。
          </div>
        </div>
        <div class="report">
          <div class="report-item">
            <span class="report-item-name">项目数量</span>
            <span class="report-item-score">{{stat.noteCount}}</span>
          </div>
          <div class="report-item">
            <span class="report-item-name">附加项目统计</span>
            <span class="report-item-score">{{stat.itemUserCount}} / {{stat.itemCount}}</span>
          </div>
          <div class="report-item">
            <span class="report-item-name">项目访问</span>
            <span class="report-item-score">{{stat.vistCount}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="page-body">
      <Row>
        <Cell span="16" class="pr-16">
          <Card title="新添加的项目">
            <a slot="extra" href="#/hole/new">全部项目</a>
            <div slot="body" class="grid-project">
              <div v-for="(item, i) in projects" :key="i" class="grid-project-item">
                <div class="grid-project-title">
                  <img src="static/sc.png"/>
                  <span>{{ item.title }}</span>
                </div>
                <div class="grid-project-desc">{{ item.desc }}</div>
                <div class="grid-project-content">
                  <span>{{ item.group }}</span>
                  <span class="grid-project-time">{{ item.time }}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card class="mt-16" title="动态">
            <div slot="body" class="list-dynamic">
              <div v-for="(item, i) in activity" :key="i" class="list-dynamic-item">
                <img
                    class="list-dynamic-logo"
                    src="static/user.png"
                />
                <div class="list-dynamic-content">
                  {{item.username}} 在 <a>{{item.note_name}}</a> 新建项目 <a>{{item.item_name}}</a>
                  <div class="list-dynamic-desc">{{item.time}}</div>
                </div>
              </div>
            </div>
          </Card>
        </Cell>
        <Cell span="8">
          <Card title="快速开始 / 便捷导航">
            <div slot="body" class="grid-nav">
              <div v-for="(item, i) in navs" :key="i" class="grid-nav-item">
                {{ item }}
              </div>
              <div>
                <Wb-button icon="md-add" type="ghost">添加</Wb-button>
              </div>
            </div>
          </Card>

          <Card class="mt-16" title="幸运指数">
            <div slot="body" class="card-chart">
              <Chart :data="chartData" :options="chartOptions"></Chart>
            </div>
          </Card>

          <Card class="mt-16" title="团队">
            <div slot="body" class="grid-group">
              <div v-for="(item, i) in roles" :key="i" class="grid-group-item">
                <img src="/static/team.png" class="grid-group-icon"/>
                <span class="grid-group-name">{{ item.full_name }}</span>
              </div>
            </div>
          </Card>
        </Cell>
      </Row>
    </div>
  </div>
</template>
<script>
import DataSet from '@antv/data-set';


export default {
  FesData() {
    return {
      navs: ['操作一', '操作二', '操作三', '操作四', '操作五', '操作六'],
      chartData: [],
      chartOptions: {
        scale: {
          score: {
            min: 0,
            max: 100
          }
        },
        coordinate: {
          type: 'polar',
          cfg: {
            radius: 0.85
          }
        },
        tooltip: {
          shared: true,
          showCrosshairs: true,
          crosshairs: {
            line: {
              style: {
                lineDash: [4, 4],
                stroke: '#333'
              }
            }
          }
        },
        axis: {
          item: {
            line: null,
            tickLine: null,
            grid: {
              line: {
                style: {
                  lineDash: null
                }
              }
            }
          },
          score: {
            line: null,
            tickLine: null,
            grid: {
              line: {
                type: 'line',
                style: {
                  lineDash: null
                }
              }
            }
          }
        },
        line: {
          position: 'item*score',
          color: 'user',
          size: 2
        },
        point: {
          position: 'item*score',
          color: 'user',
          shape: 'circle',
          size: 4,
          style: {
            stroke: '#fff',
            lineWidth: 1,
            fillOpacity: 1
          }
        }
      },
      // 统计信息
      stat: {
        'noteCount': 0,
        'itemCount': 0,
        'itemUserCount': 0,
        'vistCount': 0
      },
      roles:[],
      activity:[],
      username: this.FesApp.get('FesUserName'),
      projects: [],
    };
  },
  FesReady() {
    const data = [
      {
        item: '热度',
        a: 70,
        b: 10,
        c: 70
      },
      {
        item: '引用',
        a: 100,
        b: 30,
        c: 40
      },
      {
        item: '口碑',
        a: 80,
        b: 90,
        c: 10
      },
      {
        item: '产出',
        a: 40,
        b: 60,
        c: 60
      },
      {
        item: '贡献',
        a: 50,
        b: 30,
        c: 60
      }
    ];
    const {DataView} = DataSet;
    const dv = new DataView().source(data);
    dv.transform({
      type: 'rename',
      map: {
        a: '个人',
        b: '团队',
        c: '部门'
      }
    });
    dv.transform({
      type: 'fold',
      fields: ['个人', '团队', '部门'], // 展开字段集
      key: 'user', // key字段
      value: 'score' // value字段
    });
    this.chartData = dv.rows;
    // 获取综合信息
    this.getInfo()
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
    // 跳转修改密码
    changPassword() {
      this.$router.push('/my')
    },
    // 获取所有角色
    async getInfo() {
      await this.FesApi.fetch("/api/home/info", {}).then(rst => {
        if (rst.type == 0){
          this.stat = rst.stat
          this.roles = rst.roles
          this.activity = rst.activity
          this.projects = rst.news
        }else{
         this.retSucceedInfo(rst)
        }
      })
    },
  }
};
</script>
<style lang="scss">
@import "~@/assets/styles/variables";

.page.page-console {
  font-size: 14px;

  .page-header {
    .page-hader-content {
      display: flex;
      align-items: center;
      margin-bottom: 24px;

      .avatar {
        width: 60px;
        height: 60px;
        margin-right: 16px;
        cursor: pointer;
      }

      .user {
        flex: 1;

        .user-wellcome {
          font-size: 18px;
          color: $title-color;
        }

        .user-role {
          margin-top: 8px;
        }
      }

      .report {
        min-width: 420px;
        margin-left: 88px;
        display: flex;

        .report-item {
          flex: 1;
          display: flex;
          padding: 0 32px;
          flex-direction: column;
          align-items: flex-end;
          position: relative;

          &:not(:last-child):before {
            content: "";
            position: absolute;
            right: 0;
            top: 6px;
            bottom: 6px;
            width: 1px;
            background: $border-color-split;
          }

          &:last-child {
            padding-right: 0;

          }

          .report-item-name {
            margin-bottom: 4px;
          }

          .report-item-score {
            font-size: 24px;
            font-weight: 500;
          }
        }
      }
    }
  }

  .page-body {
    background: #f0f2f5;
    border: none;

    .grid-project {
      display: grid;
      grid-template-columns: repeat(3, 33.33%);

      .grid-project-item {
        padding: 24px;
        border: 0px;
        box-shadow: rgb(240, 240, 240) 1px 0px 0px 0px,
        rgb(240, 240, 240) 0px 1px 0px 0px, rgb(240, 240, 240) 1px 1px 0px 0px,
        rgb(240, 240, 240) 1px 0px 0px 0px inset,
        rgb(240, 240, 240) 0px 1px 0px 0px inset;
        transition: all 0.3s ease 0s;

        &:hover {
          position: relative;
          z-index: 1;
          box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16),
          0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
        }
      }

      .grid-project-title {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        font-size: 16px;

        img {
          width: 24px;
          height: auto;
        }

        span {
          margin-left: 8px;
        }
      }

      .grid-project-desc {
        height: 44px;
        overflow: hidden;
        color: $sub-text-color;
        line-height: 22px;
        font-size: 14px;
      }

      .grid-project-content {
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .grid-project-time {
          color: rgba($sub-text-color, 0.85);
        }
      }
    }

    .grid-nav {
      display: grid;
      padding: 20px;
      row-gap: 20px;
      grid-template-columns: repeat(4, 25%);

      .grid-nav-item {
        line-height: 24px;
      }

      .ui-button {
        padding: 2px 8px;
      }
    }

    .card-chart {
      padding: 20px;
    }

    .grid-group {
      display: grid;
      padding: 20px;
      row-gap: 20px;
      grid-template-columns: repeat(2, 50%);

      .grid-group-item {
        display: flex;
        align-items: center;
      }

      .grid-group-icon {
        width: 24px;
        height: auto;
      }

      .grid-group-name {
        margin-left: 8px;
      }
    }

    .list-dynamic {
      padding: 8px 24px 8px 24px;

      .list-dynamic-item {
        padding: 16px 24px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;

        &:last-child {
          border: 0;
        }

        .list-dynamic-logo {
          margin-right: 16px;
          width: 24px;
          height: 24px;
        }

        .list-dynamic-content {
          flex: 1;

          .list-dynamic-desc {
            margin-top: 4px;
            color: $sub-text-color;
          }
        }
      }
    }
  }
}
</style>
