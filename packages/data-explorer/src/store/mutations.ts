import ApplicationState, { Toast, FilterDefinition } from '@/types/ApplicationState'
import { DataApiResponse } from '@/types/ApiResponse'
import { StringMap } from '@/types/GeneralTypes'
import Vue from 'vue'
import { MetaData } from '@/types/MetaData'

export default {
  setToast (state: ApplicationState, toast: Toast) {
    state.toast = toast
  },
  clearToast (state: ApplicationState) {
    state.toast = null
  },
  setDataDisplayLayout (state: ApplicationState, layout: ApplicationState['dataDisplayLayout']) {
    state.dataDisplayLayout = layout
  },
  setTableData (state: ApplicationState, data: DataApiResponse) {
    state.tableData = data
  },
  setHideFilters (state: ApplicationState, hideFilters: boolean) {
    state.filters.hideSidebar = hideFilters
  },
  setTableName (state: ApplicationState, entity: string) {
    state.tableName = entity
  },
  setShowShoppingCart (state: ApplicationState, cart: boolean) {
    state.showShoppingCart = cart
  },
  toggleShoppingItems (state: ApplicationState, id: string) {
    const index = state.shoppedEntityItems.indexOf(id)
    if (index !== -1) {
      state.shoppedEntityItems.splice(index, 1)
    } else {
      state.shoppedEntityItems.push(id)
    }
  },
  setTableSettings (state: ApplicationState, tableSettings: StringMap) {
    const isPropSet = (prop: string) => typeof tableSettings[prop] !== 'undefined'

    if (isPropSet('shop')) {
      state.tableSettings.isShop = Boolean(tableSettings.shop)
    }
    if (isPropSet('collapse_limit')) {
      state.tableSettings.collapseLimit = parseInt(tableSettings.collapse_limit)
    }
    if (isPropSet('id')) {
      state.tableSettings.settingsRowId = tableSettings.id
    }
    if (isPropSet('card_template')) {
      state.tableSettings.customCardCode = tableSettings.card_template
    }
    if (isPropSet('template_attrs')) {
      state.tableSettings.customCardAttrs = tableSettings.template_attrs
    }
    if (isPropSet('default_filters')) {
      state.tableSettings.defaultFilters = tableSettings.default_filters.split(',').map(f => f.trim())
    }
  },
  setMetaData (state: ApplicationState, metaData: MetaData) {
    state.tableMeta = metaData
  },
  setFilterSelection (state: ApplicationState, selections: StringMap) {
    Vue.set(state.filters, 'selections', selections)
  },
  setFilterDefinition (state: ApplicationState, definition: FilterDefinition[]) {
    Vue.set(state.filters, 'definition', definition)
  },
  setFiltersShown (state: ApplicationState, shown: string[]) {
    Vue.set(state.filters, 'shown', shown)
  },
  updateRowData (state: ApplicationState, { rowId, rowData }: {rowId: string, rowData: StringMap}) {
    if (!state.tableData) {
      throw new Error('cannot update empty table data')
    }
    // todo need to refacor state.tableData to look up list
    state.tableData.items.forEach((row, index) => {
      // @ts-ignore
      if (rowId && row[state.tableMeta.idAttribute.name].toString() === rowId.toString()) {
        // @ts-ignore
        Vue.set(state.tableData.items, index, rowData)
      }
    })
  },
  removeRow (state: ApplicationState, { rowId }: {rowId: string}) {
    if (!state.tableData) {
      throw new Error('Cannot delete item from empty table')
    }
    // todo need to refacor state.tableData to look up list
    state.tableData.items.forEach((row, index) => {
      // @ts-ignore
      if (rowId && row[state.tableMeta.idAttribute.name].toString() === rowId.toString()) {
        // @ts-ignore
        Vue.delete(state.tableData.items, index)
      }
    })
  },
  setIsSettingsLoaded (state: ApplicationState, isLoaded: boolean) {
    state.isSettingsLoaded = isLoaded
  },
  setSearchText (state: ApplicationState, searchText: string) {
    state.searchText = searchText
  }
}
