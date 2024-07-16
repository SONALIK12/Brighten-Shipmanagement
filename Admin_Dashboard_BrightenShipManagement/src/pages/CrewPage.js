import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Button, Modal, Form, InputNumber,DatePicker} from 'antd';
import { ref, push, update, remove, onValue } from 'firebase/database';
import { db,app} from "./firebaseConfig";
import moment from 'moment';
const { Option } = Select;
const dateFormat = 'YYYY/MM/DD';

const CrewPage = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [crewMembersData, setCrewMembersData] = useState([]);                                                                     
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    fetchCrewMembers();
  }, []);

  const fetchCrewMembers = () => {
    onValue(ref(db, 'crewMembers'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const crewDataArray = Object.entries(data).map(([key, value]) => ({ key, ...value }));
        setCrewMembersData(crewDataArray);
      }
    });
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      form.resetFields();
      setVisible(false);
      if (editingKey !== '') {
        update(ref(db, `crewMembers/${editingKey}`), values);
        setEditingKey('');
      } else {
        const formattedValues = {
          ...values,
          joiningDate: moment(values.joiningDate).format(dateFormat), // Format using Moment.js
        };
  
        push(ref(db, 'crewMembers'), formattedValues)
          .catch((error) => {
            console.log('Push failed:', error.message);
          });
      }
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
    setEditingKey('');
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    showModal();
  };

  const handleDelete = (key) => {
    remove(ref(db, `crewMembers/${key}`))
      .then(() => {
        console.log('Delete successful!');
        const index = findIndexByKey(key);
        if (index !== -1) {
          const updatedData = [...crewMembersData];
          updatedData.splice(index, 1);
          setCrewMembersData(updatedData);
        }
      })
      .catch((error) => {
        console.log('Delete failed:', error.message);
      });
  }

  const findIndexByKey = (key) => {
    return crewMembersData.findIndex((item) => item.key === key);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      filters: [
        { text: 'Captain', value: 'Captain' },
        { text: 'First Officer', value: 'First Officer' },
        { text: 'Engineer', value: 'Engineer' },
      ],
      onFilter: (value, record) => record.designation === value,
    },
    {
      title: 'Nationality',
      dataIndex: 'nationality',
      key: 'nationality',
    },
    {
      title: 'Joining Date',
      dataIndex: 'joiningDate',
      key: 'joiningDate',
      render: (joiningDate) => (
        <span title={joiningDate}>{joiningDate}</span>
      ),
    },
    {
      title: 'Email Address',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Certificate Type',
      dataIndex: 'certificateType',
      key: 'certificateType',
      filters: [
        { text: 'COC', value: 'COC' },
        { text: 'COP', value: 'COP' },
        { text: 'COOK COC', value: 'COOK COC' },
        { text: 'Other', value: 'Other' },
      ],
      onFilter: (value, record) => record.certificateType === value,
    },
    {
      title: 'Certificate Number',
      dataIndex: 'certificateNumber',
      key: 'certificateNumber',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" onClick={() => handleDelete(record.key)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h1>Crew Members of Brighten Ship Management</h1>
      <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
        Add New Crew Member
      </Button>
      <Table
        columns={columns}
        dataSource={crewMembersData}
        pagination={{ pageSize: 10 }}
        onChange={(pagination, filters, sorter) => console.log(sorter)}
      />

      <Modal
        title={editingKey ? 'Edit Crew Member' : 'Add New Crew Member'}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="designation"
            label="Designation"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Captain">Captain</Option>
              <Option value="First Officer">First Officer</Option>
              <Option value="Engineer">Engineer</Option>
            </Select>
          </Form.Item>
          <Form.Item name="nationality" label="Nationality">
            <Input />
          </Form.Item>
          <Form.Item name="joiningDate" label="Joining Date" rules={[{ required: true }]}>
            <input type="date" name="joiningDate" id="joiningDate" className="ant-input" />
          </Form.Item>
          <Form.Item name="email" label="Email Address">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender">
            <Input />
          </Form.Item>
          <Form.Item name="age" label="Age">
            <InputNumber />
          </Form.Item>
          <Form.Item name="certificateType" label="Certificate Type">
            <Select>
              <Option value="COC">COC</Option>
              <Option value="COP">COP</Option>
              <Option value="COOK COC">COOK COC</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="certificateNumber" label="Certificate Number">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CrewPage;
