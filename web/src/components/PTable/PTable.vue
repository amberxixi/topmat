<template>
  <div :class="{'ptable':true, 'ptable-full':full}">
    <div class="ptable-main">
      <div :class="{'ptable-row':true, 'ptable-row-full':full}" v-for="i in 7" :key="i">
        <div :class="classes(i, j)" v-for="j in 18" :key="j" @click="clickCell(i, j)">
          <i :class="{'element-id':true, 'element-id-full':full}" @mousedown.stop.prevent>{{ index(i, j)}}</i>
          <strong :class="{'element-symbol':true, 'element-symbol-full':full}" @mousedown.stop.prevent>{{ symbol(i, j) }}</strong>
        </div>
      </div>
    </div>
    <div class="ptable-LaAc">
      <div :class="{'ptable-row':true, 'ptable-row-full':full}" v-for="i in [8, 9]" :key="i">
        <div :class="classes(i, j)" v-for="j in 15" :key="j" @click="clickCell(i, j)">
          <i :class="{'element-id':true, 'element-id-full':full}" @mousedown.stop.prevent>{{ index(i, j)}}</i>
          <strong :class="{'element-symbol':true, 'element-symbol-full':full}" @mousedown.stop.prevent>{{ symbol(i, j) }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {cells, symbolToObj} from './PTableData.js'

export default {
  name: 'PTable',

  componentName: 'PTable',

  components: {
  },

  props: {
    value: Array,
    min: Number,
    max: Number,
    full: Boolean
  },

  data () {
    return {
      elems: this.value,
      isActive: Array(104),
      oldValue: []
    }
  },

  methods: {
    getArray: function (min, max) {
      let a = [min]
      while (min < max) {
        min++
        a.push(min)
      }
      return a
    },

    handleClick (elem) {
      console.log(elem)
      let i = elem.ind
      this.isActive[i] = !this.isActive[i]
      let ind = this.elems.indexOf(elem.symbol)
      if (ind === -1) {
        let isLimitExceeded = false
        this.min !== undefined && this.elems.length < this.min && (isLimitExceeded = true)
        this.max !== undefined && this.elems.length > this.max && (isLimitExceeded = true)
        isLimitExceeded === false && this.elems.push(elem.symbol)
      } else {
        this.elems.splice(ind, 1)
      }
      this.$emit('input', this.elems)
    },

    classes (i, j) {
      let rtn = {}
      let cell = cells[(i - 1) * 18 + j - 1]
      if (cell == null) {
        rtn = {
          'ptable-cell': true,
          'ptable-cell-blank': true
        }
      } else if (cell.symbol.length > 2) {
        rtn = {
          'ptable-cell': true,
          'ptable-cell-LaAc': true,
          'disabled': true
        }
      } else {
        rtn = {
          'ptable-cell': true,
          'active': this.isActive[cell.ind]
        }
      }
      if (this.full) {
        rtn['ptable-cell-full'] = true
      }
      return rtn
    },

    index (i, j) {
      let cell = cells[(i - 1) * 18 + j - 1]
      if (cell == null) {
        return ''
      }
      return cell.ind
    },

    symbol (i, j) {
      let cell = cells[(i - 1) * 18 + j - 1]
      if (cell == null) {
        return ''
      }
      return cell.symbol
    },

    clickCell (i, j) {
      let cell = cells[(i - 1) * 18 + j - 1]
      if (cell && cell.symbol.length < 3) {
        this.handleClick(cell)
      }
    }
  },

  watch: {
    value (newValue) {
      this.elems = newValue
      newValue.forEach((symbol, index) => {
        let elemObj = symbolToObj(symbol)
        if (elemObj === undefined) return
        let i = this.oldValue.indexOf(symbol)
        if (i === -1) { // if not in old list, make it active
          this.isActive.splice(elemObj.ind, 1, true)
        } else { // if already in old list, remove it from the old list then do nothing
          this.oldValue.splice(i, 1)
        }
      })
      this.oldValue.forEach(symbol => { // for those in old list but not in new list, make inactive
        let elemObj = symbolToObj(symbol)
        if (elemObj === undefined) return
        this.isActive.splice(elemObj.ind, 1, false)
      })
      this.oldValue = newValue.slice()
    }
  },

  created () {
    this.isActive.fill(false)
  }
}
</script>

<style>
.ptable {
  margin: auto;
}
.ptable-LaAc {
  margin: 30px auto 0 30px;
}
.ptable-cell {
  position: relative;
  box-sizing: border-box;
  display: block;
  float: left;
  padding: 2px;
  cursor: pointer;
  z-index: 10;
  border: 1px solid rgba(255,255,255,0);
  background-color: #F7C331;
  background-clip: padding-box;
}
.ptable-cell-blank {
  background-color: transparent;
  cursor: auto;
}
.active {
  /* background: #FADE98;*/
  background-color: #F7882F;
}
.disabled {
  cursor: default;
  opacity: 0.4;
}
.element-id {
  font-style: italic;
  text-align: left;
}
.element-symbol {
  position: absolute;
  left: 0;
  right: 0;
  display: block;
  line-height: 30px;
  margin-top: -4px;
  text-align: center;
  font-weight: bold;
}
/* Size specific rules */
.ptable {
  width: 600px;
}
.ptable-full {
  width: 864px;
}
.ptable-row {
  box-sizing: border-box;
  height: 33.333px;
}
.ptable-row-full {
  box-sizing: border-box;
  height: 48px;
}
.ptable-cell {
  width: 33.333px;
  height: 33.333px;
}
.ptable-cell-full {
  width: 48px;
  height: 48px;
}
.element-id {
  display: none;
}
.element-id-full {
  display: block;
  font-size: 10px;
}
.element-symbol {
  font-size: 16px;
  position: relative;
  top: 3px;
}
.element-symbol-full {
  font-size: 20px;
}
.ptable-cell-LaAc .element-symbol {
  font-size: 10px;
}
.ptable-cell-LaAc .element-symbol-full {
  font-size: 14px;
}

</style>
