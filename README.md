# VueFormer

## 更新记录

- 11.15 首次提交
- 11.15-11.18 完成基础组件的渲染
- 11.19-11.21 完成嵌套数据的渲染
- 11.22-11.23 布局和定义Schema
- 11.24- 校验

## 问题记录

antd-vue 嵌套对象时可能报错 `please transfer a valid name path to form item!` 但不影响
formData 中比如`a.b`的 path,这时候要求 a 对象必须存在
