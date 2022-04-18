<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="12" xl="6">
          <h5>Found {{data.count}} entries, showing {{data.materials.length}}</h5>
        </b-col>
        <b-col cols="12" xl="6">
          <b-pagination :total-rows=total v-model="page" :per-page="pageSize" align="right">
          </b-pagination>
        </b-col>
      </b-row>
    </b-container>
    <b-table striped hover :fields="fields" :per-page="pageSize" :items="tableData" :current-page="page">
      <template slot="action" slot-scope="row">
        <b-button size="sm" variant="success" :to="'/materials/' + row.item.id">
          Details
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'DataTable',
  componentName: 'DataTable',

  data () {
    return {
      fields: [
        {key: 'id', label: 'ID', sortable: true},
        {key: 'formula', label: 'Formula', sortable: true},
        {key: 'spacegroup.number', label: 'Space Group', sortable: true},
        {key: 'nsoc_topo_class', label: 'NSOC Topo Class', sortable: true},
        {key: 'soc_topo_class', label: 'SOC Topo Class', sortable: true},
        {key: 'nsoc_dos_gap', label: 'NSOC Gap', sortable: true},
        {key: 'soc_dos_gap', label: 'SOC Gap', sortable: true},
        {key: 'action', label: 'Action'}
      ],
      page: 1,
      pageSize: 10
    }
  },

  computed: {
    tableData () {
      let rtn = []
      this.data.materials.forEach((mat, i) => {
        console.log(mat)
        const spacegroup = mat.spacegroup.number
        rtn.push({
          'id': mat.id,
          'formula': mat.formula,
          'spacegroup.number': spacegroup,
          'nsoc_topo_class': mat.nsoc_topo_class,
          'soc_topo_class': mat.soc_topo_class,
          'nsoc_dos_gap': mat.nsoc_dos_gap,
          'soc_dos_gap': mat.soc_dos_gap
        })
      })
      return rtn
    },

    total () {
      return this.data.materials.length
    }
  },

  watch: {
    data () {
      this.page = 1
    }
  },

  props: {
    data: Object
  }
}
</script>

<style>
</style>
