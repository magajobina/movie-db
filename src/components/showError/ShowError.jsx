import { Alert } from 'antd'
import './showError.css'

export default function ShowError() {
  return <Alert message="Error" description="Произошла ошибка" type="error" showIcon />
}
