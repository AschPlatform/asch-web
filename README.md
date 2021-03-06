
## 什么是asch-web?

__[asch-web - Developer Document](https://github.com/AschPlatform/asch-docs/blob/master/http_api/zh-cn.md)__
asch-web是一个通过HTTP请求与ASCH节点进行通信的js库。asch-web提供常用的交易写操作API和常用的工具函数，诸如XAS转账，合约执行，账户创建，助记词，公钥和地址转和交易离线签名等等，asch-web受到Ethereum的[web3.js](https://github.com/ethereum/web3.js/)库的设计思想，提供统一的，无缝的开发体验。我们用核心思想对其进行了扩展，集成了ASCH常用的API，asch-web用typescript语言进行编写，可以build生成浏览器环境和node环境的js库，也可以直接在typescript项目中直接引用使用，对于DAapps与asch节点的交互提供了极大的方便。

## 兼容性

- 支持Node.js v8及更高版本构建的版本
- 支持Chrome浏览器环境

您可以从`dist /`文件夹中专门访问这两个版本。
asch-web还兼容前端框架，如Angular，React和Vue。
您也可以在Chrome扩展程序中集成asch-web。

## Build

首先使用git克隆asch-web项目, 安装依赖并且运行示例：

```
git clone https://github.com/AschPlatform/asch-web
cd asch-web
npm install
npm run build

```
dist目录下生成了两个文件夹tsc和webpack, 可供不同环境的项目使用，其中tsc可以拷贝到typescript项目中直接使用，webpack生成的文件可以拷贝到node项目或者web项目直接使用。


## 安装

 1. npm安装

```
npm install asch-web

```
 
2. 本地安装
  
```
npm install path/to/asch-web  #本地路径

```

3. 通过github安装
  
```
npm install git://github.com/AschPlatform/asch-web.git   #master分支
npm install git://github.com/AschPlatform/asch-web.git#kim  #kim分支

```

## 

## 实例

实例源码在`examples`目录下，这个目录分有三个子目录：typescript, browser和server,分别对应typescript, 浏览器和node三种不同运行环境的实例。


### typescript项目实例

```
cd  example/typescript
npm install
npm run build #生成js文件
npm run start #运行js文件

```

```
import { AschWeb } from 'asch-web'
const host = 'http://testnet.asch.cn'// 'http://mainnet.asch.cn/'
const net = AschWeb.Network.Test//   Network.Main

let secret = 'quantum jelly guilt chase march lazy able repeat enrich fold sweet sketch'
let secondSecret = '' //'11111111a'
let address = 'ACFi5K42pVVYxq5rFkFQBa6c6uFLmGFUP2'
let to = 'AHcGmYnCyr6jufT5AGbpmRUv55ebwMLCym'

let unsignedTrx =
{
    type: 1,
    fee: 10000000,
    args: [1000000, 'AHcGmYnCyr6jufT5AGbpmRUv55ebwMLCym'],
    timestamp: 84190767,
    message: '',
    senderPublicKey: '',
    senderId: 'ACFi5K42pVVYxq5rFkFQBa6c6uFLmGFUP2',
}


//utils用法
let keys = AschWeb.Utils.getKeys(secret)
console.log('keys:' + JSON.stringify(keys))

let addr: string = AschWeb.Utils.getAddress(keys.publicKey)
console.log('get address by publicKey:' + addr)


let signedTrx = AschWeb.Utils.fullSign(unsignedTrx, secret, secondSecret)
console.log('full sign transaction:' + JSON.stringify(signedTrx))

const provider = new AschWeb.HTTPProvider(host, net)
const aschWeb = new AschWeb(provider, secret, secondSecret)

aschWeb.api
    .transferXAS(1000000, to, 'test')
    .then(res => {
        console.log('transfer XAS response:' + JSON.stringify(res))
    })
    .catch(err => {
        console.error(err)
    })

const host2 = 'http://mainnet.asch.cn/'
const net2 = AschWeb.Network.Main
const provider2 = new AschWeb.HTTPProvider(host2, net2)
//切换provider
aschWeb.setProvider(provider2)

aschWeb.api
    .get('api/v2/blocks', {})
    .then(res => {
        console.log('get blocks response:' + JSON.stringify(res))
    })
    .catch(err => {
        console.error(err)
    })



```

## HTTP API的基本使用
目前asch节点的api有两种类型，查询操作的api和写操作的api

### 查询api的使用

```javascript
//查询账户详情
let result = await aschWeb.api.getAccountDetail('AdbL9HkeL5CPHmuVn8jMJSHtdeTHL6QXb')
console.log('result:' + JSON.stringify(result))

```

### 写操作api的使用(签名交易api)

```javascript
//发送XAS
let result = await aschWeb.api.transferXAS(123456,to,'test transfer XAS')
console.log('result:' + JSON.stringify(result))

```

### 构建交易-->签名交易-->广播交易

所有的写操作的api都需要：构建交易-->签名交易-->广播交易这3个过程，若不想用api里的方法，也可以如下使用

1. [TransactionBuilder 生成未签名的交易](https://github.com/AschPlatform/asch-web/blob/contract-gen/src/builders/README.md)
```
let trans = TransactionBuilder.transferXAS(1000,to,'test')
console.log('unsigned transcation:'+JSON.stringify(trans))
```

```
unsigned transcation:
{
	"type": 1,
	"fee": 10000000,
	"args": [1000, "AHcGmYnCyr6jufT5AGbpmRUv55ebwMLCym"],
	"timestamp": 86665886,
	"message": "test",
	"senderPublicKey": "",
	"senderId": ""
}
```

2. fullSign 对交易签名，并生成交易ID
```
let signedTrans = AschWeb.Utils.fullSign(trans, secret, secondSecret)
console.log('signed transcation:'+JSON.stringify(signedTrans))
```

```
signed transcation:
{
	"type": 1,
	"fee": 10000000,
	"args": [1000, "AHcGmYnCyr6jufT5AGbpmRUv55ebwMLCym"],
	"timestamp": 86665886,
	"message": "test",
	"senderPublicKey": "0136d2cc3970fb029ac763cfdae6cc44416a7470d04301897f718ecf0cb0d640",
	"senderId": "ACFi5K42pVVYxq5rFkFQBa6c6uFLmGFUP2",
	"signatures": ["89812e11e74243aec19cff9979e58e2f6ae31b70c75b52ad65dfebb816f4bce626d3d310396796526316f90daba409dc4cd7865944df50d570295bc1469d9a05"],
	"id": "ce6f75041fb0041c6523700af174d12da3a8e39d5e730f81aa3727ca24db2982"
}
```

3. broadcastTransaction广播交易

```
let result = aschWeb.api.broadcastTransaction(signedTrans)
    .then(res => {
        console.log('result:' + JSON.stringify(res))
    })
    .catch(err => {
        console.error(err)
    })
```

```
result:
{
	"success": true,
	"transactionId": "15cab894a1c86b68c33e0c47e292fdb474cdca73d6337fd2c7f138c48d6e20e3"
}
```




## 智能合约使用


#### 发布智能合约

```javascript
let code ='<智能合约代码>'
let result = await aschWeb.registerContract('crowdFundging_v2','a crowd funding contract',code)
console.log('registerContract result:'+JSON.stringify(result))
```


#### 创建智能合约实例

```javascript
let contract = await aschWeb.createContractFromName('crowdFundging_v1')
contract.gasLimit=1000000
contract.enablePayGasInXAS=true
```

#### 调用合约方法（可见性为公开的普通方法）

```javascript
//基本使用
let result = await contract.call('getXXT', ['233'])
console.log('testContract result:' + JSON.stringify(result))

//代理方法使用
let result =await contract.getXXT('233')
console.log('result:'+JSON.stringify(result))

```

#### 调用转账到合约（资产接收方法 @payable）

```javascript
//基本使用
// 调用默认的默认向合约转账方法,方法名参数可以省略,此实例合约中对应crowdFunding函数(@payable({ isDefault: true }))
let result =await contract.pay('XAS','8345667')
console.log('result:'+JSON.stringify(result))
//调用payInitialToken资产接收方法(@payable)
let result =await contract.pay('kim.KIM','8345667', 'payInitialToken')
console.log('result:'+JSON.stringify(result))

//代理方法使用
// 调用默认的默认向合约转账方法,方法名参数可以省略,此实例合约中对应crowdFunding函数(@payable({ isDefault: true }))
let result =await contract.crowdFunding('XAS','8345667')
console.log('result:'+JSON.stringify(result))
//调用payInitialToken资产接收方法(@payable)
let result =await contract.payInitialToken('kim.KIM','8345667')
console.log('result:'+JSON.stringify(result))
```


#### 状态查询函数查询（@constant）

```javascript
//基本使用
//状态查询函数查询
let result =await contract.constant('getFunding','AdbL9HkeL5CPHmuVn8jMJSHtdeTHL6QXb')
console.log('result:'+JSON.stringify(result))

//代理方法使用
//状态查询函数查询
let result =await contract.getFunding('AdbL9HkeL5CPHmuVn8jMJSHtdeTHL6QXb')
console.log('result:'+JSON.stringify(result))

```

#### 简单状态查询

```javascript
//简单状态查询
let result =await contract.queryStates('totalFundingToken')
console.log('result:'+JSON.stringify(result))

//代理方法使用
//简单状态查询 get+状态名称(首字母大写)
let result =await contract.getTotalFundingToken()
console.log('result:'+JSON.stringify(result))

```

#### 合约函数执行结果查询

```javascript
//合约函数执行结果查询，传入交易ID
let result =await contract.getResultOfContract('e7f9d71cbb92fa8ff545a8353f10813da90b20303bb1c97bb4e373b4eb0e66d6')
console.log('result:'+JSON.stringify(result))


```
返回结果:

```json
{
	"success": true,
	"result": {
		"gas": 2721,
		"error": "",
		"stateChangesHash": "12c5f0d424831206219852d587630b4345326be68622ee46950d95c6fbab095f",
		"tid": "e7f9d71cbb92fa8ff545a8353f10813da90b20303bb1c97bb4e373b4eb0e66d6",
		"data": null,
		"contractId": 7,
		"success": true,
		"transaction": {
			"id": "e7f9d71cbb92fa8ff545a8353f10813da90b20303bb1c97bb4e373b4eb0e66d6",
			"type": 602,
			"timestamp": 89217523,
			"senderId": "AdbL9HkeL5CPHmuVn8jMJSHtdeTHL6QXb",
			"senderPublicKey": "744aa1098be936488f5178865422c4f383914fdb47fecea602e397420f2742d5",
			"requestorId": null,
			"fee": 0,
			"signatures": ["358d1cbb70616c38d37981f29cecde0e32d8f62877ec9db391196896f22df2f7fc5ab61583bade0de6dc4786bb2bd60d4c02ae421bf3aff6f2c6cb6400d9f90d"],
			"secondSignature": null,
			"args": [1000000, true, "crowdFundging_v1", "", "12345667", "XAS"],
			"height": 128568,
			"message": "",
			"mode": 0,
			"_version_": 1
		}
	}
}

```