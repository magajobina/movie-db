/* eslint-disable react/jsx-props-no-spreading */
import { Spin, Col } from 'antd'
import './spinner.css'

export default function Spinner(props) {
  return (
    <Col lg={24}>
      <div className="text-center">
        <Spin size="large" {...props} />
      </div>
    </Col>
  )
}
