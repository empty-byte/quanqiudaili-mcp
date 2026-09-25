# 获取动态住宅流量子账号列表

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
      summary: 获取动态住宅流量子账号列表
      deprecated: false
      description: 获取动态住宅流量子账号列表
      tags:
        - 用户IP子账号管理/动态住宅流量子账号（不限时长）
      parameters:
        - name: product_type_id
          in: query
          description: 产品类型id，此处固定类别为：1
          required: true
          example: 1
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
          description: 子账号备注
          required: false
          example: ''
          schema:
            type: string
        - name: country
          in: query
          description: 国家编码，例如：US。从<a href='/api-222033933' target='_blank'>动态住宅国家列表</a>获取
          required: false
          example: ''
          schema:
            type: string
        - name: subAccountName
          in: query
          description: 自定义用户名
          required: false
          example: ''
          schema:
            type: string
        - name: subAccountStart
          in: query
          description: 子账号区间搜索[初始]
          required: false
          example: 0
          schema:
            type: integer
        - name: subAccountEnd
          in: query
          description: 子账号区间搜索[结束]
          required: false
          example: 0
          schema:
            type: integer
        - name: ids
          in: query
          description: id集,多个以英文逗号分隔
          required: false
          example: ''
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
                            password:
                              type: string
                              description: 子账号密码
                            username:
                              type: string
                              description: 子账号用户名
                            id:
                              type: integer
                              description: 子账号编码
                            is_bind:
                              type: string
                              description: 是否绑定
                            bindUser:
                              type: string
                              description: 绑定的账户
                            bindPassword:
                              type: string
                              description: 绑定的账户密码
                            createTime:
                              type: string
                              description: 添加时间
                            port:
                              type: integer
                              description: 端口
                            agree:
                              type: string
                              description: 协议
                            target:
                              type: string
                              description: 加速通道
                            ip:
                              type: string
                              description: 出口ip
                            bill:
                              type: integer
                              description: 消耗流量
                            is_diff:
                              type: integer
                              description: 是否去重
                            country:
                              type: string
                              description: 国家Code
                            countryName:
                              type: string
                              description: 国家名称
                            state:
                              type: string
                              description: 省/市
                            city:
                              type: string
                              description: 城市
                            type:
                              type: string
                            status:
                              type: string
                            limit_flow:
                              type: integer
                              description: 流量限制
                          x-apifox-orders:
                            - password
                            - username
                            - id
                            - is_bind
                            - bindUser
                            - bindPassword
                            - createTime
                            - port
                            - agree
                            - target
                            - ip
                            - bill
                            - is_diff
                            - country
                            - countryName
                            - state
                            - city
                            - type
                            - status
                            - limit_flow
                          required:
                            - password
                            - username
                            - id
                            - is_bind
                            - bindUser
                            - bindPassword
                            - createTime
                            - port
                            - agree
                            - target
                            - ip
                            - bill
                            - is_diff
                            - country
                            - countryName
                            - state
                            - city
                            - type
                            - status
                            - limit_flow
                        description: 响应内容
                      baseFlow:
                        type: number
                        description: 剩余基准流量
                    required:
                      - total
                      - rows
                      - baseFlow
                    x-apifox-orders:
                      - total
                      - rows
                      - baseFlow
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
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/动态住宅流量子账号（不限时长）
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-222033931-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
