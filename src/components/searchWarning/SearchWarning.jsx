/* eslint-disable react/prop-types */
import { Alert } from 'antd'
import './searchWarning.css'

export default function SearchWarning({ message }) {
  return <Alert message={message} type="warning" showIcon />
}
