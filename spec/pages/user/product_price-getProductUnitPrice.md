# 获取用户价格

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/product_price/getProductUnitPrice:
    get:
      summary: 获取用户价格
      deprecated: false
      description: >-
        获取当前登录用户的各产品单价。返回数据 data
        按产品ID分组：1=动态住宅流量(不限时长)、2=静态住宅(普通)、3=静态住宅(本土原生)、4=静态住宅(运营商原生)、6=动态住宅流量(包月)、8=静态数据中心；customPriceBalance
        为价格优惠额度(商品价格超出后会使用原价)。时长类产品按天数档位(7/30/90/180/360)返回，每档含
        originUnitPrice(平台原价)、userUnitPrice(用户单价，未配置折扣时等于原价)、percent(折扣百分比，未配置为
        null)。若给用户配置了按国家的自定义价格，天数档位下还会出现国家二字码子项(如 "US")，结构与档位相同。
      tags:
        - 用户管理
      parameters:
        - name: token
          in: header
          description: ''
          required: false
          example: '{{access_token}}'
          schema:
            type: string
      responses:
        '200':
          x-apifox-name: 成功
          x-apifox-ordering: 0
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
                      '1':
                        type: object
                        properties:
                          originUnitPrice:
                            type: integer
                            description: 原价
                          userUnitPrice:
                            type: number
                            description: 客户价
                          percent:
                            type: number
                            description: 优惠比例
                        required:
                          - originUnitPrice
                          - userUnitPrice
                          - percent
                        x-apifox-orders:
                          - originUnitPrice
                          - userUnitPrice
                          - percent
                        description: 流量套餐(不限时)
                      '2':
                        type: object
                        properties:
                          '7':
                            type: object
                            properties:
                              originUnitPrice:
                                type: number
                              userUnitPrice:
                                type: number
                              percent:
                                type: number
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                          '30':
                            type: object
                            properties:
                              originUnitPrice:
                                type: number
                              userUnitPrice:
                                type: number
                              percent:
                                type: integer
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                          '90':
                            type: object
                            properties:
                              originUnitPrice:
                                type: number
                              userUnitPrice:
                                type: number
                              percent:
                                type: integer
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                          '180':
                            type: object
                            properties:
                              originUnitPrice:
                                type: number
                              userUnitPrice:
                                type: number
                              percent:
                                type: integer
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                          '360':
                            type: object
                            properties:
                              originUnitPrice:
                                type: number
                              userUnitPrice:
                                type: number
                              percent:
                                type: integer
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                        required:
                          - '7'
                          - '30'
                          - '90'
                          - '180'
                          - '360'
                        x-apifox-orders:
                          - '7'
                          - '30'
                          - '90'
                          - '180'
                          - '360'
                        description: 静态住宅(普通)
                      '3':
                        type: object
                        properties:
                          '7':
                            type: object
                            properties:
                              originUnitPrice:
                                type: number
                              userUnitPrice:
                                type: number
                              percent:
                                type: integer
                              US:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: number
                                  percent:
                                    type: number
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                              VN:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  percent:
                                    type: number
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                              KR:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  percent:
                                    type: number
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                              GB:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  percent:
                                    type: number
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                              - US
                              - VN
                              - KR
                              - GB
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                              - US
                              - VN
                              - KR
                              - GB
                          '30':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: integer
                              percent:
                                type: integer
                              US:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  percent:
                                    type: number
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                              VN:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  percent:
                                    type: integer
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                              KR:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  percent:
                                    type: number
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                              GB:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  percent:
                                    type: number
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                              - US
                              - VN
                              - KR
                              - GB
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                              - US
                              - VN
                              - KR
                              - GB
                          '90':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: integer
                              percent:
                                type: integer
                              US:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  percent:
                                    type: number
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                              VN:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  percent:
                                    type: integer
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                              KR:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  percent:
                                    type: integer
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                              GB:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  percent:
                                    type: integer
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                              - US
                              - VN
                              - KR
                              - GB
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                              - US
                              - VN
                              - KR
                              - GB
                          '180':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: integer
                              percent:
                                type: integer
                              US:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  percent:
                                    type: integer
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                              VN:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  percent:
                                    type: integer
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                              KR:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  percent:
                                    type: integer
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                              GB:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  percent:
                                    type: integer
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                              - US
                              - VN
                              - KR
                              - GB
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                              - US
                              - VN
                              - KR
                              - GB
                          '360':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: integer
                              percent:
                                type: integer
                              US:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  percent:
                                    type: number
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                              VN:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  percent:
                                    type: integer
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                              KR:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  percent:
                                    type: integer
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                              GB:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  percent:
                                    type: integer
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - percent
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                              - US
                              - VN
                              - KR
                              - GB
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                              - US
                              - VN
                              - KR
                              - GB
                        required:
                          - '7'
                          - '30'
                          - '90'
                          - '180'
                          - '360'
                        x-apifox-orders:
                          - '7'
                          - '30'
                          - '90'
                          - '180'
                          - '360'
                        description: 静态住宅(原生)
                      '4':
                        type: object
                        properties:
                          '7':
                            type: object
                            properties:
                              originUnitPrice:
                                type: number
                                description: 平台原价
                              userUnitPrice:
                                type: number
                                description: 用户单价，未配置折扣时等于原价
                              percent:
                                type: number
                                description: 折扣百分比，未配置为 null
                                nullable: true
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                          '30':
                            type: object
                            properties:
                              originUnitPrice:
                                type: number
                                description: 平台原价
                              userUnitPrice:
                                type: number
                                description: 用户单价，未配置折扣时等于原价
                              percent:
                                type: number
                                description: 折扣百分比，未配置为 null
                                nullable: true
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                          '90':
                            type: object
                            properties:
                              originUnitPrice:
                                type: number
                                description: 平台原价
                              userUnitPrice:
                                type: number
                                description: 用户单价，未配置折扣时等于原价
                              percent:
                                type: number
                                description: 折扣百分比，未配置为 null
                                nullable: true
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                          '180':
                            type: object
                            properties:
                              originUnitPrice:
                                type: number
                                description: 平台原价
                              userUnitPrice:
                                type: number
                                description: 用户单价，未配置折扣时等于原价
                              percent:
                                type: number
                                description: 折扣百分比，未配置为 null
                                nullable: true
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                          '360':
                            type: object
                            properties:
                              originUnitPrice:
                                type: number
                                description: 平台原价
                              userUnitPrice:
                                type: number
                                description: 用户单价，未配置折扣时等于原价
                              percent:
                                type: number
                                description: 折扣百分比，未配置为 null
                                nullable: true
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                        required:
                          - '7'
                          - '30'
                          - '90'
                          - '180'
                          - '360'
                        x-apifox-orders:
                          - '7'
                          - '30'
                          - '90'
                          - '180'
                          - '360'
                        description: 静态住宅(运营商原生)
                      '6':
                        type: object
                        properties:
                          '30':
                            type: object
                            properties:
                              originUnitPrice:
                                type: string
                              userUnitPrice:
                                type: number
                              percent:
                                type: number
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                          '90':
                            type: object
                            properties:
                              originUnitPrice:
                                type: string
                              userUnitPrice:
                                type: number
                              percent:
                                type: number
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                          '180':
                            type: object
                            properties:
                              originUnitPrice:
                                type: string
                              userUnitPrice:
                                type: number
                              percent:
                                type: integer
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                        required:
                          - '30'
                          - '90'
                          - '180'
                        x-apifox-orders:
                          - '30'
                          - '90'
                          - '180'
                        description: 流量套餐(限时)
                      '8':
                        type: object
                        properties:
                          '7':
                            type: object
                            properties:
                              originUnitPrice:
                                type: number
                              userUnitPrice:
                                type: number
                              percent:
                                type: number
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                          '30':
                            type: object
                            properties:
                              originUnitPrice:
                                type: number
                              userUnitPrice:
                                type: number
                              percent:
                                type: integer
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                          '90':
                            type: object
                            properties:
                              originUnitPrice:
                                type: number
                              userUnitPrice:
                                type: number
                              percent:
                                type: integer
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                          '180':
                            type: object
                            properties:
                              originUnitPrice:
                                type: number
                              userUnitPrice:
                                type: number
                              percent:
                                type: integer
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                          '360':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: integer
                              percent:
                                type: integer
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - percent
                        required:
                          - '7'
                          - '30'
                          - '90'
                          - '180'
                          - '360'
                        x-apifox-orders:
                          - '7'
                          - '30'
                          - '90'
                          - '180'
                          - '360'
                        description: 数据中心
                      customPriceBalance:
                        type: number
                        description: 优惠额度(商品价格超出后会使用原价)
                    required:
                      - '1'
                      - '2'
                      - '3'
                      - '4'
                      - '6'
                      - '8'
                      - customPriceBalance
                    x-apifox-orders:
                      - '1'
                      - '2'
                      - '3'
                      - '4'
                      - '6'
                      - '8'
                      - customPriceBalance
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
                time: '1782825788'
                data:
                  '1':
                    originUnitPrice: 51
                    userUnitPrice: 0.01
                    percent: 0.0196
                  '2':
                    '7':
                      originUnitPrice: 12.16
                      userUnitPrice: 0.01
                      percent: 0.0822
                    '30':
                      originUnitPrice: 52.11
                      userUnitPrice: 52.11
                      percent: 100
                    '90':
                      originUnitPrice: 156.33
                      userUnitPrice: 156.33
                      percent: 100
                    '180':
                      originUnitPrice: 312.66
                      userUnitPrice: 312.66
                      percent: 100
                    '360':
                      originUnitPrice: 625.31
                      userUnitPrice: 625.31
                      percent: 100
                  '3':
                    '7':
                      originUnitPrice: 15.17
                      userUnitPrice: 15.17
                      percent: 100
                      US:
                        originUnitPrice: 11
                        userUnitPrice: 0.01
                        percent: 0.0909
                      VN:
                        originUnitPrice: 41
                        userUnitPrice: 11
                        percent: 26.8293
                      KR:
                        originUnitPrice: 45
                        userUnitPrice: 19
                        percent: 42.2222
                      GB:
                        originUnitPrice: 39
                        userUnitPrice: 20
                        percent: 51.2821
                    '30':
                      originUnitPrice: 65
                      userUnitPrice: 65
                      percent: 100
                      US:
                        originUnitPrice: 18
                        userUnitPrice: 10
                        percent: 55.5556
                      VN:
                        originUnitPrice: 85
                        userUnitPrice: 85
                        percent: 100
                      KR:
                        originUnitPrice: 89
                        userUnitPrice: 37
                        percent: 41.573
                      GB:
                        originUnitPrice: 79
                        userUnitPrice: 30
                        percent: 37.9747
                    '90':
                      originUnitPrice: 195
                      userUnitPrice: 195
                      percent: 100
                      US:
                        originUnitPrice: 33
                        userUnitPrice: 20
                        percent: 60.6061
                      VN:
                        originUnitPrice: 224
                        userUnitPrice: 224
                        percent: 100
                      KR:
                        originUnitPrice: 229
                        userUnitPrice: 229
                        percent: 100
                      GB:
                        originUnitPrice: 199
                        userUnitPrice: 199
                        percent: 100
                    '180':
                      originUnitPrice: 390
                      userUnitPrice: 390
                      percent: 100
                      US:
                        originUnitPrice: 50
                        userUnitPrice: 30
                        percent: 60
                      VN:
                        originUnitPrice: 422
                        userUnitPrice: 422
                        percent: 100
                      KR:
                        originUnitPrice: 427
                        userUnitPrice: 427
                        percent: 100
                      GB:
                        originUnitPrice: 379
                        userUnitPrice: 379
                        percent: 100
                    '360':
                      originUnitPrice: 780
                      userUnitPrice: 780
                      percent: 100
                      US:
                        originUnitPrice: 60
                        userUnitPrice: 40
                        percent: 66.6667
                      VN:
                        originUnitPrice: 819
                        userUnitPrice: 819
                        percent: 100
                      KR:
                        originUnitPrice: 829
                        userUnitPrice: 829
                        percent: 100
                      GB:
                        originUnitPrice: 729
                        userUnitPrice: 729
                        percent: 100
                  '4':
                    '7':
                      originUnitPrice: 30
                      userUnitPrice: 30
                      percent: null
                    '30':
                      originUnitPrice: 60
                      userUnitPrice: 60
                      percent: null
                    '90':
                      originUnitPrice: 150
                      userUnitPrice: 150
                      percent: null
                    '180':
                      originUnitPrice: 300
                      userUnitPrice: 300
                      percent: null
                    '360':
                      originUnitPrice: 540
                      userUnitPrice: 540
                      percent: null
                  '6':
                    '30':
                      originUnitPrice: '50.00'
                      userUnitPrice: 0.02
                      percent: 0.04
                    '90':
                      originUnitPrice: '54.88'
                      userUnitPrice: 54.87
                      percent: 99.9818
                    '180':
                      originUnitPrice: '59.76'
                      userUnitPrice: 59.76
                      percent: 100
                  '7':
                    originUnitPrice: 2.5
                    userUnitPrice: 2.5
                    percent: 100
                  '8':
                    '7':
                      originUnitPrice: 20.21
                      userUnitPrice: 0.01
                      percent: 0.0495
                    '30':
                      originUnitPrice: 73.75
                      userUnitPrice: 73.75
                      percent: 100
                    '90':
                      originUnitPrice: 131.25
                      userUnitPrice: 131.25
                      percent: 100
                    '180':
                      originUnitPrice: 262.5
                      userUnitPrice: 262.5
                      percent: 100
                    '360':
                      originUnitPrice: 525
                      userUnitPrice: 525
                      percent: 100
                  customPriceBalance: 2.83
          headers: {}
      security: []
      x-apifox-folder: 用户管理
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-389339469-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
