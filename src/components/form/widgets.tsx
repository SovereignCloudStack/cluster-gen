"use client"

import { RegistryWidgetsType, WidgetProps } from '@rjsf/utils'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

export const widgets: RegistryWidgetsType = {
    CheckboxWidget: function (props: WidgetProps) {
        return <Checkbox checked={props.value} onChange={props.onChange} />
    },
    TextWidget: function (props: WidgetProps) {
        return <Input onChange={e => props.onChange(e.target.value)} value={props.value} className='text-red-500' />
    },
}
