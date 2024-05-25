import { Spin, Col } from 'antd'
import './spinner.css';

export default function Spinner() {
  return (
    <Col lg={24}>
      <div className="text-center">
        <Spin size="large" />
      </div>
    </Col>
  )
}
