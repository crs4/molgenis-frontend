import { mount } from '@vue/test-utils'
import Pagination from '@/components/ui/Pagination.vue'
import { localVue as getLocalVue } from '../../lib/helpers'

let wrapper: any

const localVue: any = getLocalVue()

let propsData: any

const buildWrapper = async (propsData: any, attrs: any = null) => {
  wrapper = await mount(Pagination, {
    listeners: {
      input: async function (e: any) {
        propsData.value = e
      }
    },
    localVue,
    mocks: {
      $tc: (msg: any) => msg,
      $t: (msg: any) => msg
    },
    propsData,
    ...attrs
  })

  return wrapper
}

describe('Pagination.vue', () => {
  it('navigates within a paginated range', async () => {
    propsData = {
      value: {
        count: 100, loading: false, size: 20, page: 4
      },
      visiblePages: 3
    }
    const wrapper = await buildWrapper(propsData)
    // The model is leading to determine the current page:
    expect(wrapper.vm.localValue).toEqual({ count: 100, loading: false, page: 4, size: 20 })
    await wrapper.find('.t-page-next').trigger('click')
    expect(propsData.value.page).toEqual(5)
    // // Next page is disabled when on the last page:
    expect(wrapper.find('.t-page-next[disabled]').exists()).toBe(true)

    await wrapper.find('.t-page-prev').trigger('click')
    expect(propsData.value.page).toEqual(4)

    // go back to page 1
    await wrapper.find('.t-page-prev').trigger('click')
    await wrapper.find('.t-page-prev').trigger('click')
    await wrapper.find('.t-page-prev').trigger('click')
    expect(propsData.value.page).toEqual(1)
  })

  it('it emits the updated model when the size is changed', async () => {
    propsData = {
      value: { count: 100, loading: false, size: 20, page: 4 },
      visiblePages: 3
    }
    const wrapper = await buildWrapper(propsData)
    const options = await wrapper.find('select').findAll('option')

    await options.at(0).setSelected()
    expect(wrapper.emitted().input[0][0]).toEqual({ count: 100, loading: false, page: 1, size: 10 })
    await options.at(1).setSelected()
    expect(wrapper.emitted().input[1][0]).toEqual({ count: 100, loading: false, page: 1, size: 20 })
    await options.at(2).setSelected()
    expect(wrapper.emitted().input[2][0]).toEqual({ count: 100, loading: false, page: 1, size: 50 })
    await options.at(0).setSelected()
    expect(wrapper.emitted().input[3][0]).toEqual({ count: 100, loading: false, page: 1, size: 10 })
  })
})
