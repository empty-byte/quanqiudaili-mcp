# 购买静态住宅（数据中心）时长测试IP

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/product_order/createTestOrder:
    post:
      summary: 购买静态住宅（数据中心）时长测试IP
      deprecated: false
      description: 购买数据中心时长测试IP，购买测试IP通常用于自有平台短期时长购买，用户赠送给自有用户测试，购买会按照时长扣费
      tags:
        - 用户IP子账号管理/数据中心时长子账号
      parameters:
        - name: token
          in: header
          description: ''
          required: false
          example: '{{access_token}}'
          schema:
            type: string
      requestBody:
        content:
          application/x-www-form-urlencoded:
            schema:
              type: object
              properties:
                product_type_id:
                  description: 产品类型id，此处固定为：8
                  example: 8
                  type: integer
                num:
                  description: 需要短期购买的子账号数量。范围：1-20之间
                  example: 1
                  type: integer
                timelen:
                  description: 时长计费：固定为12小时
                  example: 12
                  type: integer
                agree:
                  description: 协议：SOCKS5，HTTP，HTTPS
                  example: SOCKS5
                  type: string
                country:
                  description: 静态住宅国家编码code
                  example: US
                  type: string
                city:
                  description: 静态住宅城市名称,不传默认随机。
                  example: Los Angeles
                  type: string
              required:
                - product_type_id
                - num
                - timelen
                - agree
                - country
            examples: {}
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: integer
                    description: 响应编码:1=正常,0=错误
                  msg:
                    type: string
                    description: 响应说明
                  time:
                    type: string
                  data:
                    type: object
                    properties:
                      subAccounts:
                        type: array
                        items:
                          type: object
                          properties:
                            id:
                              type: string
                              description: 子账号id
                            is_diff:
                              type: integer
                              description: 是否去重。静态时长IP用不到
                            agree:
                              type: string
                              description: '协议，socks5, https, http '
                            country:
                              type: string
                              description: 国家代码。比如：US
                            ip:
                              type: string
                              description: 出口IP
                            target:
                              type: string
                              description: 代理主机（加速通道）
                            port:
                              type: integer
                              description: 端口
                            username:
                              type: string
                              description: 子账号用户名
                            password:
                              type: string
                              description: 子账号密码
                            is_bind:
                              type: string
                              description: 是否设置了子账号映射。0=否，1=是。
                            remark:
                              type: string
                              description: 备注
                            bindUser:
                              type: string
                              description: 子账号用户名。同username
                            bindPassword:
                              type: string
                              description: 子账号密码。同password
                            countdown:
                              type: string
                              description: 到期天数
                            createtime:
                              type: string
                              description: 创建时间
                            state:
                              type: string
                              description: 州/省
                            city:
                              type: string
                              description: 城市
                            bill:
                              type: integer
                              description: 使用流量，静态时长IP显示0
                            countryName:
                              type: string
                              description: 国家中文名称
                            status:
                              type: integer
                              description: 子账号状态。1=正常，2=即将过期，3=已过期
                          x-apifox-orders:
                            - id
                            - is_diff
                            - agree
                            - country
                            - ip
                            - target
                            - port
                            - username
                            - password
                            - is_bind
                            - remark
                            - bindUser
                            - bindPassword
                            - countdown
                            - createtime
                            - state
                            - city
                            - bill
                            - countryName
                            - status
                        description: 新建的子账号数组
                    required:
                      - subAccounts
                    x-apifox-orders:
                      - subAccounts
                required:
                  - code
                  - msg
                  - time
                  - data
                x-apifox-orders:
                  - code
                  - msg
                  - time
                  - data
              example:
                code: 1
                msg: 获取成功
                time: '1697164784'
                data:
                  total: 1
                  rows:
                    - id: '1'
                      is_diff: 0
                      agree: SOCKS5
                      country: US
                      target: proxy.quanqiudaili.com
                      port: 5001
                      username: test
                      password: test
                      is_bind: '0'
                      remark: ''
                      poolStatus: online
                      bindUser: test
                      bindPassword: test
                      ip: 172.11.11.11
                      countdown: 7.0天
                      expiresIn: 1747108219
                      createtime: '2025-05-06 11:50:20'
                      state: New York
                      city: New York City
                      bill: 0
                      countryName: 美国
                      status: 1
                      expireDate: '2025-05-13 11:50:19'
                      order_back_date_valid: true
                      order_product_buy_id: 16874
                      order_back_status: 0
                      is_renew: '0'
                      order_back_reject_reason: null
                      renewtime: '1970-01-01'
                  baseFlow: 180.31
                  countryList:
                    - id: 1
                      countryName: 全球随机
                      country: ALL
                    - id: 1671
                      conutry: AX
                      countryName: 奥兰
                      type_text: ''
                      status_text: ''
                    - id: 1672
                      conutry: AL
                      countryName: 阿尔巴尼亚
                      type_text: ''
                      status_text: ''
                    - id: 4038
                      conutry: XK
                      countryName: 科索沃
                      type_text: ''
                      status_text: ''
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/数据中心时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-311762881-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
