<template>
  <div>
    <!-- <page-header-wrapper/> -->
    <a-tabs default-active-key="Detail" size="small" @change="handleTabChange" :tab-bar-style="{marginBottom: '6px', paddingLeft: '6px'}">
      <a-tab-pane key="Detail" tab="明细">
        <a-card :bordered="false">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                  <a-form-item label="规则编号">
                    <a-input v-model="queryParam.id" placeholder=""/>
                  </a-form-item>
                </a-col>
                <template v-if="advanced">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="调用次数">
                      <a-input-number v-model="queryParam.callNo" style="width: 100%"/>
                    </a-form-item>
                  </a-col>
                  <a-col :md="8" :sm="24">
                    <a-form-item label="更新日期">
                      <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期"/>
                    </a-form-item>
                  </a-col>
                </template>
                <a-col :md="!advanced && 8 || 24" :sm="24">
                  <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                    <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                    <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                    <a @click="toggleAdvanced" style="margin-left: 8px">
                      {{ advanced ? '收起' : '展开' }}
                      <a-icon :type="advanced ? 'up' : 'down'"/>
                    </a>
                  </span>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <s-table
            ref="table"
            size="default"
            rowKey="Vid"
            bordered
            :columns="currentformThead"
            :data="loadData"
            :alert="true"
            showPagination="auto"
          >
            <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
            <span slot="description" slot-scope="text"><ellipsis :length="4" tooltip>{{ text }}</ellipsis></span>
          </s-table>
        </a-card>
      </a-tab-pane>
      <a-tab-pane key="Analysis" tab="分析" force-render>
        <a-card><ReserveAnalysis/></a-card>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getRoleList, getServiceList } from '@/api/manage'
import ReserveAnalysis from './ReserveAnalysis'

const columnsDef = [
  { title: '#', dataIndex: 'Vid', width: 50, scopedSlots: { customRender: 'serial' } },
  { title: '镇街名称', dataIndex: 'town_name', scopedSlots: { customRender: 'town' } },
  { title: '村社名称', dataIndex: 'village_name', scopedSlots: { customRender: 'village' } },
  { title: '村社描述', dataIndex: 'description', width: 150, scopedSlots: { customRender: 'description' } },
  { title: '五星三色星级', dataIndex: '5s3c_star', scopedSlots: { customRender: '5s3c_star' } },
  { title: '近五年镇街考核排名', dataIndex: 'eval_town_ranks_5y', scopedSlots: { customRender: 'eval_town_ranks_5y' } },
  { title: '服务调用次数', dataIndex: 'callNo', sorter: true, needTotal: true, customRender: (text) => text + ' 次' }
]

export default {
  name: 'Reserve',
  components: {
    STable,
    Ellipsis,
    ReserveAnalysis
  },
  data () {
    return {
      currentformThead: [],
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getServiceList(requestParameters)
          .then(res => {
            return res.result
          })
      }
    }
  },
  filters: {
  },
  created () {
    getRoleList({ t: new Date() })
    columnsDef.map((val, key) => {
      // console.log(val.width === undefined, val.width, val.dataIndex)
      // init default values
      if (!val.children && val.width === undefined && key <= columnsDef.length - 2) val.width = 150
      if (!val.align) val.align = 'center'
      if (val.children) {
        val.children.map((v, k) => {
          if (!v.align) v.align = 'center'
          if (v.width === undefined) v.width = 100
        })
      }
      val.show = 'true'
      val.key = val.dataIndex
      console.log(val)
      // init table from const
      this.currentformThead.push(val)
    })
  },
  computed: {
  },
  methods: {
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    // 标签切换
    handleTabChange (key) {
      console.log(key)
      this.tabActiveKey = key
      // this.$router.push({ name: key })
    }
  }
}
</script>
