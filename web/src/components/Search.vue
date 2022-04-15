<template>
  <b-container fluid class="d-flex align-items-stretch">
    <b-row class="flex-grow-1 d-flex align-items-stretch">
      <b-col cols="2" class="filter-area pt-4 pb-5 bg-primary text-white" :key="filterKey">
        <!-- Left sidebar -->
      </b-col>
      <b-col cols="10" class="mb-5">
        <h2 class="text-center mt-4">Welcome to the TopMat Database</h2>
        <b-input-group class="search-bar">
          <b-select v-model="searchMode" :options="modeOptions" class="bg-success text-white" slot="prepend"></b-select>
          <!-- Main form input -->
          <b-form-input v-model="input" @input="handleInput" class="bg-white">
          </b-form-input>
          <span id="searchclear" @click="handleClear">
            <icon name="close"></icon>
          </span>
          <!-- Attach Right button Group via slot -->
          <b-btn @click="handleSearch" variant="info" slot="append" class="text-white">Search</b-btn>
        </b-input-group>
        <div class="input-warning">
          <!-- <span class="text-danger"> {{ warning }} </span> -->
        </div>
          <PTable full class="mx-auto mb-5" :value="elems" @input="handlePTInput"></PTable>
        <!-- 滚动动画 -->
        <div id="scroll-point"></div>
        <!-- 缓冲ing -->
        <b-col class="text-center" cols="12">
          <b-spinner style="height: 2rem;" v-show="loading" variant="success"/>
        </b-col>

        <div class="data-table" v-if="showTable">
          <DataTable :data="data"></DataTable>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Vue from 'vue'
import PTable from './PTable/PTable.vue'
import DataTable from './DataTable.vue'

function parseElems (str) {
  let elems = []
  console.log('parseElems: ', str)
  str.split(/\s+/).forEach(item => {
    item = item.trim()
    if (item !== '' && !elems.includes(item)) {
      elems.push(item)
    }
  })
  console.log(elems)
  return elems
}

function getDefaultData () {
  return {
    oldpath: 'Te',
    elems: [],
    searchMode: 'elements',
    modeOptions: [
      {value: 'formula', text: 'By Formula'},
      {value: 'elements', text: 'Include Element'}
    ],
    input: '',
    // warning: '',
    data: {},
    showTable: false,
    queryNow: true,
    filterKey: 0,
    loading: false
  }
}

export default {
  name: 'Search',

  components: {
    PTable,
    DataTable
  },

  data: getDefaultData,

  computed: {
    query () {
      let query = {}
      if (this.searchMode === 'formula' && this.elems.length) {
        query['formula'] = this.elems.join('')
      } else if (this.searchMode === 'elements' && this.elems.length) {
        query['elements'] = this.elems.join('')
      }
      console.log(query)
      return query
    }
  },
  methods: {
    handleInput (str) {
      this.elems = parseElems(str)
    },

    handlePTInput (elems) {
      let TableStr = Object.assign([], elems)
      this.input = ''
      for (var i = 0; i < TableStr.length; i++) {
        this.input += TableStr[i] + ' '
      }
    },

    handleClear () {
      this.input = ''
      this.elems = []
    },

    handleSearch () {
      this.queryServer(this.query)
      this.queryNow = false
      this.$router.push({name: 'searchResults', query: this.query})
    },

    queryServer (query) {
      console.log(query)
      this.loading = true
      this.showTable = false
      document.getElementById('scroll-point').scrollIntoView()
      this.axios.get('/api/materials/search', { params: query })
        .then(res => {
          this.data = res.data
          console.log(res.data)
          this.loading = false
          this.showTable = true
          let that = this
          Vue.nextTick()
            .then(function () {
              document.getElementById('scroll-point').scrollIntoView()
              that.filterKey += 1 // force the filter area component to be recreated to fix the partial background problem
            })
        })
        .catch(error => {
          console.log(error.response)
        })
    }
  },

  watch: {
    '$route' (to, from) {
      // console.log('route changed!')
      if (to.name === 'search') {
        this.reset()
      }
      // console.log(to.name, to.fullPath, this.oldPath)
      if (to.name === 'searchResults' && to.fullPath !== this.oldPath && this.queryNow) {
        this.queryServer(to.query)
        this.oldPath = to.fullPath
      }
      this.queryNow = true
    }
  },

  mounted () {
    this.oldPath = this.$route.fullPath
    if (this.$route.name === 'searchResults') {
      this.queryServer(this.$route.query)
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
