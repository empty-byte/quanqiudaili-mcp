# 获取静态住宅（普通非原生）子账号列表

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/device/accountList:
    get:
      summary: 获取静态住宅（普通非原生）子账号列表
      deprecated: false
      description: 获取静态住宅非原生子账号列表
      tags:
        - 用户IP子账号管理/静态住宅（普通非原生）时长子账号
      parameters:
        - name: product_type_id
          in: query
          description: 产品类型id，此处固定为：2
          required: true
          example: 2
          schema:
            type: integer
        - name: page
          in: query
          description: 当前页数
          required: true
          example: 1
          schema:
            type: integer
        - name: pagesize
          in: query
          description: 每页显示数量。每页最大100条数据
          required: true
          example: 10
          schema:
            type: integer
        - name: remark
          in: query
          description: 子账号备注(模糊匹配)
          required: false
          example: ''
          schema:
            type: string
        - name: country
          in: query
          description: >-
            静态住宅国家编码code，例如：US。可从<a href='/api-222487309'
            target='_blank'>静态住宅（普通非原生）国家列表获取</a>
          required: false
          example: ''
          schema:
            type: string
        - name: ids
          in: query
          description: 子账号id集合，多个以英文逗号连接
          required: false
          example: '1'
          schema:
            type: string
        - name: subAccountStart
          in: query
          description: 子账号区间搜索[初始]
          required: false
          example: 100
          schema:
            type: integer
        - name: subAccountEnd
          in: query
          description: 子账号区间搜索[结束]
          required: false
          example: 200
          schema:
            type: integer
        - name: exportIp
          in: query
          description: 出口IP(模糊查询)
          required: false
          example: '149.52'
          schema:
            type: string
        - name: search_type
          in: query
          description: 批量搜索类型(精准匹配):0=自定义账密;1=出口ip;2=备注
          required: false
          example: 1
          schema:
            type: integer
        - name: searchArr[0]
          in: query
          description: 搜索数组,单次最多100条
          required: false
          example: 127.0.0.1
          schema:
            type: string
        - name: searchArr[1]
          in: query
          description: ''
          required: false
          example: 127.0.0.2
          schema:
            type: string
        - name: token
          in: header
          description: ''
          required: false
          example: '{{access_token}}'
          schema:
            type: string
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
                    description: 错误说明
                  time:
                    type: string
                    description: 响应时间戳
                  data:
                    type: object
                    properties:
                      total:
                        type: integer
                        description: 总数
                      rows:
                        type: array
                        items:
                          type: object
                          properties:
                            id:
                              type: string
                              title: 编号
                            is_diff:
                              type: integer
                              description: 是否去重
                            agree:
                              type: string
                              title: 协议
                              description: 协议
                            country:
                              type: string
                              title: 城市
                              description: 国家Code
                            target:
                              type: string
                              title: 代理主机
                              description: 加速通道
                            port:
                              type: integer
                              title: 端口
                              description: 端口
                            username:
                              type: string
                              title: 用户名
                              description: 子账号用户名
                            password:
                              type: string
                              title: 密码
                              description: 子账号密码
                            is_bind:
                              type: string
                              description: 是否绑定
                            remark:
                              type: string
                            poolStatus:
                              type: string
                              title: ip状态
                            bindUser:
                              type: string
                              description: 绑定的账户
                            bindPassword:
                              type: string
                              description: 绑定的账户密码
                            ip:
                              type: string
                              description: 出口ip
                            countdown:
                              type: string
                            expiresIn:
                              type: integer
                              title: 过期时间戳
                            createtime:
                              type: string
                              title: 过期时间
                            state:
                              type: string
                              description: 省/市
                            city:
                              type: string
                              description: 城市
                            bill:
                              type: integer
                              title: 已使用流量
                            countryName:
                              type: string
                              description: 国家名称
                            status:
                              type: integer
                            expireDate:
                              type: string
                              description: 过期时间
                            order_back_date_valid:
                              type: boolean
                            order_product_buy_id:
                              type: integer
                            order_back_status:
                              type: integer
                            is_renew:
                              type: string
                              title: 是否自动续费
                            order_back_reject_reason:
                              type: 'null'
                            renewtime:
                              type: string
                          x-apifox-orders:
                            - id
                            - is_diff
                            - agree
                            - country
                            - target
                            - port
                            - username
                            - password
                            - is_bind
                            - remark
                            - poolStatus
                            - bindUser
                            - bindPassword
                            - ip
                            - countdown
                            - expiresIn
                            - createtime
                            - state
                            - city
                            - bill
                            - countryName
                            - status
                            - expireDate
                            - order_back_date_valid
                            - order_product_buy_id
                            - order_back_status
                            - is_renew
                            - order_back_reject_reason
                            - renewtime
                        description: 响应内容
                      countryList:
                        type: array
                        items:
                          type: object
                          properties:
                            country:
                              type: string
                              description: 城市编码
                            countryName:
                              type: string
                              description: 城市名称
                          required:
                            - country
                            - countryName
                          x-apifox-orders:
                            - country
                            - countryName
                        title: 国家列表
                        description: 城市列表(用于城市搜索)
                      base:
                        type: object
                        properties:
                          total:
                            type: integer
                          normal:
                            type: integer
                          expiring_soon:
                            type: integer
                        required:
                          - total
                          - normal
                          - expiring_soon
                        x-apifox-orders:
                          - total
                          - normal
                          - expiring_soon
                    required:
                      - total
                      - rows
                      - countryList
                      - base
                    x-apifox-orders:
                      - total
                      - rows
                      - countryList
                      - base
                    title: 子账号详情
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
                time: '1746503431'
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
                  countryList:
                    - country: US
                      countryName: 美国
                  base:
                    total: 1
                    normal: 1
                    expiring_soon: 0
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/静态住宅（普通非原生）时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-222488103-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
