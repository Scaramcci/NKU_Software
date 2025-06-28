import { DatePicker } from 'antd';

const DateSelector = ({ onChange }) => (
  <DatePicker 
    picker="month" 
    onChange={onChange}
    style={{ width: '100%' }}
  />
);