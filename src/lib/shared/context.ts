import type { Schema, PresetConfig } from '../types'
import type { InjectionKey } from 'vue'

export const ContextSymbol: InjectionKey<{
  schema: Schema
  formData: Record<string, any>
  config: PresetConfig
}> = Symbol('Context')

export const defaultCtx = { schema: {}, formData: {}, config: {} }
