// @ts-ignore
import api from '@molgenis/molgenis-api-client'
import ApplicationState from '@/types/ApplicationState'
import { tryAction } from './helpers'
import * as metaDataRepository from '@/repository/metaDataRepository'
import * as dataRepository from '@/repository/dataRepository'

export default {
  loadTableData: tryAction(async ({ commit, state } : {commit: any, state: ApplicationState}) => {
    const response = await api.get(`/api/data/${state.tableName}`)
    commit('setTableData', response)
  }),
  getTableSettings: tryAction(async ({ commit, state }: { commit: any, state: ApplicationState },
    payload: { tableName: string }) => {
    const response = await api.get(`/api/data/${state.tableSettings.settingsTable}?q=table=="${payload.tableName}"`)
    if (response.items.length > 0) {
      const id = response.items[0].data.id
      commit('setTableSettings', response.items[0].data)
      return id
    }
  }),
  getTableData: async ({ commit, state }: { commit: any, state: ApplicationState }) => {
    if (typeof state.tableName !== 'string') {
      throw new Error('cannot load table data for non string table id')
    }
    const metaData = await metaDataRepository.fetchMetaData(state.tableName)
    commit('setMetaData', metaData)
    const tableData = await dataRepository.getTableDataWithReference(state.tableName, metaData, state.tableSettings.collapseLimit)
    commit('setTableData', tableData)
  },
  fetchRowData: async ({ commit, state }: { commit: any, state: ApplicationState }, payload: {rowId: string}) => {
    if (typeof payload.rowId !== 'string') {
      throw new Error('cannot load row data for non string row id')
    }
    if (typeof state.tableName !== 'string') {
      throw new Error('cannot load table data for non string table id')
    }
    const metaData = await metaDataRepository.fetchMetaData(state.tableName)
    commit('setMetaData', metaData)
    const rowData = await dataRepository.getRowDataWithReference(state.tableName, payload.rowId, metaData)
    commit('updateRowData', { rowId: payload.rowId, rowData })
  }

}
