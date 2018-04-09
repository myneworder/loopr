import React from 'react';
import {Card, message, List, Input, Icon, Form, Button, Radio} from 'antd'
import {paths} from '../../../common/config/data'
import intl from 'react-intl-universal';
import {unlockRedirection} from '../../../common/utils/redirection'

const RadioGroup = Radio.Group;
export default class DetermineWallet extends React.Component {
  state = {
    pageNum: 0,
    pageSize: 5,
    customPath:"m/44'/60'/1'/",
    selectedPath:0,
    addresses:[]
  };
  onChange = (e) => {
    this.setState({
      index: e.target.value,
    });
  };

  componentDidMount(){
    const {pageNum,pageSize} = this.state;
    const addresses = window.WALLET.getAddresses(pageSize, pageNum);
    this.setState({addresses})
  }
  nextPage = () => {
    const {pageNum,pageSize} = this.state;
    const addresses = window.WALLET.getAddresses(pageSize, pageNum);
    this.setState({pageNum: pageNum + 1,addresses})
  };
  previousPage = () => {
    const {pageNum,pageSize} = this.state;
    const addresses = window.WALLET.getAddresses(pageSize, pageNum);
    this.setState({pageNum: pageNum - 1,addresses})
  };

  handlePathChange= (path,index) => {
    const {modal} = this.props;
    const {handlePathChange} = modal;
  //  const {handlePathChange} =  this.props;
    handlePathChange(path,() => {
      const pageNum=0;
      const addresses = window.WALLET.getAddresses(this.state.pageSize, pageNum);
      this.setState({pageNum,addresses,selectedPath:index})
    });

  };
   onCustomPathChange =(e) => {
     this.setState({customPath:e.target.value})
   };

  confirm = (index) => {
    const {modal} = this.props;
    const {pageFrom,setWallet} = modal;
    const {pageNum, pageSize} = this.state;
    setWallet(pageNum * pageSize +index);
    modal.hideModal({id: 'wallet/determineWallet'});
    modal.hideModal({id: 'wallet/unlock'});
    unlockRedirection(pageFrom)
  };

  render() {
    const {addresses,selectedPath} = this.state;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return (
      <Card>
        <Form>
          <Form.Item label="选择钱包">
            <List
              grid={{ column: 3}}
              dataSource={paths}
              className='mt10'
              renderItem={(item,index) => (
                <List.Item style={{height:'80px'}} className={`mr10 p10  ${selectedPath===index && 'bg-grey-200'}`}>
                  <List.Item.Meta title={item.path}  description = {item.wallet.join(", ")} onClick={this.handlePathChange.bind(this,item.path,index)}/>
                </List.Item>
              )}
            />
          </Form.Item>
          <Form.Item label="您自定义的路径:" className={`col-6`}>
            <Input addonAfter={<Icon type="caret-right" onClick={this.handlePathChange.bind(this,this.state.customPath,-1)}/>}
                   value={this.state.customPath} onChange={this.onCustomPathChange}/>
          </Form.Item>
          <Form.Item label="选择您要使用的地址" >
            {addresses.map((address, index) => {
              return (
                <div key={index} className="mb10 fs16 color-black-2 d-flex justify-content-between row" style={radioStyle}>
                  <span className='col-6'>{address}</span>
                  <Button className='col-auto mr20' onClick={this.confirm.bind(this,index)}> Import</Button>
                </div>)
            })}
          </Form.Item>
        </Form>
        <div className="pt15 d-flex justify-content-between zb-b-t">
          <Button onClick={this.previousPage}>{intl.get('wallet.pre_page')}</Button>
          <Button onClick={this.nextPage}> {intl.get('wallet.next_page')}</Button>
        </div>
      </Card>
    )
  }
}
