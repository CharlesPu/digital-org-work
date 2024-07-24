<template>
  <!-- <page-header-wrapper> -->
  <div class="main">
    <div id="components-form-demo-advanced-search">
      <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col v-for="i in 10" :key="i" :span="4" :style="{ display: i < count ? 'block' : 'none' }">
            <a-form-item :label="`Field ${i}`">
              <a-input
                v-decorator="[
                  `field-${i}`,
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Input something!',
                      },
                    ],
                  },
                ]"
                placeholder="placeholder" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" :style="{ textAlign: 'right' }">
            <a-button type="primary" html-type="submit">
              Search
            </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
              Clear
            </a-button>
            <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggle">
              Collapse <a-icon :type="expand ? 'up' : 'down'" />
            </a>
          </a-col>
        </a-row>
      </a-form>
      <div class="search-result-list">
        <!-- 开启选择框 :row-selection="rowSelection" -->
        <a-table
          :columns="columns"
          :data-source="data"
          :scroll="{ x: 2000, y: 800 }"
          bordered
          :pagination="paginationProp"
          :rowClassName="(_, index) => index % 2 == 0 ? 'odd' : 'even'"
        >
          <span slot="Did" slot-scope="text, record, index">{{ index + 1 }}</span>
          <a slot="town" slot-scope="text, record" @click="onDetail(record)">{{ text }}</a>
          <a slot="action" slot-scope="text, record" @click="onEdit(record)">编辑</a>
        </a-table>
      </div>
    </div>
  </div>
  <!-- </page-header-wrapper> -->
</template>
<script>
const columns = [
  { title: '#', width: 70, dataIndex: 'Did', key: 'Did', fixed: 'left', scopedSlots: { customRender: 'Did' } },
  { title: '镇街名', width: 100, dataIndex: 'town', key: 'town', fixed: 'left', scopedSlots: { customRender: 'town' } },
  { title: '村社名', width: 100, dataIndex: 'age', key: 'age', fixed: 'left' },
  // { title: 'Age', width: 100, dataIndex: 'age', key: 'age', fixed: 'left', sorter: (a, b) => a.age - b.age },
  { title: 'Column 1', dataIndex: 'address', key: '1', width: 150 },
  { title: 'Column 2', dataIndex: 'address', key: '2', width: 150 },
  { title: 'Column 3', dataIndex: 'address', key: '3', width: 150 },
  { title: 'Column 4', dataIndex: 'address', key: '4', width: 150 },
  { title: 'Column 5', dataIndex: 'address', key: '5', width: 150 },
  { title: 'Column 6', dataIndex: 'address', key: '6', width: 150 },
  { title: 'Column 7', dataIndex: 'address', key: '7', width: 150 },
  { title: 'Column 8', dataIndex: 'address', key: '8', width: 150 },
  { title: 'Column 9', dataIndex: 'address', key: '9', width: 150 },
  { title: 'Column 10', dataIndex: 'address', key: '10' },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 100,
    scopedSlots: { customRender: 'action' }
  }
]

const data = []
for (let i = 0; i < 101; i++) {
  data.push({
    town: `Edrward ${i}`,
    age: 32 + i,
    address: `London Park no. ${i}`
  })
}

export default {
  data () {
    return {
      data,
      columns,
      expand: false,
      form: this.$form.createForm(this, { name: 'advanced_search' }),
      paginationProp: {
        showTotal: (totals) => `总共 ${totals} 条数据` // 用于显示数据总量和当前数据顺序
      }
    }
  },
  mounted: function () {
    // todo
    for (let i = 200; i < 210; i++) {
      data.push({
        Did: i,
        town: `Edrward ${i}`,
        age: 32 + i,
        address: `London Park no. ${i}`
      })
    }
  },

  methods: {
    onEdit (params) {
      alert(params.Did)
    },
    onDetail (param) {
      this.$router.push({ name: 'VillageDetail', params: { villageMeta: param } })
    },
    handleSearch (e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        console.log('error', error)
        console.log('Received values of form: ', values)
      })
    },
    handleReset () {
      this.form.resetFields()
    },
    toggle () {
      this.expand = !this.expand
    }
  },
  computed: {
    count () {
      return this.expand ? 11 : 7
    },
    rowSelection () {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
          }
        })
      }
    }
  }
}
</script>
<style>
.ant-advanced-search-form {
  padding: 24px;
  background: #fbfbfb;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}
.ant-advanced-search-form .ant-form-item {
  display: flex;
}
.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}
#components-form-demo-advanced-search .ant-form {
  max-width: none;
}
#components-form-demo-advanced-search .search-result-list {
  margin-top: 16px;
  border: 1px solid #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  text-align: center;
  /* padding-top: 80px; */
}
.odd {
  background-color: #ffffff;
}
.even {
  background-color: #f8f8f8;
}
</style>
