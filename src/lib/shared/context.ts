import type { Schema, PresetConfig } from '../types'
import type { InjectionKey } from 'vue'

export const ContextSymbol: InjectionKey<{
  schema: Schema
  formData: any
  config: PresetConfig
}> = Symbol('former')
