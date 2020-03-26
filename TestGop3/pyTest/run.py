# run_selenium.py
import time
from selenium import webdriver  # 從library中引入webdriver
from selenium.webdriver.common.keys import Keys

# 選擇服務器 #172.18.2.28
#cars = ["car-00", "car-01"]
#cars = ["car-00", "car-01", "car-02", "car-03"]

# cars = ["car-00", "car-01", "car-02", "car-03",
#         "car-04", "car-05", "car-06", "car-07"]

# cars = ["car-00", "car-01", "car-02", "car-03",
#         "car-04", "car-05", "car-06", "car-07",
#         "car-08", "car-09", "car-10", "car-11",
#         "car-12", "car-13", "car-14", "car-15"
#         ]

cars = ["car-00", "car-01", "car-02", "car-03",
        "car-04", "car-05", "car-06", "car-07",
        "car-08", "car-09", "car-10", "car-11",
        "car-12", "car-13", "car-14", "car-15",
        "car-16", "car-17", "car-18", "car-19"
        ]

channellst = ["channel1", "channel2", "channel3", "channel4",
              "channel5", "channel6", "channel7", "channel8"]
webindex = 0
webs = []
# click #	 傳回符合指定 id 之元素
for item in cars:
    web = webdriver.Chrome('./chromedriver')  # 開啟chrome browser
    web.get('http://localhost:4300/dashboard/carpanel')
    webs.append(web)
    # web.execute_script(
    #     "window.open('http://localhost:4300/dashboard/carpanel');")
    for idx, channel in enumerate(channellst):
        if channel != 'channel1':
            web.execute_script(
                "window.open('http://localhost:4300/dashboard/carpanel');")
        time.sleep(1)
    for idx, channel in enumerate(channellst):
        index = (len(channellst) - idx) % len(channellst)
        print(index)

        web.switch_to.window(web.window_handles[index])
        web.set_window_position(0, webindex)  # 瀏覽器位置
        web.set_window_size(700, 700)  # 瀏覽器大小
        server = web.find_element_by_id("172.18.2.57").click()
        # 選擇car
        car = web.find_element_by_id(item).click()
        web.find_element_by_id(channel).click()
webindex = webindex+1

#


# web.find_element_by_xpath('//input[@value="172.18.2.28"]').click()  # click
# web.find_element_by_link_text('選擇服務器').click()  # 點擊頁面上"天氣預報"的連結
time.sleep(5)
# web.quit()  # 關閉 chromedriver


# for idx, web in enumerate(webs):
#     for channel in enumerate(channellst):
#         web.switch_to.window(web.window_handles[1])

#         # web.switch_to.window(web.window_handles[-1])
#         item = cars[idx]
#         # server = web.find_element_by_id("172.18.2.44").click()

#     # web.execute_script(
#     #     "window.open('http://localhost:4300/dashboard/carpanel');")

#     # for winHandle in web.window_handles:
#     #     web.switch_to_window(winHandle)

#     # for channel in channellst:
#     #     web.switch_to.window(web.window_handles[-1])
#     #     web.set_window_position(0, webindex)  # 瀏覽器位置
#     #     web.set_window_size(700, 700)  # 瀏覽器大小
#     #     server = web.find_element_by_id("172.18.2.44").click()
#     #     # 選擇car
#     #     car = web.find_element_by_id(item).click()
#     #     web.find_element_by_id(channel).click()
#     #     if channel != "channel1":
#     #         web.execute_script(
#     #             "window.open('http://localhost:4300/dashboard/carpanel');")
#     #         webindex = webindex+1
#     #     time.sleep(1)
#     # # print(item)

# from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
# import time
# from selenium import webdriver
# driver = webdriver.Chrome('./chromedriver')
# #browser = webdriver.Chrome('./chromedriver')
# driver = webdriver.Remote(
#     command_executor='http://localhost:4300/dashboard/carpanel',
#     desired_capabilities=DesiredCapabilities.CHROME
# )
# # search_input = driver.find_element_by_name('q')  # 取得搜尋框
# # search_input.send_keys('Python')  # 在搜尋框內輸入 'Python'
# # search_input.submit()  # 令 chrome driver 按下 submit
# time.sleep(5)
# driver.quit()  # 關閉 chromedriver
