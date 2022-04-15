<template>
  <b-container class="my-5 mx-auto material-container">
    <b-row>
      <b-col cols="12" class="mb-5">
        <h2 class="text-center">
          <icon name="asterisk" class="align-middle"></icon>
          Record for
          <span v-html="matShow.formula"></span>
        </h2>
      </b-col>
      <b-col cols="12" class="mb-5">
        <h4 class="d-flex justify-content-between align-items-center">
          <span class="text-muted">General Info</span>
        </h4>
        <table class="table striped rounded">
          <tbody>
            <tr>
              <td style="width:25%;" class="info-cell">ID</td>
              <td style="width:25%;">{{ matShow.id }}</td>
              <td class="info-cell">ICSD IDs </td>
              <td>{{ matShow.icsd_ids ? matShow.icsd_ids : 'N/A' }}</td>
            </tr>
            <tr>
              <td class="info-cell"># of Electrons in Unit Cell</td>
              <td>{{ matShow.nelec }} </td>
              <td style="width:25%;" class="info-cell"># of Sites in Unit Cell</td>
              <td style="width:25%;">{{ matShow.nsites }}</td>
            </tr>
            <tr>
              <td class="info-cell">Non-SOC Gap
                <icon v-b-tooltip.hover title="The energy gap is obtained from fitting the density of states near the Fermi energy.
                    This value is currently available for only a portion of the materials."
                    name="info-circle"></icon>
              </td>
              <td>{{ matShow.nsoc_dos_gap }}</td>
              <td class="info-cell">SOC Gap
                <icon v-b-tooltip.hover title="The energy gap is obtained from fitting the density of states near the Fermi energy.
                    This value is currently available for only a portion of the materials."
                    name="info-circle"></icon>
              </td>
              <td>{{ matShow.soc_dos_gap }}</td>
            </tr>
          </tbody>
        </table>
        <span>
          <icon name="info-circle"></icon>
          The initial structure (unrefined) and ICSD numbers of this compound are obtained from the Materials Project. For more information, please follow
          <a :href="'https://materialsproject.org/materials/' + mat.mp_id" target="_blank">this link</a>.
        </span>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" xl="6">
        <h4 class="d-flex justify-content-between align-items-center">
          <span class="text-muted">Structural Info</span>
        </h4>
        <table class="table striped rounded">
          <tbody>
            <tr>
              <td style="width:50%;" class="info-cell">Crystal Family</td>
              <td style="width:50%;">{{ matShow.spacegroup.lattice_type }}</td>
            </tr>
            <tr>
              <td class="info-cell">Point Group</td>
              <td>{{ matShow.spacegroup.pointgroup_international }}</td>
            </tr>
            <tr>
              <td class="info-cell">Space Group Number</td>
              <td>{{ matShow.spacegroup.number }}</td>
            </tr>
            <tr>
              <td class="info-cell">Space Group Symbol</td>
              <td>{{ matShow.spacegroup.international }}</td>
            </tr>
            <tr>
              <td class="info-cell">Cell Length a</td>
              <td>{{ this.lattice_para._cell_length_a }}</td>
            </tr>
            <tr>
              <td class="info-cell">Cell Length b</td>
              <td>{{ this.lattice_para._cell_length_b }}</td>
            </tr>
            <tr>
              <td class="info-cell">Cell Length c</td>
              <td>{{ this.lattice_para._cell_length_c }}</td>
            </tr>
            <tr>
              <td class="info-cell">Cell Angle
                <span v-html="'&alpha;'"/>
              </td>
              <td>{{ this.lattice_para._cell_angle_alpha }}</td>
            </tr>
            <tr>
              <td class="info-cell">Cell Angle
                <span v-html="'&beta;'"/>
              </td>
              <td>{{ this.lattice_para._cell_angle_beta}}</td>
            </tr>
            <tr>
              <td class="info-cell">Cell Angle
                <span v-html="'&gamma;'"/>
              </td>
              <td>{{ this.lattice_para._cell_angle_gamma }}</td>
            </tr>
          </tbody>
        </table>
      </b-col>
      <b-col cols="12" xl="1">
      </b-col>
      <b-row class="mb-5">
      <!-- Non-SOC -->
      <b-col cols="12" xl="12" class="mb-5">
        <div class="mb-5">
          <h4 class="d-flex justify-content-between align-items-center">
            <span class="text-muted">Non-SOC Topological Info</span>
          </h4>
          <table class="table striped rounded">
            <tbody>
              <tr>
                <td class="info-cell" style="width:50%;">Topological Class</td>
                <td>{{ matShow.nsoc_topo_class || 'N/A' }}
                  <icon v-if="mat.nsoc_topo_class === 'Triv_Ins'" v-b-tooltip.hover
                        title="'Trivial' means that one cannot distinguish this material from an atomic insulator by looking at the lattice symmetry eigenvalues at all high-symmetry points. It is possible that the material is still topologically nontrivial, the diagnosis of which requires further calculation of the Wilson loops."
                    name="info-circle"></icon>
                </td>
              </tr>
              <template v-if="mat.nsoc_topo_class === 'Triv_Ins'">
                <tr>
                  <td class="info-cell">Symmetry-based Indicator</td>
                  <td>{{ matShow.nsoc_sym_ind || 'N/A' }}
                  </td>
                </tr>
                <tr>
                  <td class="info-cell">Indicator Group</td>
                  <td>{{ matShow.nsoc_ind_group || 'N/A' }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <!-- SOC -->
        <div class="mb-5">
          <h4 class="d-flex justify-content-between align-items-center">
            <span class="text-muted">SOC Topological Info</span>
          </h4>
          <table class="table striped rounded">
            <tbody>
              <tr>
                <td class="info-cell" style="width:50%;">Topological class</td>
                <td>{{ matShow.soc_topo_class || 'N/A' }}
                  <icon v-if="mat.soc_topo_class === 'Triv_Ins'" v-b-tooltip.hover
                        title="'Trivial' means that one cannot distinguish this material from an atomic insulator by looking at the lattice symmetry eigenvalues at all high-symmetry points. It is possible that the material is still topologically nontrivial, the diagnosis of which requires further calculation of the Wilson loops."
                    name="info-circle"></icon>
                </td>
              </tr>
              <template v-if="mat.soc_topo_class === 'HSP_SM'">
                <tr>
                  <td class="info-cell"> High Symmetry Points </td>
                  <td> {{ matShow.soc_dgn_hsp }} </td>
                </tr>
                <tr>
                  <td class="info-cell"> Degenerate Irriducible Representations </td>
                  <td v-html="matShow.soc_dgn_IR"></td>
                </tr>
              </template>
              <template v-if="mat.soc_topo_class === 'HSL_SM'">
                <tr>
                  <td class="info-cell">High Symmetry Lines</td>
                  <td>{{ matShow.soc_dgn_hsl }}
                    <b-btn v-if="false" @click="toggle_soc_hsl" class="float-right">
                      <span style="font-size:smaller;">Show/Hide</span>
                    </b-btn>
                  </td>
                </tr>
              </template>
              <template v-if="mat.soc_topo_class === 'TI' || mat.soc_topo_class === 'TCI'">
                <tr>
                  <td class="info-cell">Symmetry-based Indicator</td>
                  <td> {{ matShow.soc_sym_ind }}
                  </td>
                </tr>
                <tr>
                  <td class="info-cell">Indicator Group</td>
                  <td>{{ matShow.soc_ind_group }}</td>
                </tr>
                <tr v-if="matShow.soc_inv_table">
                  <td colspan="2" align="center">
                    <b-button class="ml-3" @click="showInvTable">
                      Show possible invariants
                    </b-button>
                    <b-modal v-if="matShow.soc_inv_table" size="lg" ref="modalInvTable" id="modalInvTable" hide-footer title="Possible topological invariants" align="left">
                      <table style="width:100%;" class="table">
                        <tbody>
                          <tr>
                            <th v-for="(item,index) in matShow.soc_inv_table.head" :key="index" class="info-cell text-center">
                              {{ formatMath(item) }}

                              <!--
                              <vue-mathjax :formula="item"></vue-mathjax>
                              -->
                            </th>
                          </tr>
                          <tr v-for="(row,index) in matShow.soc_inv_table.body" :key="index">
                            <td v-for="(item,index) in row" :key="index" class="info-cell" align="center"
                                    :class="{'inv-observable': item.observable}">
                              {{ formatMath(item.invariant) }}
                              <!--
                              <vue-mathjax :formula="item.invariant"></vue-mathjax>
                              -->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <span> Each row of the table corresponds to one possible set of topological invariants with respect to the corresponding symmetry operations. </span>
                      <span class="inv-observable">Invariants in blue are observable.</span>
                      <span>More infomation on the notations can be found in Supplementary Note 7 in Supplementary Information of the article:
                        <a target="_blank" href=https://www.nature.com/articles/s41467-018-06010-w>Nature communications 9, no. 1 (2018): 3530</a>
                      </span>
                    </b-modal>
                  </td>
                </tr>
              </template>
              <template v-if="mat.soc_topo_class === 'Triv_Ins'">
                <tr>
                  <td class="info-cell">Symmetry-based Indicator</td>
                  <td>{{ matShow.soc_sym_ind || 'N/A' }}</td>
                </tr>
                <tr>
                  <td class="info-cell">Indicator Group</td>
                  <td>{{ matShow.soc_ind_group || 'N/A' }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </b-col>
      </b-row>
      <!-- NSOC DOS -->
      <b-col v-if="mat.nsoc_dos" cols="12" class="mb-5">
        <h4 class="d-flex justify-content-between align-items-center">
          <span class="text-muted">Non-SOC Density of States</span>
        </h4>
        <Chart :height="50" :data="nsocDosData" :options="dosOptions"></Chart>

      </b-col>

      <!-- SOC DOS -->
      <b-col v-if="mat.soc_dos" cols="12" class="mb-5">
        <h4 class="d-flex justify-content-between align-items-center">
          <span class="text-muted">SOC Density of States</span>
        </h4>
        <Chart :height="50" :data="socDosData" :options="dosOptions"></Chart>
      </b-col>
      <!-- Calculation Summary -->
      <b-col cols="12" class="mb-5">
        <h4 class="d-flex justify-content-between align-items-center">
          <span class="text-muted">Calculation Summary</span>
        </h4>
        <table class="table striped rounded">
          <tbody>
            <tr>
              <td>
                The calculations are performed by Vienna abinitio Simulation Package (VASP 5.3) with the generalized gradient  approximation (GGA) of Perdew-Burke-Ernzerhof (PBE) type exchange-correlation potential.
                The cut-off energy of plane wave basis set is set to be the ENMAX value in the pseudo-potential file plus 25%.
                A Γ-centered Monkhorst-Pack grid with 30 k-points per Å
                <sup>-1</sup>
                is used for the self-consistent calculations.
              </td>
            </tr>
            <tr>
              <td>
                <a href="#" @click.prevent="$refs.modalPseudo.show()">
                  VASP PBE-type pseudopotential files
                </a>
              </td>
            </tr>
            <tr v-if="mat.nsoc_band || mat.soc_band">
              <td>
                The paths used in band structure calculations are generated by using the
                <a target="_blank" href="https://github.com/giovannipizzi/seekpath">SeeK-path </a> code
              </td>
            </tr>
          </tbody>
        </table>
        <!--
        <b-modal size="lg" ref="modalPseudo" hide-footer title="POTCAR files">
          <span>Elements with only one type of PBE-type psudopotential are not listed</span>
          <table style="width:100%;" class="table">
            <tbody>
              <tr v-for="(i,index) in potcarRows" :key="index">
                <template v-for="j in [0, 1, 2, 3]" v-if="validIJ(i, j)">
                    <td style="width:10%;" class="info-cell"> {{ potcarKeys[i*4+j] }} </td>
                    <td style="width:10%;"> {{ potcars[potcarKeys[i*4+j]] }} </td>
                </template>
              </tr>
            </tbody>
          </table>
        </b-modal>
        -->
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Chart from './Chart.vue'
import MathJax from '../MathJax.js'

function getLatticePara (cif) {
  let lines = cif.split('\n')
  let latticePara = {}
  let keys = ['_cell_length_a', '_cell_length_b', '_cell_length_c', '_cell_angle_alpha', '_cell_angle_beta', '_cell_angle_gamma']
  lines.forEach(line => {
    line = line.split(/\s+/)
    if (line.length === 2 && keys.includes(line[0])) {
      latticePara[line[0]] = parseFloat(line[1])
    }
  })
  return latticePara
}

function formatHSP (str) {
  return str.replace(/GM/g, '\u0393')
}

function formatIR (str) {
  let re = /([^\d]+)(\d*)([d+-]?)/
  let rst = re.exec(str)
  let rtn = formatHSP(rst[1])
  if (rst[3] === 'd') {
    rtn = '<font style="text-decoration:overline;">' + rtn + '</font>'
  }
  if (rst[2] !== '') {
    rtn += '<sub>' + rst[2] + '</sub>'
  }
  if (rst[3] === '+' || rst[3] === '-') {
    rtn += '<sup>' + rst[3] + '</sup>'
  }
  return rtn
}

function loadDOS (raw, eFermi = null) {
  if (raw === 'None') {
    return null
  }
  if (eFermi === null) {
    eFermi = Math.min(...raw.map(line => {
      return line[0]
    })) + 4
  }

  let data = raw.map(line => {
    return {x: line[0] - eFermi, y: line[1]}
  })
  return data
}

function getPotcars () {
  return {
    Ac: 'Ac',
    Ag: 'Ag',
    Al: 'Al',
    Ar: 'Ar',
    As: 'As',
    Au: 'Au',
    B: 'B',
    Ba: 'Ba_sv',
    Be: 'Be_sv',
    Bi: 'Bi',
    Br: 'Br',
    C: 'C',
    Ca: 'Ca_sv',
    Cd: 'Cd',
    Ce: 'Ce',
    Cl: 'Cl',
    Co: 'Co',
    Cr: 'Cr_pv',
    Cs: 'Cs_sv',
    Cu: 'Cu_pv',
    Dy: 'Dy_3',
    Er: 'Er_3',
    Eu: 'Eu',
    F: 'F',
    Fe: 'Fe_pv',
    Ga: 'Ga_d',
    Gd: 'Gd',
    Ge: 'Ge_d',
    H: 'H',
    He: 'He',
    Hf: 'Hf_pv',
    Hg: 'Hg',
    Ho: 'Ho_3',
    I: 'I',
    In: 'In_d',
    Ir: 'Ir',
    K: 'K_sv',
    Kr: 'Kr',
    La: 'La',
    Li: 'Li_sv',
    Lu: 'Lu_3',
    Mg: 'Mg_pv',
    Mn: 'Mn_pv',
    Mo: 'Mo_pv',
    N: 'N',
    Na: 'Na_pv',
    Nb: 'Nb_pv',
    Nd: 'Nd_3',
    Ne: 'Ne',
    Ni: 'Ni_pv',
    Np: 'Np',
    O: 'O',
    Os: 'Os_pv',
    P: 'P',
    Pa: 'Pa',
    Pb: 'Pb_d',
    Pd: 'Pd',
    Pm: 'Pm_3',
    Pr: 'Pr_3',
    Pt: 'Pt',
    Pu: 'Pu',
    Rb: 'Rb_sv',
    Re: 'Re_pv',
    Rh: 'Rh_pv',
    Ru: 'Ru_pv',
    S: 'S',
    Sb: 'Sb',
    Sc: 'Sc_sv',
    Se: 'Se',
    Si: 'Si',
    Sm: 'Sm_3',
    Sn: 'Sn_d',
    Sr: 'Sr_sv',
    Ta: 'Ta_pv',
    Tb: 'Tb_3',
    Tc: 'Tc_pv',
    Te: 'Te',
    Th: 'Th',
    Ti: 'Ti_pv',
    Tl: 'Tl_d',
    Tm: 'Tm_3',
    U: 'U',
    V: 'V_pv',
    W: 'W_pv',
    Xe: 'Xe',
    Y: 'Y_sv',
    Yb: 'Yb_2',
    Zn: 'Zn',
    Zr: 'Zr_sv'
  }
}

function getDefaultData () {
  return {
    potcars: getPotcars(),

    mat: {
    },

    matShow: {
      spacegroup: {
        schoenflies: []
      },
      prim_lattice_para: {},
      conv_lattice_para: {}
    },

    cellType: 'primitive',

    paths: [],
    showingPaths: null,

    dosOptions: {
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'DoS'
          },
          ticks: {
            beginAtZero: false
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Energy / eV'
          },
          ticks: {
            min: -4,
            max: 4
          }
        }]
      },
      legend: {
        display: false
      },
      maintainAspectRatio: true
    }
  }
}

export default {
  name: 'Material',

  metaInfo () {
    return {
      title: this.page_title
    }
  },

  components: {
    Chart
  },

  data: getDefaultData,

  computed: {
    page_title () {
      let formula = this.mat.formula === undefined ? '' : this.mat.formula
      let sg = this.mat.spacegroup === undefined ? '' : this.mat.spacegroup.number
      return 'Topological properties and more for material ' + formula + ' (sg' + sg + ')'
    },

    potcarKeys () {
      return Object.keys(this.potcars)
    },

    potcarRows () {
      return [...Array(Math.ceil(this.potcarKeys.length / 4)).keys()]
    },

    lattice_para () {
      if (this.cellType === 'conventional') {
        return this.matShow.conv_lattice_para
      } else {
        return this.matShow.prim_lattice_para
      }
    },

    nsocDosData () {
      let datasets = [{
        label: 'Temperature',
        data: this.matShow.nsoc_dos,
        lineTension: 0,
        borderColor: '#6ebaae',
        borderWidth: 2,
        pointRadius: 0,
        showLine: true
      }]
      return {datasets: datasets}
    },

    socDosData () {
      let datasets = [{
        label: 'Temperature',
        data: this.matShow.soc_dos,
        lineTension: 0,
        borderColor: '#6ebaae',
        borderWidth: 2,
        pointRadius: 0,
        showLine: true
      }]
      return {datasets: datasets}
    }
  },
  methods: {
    formatMath (str) {
      let pattern = /\$(.*?)\$/g
      let match = pattern.exec(str)
      let rtn = match ? '\\(' + match[1] + '\\)' : str
      return rtn
    },

    validIJ (i, j) {
      return i * 4 + j < this.potcarKeys.length
    },

    showNsocBand () {
      this.$refs.modalNsocBand.show()
    },

    showSocBand () {
      this.$refs.modalSocBand.show()
    },

    showInvTable () {
      this.$refs.modalInvTable.show()
    },

    showNodalLine () {
      this.$refs.modalNodalLine.show()
    },

    changeCell (cellType) {
      this.cellType = cellType
    },

    processData (mat) {
      let newMat = {}
      Object.keys(mat).map(key => {
        let value = mat[key]
        value = value === 'Triv_Ins' ? 'Trivial insulator' : value
        value = value === null ? 'None' : value
        if (key === 'icsd_ids') {
          value = value.join(', ')
        } else if (key === 'nsoc_dgn_hsl' || key === 'soc_dgn_hsl') {
          value = value.join(', ')
          value = formatHSP(value)
        } else if (key === 'spacegroup') {
          value.schoenflies = value.schoenflies.split('^')
        } else if (key === 'prim_cif_str') {
          newMat.prim_lattice_para = getLatticePara(value)
        } else if (key === 'conv_cif_str') {
          newMat.conv_lattice_para = getLatticePara(value)
        } else if (key === 'nsoc_ind_group' || key === 'soc_ind_group') {
          value = value.split('_').join(', ')
        } else if ((key === 'nsoc_sym_ind' || key === 'soc_sym_ind') && value !== 'None') {
          value = value.map(i => { return i.toString() }).join(', ')
        } else if (key === 'formula') {
          value = value.replace(/\d+/g, str => { return '<sub>' + str + '</sub>' })
        } else if (key === 'nsoc_dgn_IR' || key === 'soc_dgn_IR') {
          let dimkey = key === 'nsoc_dgn_IR' ? 'nsoc_dgn_dim' : 'soc_dgn_dim'
          value = value.map((IRs, i) => {
            return IRs.map(IR => {
              return formatIR(IR)
            }).join('') + '(' + this.mat[dimkey][i] + ')'
          }).join(', ')
        } else if (key === 'nsoc_dgn_hsp' || key === 'soc_dgn_hsp') {
          value = value.map(point => {
            return formatHSP(point)
          }).join(', ')
        } else if (key === 'nsoc_dos') {
          value = loadDOS(value, mat.nsoc_efermi)
        } else if (key === 'soc_dos') {
          value = loadDOS(value, mat.soc_efermi)
        } else if ((key === 'nsoc_dos_gap' || key === 'soc_dos_gap') && value === 'None') {
          value = 'N/A'
        }
        newMat[key] = value
      })
      return newMat
    },

    fetchData () {
      let id = this.$route.params.id
      console.log(id)
      let query = {'id': id}
      console.log(query)
      this.axios.get('/api/material', { params: query })
        .then(res => {
          this.mat = res.data.materials[0]
          console.log(this.mat)
          this.matShow = this.processData(res.data.materials[0])
          console.log(this.matShow)
          this.$nextTick(function () {
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'modalInvTable'])
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'modalNodalLine'])
          })
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            this.$router.push('/404')
          }
          console.log(error)
        })
    },

    toggle_nsoc_hsl () {
      if (this.showingPaths === 'nsoc_dgn_hsl') {
        this.paths = []
        this.showingPaths = null
      } else {
        this.paths = this.mat.nsoc_dgn_hsl.map(line => { return line.split('-') })
        this.showingPaths = 'nsoc_dgn_hsl'
      }
    },

    toggle_soc_hsl () {
      if (this.showingPaths === 'soc_dgn_hsl') {
        this.paths = []
        this.showingPaths = null
      } else {
        this.paths = this.mat.soc_dgn_hsl.map(line => { return line.split('-') })
        this.showingPaths = 'soc_dgn_hsl'
      }
    }

  },

  watch: {
    $route (to, from) {
      Object.assign(this.$data, getDefaultData())
      this.fetchData()
      window.scrollTo(0, 0)
    }
  },

  mounted () {
    this.fetchData()
  },

  activated () {
    window.scrollTo(0, 0)
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.inv-observable {
  color: #2256fc;
}
</style>
