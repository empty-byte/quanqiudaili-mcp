# 静态住宅（原生）库存检测

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/product_order/checkInventory:
    post:
      summary: 静态住宅（原生）库存检测
      deprecated: false
      description: 购买静态住宅时长IP前的库存检测
      tags:
        - 用户IP子账号管理/静态住宅（原生）时长子账号
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
                  description: 产品类型id，此处固定为：3
                  example: 3
                  type: integer
                num:
                  description: 需要购买的子账号数量。范围：1-300之间
                  example: 15
                  type: integer
                timelen:
                  description: 时长计费类型：0=7天，1=30天，2=90天，3=180天，4=360天，5=3天
                  example: 0
                  type: integer
                country:
                  description: >-
                    静态住宅国家编码code，例如：US。可从<a href='/api-245746641'
                    target='_blank'>静态住宅（原生）国家列表获取</a>
                  example: US
                  type: string
                city:
                  description: >-
                    静态住宅城市名称。在<a href='/api-245746642'
                    target='_blank'>静态住宅（原生）城市列表</a>可获取城市名称。不传默认随机。
                  example: Los Angeles
                  type: string
                bandwidth_num:
                  type: integer
                  description: 带宽值
                  example: 5
                appoint_ip[0][ip_str]:
                  description: 指定段
                  example: '149.52'
                  type: string
                appoint_ip[0][count]:
                  description: 数量
                  example: '24'
                  type: string
                exclude_ip_str:
                  description: 排除ip段，多个以英文逗号分隔
                  example: '149.119'
                  type: string
                remark:
                  description: 创建的子账号备注
                  example: test
                  type: string
                use_ip_port:
                  type: integer
                  description: 是否开启ip端口连接:0=不开启,1=开启(默认为0)
                  example: 0
                random_account_password:
                  type: integer
                  description: 是否生成随机账号密码:0=否,1=是(默认为0)
                  example: 0
              required:
                - product_type_id
                - num
                - timelen
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
                  msg:
                    type: string
                  time:
                    type: string
                  data:
                    type: object
                    properties:
                      is_sufficient:
                        type: boolean
                        description: 全部是否充足：true = 充足，false = 不足
                      segments:
                        type: array
                        items:
                          type: object
                          properties:
                            cidr:
                              type: string
                              description: IP段
                            is_sufficient:
                              type: boolean
                              description: 当前IP段是否充足：true = 充足，false = 不足
                          required:
                            - cidr
                            - is_sufficient
                          x-apifox-orders:
                            - cidr
                            - is_sufficient
                    required:
                      - is_sufficient
                      - segments
                    x-apifox-orders:
                      - is_sufficient
                      - segments
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
                msg: ok
                time: '1778573024'
                data:
                  is_sufficient: true
                  segments:
                    - cidr: '149.52'
                      is_sufficient: true
                    - cidr: '150.241'
                      is_sufficient: true
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/静态住宅（原生）时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-456171837-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
