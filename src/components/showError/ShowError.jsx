/* eslint-disable react/prop-types */
import { Alert } from 'antd'
import './showError.css'

export default function ShowError({description = 'Произошла ошибка'}) {
  return <Alert message="Ошибка" description={description} type="error" showIcon />
}
