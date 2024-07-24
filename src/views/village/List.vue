<template>
  <!-- <page-header-wrapper> -->
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="规则编号">
              <a-input v-model="queryParam.id" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="使用状态">
              <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
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
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select v-model="queryParam.useStatus" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
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
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      <a-dropdown :trigger="['click']" style="margin-bottom: 10px" v-model="DropdownVisible">
        <a-menu slot="overlay">
          <a-menu-item v-for="(item, index) in columnsDef" :key="index">
            <a-checkbox :defaultChecked="true" @change="(e)=>{refreshTableColumns(e.target, e.target.checked, item, index)}">
              {{ item.title }}
            </a-checkbox>
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 筛选列 <a-icon type="down" /> </a-button>
      </a-dropdown>
      <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
          <!-- lock | unlock -->
          <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="Did"
      bordered
      :columns="currentformThead"
      :data="loadData"
      :alert="true"
      :rowSelection="rowSelection"
      showPagination="auto"
      :pagination="paginationProp"
      :rowClassName="(_, index) => index % 2 == 0 ? 'odd' : 'even'"
      :scroll="{ x: 1000, y: 1300 }"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <a slot="town" slot-scope="text, record" @click="onDetail(record)">{{ text }}</a>
      <a slot="secretary" slot-scope="text">
        <a-popover title="历届村书记">
          <template slot="content">
            <p>Content</p>
            <p>Content</p>
          </template>
          {{ text }}
        </a-popover>
      </a>
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
      <span slot="description" slot-scope="text">
        <ellipsis :length="10" tooltip style="white-space: pre-line;">{{ text }}</ellipsis>
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">配置</a>
          <a-divider type="vertical" />
          <a @click="handleSub(record)">订阅报警</a>
        </template>
      </span>
    </s-table>

    <create-form
      ref="createModal"
      :visible="visible"
      :loading="confirmLoading"
      :model="mdl"
      @cancel="handleCancel"
      @ok="handleOk"
    />
    <step-by-step-modal ref="modal" @ok="handleOk"/>
  </a-card>
  <!-- </page-header-wrapper> -->
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
// import { getRoleList, getServiceList } from '@/api/manage'
import { getVillageList } from '@/api/village'

import StepByStepModal from '../list/modules/StepByStepModal'
import CreateForm from '../list/modules/CreateForm'

const columnsDef = [
  { title: '#', fixed: 'left', dataIndex: 'Did', width: 50, scopedSlots: { customRender: 'serial' } },
  { title: '镇街名称', fixed: 'left', dataIndex: 'town_name', scopedSlots: { customRender: 'town' } },
  { title: '村社名称', fixed: 'left', dataIndex: 'village_name' },
  {
    title: '班子情况',
    children: [
      { title: '党组织书记', dataIndex: 'secretary_name', scopedSlots: { customRender: 'secretary' } }
    ]
  },
  {
    title: '队伍情况',
    children: [
      { title: '书记是否换届调整', dataIndex: 'secretary_name', scopedSlots: { customRender: 'secretary' } },
      { title: '书记后备人选', dataIndex: 'secretary_name', scopedSlots: { customRender: 'secretary' } }
    ]
  },
  { title: '村社描述', dataIndex: 'description', width: 150, scopedSlots: { customRender: 'description' } },
  {
    title: '考核情况',
    children: [
      { title: '五星三色成绩', dataIndex: 'secretary_name', scopedSlots: { customRender: 'secretary' } },
      { title: '近五年镇街考核排名', dataIndex: 'secretary_name', scopedSlots: { customRender: 'secretary' } }
    ]
  },
  { title: '服务调用次数', dataIndex: 'callNo', sorter: true, needTotal: true, customRender: (text) => text + ' 次' },
  { title: '状态', dataIndex: 'status', scopedSlots: { customRender: 'status' } },
  { title: '更新时间', dataIndex: 'updatedAt', sorter: true },
  { title: '操作', dataIndex: 'action', width: '150px', fixed: 'right', scopedSlots: { customRender: 'action' } }
]

const statusMap = {
  0: { status: 'default', text: '关闭' },
  1: { status: 'processing', text: '运行中' },
  2: { status: 'success', text: '已上线' },
  3: { status: 'error', text: '异常' }
}

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
    // this.columns = columnsDef
    return {
      columnsDef,
      DropdownVisible: false,
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
        // return getServiceList(requestParameters)
        return getVillageList(requestParameters)
          .then(res => {
            console.log('get query result', res)
            return res.result
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      paginationProp: {
        pageSizeOptions: ['10', '20', '50'],
        showQuickJumper: true,
        // showSizeChanger: true,
        showTotal: (totals) => `总共 ${totals} 条数据` // 用于显示数据总量和当前数据顺序
      },
      currentformThead: []
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {
    // getRoleList({ t: new Date() })
    this.columnsDef.map((val, key) => {
      // console.log(val.width === undefined, val.width, val.dataIndex)
        // init default values
        if (!val.children && val.width === undefined && key !== columnsDef.length - 2) val.width = 100
        if (!val.align) val.align = 'center'
        if (val.children) {
          val.children.map((v, k) => {
            if (!v.align) v.align = 'center'
            if (v.width === undefined) v.width = 100
          })
        }
        val.show = 'true'
        val.key = val.dataIndex
        // console.log(val)
        // init table from const
        this.currentformThead.push(val)
      })
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    onDetail (param) {
      this.$router.push({ name: 'VillageDetail', params: { villageMeta: param } })
    },
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            // 新增
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('新增成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.village_name} 订阅成功`)
      } else {
        this.$message.error(`${record.village_name} 订阅失败，规则已关闭`)
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    refreshTableColumns (target, checked, item, idx) {
      this.columnsDef[idx].show = checked
      this.currentformThead = []
      this.columnsDef.map((val, key) => {
        if (val.show) {
          this.currentformThead.push(val)
        }
      })
      // console.log(checked, idx, this.currentformThead)
    }
  }
}
</script>
<style>
.odd {
  background-color: #ffffff;
}
.even {
  background-color: #f8f8f8;
}
</style>
